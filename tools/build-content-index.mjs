#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd(),CHECK=process.argv.includes("--check");
const cfg=JSON.parse(fs.readFileSync(path.join(ROOT,"data/factory-config.json"),"utf8"));

function parseCSV(text){
  const rows=[];let row=[],f="",q=false;
  for(let i=0;i<text.length;i++){const c=text[i];if(q){if(c==='"'&&text[i+1]==='"'){f+='"';i++;}else if(c==='"')q=false;else f+=c;}else{if(c==='"')q=true;else if(c===","){row.push(f);f="";}else if(c==="\n"){row.push(f);rows.push(row);row=[];f="";}else if(c!=="\r")f+=c;}}
  if(f||row.length){row.push(f);rows.push(row);}return rows.filter(r=>r.length);
}
function matrix(){
  if(!fs.existsSync(cfg.matrix_path))return[];
  const raw=parseCSV(fs.readFileSync(cfg.matrix_path,"utf8")),h=raw[0]||[];
  return raw.slice(1).map(r=>Object.fromEntries(h.map((x,i)=>[x,r[i]||""])));
}
const articles=[];
for(const r of matrix().filter(r=>r.production_status==="PUBLISHED"&&r.path)){
  const p=path.join(ROOT,r.path);if(!fs.existsSync(p))continue;
  const html=fs.readFileSync(p,"utf8");
  const title=((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[])[1]||r.working_title_fr||r.keyword_signal).replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
  const url="/"+r.path.replace(/index\.html$/,"");
  articles.push({url,title,tags:[r.silo_id,"article",r.priority.toLowerCase()]});
}
const fixed=[
  {url:"/",title:"Location de moto et scooter à Hanoi",tags:["location","hanoi","scooter"]},
  {url:"/a-propos/",title:"À propos",tags:["entreprise","hanoi"]},
  {url:"/blog/",title:"Blog",tags:["blog","location","voyage"]},
  {url:"/faq/",title:"FAQ",tags:["faq","location","permis"]},
  {url:"/contact/",title:"Contact",tags:["contact","hanoi"]}
];
const src='(()=>{const fixed='+JSON.stringify(fixed)+';const silo=(window.SILO_MAP||[]).flatMap(s=>[{url:s.href,title:s.title,tags:[s.id,"hub"]},...(s.children||[]).map(c=>({url:c.href,title:c.title,tags:[s.id,"cluster"]}))]);const articles='+JSON.stringify(articles)+';window.CONTENT_INDEX=[...fixed,...silo,...articles]})();\n';
const out=path.join(ROOT,"assets/js/content-index.js"),cur=fs.existsSync(out)?fs.readFileSync(out,"utf8"):"";
if(CHECK&&cur!==src){console.error("content-index drift");process.exit(1);}
if(!CHECK&&cur!==src)fs.writeFileSync(out,src);
console.log((CHECK?"INDEX_OK ":"INDEX_BUILT ")+articles.length);
