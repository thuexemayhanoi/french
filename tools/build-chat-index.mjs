#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
const ROOT=process.cwd(),CHECK=process.argv.includes("--check"),OUT=path.join(ROOT,"assets/chat/search-index.json");
const strip=s=>String(s||"").replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;/gi," ").replace(/&amp;/gi,"&").replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&lt;/gi,"<").replace(/&gt;/gi,">").replace(/\s+/g," ").trim();
const cut=(s,n=340)=>s.length>n?s.slice(0,n).replace(/\s+\S*$/,"")+"…":s;
const files=[];
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if([".git","node_modules","site","_factory","assets"].includes(e.name))continue;const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(e.isFile()&&e.name==="index.html")files.push(p)}}walk(ROOT);
const entries=[];
for(const f of files){
 const html=fs.readFileSync(f,"utf8");if(/data-page-type="redirect"/i.test(html)||/<meta name="robots" content="noindex/i.test(html))continue;const rel=path.relative(ROOT,f).split(path.sep).join("/"),u=rel==="index.html"?"/":"/"+rel.replace(/index\.html$/,"");
 const title=strip((html.match(/<title>([\s\S]*?)<\/title>/i)||[])[1]||""),desc=strip((html.match(/<meta name="description" content="([^"]*)"/i)||[])[1]||""),h1=strip((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[])[1]||title);
 const main=((html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)||[])[1]||html).replace(/<details class="article-toc"[\s\S]*?<\/details>/gi," "),parts=main.split(/(?=<h[23]\b)/i),sections=[];
 for(const part of parts){const hm=part.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/i),head=strip(hm?.[1]||h1);const ps=[...part.matchAll(/<(?:p|li)\b[^>]*>([\s\S]*?)<\/(?:p|li)>/gi)].map(m=>cut(strip(m[1]))).filter(x=>x.length>35).slice(0,3);if(ps.length)sections.push({h:head,p:ps});if(sections.length>=16)break}
 const fallback=[...main.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map(m=>cut(strip(m[1]))).filter(x=>x.length>35).slice(0,4);
 entries.push({u,t:title,d:cut(desc,240),h:h1,p:fallback,s:sections});
}
entries.sort((a,b)=>a.u.localeCompare(b.u));
const data={version:1,site:"https://fr.rentbikehanoi.com",generated:null,count:entries.length,e:entries};
const out=JSON.stringify(data);
const cur=fs.existsSync(OUT)?fs.readFileSync(OUT,"utf8").trim():"";
if(CHECK&&cur!==out){console.error("chat search-index drift:",entries.length,"pages");process.exit(1)}
if(!CHECK){fs.mkdirSync(path.dirname(OUT),{recursive:true});fs.writeFileSync(OUT,out+"\n")}
console.log((CHECK?"CHAT_INDEX_OK ":"CHAT_INDEX_BUILT ")+entries.length);
