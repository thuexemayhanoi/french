#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import {frenchSlug} from "./french-slug.mjs";

const ROOT=process.cwd();
const cfg=JSON.parse(fs.readFileSync(path.join(ROOT,"data/factory-config.json"),"utf8"));
const foundation=JSON.parse(fs.readFileSync(path.join(ROOT,cfg.foundation_matrix_path),"utf8"));
const packed=cfg.source_plan_parts.map(p=>fs.readFileSync(path.join(ROOT,p),"utf8").trim()).join("");
const rawRows=JSON.parse(zlib.inflateSync(Buffer.from(packed,"base64")).toString("utf8"));
const source=rawRows.map(v=>({source_id:Number(v[0]),hub_vi:v[1]||"",page_type_vi:v[2]||"",title_vi:v[3]||"",intent_vi:v[4]||"",keyword_variants:v[5]||"",seed:v[6]||"",priority:v[7]||"P2",claim_policy_vi:v[8]||"",source_url:v[9]||""}));
if(source.length!==500)throw new Error("Expected 500 source rows, got "+source.length);

const gapReplacements=[
  [501,"04. Loại xe & nhu cầu sử dụng","Bài hướng dẫn","Dùng Google Maps khi đi xe máy ở Hà Nội: tránh đường cấm và chọn lộ trình dễ đi","Điều hướng","google maps moto hanoi; navigation scooter hanoi; itineraire moto hanoi","google maps moto hanoi","P1","Không khẳng định quy định giao thông nếu chưa kiểm tra nguồn chính thức.","EDITORIAL_GAP_AUDIT"],
  [502,"04. Loại xe & nhu cầu sử dụng","Bài hướng dẫn","Giá đỡ điện thoại và sạc pin khi đi xe máy: cách dùng an toàn cho khách du lịch","Thông tin","support telephone scooter hanoi; charge telephone moto vietnam","support telephone scooter hanoi","P2","Không quảng cáo thiết bị cụ thể nếu chưa xác minh.","EDITORIAL_GAP_AUDIT"],
  [503,"04. Loại xe & nhu cầu sử dụng","Bài hướng dẫn","Chở người ngồi sau bằng xe máy ở Việt Nam: chọn xe và sắp xếp hành lý","Thông tin","passager scooter vietnam; deux personnes moto hanoi","passager scooter vietnam","P1","Chỉ đưa hướng dẫn an toàn chung, không suy diễn luật.","EDITORIAL_GAP_AUDIT"],
  [504,"04. Loại xe & nhu cầu sử dụng","Bài hướng dẫn","Khóa xe và chống trộm khi thuê xe máy ở Hà Nội: thói quen nên có","Thông tin","antivol moto hanoi; securiser scooter hanoi; vol moto location vietnam","antivol moto hanoi","P1","Không khẳng định mức độ tội phạm hay bảo hiểm nếu chưa có nguồn.","EDITORIAL_GAP_AUDIT"],
  [505,"04. Loại xe & nhu cầu sử dụng","Bài hướng dẫn","Đi xe máy qua phố ngập ở Hà Nội: khi nào nên dừng và đổi lộ trình","An toàn","rue inondee moto hanoi; scooter pluie hanoi; inondation moto vietnam","rue inondee moto hanoi","P1","Ưu tiên an toàn, không đưa ngưỡng kỹ thuật tuyệt đối nếu chưa xác minh.","EDITORIAL_GAP_AUDIT"],
  [506,"04. Loại xe & nhu cầu sử dụng","Bài hướng dẫn","Đổ xăng ở Hà Nội khi thuê xe máy: tìm cây xăng, thanh toán và kiểm tra nhiên liệu","Thông tin","station essence hanoi moto; faire le plein scooter hanoi; essence moto vietnam","station essence hanoi moto","P1","Không khẳng định loại xăng hoặc giá hiện tại nếu chưa kiểm tra.","EDITORIAL_GAP_AUDIT"],
  [507,"01. Thuê xe máy Hà Nội","Bài hướng dẫn","Nhận xe thuê: nên chụp ảnh và quay video những gì trước khi rời cửa hàng","Điều tra thương mại","etat des lieux moto location hanoi; photo scooter location hanoi","etat des lieux moto location hanoi","P1","Chỉ hướng dẫn quy trình kiểm tra, không hứa chính sách bồi thường.","EDITORIAL_GAP_AUDIT"],
  [508,"01. Thuê xe máy Hà Nội","Bài hướng dẫn","Trả xe thuê ở Hà Nội: kiểm tra xe, nhiên liệu và đồ dùng trước khi bàn giao","Giao dịch","rendre scooter location hanoi; retour moto location hanoi","rendre scooter location hanoi","P1","Không khẳng định chính sách nhiên liệu hay phí nếu chưa xác minh.","EDITORIAL_GAP_AUDIT"],
  [509,"01. Thuê xe máy Hà Nội","Bài hướng dẫn","Làm gì khi xe thuê bị chết máy trong nội thành Hà Nội","Hỗ trợ","panne scooter hanoi; moto location en panne hanoi","panne scooter hanoi","P1","Ưu tiên liên hệ bên cho thuê, không hướng dẫn sửa chữa nguy hiểm.","EDITORIAL_GAP_AUDIT"],
  [510,"01. Thuê xe máy Hà Nội","Bài hướng dẫn","Làm gì sau va chạm nhẹ khi đang sử dụng xe thuê ở Việt Nam","Hỗ trợ","accident scooter location vietnam; collision moto louee vietnam","accident scooter location vietnam","P1","Không thay thế tư vấn pháp lý; thông tin pháp lý phải kiểm tra nguồn chính thức.","EDITORIAL_GAP_AUDIT"],
  [511,"06. Bằng lái & an toàn","Bài pháp lý","Xe máy có được đi vào đường cao tốc ở Việt Nam không? Hướng dẫn cho khách nước ngoài","Pháp lý","autoroute moto vietnam; scooter autoroute vietnam; route interdite moto vietnam","autoroute moto vietnam","P1","Bắt buộc kiểm tra văn bản pháp luật Việt Nam hiện hành trước khi xuất bản.","EDITORIAL_GAP_AUDIT"],
  [512,"06. Bằng lái & an toàn","Bài pháp lý","Giới hạn tốc độ xe máy ở Việt Nam: khách du lịch cần kiểm tra gì trước chuyến đi","Pháp lý","limite vitesse moto vietnam; vitesse scooter vietnam","limite vitesse moto vietnam","P1","Bắt buộc kiểm tra quy định tốc độ hiện hành từ nguồn chính thức.","EDITORIAL_GAP_AUDIT"],
  [513,"06. Bằng lái & an toàn","Bài pháp lý","Khi cảnh sát giao thông dừng xe: khách nước ngoài nên chuẩn bị giấy tờ nào","Pháp lý","police moto vietnam touriste; controle routier vietnam moto","police moto vietnam touriste","P1","Bắt buộc kiểm tra quy định hiện hành; không tư vấn né tránh thực thi pháp luật.","EDITORIAL_GAP_AUDIT"],
  [514,"06. Bằng lái & an toàn","Bài pháp lý","Giấy tờ cần mang theo khi lái xe máy thuê ở Việt Nam","Pháp lý","documents moto location vietnam; papiers scooter vietnam","documents moto location vietnam","P1","Bắt buộc kiểm tra danh mục giấy tờ hiện hành từ nguồn chính thức.","EDITORIAL_GAP_AUDIT"],
  [515,"06. Bằng lái & an toàn","Bài pháp lý","Biển báo, vòng xuyến và đường một chiều ở Hà Nội: hướng dẫn đọc nhanh cho khách nước ngoài","Pháp lý","panneaux circulation hanoi moto; rond point hanoi scooter; sens unique hanoi moto","panneaux circulation hanoi moto","P2","Bắt buộc kiểm tra quy tắc giao thông hiện hành từ nguồn chính thức.","EDITORIAL_GAP_AUDIT"]
];
for(const v of gapReplacements)source.push({source_id:v[0],hub_vi:v[1],page_type_vi:v[2],title_vi:v[3],intent_vi:v[4],keyword_variants:v[5],seed:v[6],priority:v[7],claim_policy_vi:v[8],source_url:v[9]});


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
  const merge=merges[r.source_id]||"";
  const id="FR-"+String(r.source_id).padStart(3,"0");
  let slug=frenchSlug(primary,id),n=2;
  while(used.has(hub.path+slug+"/"))slug=frenchSlug(primary,id)+"-"+(n++);
  used.add(hub.path+slug+"/");
  const url=merge?"":cfg.production_domain+hub.path+slug+"/";
  const outputPath=merge?"":hub.path.slice(1)+slug+"/index.html";
  const manual=/^06\./.test(r.hub_vi)&&/(license|permit|law|legal|driving licence|international|permis|loi|légal|legal|police|vitesse|autoroute|péage|peage|documents|panneaux|circulation)/i.test(primary+" "+r.seed+" "+r.title_vi);
  const brief="Rédiger en français natif à partir de l'intention du plan vietnamien « "+r.title_vi+" ». Utiliser les mots-clés de recherche comme signaux, sans traduction littérale ni bourrage. Répondre à une intention distincte du hub parent, garder les affirmations prudentes et suivre la politique de source.";
  const targets=[hub.path,...hub.links].join(";");
  out.push({
    id,source_id:r.source_id,source_title_vi:r.title_vi,keyword_signal:primary,keyword_variants:r.keyword_variants,silo_id:hub.id,parent_hub_path:hub.path,parent_hub_title:hub.title,
    content_role:"CLUSTER",intent_vi:r.intent_vi,priority:r.priority,claim_policy_vi:r.claim_policy_vi,source_url:r.source_url,url,path:outputPath,working_title_fr:"",content_brief_fr:brief,
    internal_link_targets:targets,source_policy:policy(r),manual_review_required:String(manual),target_min_words:"1500",target_max_words:"5000",
    factory_status:merge?"FOUNDATION_MERGE":"PLANNED",production_status:merge?"MERGED_FOUNDATION":"PLANNED",repair_attempts:"0",published_at:"",actual_word_count:"",seo_score:"",foundation_merge_path:merge
  });
}
// Preserve runtime/progress fields if the plan is regenerated after publishing has begun.
if(fs.existsSync(path.join(ROOT,cfg.matrix_path))){
  const parsePrev=text=>{const rows=[];let row=[],f="",q=false;for(let i=0;i<text.length;i++){const ch=text[i];if(q){if(ch==='"'&&text[i+1]==='"'){f+='"';i++;}else if(ch==='"')q=false;else f+=ch}else{if(ch==='"')q=true;else if(ch===","){row.push(f);f=""}else if(ch==="\n"){row.push(f);rows.push(row);row=[];f=""}else if(ch!=="\r")f+=ch}}if(f||row.length){row.push(f);rows.push(row)}return rows.filter(r=>r.length)};
  const prevRaw=parsePrev(fs.readFileSync(path.join(ROOT,cfg.matrix_path),"utf8")),prevH=prevRaw[0]||[],prev=new Map(prevRaw.slice(1).map(r=>{const o=Object.fromEntries(prevH.map((h,i)=>[h,r[i]||""]));return[o.id,o]}));
  const keep=["working_title_fr","factory_status","production_status","repair_attempts","published_at","actual_word_count","seo_score"];
  for(const r of out){const p=prev.get(r.id);if(!p||r.factory_status==="FOUNDATION_MERGE")continue;for(const k of keep)if(p[k]!==undefined&&p[k]!=="")r[k]=p[k]}
}

const text=[headers.map(csv).join(","),...out.map(r=>headers.map(h=>csv(r[h])).join(","))].join("\n")+"\n";
fs.writeFileSync(path.join(ROOT,cfg.matrix_path),text);
const mergeCount=out.filter(r=>r.factory_status==="FOUNDATION_MERGE").length;
console.log(JSON.stringify({source_rows:out.length,planned_new:out.length-mergeCount,foundation_merges:mergeCount,unplanned_slots:Math.max(0,cfg.target_new_articles-(out.length-mergeCount))},null,2));
