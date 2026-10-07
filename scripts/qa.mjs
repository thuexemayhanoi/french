import fs from"node:fs";import path from"node:path";
const root=process.cwd(),all=[];function w(d){for(const n of fs.readdirSync(d)){if([".git","node_modules"].includes(n))continue;const f=path.join(d,n),s=fs.statSync(f);s.isDirectory()?w(f):all.push(f)}}w(root);
const html=all.filter(f=>f.endsWith(".html")),err=[],sm=fs.readFileSync("sitemap.xml","utf8"),titles=new Map(),canonicals=new Map();
const route=f=>{const r=path.relative(root,f).replace(/\\/g,"/");return r==="index.html"?"/":"/"+r.replace(/index\.html$/,"")};
const count=t=>t.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/&[a-z#0-9]+;/gi," ").replace(/\s+/g," ").trim().split(/\s+/).filter(Boolean).length;
for(const f of html){
 const t=fs.readFileSync(f,"utf8"),r=path.relative(root,f),u=route(f),main=t.match(/<main class="shell">([\s\S]*?)<\/main>/i)?.[1]||"";
 const title=t.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim()||"",canonical=t.match(/<link rel="canonical" href="([^"]+)"/i)?.[1]||"";
 if((t.match(/<h1\b/gi)||[]).length!==1)err.push(r+": H1");
 if(!canonical)err.push(r+": canonical");
 if(!/meta name="description"/i.test(t))err.push(r+": meta");
 if(!/site-config\.js/.test(t)||!/silo-map\.js/.test(t)||!/content-index\.js/.test(t))err.push(r+": shared data");
 if(!sm.includes("https://fr.rentbikehanoi.com"+u))err.push(r+": sitemap");
 if(!/data-breadcrumbs/.test(t))err.push(r+": breadcrumbs");
 if(!/data-related/.test(t))err.push(r+": topical cluster placeholder");
 const wc=count(main);
 if(r!=="contact/index.html"&&(wc<1500||wc>3000))err.push(r+": word-count "+wc+" (expected 1500-3000)");
 if(r!=="contact/index.html"){
   const internal=[...main.matchAll(/href="(\/[^"#?]*)"/g)].map(m=>m[1]);
   if(new Set(internal).size<3)err.push(r+": fewer than 3 static internal links");
 }
 if(title){if(titles.has(title))err.push(r+": duplicate title with "+titles.get(title));else titles.set(title,r)}
 if(canonical){if(canonicals.has(canonical))err.push(r+": duplicate canonical with "+canonicals.get(canonical));else canonicals.set(canonical,r)}
}
const rootHtml=fs.readFileSync("index.html","utf8");
if(!/href="https:\/\/app\.rentbikehanoi\.com\/?"/.test(rootHtml))err.push("index.html: missing English-site body link");
if(fs.readFileSync("CNAME","utf8").trim()!=="fr.rentbikehanoi.com")err.push("CNAME");
if(err.length){console.error(err.join("\n"));process.exit(1)}
console.log("QA passed:",html.length,"pages; long-form, internal links, topical cluster hooks, unique titles/canonicals and English-site link checked.");
