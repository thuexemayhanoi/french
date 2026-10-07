#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const ROOT=process.cwd();
const cfg=JSON.parse(fs.readFileSync(path.join(ROOT,"data/factory-config.json"),"utf8"));
const foundation=JSON.parse(fs.readFileSync(path.join(ROOT,cfg.foundation_matrix_path),"utf8"));
const xml=execFileSync("unzip",["-p",cfg.source_plan_path,"xl/worksheets/sheet1.xml"],{encoding:"utf8",maxBuffer:20*1024*1024});

const dec=s=>String(s||"").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'");
const source=[];
for(const m of xml.matchAll(/<x:row\b[^>]*>([\s\S]*?)<\/x:row>/g)){
  const cells={};
  for(const c of m[1].matchAll(/<x:c\b[^>]*r="([A-J])\d+"[^>]*>[\s\S]*?<x:v>([\s\S]*?)<\/x:v>[\s\S]*?<\/x:c>/g))cells[c[1]]=dec(c[2]);
  if(cells.A==="STT"||!cells.A)continue;
  source.push({source_id:Number(cells.A),hub_vi:cells.B||"",page_type_vi:cells.C||"",title_vi:cells.D||"",intent_vi:cells.E||"",keyword_variants:cells.F||"",seed:cells.G||"",priority:cells.H||"P2",claim_policy_vi:cells.I||"",source_url:cells.J||""});
}
if(source.length!==500)throw new Error("Expected 500 source rows, got "+source.length);

const hubs={
 "01":{id:"location-hanoi",path:"/location-moto-hanoi/",title:"Location de moto à Hanoi",links:["/prix-location/","/types-motos/"]},
 "02":{id:"honda",path:"/honda/",title:"Motos Honda",links:["/types-motos/","/prix-location/"]},
 "03":{id:"yamaha",path:"/yamaha/",title:"Motos Yamaha",links:["/types-motos/","/prix-location/"]},
 "04":{id:"types",path:"/types-motos/",title:"Types de motos",links:["/location-moto-hanoi/","/permis-securite/"]},
 "05":{id:"prix",path:"/prix-location/",title:"Prix & coûts",links:["/location-moto-hanoi/","/types-motos/"]},
 "06":{id:"permis",path:"/permis-securite/",title:"Permis & sécurité",links:["/types-motos/","/location-moto-hanoi/"]},
 "07":{id:"hanoi",path:"/hanoi/",title:"Hanoi à moto",links:["/location-moto-hanoi/","/types-motos/"]},
 "08":{id:"nord",path:"/nord-vietnam/",title:"Nord du Vietnam",links:["/types-motos/trail/","/permis-securite/securite/"]},
 "09":{id:"centre-sud",path:"/centre-sud-vietnam/",title:"Centre & Sud",links:["/types-motos/","/permis-securite/securite/"]}
};

const merges={
  1:"/location-moto-hanoi/",15:"/location-moto-hanoi/courte-duree/",16:"/prix-location/semaine/",17:"/location-moto-hanoi/longue-duree/",
  60:"/faq/",221:"/types-motos/scooter-automatique/",222:"/types-motos/semi-automatique/",224:"/types-motos/50cc/",
  226:"/types-motos/electrique/",227:"/types-motos/trail/",280:"/prix-location/",320:"/permis-securite/permis/",
  360:"/hanoi/que-faire/",410:"/nord-vietnam/",460:"/centre-sud-vietnam/"
};
for(const [id,p] of Object.entries(merges))if(!foundation.pages.some(x=>x.path===p))throw new Error("Merge target missing: "+id+" -> "+p);

const slugify=s=>String(s||"").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,90);
const csv=v=>'"'+String(v??"").replace(/"/g,'""')+'"';
const headers=["id","source_id","source_title_vi","keyword_signal","keyword_variants","silo_id","parent_hub_path","parent_hub_title","content_role","intent_vi","priority","claim_policy_vi","source_url","url","path","working_title_fr","content_brief_fr","internal_link_targets","source_policy","manual_review_required","target_min_words","target_max_words","factory_status","production_status","repair_attempts","published_at","actual_word_count","seo_score","foundation_merge_path"];
const used=new Set(),out=[];

function policy(r){
  if(/^06\./.test(r.hub_vi))return "CURRENT_OFFICIAL_SOURCES_REQUIRED";
  if(/^05\./.test(r.hub_vi))return "VERIFIED_PRICES_ONLY";
  if(/^02\.|^03\./.test(r.hub_vi))return "NO_INVENTED_STOCK_OR_SPECS";
  if(/^08\.|^09\./.test(r.hub_vi))return "FRESH_ROUTE_WEATHER_RECHECK";
  if(/^07\./.test(r.hub_vi))return "CAUTIOUS_LOCAL_TRAVEL_GUIDANCE";
  return "VERIFIED_BUSINESS_PLUS_CAUTIOUS_GUIDANCE";
}

for(const r of source){
  const key=(r.hub_vi.match(/^(\d{2})/)||[])[1],hub=hubs[key];
  if(!hub)throw new Error("Unknown hub "+r.hub_vi);
  const primary=(r.keyword_variants.split(";")[0]||r.seed||r.title_vi).trim();
  let slug=slugify(primary),n=2;
  while(used.has(hub.path+slug+"/"))slug=slugify(primary)+"-"+(n++);
  used.add(hub.path+slug+"/");
  const merge=merges[r.source_id]||"";
  const id="FR-"+String(r.source_id).padStart(3,"0");
  const url=merge?"":cfg.production_domain+hub.path+slug+"/";
  const outputPath=merge?"":hub.path.slice(1)+slug+"/index.html";
  const manual=/^06\./.test(r.hub_vi)&&/(license|permit|law|legal|driving licence|international)/i.test(primary+" "+r.seed);
  const brief="Rédiger en français natif à partir de l'intention du plan vietnamien « "+r.title_vi+" ». Utiliser les mots-clés de recherche comme signaux, sans traduction littérale ni bourrage. Répondre à une intention distincte du hub parent, garder les affirmations prudentes et suivre la politique de source.";
  const targets=[hub.path,...hub.links].join(";");
  out.push({
    id,source_id:r.source_id,source_title_vi:r.title_vi,keyword_signal:primary,keyword_variants:r.keyword_variants,silo_id:hub.id,parent_hub_path:hub.path,parent_hub_title:hub.title,
    content_role:"CLUSTER",intent_vi:r.intent_vi,priority:r.priority,claim_policy_vi:r.claim_policy_vi,source_url:r.source_url,url,path:outputPath,working_title_fr:"",content_brief_fr:brief,
    internal_link_targets:targets,source_policy:policy(r),manual_review_required:String(manual),target_min_words:r.priority==="P0"?"1700":"1500",target_max_words:r.priority==="P0"?"2800":"2600",
    factory_status:merge?"FOUNDATION_MERGE":"PLANNED",production_status:merge?"MERGED_FOUNDATION":"PLANNED",repair_attempts:"0",published_at:"",actual_word_count:"",seo_score:"",foundation_merge_path:merge
  });
}
const text=[headers.map(csv).join(","),...out.map(r=>headers.map(h=>csv(r[h])).join(","))].join("\n")+"\n";
fs.writeFileSync(path.join(ROOT,cfg.matrix_path),text);
const mergeCount=out.filter(r=>r.factory_status==="FOUNDATION_MERGE").length;
console.log(JSON.stringify({source_rows:out.length,planned_new:out.length-mergeCount,foundation_merges:mergeCount,unplanned_slots:Math.max(0,cfg.target_new_articles-(out.length-mergeCount))},null,2));
