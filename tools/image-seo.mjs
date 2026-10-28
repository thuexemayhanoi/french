#!/usr/bin/env node
// Image SEO batch manager; no image generation, no paid APIs and no dependencies.
// Usage: node tools/image-seo.mjs status | next [N] | apply [N] | check
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const file=path.join(root,'data/image-seo-matrix.json');
const matrix=JSON.parse(fs.readFileSync(file,'utf8'));
const items=matrix.items;
const command=process.argv[2]||'status';
const limit=Math.max(1,Math.min(547,Number(process.argv[3]||20)||20));
const domain='https://fr.rentbikehanoi.com';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const disk=p=>{if(!p.startsWith('assets/images/seo/')||p.includes('..'))throw Error('Unsafe asset path: '+p);return path.join(root,p);};
const pageFile=p=>{if(!p.endsWith('/index.html')&&p!=='index.html')throw Error('Unsafe page path: '+p);if(p.includes('..'))throw Error('Unsafe page path: '+p);return path.join(root,p);};
const markStart=it=>'<!-- SEO_IMAGE:'+it.id+':START -->';
const markEnd=it=>'<!-- SEO_IMAGE:'+it.id+':END -->';
const metaStart='<!-- SEO_IMAGE_META:START -->';
const metaEnd='<!-- SEO_IMAGE_META:END -->';

