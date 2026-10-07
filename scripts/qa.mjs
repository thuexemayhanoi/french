import fs from"node:fs";import path from"node:path";
const root=process.cwd(),all=[];
function walk(d){for(const n of fs.readdirSync(d)){if([".git","node_modules","site","_factory"].includes(n))continue;const f=path.join(d,n),s=fs.statSync(f);s.isDirectory()?walk(f):all.push(f)}}walk(root);
const html=all.filter(f=>f.endsWith(".html")),err=[],sm=fs.readFileSync("sitemap.xml","utf8"),titles=new Map(),canonicals=new Map();
const foundation=JSON.parse(fs.readFileSync("data/seo-cluster-matrix.json","utf8"));
function parseCSV(text){const rows=[];let row=[],f="",q=false;for(let i=0;i<text.length;i++){const c=text[i];if(q){if(c==='"'&&text[i+1]==='"'){f+='"';i++;}else if(c==='"')q=false;else f+=c;}else{if(c==='"')q=true;else if(c===","){row.push(f);f="";}else if(c==="\n"){row.push(f);rows.push(row);row=[];f="";}else if(c!=="\r")f+=c;}}if(f||row.length){row.push(f);rows.push(row);}return rows.filter(r=>r.length)}
const raw=parseCSV(fs.readFileSync("data/content-matrix.csv","utf8")),mh=raw[0]||[],matrix=raw.slice(1).map(r=>Object.fromEntries(mh.map((h,i)=>[h,r[i]||""])));
const byPath=new Map(matrix.filter(r=>r.path).map(r=>[r.path,r]));
const route=f=>{const r=path.relative(root,f).replace(/\\/g,"/");return r==="index.html"?"/":"/"+r.replace(/index\.html$/,"")};
const count=t=>t.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/&[a-z#0-9]+;/gi," ").replace(/\s+/g," ").trim().split(/\s+/).filter(Boolean).length;
const routes=new Set();
for(const f of html){
 const t=fs.readFileSync(f,"utf8"),r=path.relative(root,f).replace(/\\/g,"/"),u=route(f),main=t.match(/<main class="shell">([\s\S]*?)<\/main>/i)?.[1]||"";
 const fr=foundation.pages.find(x=>x.path===u),mr=byPath.get(r);
 const title=t.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim()||"",desc=t.match(/<meta name="description" content="([^"]*)"/i)?.[1]||"",h1=t.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g,"").trim()||"",canonical=t.match(/<link rel="canonical" href="([^"]+)"/i)?.[1]||"";
 routes.add(u);
 if((t.match(/<h1\b/gi)||[]).length!==1)err.push(r+": H1 count");
 if(!title||!desc||!canonical)err.push(r+": SEO head missing");
 if(!/site-config\.js/.test(t)||!/silo-map\.js/.test(t)||!/content-index\.js/.test(t))err.push(r+": shared data");
 if(!sm.includes("https://fr.rentbikehanoi.com"+u))err.push(r+": sitemap");
 if(!/data-breadcrumbs/.test(t)||!/data-related/.test(t))err.push(r+": shared hooks");
 if(fr){
   if(title!==fr.seo_title)err.push(r+": title differs from foundation matrix");
   if(desc!==fr.meta_description)err.push(r+": meta differs from foundation matrix");
   if(h1!==fr.h1)err.push(r+": H1 differs from foundation matrix");
   if(canonical!==fr.canonical)err.push(r+": canonical differs from foundation matrix");
   for(const l of fr.required_internal_links||[])if(!main.includes('href="'+l+'"'))err.push(r+": missing foundation link "+l);
 }else if(mr){
   if(mr.production_status!=="PUBLISHED")err.push(r+": public factory page not marked PUBLISHED");
   if(canonical!==mr.url)err.push(r+": factory canonical mismatch");
   const wc=count(main);if(wc<1500||wc>3000)err.push(r+": factory word count "+wc);
   if(!t.includes('data-factory-id="'+mr.id+'"'))err.push(r+": factory ID marker missing");
   for(const l of (mr.internal_link_targets||"").split(";").filter(Boolean))if(!main.includes('href="'+l+'"'))err.push(r+": missing factory link "+l);
 }else err.push(r+": public page missing from foundation/factory matrix");
 if(title){if(titles.has(title))err.push(r+": duplicate title with "+titles.get(title));else titles.set(title,r)}
 if(canonical){if(canonicals.has(canonical))err.push(r+": duplicate canonical with "+canonicals.get(canonical));else canonicals.set(canonical,r)}
}
for(const p of foundation.pages)if(!routes.has(p.path))err.push("foundation orphan "+p.path);
if(foundation.pages.length!==43||foundation.summary?.pending!==0)err.push("foundation matrix incomplete");
if(matrix.length!==0&&matrix.length!==515)err.push("factory matrix row count "+matrix.length+" expected 515");
for(const r of matrix.filter(x=>x.production_status==="PUBLISHED")){if(!r.path||!fs.existsSync(path.join(root,r.path)))err.push(r.id+": published output missing");if(!sm.includes(r.url))err.push(r.id+": sitemap missing")}
const pathsSeen=new Set(),urlSeen=new Set();
for(const r of matrix.filter(x=>x.path)){if(pathsSeen.has(r.path))err.push(r.id+": duplicate factory path");pathsSeen.add(r.path);if(urlSeen.has(r.url))err.push(r.id+": duplicate factory URL");urlSeen.add(r.url)}
for(const p of ["data/source-plan.part1.b64","data/source-plan.part2.b64","data/source-plan.part3.b64","data/source-plan.part4.b64"])if(!fs.existsSync(p))err.push("source plan part missing "+p);
if(!fs.readFileSync("assets/js/components.js","utf8").includes('dataset.pageType==="article"'))err.push("article schema support missing");
const cfgSrc=fs.readFileSync("assets/js/site-config.js","utf8");
if(!cfgSrc.includes("quickContact:true")||!cfgSrc.includes("localChatbot:true"))err.push("floating feature flags missing");
if(!cfgSrc.includes("wa.me/84942467674")||!cfgSrc.includes("zalo.me/84942467674")||!cfgSrc.includes("google.com/maps/search"))err.push("quick contact targets missing");
if(!fs.existsSync("assets/js/assistant.js"))err.push("local assistant script missing");
if(!fs.existsSync("assets/chat/search-index.json"))err.push("chat search index missing");
else{const chat=JSON.parse(fs.readFileSync("assets/chat/search-index.json","utf8"));if(chat.count!==html.length)err.push("chat index count "+chat.count+" differs from public HTML "+html.length);if(!Array.isArray(chat.e)||chat.e.length!==chat.count)err.push("chat index entries invalid")}
if(!fs.readFileSync("assets/css/site.css","utf8").includes(".quick-contact")||!fs.readFileSync("assets/css/site.css","utf8").includes(".chat-panel"))err.push("floating UI CSS missing");
if(!fs.readFileSync("index.html","utf8").includes("https://app.rentbikehanoi.com/"))err.push("English-site homepage link missing");
if(fs.readFileSync("CNAME","utf8").trim()!=="fr.rentbikehanoi.com")err.push("CNAME");
if(err.length){console.error(err.join("\n"));process.exit(1)}
console.log("QA passed:",html.length,"public HTML; foundation + French factory architecture clean.");
