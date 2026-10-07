#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const ROOT=process.cwd();
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const write=(p,s)=>{const f=path.join(ROOT,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,s);};
const cfg=JSON.parse(read("data/factory-config.json"));
const now=()=>new Date().toISOString();
const today=()=>now().slice(0,10);

function parseCSV(text){
  const rows=[];let row=[],f="",q=false;
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(q){
      if(c==='"'&&text[i+1]==='"'){f+='"';i++;}
      else if(c==='"')q=false;
      else f+=c;
    }else{
      if(c==='"')q=true;
      else if(c===","){row.push(f);f="";}
      else if(c==="\n"){row.push(f);rows.push(row);row=[];f="";}
      else if(c!=="\r")f+=c;
    }
  }
  if(f||row.length){row.push(f);rows.push(row);}
  return rows.filter(r=>r.length);
}
const csv=v=>'"'+String(v??"").replace(/"/g,'""')+'"';

function loadMatrix(){
  const raw=parseCSV(read(cfg.matrix_path)),headers=raw[0]||[];
  return {headers,rows:raw.slice(1).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??""])))};
}
function saveMatrix(m){
  write(cfg.matrix_path,[m.headers.map(csv).join(","),...m.rows.map(r=>m.headers.map(h=>csv(r[h]||"")).join(","))].join("\n")+"\n");
}
function loadState(){return JSON.parse(read(cfg.state_path));}
function saveState(s){write(cfg.state_path,JSON.stringify(s,null,2)+"\n");}
function excluded(r){return ["FOUNDATION_MERGE","EXCLUDED"].includes(r.factory_status);}
function priority(r){return r.priority==="P0"?0:r.priority==="P1"?1:2;}

function stats(m){
  const valid=m.rows.filter(r=>!excluded(r));
  const count=s=>valid.filter(r=>r.factory_status===s).length;
  const published=valid.filter(r=>r.production_status==="PUBLISHED").length;
  return {
    target:cfg.target_new_articles,
    matrix_rows:m.rows.length,
    valid_new_rows:valid.length,
    foundation_merges:m.rows.filter(r=>r.factory_status==="FOUNDATION_MERGE").length,
    published,
    planned:count("PLANNED"),
    writing:count("WRITING"),
    repair:count("REPAIR"),
    review:count("REVIEW"),
    blocked:count("BLOCKED"),
    remaining_to_target:Math.max(0,cfg.target_new_articles-published),
    unplanned_slots:Math.max(0,cfg.target_new_articles-valid.length)
  };
}

function claimNext(m){
  const active=m.rows.filter(r=>["WRITING","REPAIR"].includes(r.factory_status)).length;
  let slots=Math.max(0,cfg.batch_size-active);
  const candidates=m.rows.filter(r=>r.factory_status==="PLANNED").sort((a,b)=>priority(a)-priority(b)||Number(a.source_id)-Number(b.source_id));
  for(const r of candidates){if(!slots)break;r.factory_status="WRITING";slots--;}
}