function dimensions(buffer) {
  if(buffer.length<30||buffer.toString('ascii',0,4)!=='RIFF'||buffer.toString('ascii',8,12)!=='WEBP')return null;
  let pos=12;
  while(pos+8<=buffer.length) {
    const type=buffer.toString('ascii',pos,pos+4);
    const size=buffer.readUInt32LE(pos+4);
    const a=pos+8;
    if(type==='VP8X'&&a+10<=buffer.length)return [buffer.readUIntLE(a+4,3)+1,buffer.readUIntLE(a+7,3)+1];
    if(type==='VP8 '&&a+10<=buffer.length&&buffer[a+3]===157&&buffer[a+4]===1&&buffer[a+5]===42)return [buffer.readUInt16LE(a+6)&0x3fff,buffer.readUInt16LE(a+8)&0x3fff];
    if(type==='VP8L'&&a+5<=buffer.length&&buffer[a]===47)return [1+buffer[a+1]+((buffer[a+2]&0x3f)<<8),1+((buffer[a+2]&0xc0)>>6)+(buffer[a+3]<<2)+((buffer[a+4]&15)<<10)];
    if(size>buffer.length-pos)break;
    pos=a+size+(size%2);
  }
  return null;
}
function verifyImage(it) {
  const p=disk(it.asset_path);
  if(!fs.existsSync(p))return {ok:false,reason:'MISSING_FILE'};
  const b=fs.readFileSync(p);
  if(b.length<it.target_min_kb*1024||b.length>it.target_max_kb*1024)return {ok:false,reason:'WRONG_SIZE',bytes:b.length};
  const d=dimensions(b);
  if(!d)return {ok:false,reason:'INVALID_WEBP',bytes:b.length};
  if(d[0]!==it.target_width||d[1]!==it.target_height)return {ok:false,reason:'WRONG_DIMENSIONS',width:d[0],height:d[1]};
  if(!it.alt_fr||it.alt_fr.trim().length<12)return {ok:false,reason:'ALT_NOT_REVIEWED'};
  return {ok:true,bytes:b.length};
}
function finished(it) {
  const v=verifyImage(it);
  if(!v.ok)return false;
  if(!fs.existsSync(pageFile(it.page_path)))return false;
  const h=fs.readFileSync(pageFile(it.page_path),'utf8');
  const a=h.includes(markStart(it))&&h.includes(markEnd(it))&&h.includes('src="/'+esc(it.asset_path)+'"');
  const meta=it.type==='EXTRA'||(h.includes(metaStart)&&h.includes(metaEnd)&&h.includes('property="og:image" content="'+domain+'/'+esc(it.asset_path)+'"'));
  return a&&meta;
}
function inject(html,it) {
  const blockStart=markStart(it),blockEnd=markEnd(it);
  const lazy=it.type==='EXTRA';
  const snippet=blockStart+'\n<figure class="seo-image" data-image-seo-id="'+esc(it.id)+'"><img src="/'+esc(it.asset_path)+'" alt="'+esc(it.alt_fr)+'" width="'+it.target_width+'" height="'+it.target_height+'" loading="'+(lazy?'lazy':'eager')+'" decoding="async"'+(lazy?'':' fetchpriority="high"')+'></figure>\n'+blockEnd;
  if(html.includes(blockStart)) {
    const a=html.indexOf(blockStart),b=html.indexOf(blockEnd,a);
    if(b<0)throw Error('Missing image end marker in '+it.page_path);
    html=html.slice(0,a)+snippet+html.slice(b+blockEnd.length);
  } else if(lazy) {
    const p=html.indexOf('</article>');
    if(p<0)throw Error('Article end not found in '+it.page_path);
    html=html.slice(0,p)+snippet+'\n'+html.slice(p);
  } else {
    const article=html.indexOf('<article class="seo-longform">');
    const end=html.indexOf('</header>',article);
    if(article>=0&&end>=0)html=html.slice(0,end+9)+'\n'+snippet+html.slice(end+9);
    else {
      // Short institutional pages (e.g. contact) have no long-form header: place the figure right after the H1.
      const h1=html.indexOf('</h1>',html.indexOf('<article'));
      if(html.indexOf('<article')<0||h1<0)throw Error('Article header missing in '+it.page_path);
      html=html.slice(0,h1+5)+'\n'+snippet+html.slice(h1+5);
    }
  }
  if(!lazy) {
    const url=domain+'/'+it.asset_path;
    const meta=metaStart+'\n<meta property="og:image" content="'+esc(url)+'">\n<meta property="og:image:alt" content="'+esc(it.alt_fr)+'">\n<meta property="og:image:type" content="image/webp">\n<meta property="og:image:width" content="'+it.target_width+'">\n<meta property="og:image:height" content="'+it.target_height+'">\n<meta name="twitter:image" content="'+esc(url)+'">\n'+metaEnd;
    if(html.includes(metaStart)) {
      const a=html.indexOf(metaStart),b=html.indexOf(metaEnd,a);
      if(b<0)throw Error('Missing metadata end marker in '+it.page_path);
      html=html.slice(0,a)+meta+html.slice(b+metaEnd.length);
    } else {
      html=html.replace('</head>',meta+'\n</head>');
    }
    html=html.replace(/<meta name="twitter:card" content="summary">/i,'<meta name="twitter:card" content="summary_large_image">');
    if(!/<meta name="twitter:card"/i.test(html))html=html.replace('</head>','<meta name="twitter:card" content="summary_large_image">\n</head>');
  }
  return html;
}
function status() {
  let valid=0,done=0,ready=0,missing=0,broken=0;
  for(const it of items) {
    const v=verifyImage(it);
    if(v.ok)valid++;else if(v.reason==='MISSING_FILE')missing++;else broken++;
    if(finished(it))done++;
    else if(v.ok)ready++;
  }
  console.log(JSON.stringify({planned:items.length,primary:items.filter(x=>x.type!=='EXTRA').length,secondary:items.filter(x=>x.type==='EXTRA').length,verified_on_disk:valid,integrated:done,ready_to_apply:ready,missing_files:missing,invalid_or_unreviewed:broken,remaining:items.length-done},null,2));
}
if(command==='status')status();
else if(command==='next') {
  const pending=items.filter(it=>!finished(it)).slice(0,limit);
  console.log(JSON.stringify(pending,null,2));
} else if(command==='apply') {
  let changed=0,skipped={};
  for(const it of items) {
    if(changed>=limit)break;
    if(finished(it)){if(it.status!=='DONE'){it.status='DONE';changed++;}continue;}
    const v=verifyImage(it);
    if(!v.ok){skipped[v.reason]=(skipped[v.reason]||0)+1;continue;}
    const dest=pageFile(it.page_path);
    const old=fs.readFileSync(dest,'utf8');
    const next=inject(old,it);
    if(next!==old)fs.writeFileSync(dest,next);
    it.status='DONE';
    changed++;
  }
  fs.writeFileSync(file,JSON.stringify(matrix,null,2)+'\n');
  console.log(JSON.stringify({applied_or_marked_done:changed,skipped},null,2));
  status();
} else if(command==='check') {
  const problems=[];
  const seen=new Set();
  for(const it of items) {
    if(seen.has(it.asset_path))problems.push(it.id+': duplicate asset path');
    seen.add(it.asset_path);
    const v=verifyImage(it);
    if(it.status==='DONE'&&!finished(it))problems.push(it.id+': DONE but invalid image or metadata ('+v.reason+')');
  }
  if(items.length!==547)problems.push('Expected 547 matrix entries, got '+items.length);
  console.log(JSON.stringify({errors:problems,done:items.filter(finished).length,total:items.length},null,2));
  if(problems.length)process.exitCode=1;
} else {
  console.error('Usage: node tools/image-seo.mjs status | next [N] | apply [N] | check');
  process.exitCode=2;
}
