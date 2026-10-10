#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {loadSite} from '../tools/shared-site.mjs';
import {publicFiles} from '../tools/build-site.mjs';
const config=loadSite().config;
const root=process.cwd(),out=path.join(root,'_site'),files=publicFiles(root),errors=[];
const run=(file,fn)=>{try{fn()}catch(error){errors.push(file+': '+error.message)}};
// Locate an article's exact source bytes, including nested FAQ articles.
function editorial(html){const start=html.search(/<article\b[^>]*class="seo-longform"/i);if(start<0)return '';let depth=0;for(const m of html.slice(start).matchAll(/<\/?article\b[^>]*>/gi)){depth+=m[0].startsWith('</')?-1:1;if(!depth)return html.slice(start,start+m.index+m[0].length)}throw Error('Unclosed editorial article')}
let indexable=0,redirects=0,schemas=0;
const routes=new Set(files.filter(f=>f.endsWith('index.html')).map(f=>f==='index.html'?'/':'/'+f.replace(/index\.html$/,'')));
for(const file of files){if(!file.endsWith('.html'))continue;run(file,()=>{
 const source=fs.readFileSync(path.join(root,file),'utf8'),built=fs.readFileSync(path.join(out,file),'utf8');
 if(/data-page-type="redirect"/i.test(source)){assert.equal(built,source,'redirect changed');redirects++;return}
 indexable++;
 assert.equal(editorial(built),editorial(source),'editorial HTML changed');
 const metadata=h=>[...h.matchAll(/<title>[\s\S]*?<\/title>|<meta\b[^>]*(?:name="(?:description|robots)"|property="og:[^"]+")[^>]*>|<link\b[^>]*rel="canonical"[^>]*>/gi)].map(m=>m[0]);
 assert.deepEqual(metadata(built),metadata(source),'SEO metadata changed');
 assert.equal((built.match(/<h1\b/gi)||[]).length,1,'H1 count');
 assert.ok(/data-shared-built="1"/.test(built),'build marker missing');
 assert.ok(/src="\/assets\/js\/components\.js/.test(built),'runtime component bootstrap missing');
 assert.ok(!/data-(?:site-header|site-footer|global-cta|related|breadcrumbs)"(?=>)/.test(built),'malformed shared hook');
 const schemaMatches=[...built.matchAll(/<script type="application\/ld\+json" data-site-schema="1">([\s\S]*?)<\/script>/g)];
 assert.equal(schemaMatches.length,config.featureFlags.schema?1:0,'shared schema count');schemas+=schemaMatches.length;
 if(config.featureFlags.schema){const graph=JSON.parse(schemaMatches[0][1])['@graph'];assert.ok(graph.length>=2);
 const business=graph.find(n=>n['@type']==='LocalBusiness');
 assert.equal(business.telephone,config.phone);assert.equal(business.openingHoursSpecification[0].closes,config.hours.close);
 assert.equal(business.name,config.businessName||config.siteName);
 for(const faq of graph.filter(n=>n['@type']==='FAQPage'))assert.ok(faq.mainEntity?.length,'empty FAQ schema');}
 for(const m of built.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[^"\s]*)"/g)){
   const route=m[1];assert.ok(fs.existsSync(path.join(out,route.slice(1))), 'broken local resource '+route);
 }
 const related=built.match(/<section class="related topical-cluster">([\s\S]*?)<\/section>/)?.[1]||'';
 const links=[...related.matchAll(/href="([^"]+)"/g)].map(m=>m[1]);
 assert.ok(links.length<=8,'related limit');assert.equal(new Set(links).size,links.length,'duplicate related link');
 const own=file==='index.html'?'/':'/'+file.replace(/index\.html$/,'');
 for(const link of links){assert.notEqual(link,own,'related self link');assert.ok(routes.has(link),'missing related target')}
 });}
for(const f of ['sitemap.xml','robots.txt','CNAME'])run(f,()=>assert.equal(fs.readFileSync(path.join(out,f),'utf8'),fs.readFileSync(path.join(root,f),'utf8'),f+' changed'));
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(`SHARED_QA_OK ${indexable} pages, ${redirects} redirects, ${schemas} static schemas; editorial bytes, SEO, URLs, sitemap and local links preserved`);