function queuePayload(m){
  const s=stats(m),st=loadState();
  const active=m.rows.filter(r=>["WRITING","REPAIR"].includes(r.factory_status)).sort((a,b)=>priority(a)-priority(b)||Number(a.source_id)-Number(b.source_id)).slice(0,cfg.batch_size);
  let status="READY";
  if(st.blocked)status="BLOCKED";
  else if(!st.enabled)status="PAUSED";
  else if(s.remaining_to_target===0)status="TARGET_REACHED";
  else if(!active.length&&!s.planned)status=s.unplanned_slots?"PLAN_GAP":"PLAN_EXHAUSTED";
  else if(s.unplanned_slots)status="READY_WITH_PLAN_GAP";
  return {
    schema_version:1,
    status,
    generated_at:now(),
    target_new_articles:s.target,
    planned_new_articles:s.valid_new_rows,
    foundation_merges:s.foundation_merges,
    published:s.published,
    remaining_to_target:s.remaining_to_target,
    unplanned_slots:s.unplanned_slots,
    queue:active.map(r=>({
      id:r.id,
      source_id:Number(r.source_id),
      source_title_vi:r.source_title_vi,
      keyword_signal:r.keyword_signal,
      keyword_variants:r.keyword_variants,
      silo_id:r.silo_id,
      parent_hub_path:r.parent_hub_path,
      parent_hub_title:r.parent_hub_title,
      intent_vi:r.intent_vi,
      priority:r.priority,
      claim_policy_vi:r.claim_policy_vi,
      source_url:r.source_url,
      url:r.url,
      path:r.path,
      content_brief_fr:r.content_brief_fr,
      internal_link_targets:(r.internal_link_targets||"").split(";").filter(Boolean),
      source_policy:r.source_policy,
      manual_review_required:r.manual_review_required==="true",
      target_min_words:Number(r.target_min_words),
      target_max_words:Number(r.target_max_words),
      title_min_chars:cfg.title_min_chars,
      title_max_chars:cfg.title_max_chars,
      meta_description_min_chars:cfg.meta_description_min_chars,
      meta_description_max_chars:cfg.meta_description_max_chars,
      seo_score_min:cfg.seo_score_min,
      draft_file:cfg.inbox_dir+"/"+r.id+cfg.draft_extension,
      template:cfg.template_path
    }))
  };
}
function writeQueue(m){const q=queuePayload(m);write(cfg.writer_queue_path,JSON.stringify(q,null,2)+"\n");return q;}

function refreshQueue(){
  const m=loadMatrix(),st=loadState();
  if(st.enabled&&!st.blocked)claimNext(m);
  saveMatrix(m);
  const q=writeQueue(m);
  console.log("FACTORY_QUEUE "+JSON.stringify({status:q.status,ids:q.queue.map(x=>x.id),remaining:q.remaining_to_target,unplanned_slots:q.unplanned_slots}));
}

