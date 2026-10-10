import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {loadSite,renderPage,applyLayout} from '../tools/shared-site.mjs';
const site=loadSite(),samples=['honda/honda-wave-rsx-location-hanoi/index.html','index.html'];
const mutate=()=>({...site,config:structuredClone(site.config)});
test('one CTA/contact edit updates different existing pages and escapes markup',()=>{
 const modified=mutate();modified.config.cta.title='<New & CTA>';modified.config.phone='+84123456789';
 for(const file of samples){const html=renderPage(fs.readFileSync(file,'utf8'),'/'+file.replace(/index\.html$/,''),modified);assert.ok(html.includes('&lt;New &amp; CTA&gt;'));assert.ok(html.includes('tel:+84123456789'));assert.ok(!html.includes('<New & CTA>'));assert.equal((html.match(/data-site-schema="1"/g)||[]).length,1)}
});
test('feature flags disable CTA, related, breadcrumbs, schema and header controls',()=>{
 const modified=mutate();for(const flag of ['globalCTA','related','breadcrumbs','schema','themeToggle','businessStatus'])modified.config.featureFlags[flag]=false;
 const html=renderPage(fs.readFileSync(samples[0],'utf8'),'/honda/honda-wave-rsx-location-hanoi/',modified);
 for(const token of ['<aside class="global-cta"','<section class="related','<nav class="breadcrumbs"','data-site-schema="1"','data-theme-toggle','data-business-status'])assert.ok(!html.includes(token),token);
});
test('related links obey central limit, exclude current page and duplicates',()=>{
 const modified=mutate();modified.config.related.limit=3;
 const route='/honda/honda-wave-rsx-location-hanoi/',html=renderPage(fs.readFileSync(samples[0],'utf8'),route,modified);
 const related=html.match(/<section class="related topical-cluster">([\s\S]*?)<\/section>/)[1];
 const links=[...related.matchAll(/href="([^"]+)"/g)].map(m=>m[1]);assert.equal(links.length,3);assert.equal(new Set(links).size,3);assert.ok(!links.includes(route));
});
test('central slots insert escaped config values and can be disabled without editing articles',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'shared-slots-'));
 try{fs.cpSync('site',path.join(temp,'site'),{recursive:true});fs.writeFileSync(path.join(temp,'site/slots/after-article.html'),'<aside>{{site.phoneDisplay}}</aside>');const config=structuredClone(site.config),source=fs.readFileSync(samples[0],'utf8');config.phoneDisplay='<test>';assert.ok(applyLayout(source,temp,config).includes('<aside>&lt;test&gt;</aside>'));config.slots.afterArticle=false;assert.ok(!applyLayout(source,temp,config).includes('<aside>&lt;test&gt;</aside>'))}finally{fs.rmSync(temp,{recursive:true,force:true})}
});
test('schema safely escapes script terminators from shared configuration',()=>{
 const modified=mutate();modified.config.businessName='</script><script>alert(1)</script>';
 const html=renderPage(fs.readFileSync(samples[0],'utf8'),'/honda/honda-wave-rsx-location-hanoi/',modified);
 const raw=html.match(/<script type="application\/ld\+json" data-site-schema="1">([\s\S]*?)<\/script>/)[1];assert.equal(JSON.parse(raw)['@graph'][0].name,modified.config.businessName);assert.ok(!raw.includes('</script>'));
});
