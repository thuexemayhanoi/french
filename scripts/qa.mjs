import fs from"node:fs";import path from"node:path";
const root=process.cwd(),all=[];function walk(d){for(const n of fs.readdirSync(d)){if([".git","node_modules"].includes(n))continue;const f=path.join(d,n),s=fs.statSync(f);s.isDirectory()?walk(f):all.push(f)}}walk(root);
const html=all.filter(f=>f.endsWith(".html")),err=[],sm=fs.readFileSync("sitemap.xml","utf8"),titles=new Map(),canonicals=new Map();
const clusterMatrix=JSON.parse(fs.readFileSync("data/seo-cluster-matrix.json","utf8"));
const components=fs.readFileSync("assets/js/components.js","utf8");
const route=f=>{const r=path.relative(root,f).replace(/\\/g,"/");return r==="index.html"?"/":"/"+r.replace(/index\.html$/,"")};
const count=t=>t.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/&[a-z#0-9]+;/gi," ").replace(/\s+/g," ").trim().split(/\s+/).filter(Boolean).length;
const routes=new Set();
for(const f of html){
 const t=fs.readFileSync(f,"utf8"),r=path.relative(root,f),u=route(f),main=t.match(/<main class="shell">([\s\S]*?)<\/main>/i)?.[1]||"";
 routes.add(u);
 const row=clusterMatrix.pages.find(x=>x.path===u);
 const title=t.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim()||"";
 const desc=t.match(/<meta name="description" content="([^"]*)"/i)?.[1]||"";
 const h1=t.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g,"").trim()||"";
 const canonical=t.match(/<link rel="canonical" href="([^"]+)"/i)?.[1]||"";
 if(!row)err.push(r+": missing from SEO cluster matrix");
 if((t.match(/<h1\b/gi)||[]).length!==1)err.push(r+": H1 count");
 if(!canonical)err.push(r+": canonical missing");
 if(!/meta name="description"/i.test(t))err.push(r+": meta missing");
 if(!/site-config\.js/.test(t)||!/silo-map\.js/.test(t)||!/content-index\.js/.test(t))err.push(r+": shared data");
 if(!sm.includes("https://fr.rentbikehanoi.com"+u))err.push(r+": sitemap file");
 if(!/data-breadcrumbs/.test(t))err.push(r+": breadcrumbs hook");
 if(!/data-related/.test(t))err.push(r+": topical cluster hook");
 if(row){
   if(title!==row.seo_title)err.push(r+": title differs from matrix");
   if(desc!==row.meta_description)err.push(r+": meta description differs from matrix");
   if(h1!==row.h1)err.push(r+": H1 differs from matrix");
   if(canonical!==row.canonical)err.push(r+": canonical differs from matrix");
   if(!row.breadcrumbs||!row.breadcrumbs.length)err.push(r+": breadcrumb mapping missing");
   if(row.sitemap!=="INCLUDED")err.push(r+": sitemap matrix status");
   if(!row.schema_type)err.push(r+": schema type missing");
   if(!row.cluster||!row.role||!row.intent||!row.primary_keyword)err.push(r+": incomplete topical mapping");
 }
 const wc=count(main);
 if(r!=="contact/index.html"&&(wc<1500||wc>3000))err.push(r+": word-count "+wc+" (expected 1500-3000)");
 if(r!=="contact/index.html"){
   const internal=[...main.matchAll(/href="(\/[^"#?]*)"/g)].map(m=>m[1]),set=new Set(internal);
   if(set.size<3)err.push(r+": fewer than 3 static internal links");
   if(row)for(const required of row.required_internal_links||[])if(!set.has(required))err.push(r+": missing required internal link "+required);
 }
 if(title){if(titles.has(title))err.push(r+": duplicate title with "+titles.get(title));else titles.set(title,r)}
 if(canonical){if(canonicals.has(canonical))err.push(r+": duplicate canonical with "+canonicals.get(canonical));else canonicals.set(canonical,r)}
}
for(const row of clusterMatrix.pages)if(!routes.has(row.path))err.push("matrix orphan: "+row.path);
if(clusterMatrix.pages.length!==43)err.push("matrix page count "+clusterMatrix.pages.length+" expected 43");
if(clusterMatrix.summary?.pending!==0)err.push("matrix still has pending items");
if(!components.includes("BreadcrumbList"))err.push("components: BreadcrumbList schema missing");
const rootHtml=fs.readFileSync("index.html","utf8");
if(!/href="https:\/\/app\.rentbikehanoi\.com\/?"/.test(rootHtml))err.push("index.html: missing English-site body link");
if(fs.readFileSync("CNAME","utf8").trim()!=="fr.rentbikehanoi.com")err.push("CNAME");
if(err.length){console.error(err.join("\n"));process.exit(1)}
console.log("QA passed:",html.length,"pages; foundation SEO matrix complete and enforced.");