function plain(html){
  return html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/&[a-z#0-9]+;/gi," ").replace(/\s+/g," ").trim();
}
function articleRegion(html){return (html.match(/<article\b[\s\S]*?<\/article>/i)||[])[0]||html;}
function wordCount(html){const t=plain(articleRegion(html));return t?t.split(/\s+/).filter(Boolean).length:0;}
function internalLinks(html){
  const out=[];
  for(const m of articleRegion(html).matchAll(/href=["']([^"'#]+)["']/gi)){
    let h=m[1].trim();
    if(h.startsWith(cfg.production_domain))h=h.slice(cfg.production_domain.length)||"/";
    if(h.startsWith("/"))out.push(h);
  }
  return [...new Set(out)];
}
function hrefToPath(href){
  const clean=href.split("#")[0].split("?")[0];
  if(clean==="/")return "index.html";
  const p=clean.replace(/^\//,"");
  return clean.endsWith("/")?p+"index.html":p;
}
function cleaned(v){return String(v||"").replace(/<[^>]+>/g," ").replace(/&amp;/g,"&").replace(/\s+/g," ").trim();}
function normalized(v){
  return cleaned(v).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").replace(/\s+/g," ").trim();
}
function frenchSignal(text){
  const s=" "+plain(text).toLowerCase()+" ";
  const tokens=[" le "," la "," les "," des "," de "," du "," pour "," avec "," dans "," sur "," une "," un "," et "," est "," à "," au "," aux "," vous "," votre "," cette "," ce "," ces "];
  return tokens.reduce((n,t)=>n+(s.split(t).length-1),0);
}
function siteSeoIndex(excludePath){
  const out=[];
  function walk(dir){
    for(const e of fs.readdirSync(dir,{withFileTypes:true})){
      if([".git","node_modules","site","_factory"].includes(e.name))continue;
      const full=path.join(dir,e.name);
      if(e.isDirectory())walk(full);
      else if(e.isFile()&&e.name.endsWith(".html")){
        const rel=path.relative(ROOT,full).split(path.sep).join("/");
        if(rel===excludePath)continue;
        const html=fs.readFileSync(full,"utf8");
        out.push({path:rel,title:cleaned((html.match(/<title>([\s\S]*?)<\/title>/i)||[])[1]),canonical:(html.match(/<link rel="canonical" href="([^"]+)"/i)||[])[1]||""});
      }
    }
  }
  walk(ROOT);return out;
}

function normalizeDraft(html,row){
  html=html.replace(/<html(?:\s+[^>]*)?>/i,'<html lang="fr">');
  const canonical='<link rel="canonical" href="'+row.url+'">';
  if(/<link rel="canonical" href="[^"]*">/i.test(html))html=html.replace(/<link rel="canonical" href="[^"]*">/i,canonical);
  else html=html.replace(/<\/head>/i,canonical+"\n</head>");
  html=html.replace(/<body([^>]*)>/i,(m,a)=>'<body'+a.replace(/\sdata-page-type="[^"]*"/i,"").replace(/\sdata-factory-id="[^"]*"/i,"").replace(/\sdata-tags="[^"]*"/i,"").replace(/\sdata-parent-path="[^"]*"/i,"")+' data-page-type="article" data-factory-id="'+row.id+'" data-tags="'+row.silo_id+',article" data-parent-path="'+row.parent_hub_path+'">');
  if(!html.includes("data-site-header"))html=html.replace(/<body[^>]*>/i,m=>m+"\n<div data-site-header></div>");
  if(!html.includes("data-breadcrumbs"))html=html.replace(/<main[^>]*>/i,m=>m+"\n<div data-breadcrumbs></div>");
  if(!html.includes("data-global-cta"))html=html.replace(/<\/main>/i,'<div data-global-cta></div><div data-related></div></main>');
  if(!/site-config\.js/.test(html))html=html.replace(/<\/body>/i,'<script src="/assets/js/site-config.js?v=20261007-nav3"></script><script src="/assets/js/silo-map.js"></script><script src="/assets/js/content-index.js"></script><script src="/assets/js/components.js?v=20261007-factory1"></script><script src="/assets/js/app.js"></script></body>');
  return html;
}

function validateDraft(html,row){
  const errors=[],warnings=[];
  const title=cleaned((html.match(/<title>([\s\S]*?)<\/title>/i)||[])[1]);
  const desc=(html.match(/<meta name="description" content="([^"]*)"/i)||[])[1]||"";
  const canon=(html.match(/<link rel="canonical" href="([^"]+)"/i)||[])[1]||"";
  const h1n=(html.match(/<h1\b/gi)||[]).length;
  const wc=wordCount(html),links=internalLinks(html),targets=(row.internal_link_targets||"").split(";").filter(Boolean);
  const site=siteSeoIndex(row.path),tlen=[...title].length,dlen=[...desc].length,fr=frenchSignal(html),h2n=(html.match(/<h2\b/gi)||[]).length;
  if(!/<html[^>]*lang="fr"/i.test(html))errors.push("html lang must be fr");
  if(tlen<cfg.title_min_chars||tlen>cfg.title_max_chars)errors.push("title length "+tlen+" outside "+cfg.title_min_chars+"-"+cfg.title_max_chars);
  if(dlen<cfg.meta_description_min_chars||dlen>cfg.meta_description_max_chars)errors.push("meta description length "+dlen+" outside "+cfg.meta_description_min_chars+"-"+cfg.meta_description_max_chars);
  if(h1n!==1)errors.push("expected exactly one H1");
  if(canon!==row.url)errors.push("canonical mismatch");
  if(wc<cfg.first_pass_min_words||wc>cfg.first_pass_max_words)errors.push("word count "+wc+" outside "+cfg.first_pass_min_words+"-"+cfg.first_pass_max_words);
  if(links.length<cfg.first_pass_min_internal_links)errors.push("internal links below minimum");
  if(links.length>cfg.first_pass_max_internal_links)warnings.push("internal links above preferred maximum: "+links.length);
  if(fr<25)errors.push("French-language signal too weak");
  if(h2n<4)errors.push("fewer than 4 H2 sections");
  for(const t of targets)if(!links.includes(t))errors.push("missing required link "+t);
  for(const l of links){const p=hrefToPath(l);if(!fs.existsSync(path.join(ROOT,p)))errors.push("broken internal link "+l);}
  if(site.some(x=>normalized(x.title)===normalized(title)))errors.push("duplicate title");
  if(site.some(x=>x.canonical===row.url))errors.push("duplicate canonical");
  if(fs.existsSync(path.join(ROOT,row.path)))errors.push("output path already exists");
  if(/app\.rentbikehanoi\.com|thuexemayhanoi\.github\.io/i.test(html))errors.push("wrong production domain");
  let score=0;
  if(tlen>=cfg.title_min_chars&&tlen<=cfg.title_max_chars)score+=15;
  if(dlen>=cfg.meta_description_min_chars&&dlen<=cfg.meta_description_max_chars)score+=10;
  if(h1n===1)score+=10;
  if(canon===row.url)score+=10;
  if(wc>=cfg.first_pass_min_words&&wc<=cfg.first_pass_max_words)score+=15;
  if(links.length>=3&&links.length<=8)score+=15;
  if(fr>=25)score+=10;
  if(targets.every(t=>links.includes(t)))score+=10;
  if(h2n>=4)score+=5;
  if(score<cfg.seo_score_min)errors.push("SEO score "+score+" below "+cfg.seo_score_min);
  return {errors:[...new Set(errors)],warnings:[...new Set(warnings)],word_count:wc,seo_score:score,title_length:tlen,description_length:dlen};
}

function changedDrafts(before,after){
  let list=[];
  try{
    if(before&&after&&before!=="0000000000000000000000000000000000000000"){
      const out=execFileSync("git",["diff","--name-status",before,after,"--",cfg.inbox_dir],{encoding:"utf8"});
      for(const line of out.split(/\r?\n/)){
        if(!line.trim())continue;
        const parts=line.split("\t"),p=parts[parts.length-1];
        if(p&&p.endsWith(cfg.draft_extension))list.push(p);
      }
    }
  }catch{}
  if(!list.length&&fs.existsSync(path.join(ROOT,cfg.inbox_dir))){
    list=fs.readdirSync(path.join(ROOT,cfg.inbox_dir)).filter(x=>x.endsWith(cfg.draft_extension)).map(x=>cfg.inbox_dir+"/"+x);
  }
  return [...new Set(list)].slice(0,cfg.batch_size);
}

function appendSitemap(urls){
  if(!urls.length)return;
  let xml=read("sitemap.xml");
  const existing=new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]));
  const add=urls.filter(u=>!existing.has(u)).map(u=>"  <url><loc>"+u+"</loc></url>").join("\n");
  if(add)xml=xml.replace(/\s*<\/urlset>\s*$/,"\n"+add+"\n</urlset>\n");
  write("sitemap.xml",xml);
}

function processDrafts(before,after){
  const m=loadMatrix(),st=loadState();
  const rep={schema_version:1,started:now(),finished:null,processed:[],published_ids:[],review_ids:[],repair_ids:[],blocked_ids:[],fatal:null};
  if(!st.enabled){rep.fatal="factory paused";rep.finished=now();write(cfg.report_path,JSON.stringify(rep,null,2)+"\n");return rep;}
  for(const draftPath of changedDrafts(before,after)){
    const id=path.basename(draftPath,cfg.draft_extension),row=m.rows.find(x=>x.id===id);
    const item={id,draft:draftPath,status:null,errors:[],warnings:[]};
    if(!row||!["WRITING","REPAIR","BLOCKED"].includes(row.factory_status)){
      item.status="REJECTED";item.errors.push("row not writable");rep.processed.push(item);continue;
    }
    const html=normalizeDraft(read(draftPath),row),qa=validateDraft(html,row);
    Object.assign(item,{errors:qa.errors,warnings:qa.warnings,word_count:qa.word_count,seo_score:qa.seo_score});
    row.actual_word_count=String(qa.word_count);row.seo_score=String(qa.seo_score);
    if(qa.errors.length){
      row.repair_attempts=String(Number(row.repair_attempts||0)+1);
      if(Number(row.repair_attempts)>=cfg.max_repair_attempts){row.factory_status="BLOCKED";item.status="BLOCKED";rep.blocked_ids.push(id);}
      else{row.factory_status="REPAIR";item.status="REPAIR";rep.repair_ids.push(id);}
      rep.processed.push(item);continue;
    }
    fs.unlinkSync(path.join(ROOT,draftPath));
    if(row.manual_review_required==="true"){
      write(cfg.review_dir+"/"+id+".html",html);
      row.factory_status="REVIEW";row.production_status="REVIEW_PENDING";item.status="REVIEW";rep.review_ids.push(id);
    }else{
      const outPath=path.join(ROOT,row.path);fs.mkdirSync(path.dirname(outPath),{recursive:true});fs.writeFileSync(outPath,html);
      row.factory_status="PUBLISHED";row.production_status="PUBLISHED";row.published_at=today();row.repair_attempts="0";item.status="PUBLISHED";rep.published_ids.push(id);st.last_successful_id=id;
    }
    rep.processed.push(item);
  }
  st.last_run=now();saveMatrix(m);
  appendSitemap(rep.published_ids.map(id=>m.rows.find(x=>x.id===id)?.url).filter(Boolean));
  if(cfg.auto_claim_next&&st.enabled)claimNext(m);
  saveMatrix(m);writeQueue(m);saveState(st);
  rep.finished=now();write(cfg.report_path,JSON.stringify(rep,null,2)+"\n");
  console.log("FACTORY_PROCESS_DONE "+JSON.stringify({published:rep.published_ids,review:rep.review_ids,repair:rep.repair_ids,blocked:rep.blocked_ids}));
  return rep;
}

function approve(id){
  const m=loadMatrix(),row=m.rows.find(x=>x.id===id);
  if(!row||row.factory_status!=="REVIEW")throw new Error("ID not in REVIEW: "+id);
  const src=path.join(ROOT,cfg.review_dir,id+".html");
  if(!fs.existsSync(src))throw new Error("review file missing");
  if(fs.existsSync(path.join(ROOT,row.path)))throw new Error("output exists");
  const html=fs.readFileSync(src,"utf8"),qa=validateDraft(html,row);
  if(qa.errors.length)throw new Error("review file no longer passes QA: "+qa.errors.join("; "));
  fs.mkdirSync(path.dirname(path.join(ROOT,row.path)),{recursive:true});
  fs.renameSync(src,path.join(ROOT,row.path));
  row.factory_status="PUBLISHED";row.production_status="PUBLISHED";row.published_at=today();row.repair_attempts="0";row.actual_word_count=String(qa.word_count);row.seo_score=String(qa.seo_score);
  appendSitemap([row.url]);
  const st=loadState();st.last_successful_id=id;st.last_run=now();saveState(st);
  if(cfg.auto_claim_next&&st.enabled)claimNext(m);
  saveMatrix(m);writeQueue(m);
  console.log("FACTORY_APPROVED "+id);
}

function verifyLast(){
  const rep=JSON.parse(read(cfg.report_path)),m=loadMatrix(),errors=[];
  for(const id of rep.published_ids||[]){
    const row=m.rows.find(x=>x.id===id);
    if(!row||!fs.existsSync(path.join(ROOT,row.path)))errors.push(id+": output missing");
    else if((parseInt(row.seo_score||"0",10)||0)<cfg.seo_score_min)errors.push(id+": stored SEO score low");
  }
  if(errors.length){console.error("FACTORY_VERIFY_FAILED\n- "+errors.join("\n- "));process.exit(1);}
  console.log("FACTORY_VERIFY_PASS");
}

function setPaused(paused){
  const st=loadState();st.enabled=!paused;if(!paused){st.blocked=false;st.last_error=null;}st.last_run=now();saveState(st);
  if(!paused)refreshQueue();else writeQueue(loadMatrix());
}
function status(){
  const m=loadMatrix(),s=stats(m),st=loadState(),q=queuePayload(m);
  console.log(JSON.stringify({...s,enabled:st.enabled,blocked:st.blocked,queue_status:q.status,queue_ids:q.queue.map(x=>x.id),last_successful_id:st.last_successful_id},null,2));
}

const [,,cmd,...args]=process.argv;
const arg=name=>{const i=args.indexOf(name);return i>=0?args[i+1]:null;};
switch(cmd){
  case "refresh-queue":refreshQueue();break;
  case "process":processDrafts(arg("--before"),arg("--after"));break;
  case "approve":approve(args[0]);break;
  case "pause":setPaused(true);break;
  case "resume":setPaused(false);break;
  case "status":status();break;
  case "verify-last":verifyLast();break;
  default:console.log("Usage: node tools/factory.mjs <refresh-queue|process|approve ID|pause|resume|status|verify-last>");process.exit(cmd?2:0);
}
