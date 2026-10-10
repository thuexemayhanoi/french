// Build the existing lightweight components without adding a DOM dependency.
// This adapter deliberately supports only the selectors used by components.js.
// Slot wrappers in source HTML must remain empty; unknown selectors fail the build.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

export const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const textContent=s=>String(s??'').replace(/<[^>]*>/g,'').replace(/&#(x[\da-f]+|\d+);/gi,(_,n)=>String.fromCodePoint(n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n))).replace(/&(amp|lt|gt|quot|apos|nbsp|rsquo|lsquo|ndash|mdash);/g,(_,n)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' ',rsquo:'’',lsquo:'‘',ndash:'–',mdash:'—'}[n]));
export function loadSite(root=process.cwd()){
  const context=vm.createContext({window:{}});
  for(const file of ['site-config.js','silo-map.js','content-index.js'])vm.runInContext(fs.readFileSync(path.join(root,'assets/js',file),'utf8'),context,{timeout:1000});
  return {config:context.window.SITE_CONFIG,silos:context.window.SILO_MAP,index:context.window.CONTENT_INDEX,script:new vm.Script(fs.readFileSync(path.join(root,'assets/js/components.js'),'utf8'))};
}
const attributes=html=>Object.fromEntries([...html.matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)].map(m=>[m[1],textContent(m[2]??m[3]??m[4]??'')]));
const selectorAttributes={'[data-site-header]':'data-site-header','[data-site-footer]':'data-site-footer','[data-global-cta]':'data-global-cta','[data-related]':'data-related','[data-breadcrumbs]':'data-breadcrumbs','[data-silo-grid]':'data-silo-grid','[data-child-grid]':'data-child-grid'};
export function renderPage(html,route,site,{year=new Date().getUTCFullYear()}={}){
  const patches=[],nodes=[];
  for(const m of html.matchAll(/<div\b([^>]*\bdata-(?:site-header|site-footer|global-cta|related|breadcrumbs|silo-grid|child-grid)\b[^>]*)>\s*<\/div>/g)){
    const attrs=attributes(m[1]);
    nodes.push({attrs,getAttribute:n=>attrs[n]??null,set innerHTML(value){patches.push({start:m.index,end:m.index+m[0].length,value:m[0].replace(/(data-[\w-]+)"(?=[\s>])/g,'$1').replace(/>\s*<\/div>$/, '>'+value+'</div>')})}});
  }
  const h1=textContent(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]||'').trim();
  const title=textContent(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]||'');
  const bodyAttrs=attributes(html.match(/<body\b([^>]*)>/i)?.[1]||'');
  const dataset=Object.fromEntries(Object.entries(bodyAttrs).filter(([k])=>k.startsWith('data-')).map(([k,v])=>[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v]));
  const added=[];
  const document={body:{dataset},title,
    querySelector(selector){if(selector==='h1')return h1?{textContent:h1}:null;if(selector==='script[data-site-schema]')return null;
      if(selectorAttributes[selector])return nodes.find(n=>Object.hasOwn(n.attrs,selectorAttributes[selector]))||null;
      throw new Error('Unsupported build selector: '+selector)},
    querySelectorAll(selector){if(selectorAttributes[selector])return nodes.filter(n=>Object.hasOwn(n.attrs,selectorAttributes[selector]));
      if(selector==='[data-faq-item], .seo-faq .faq-item')return [...html.matchAll(/<(?:article|div)\b[^>]*(?:\bdata-faq-item|class="[^"]*\bfaq-item\b[^"]*")[^>]*>([\s\S]*?)<\/(?:article|div)>/g)].map(m=>({querySelector(tag){const v=m[1].match(new RegExp('<'+tag+'\\b[^>]*>([\\s\\S]*?)<\\/'+tag+'>','i'))?.[1];return v?{textContent:textContent(v)}:null}}));
      throw new Error('Unsupported build selector: '+selector)},
    createElement(tag){if(tag!=='script')throw new Error('Unsupported build element: '+tag);return {dataset:{}}},
    head:{appendChild(node){added.push('<script type="application/ld+json" data-site-schema="1">'+node.textContent+'</script>')}}
  };
  const NativeDate=Date;
  class BuildDate extends NativeDate {getFullYear(){return year}}
  const context=vm.createContext({window:{SITE_CONFIG:site.config,SILO_MAP:site.silos,CONTENT_INDEX:site.index,SITE_BUILD:true},document,location:{pathname:route},Date:BuildDate});
  site.script.runInContext(context,{timeout:2000});
  for(const p of patches.sort((a,b)=>b.start-a.start))html=html.slice(0,p.start)+p.value+html.slice(p.end);
  return html.replace(/<\/head>/i,added.join('')+'</head>').replace(/<body\b/i,'<body data-shared-built="1"');
}
export function applyLayout(html,root,config){
  const match=html.match(/^\s*<!doctype html>\s*<html\b([^>]*)>\s*<head>([\s\S]*?)<\/head>\s*<body\b([^>]*)>([\s\S]*?)<\/body>\s*<\/html>\s*$/i);
  if(!match)throw new Error('Unsupported page shell; preserve source and fix layout adapter first');
  let body=match[4];
  const slots=[['beforeMain','before-main',/<main\b/i],['afterArticle','after-article',/<div\b[^>]*\bdata-global-cta\b/i],['beforeFooter','before-footer',/<div\b[^>]*\bdata-site-footer\b/i]];
  for(const [flag,name,anchor] of slots){
    const file=path.join(root,'site/slots',name+'.html');
    const raw=config.slots[flag]?fs.readFileSync(file,'utf8'):'';
    const content=raw.replace(/\{\{site\.([\w.]+)\}\}/g,(_,key)=>{const value=key.split('.').reduce((v,k)=>v?.[k],config);if(value===undefined||typeof value==='object')throw new Error('Unknown slot config key: '+key);return escapeHTML(value)});
    if(content.trim()&&!anchor.test(body))throw new Error('Missing anchor for '+name);
    body=body.replace(anchor,m=>'<!-- shared-slot:'+name+' -->'+content+'<!-- /shared-slot:'+name+' -->'+m);
  }
  return fs.readFileSync(path.join(root,'site/templates/layout.html'),'utf8').replace(/\{\{(htmlAttributes|head|bodyAttributes|body)\}\}/g,(_,key)=>({htmlAttributes:match[1].trim(),head:match[2],bodyAttributes:match[3].trim(),body}[key]));
}
