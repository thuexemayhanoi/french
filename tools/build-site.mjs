#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {loadSite,renderPage,applyLayout} from './shared-site.mjs';
export function publicFiles(root){
  const files=[];
  const excluded=new Set(['.git','.github','.codex','node_modules','site','tools','tests','scripts','docs','reports','data','_factory','_site']);
  function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){if(excluded.has(item.name)||item.name.startsWith('.'))continue;const p=path.join(dir,item.name);if(item.isDirectory())walk(p);else if(item.isFile()&&(/\.(html|css|js|json|xml|txt|svg|png|jpg|jpeg|webp|ico|woff2?|pdf)$/i.test(item.name)||item.name==='CNAME'))files.push(path.relative(root,p));}}
  walk(root);return files.sort();
}
export function buildSite(root=process.cwd(),out=path.join(root,'_site')){
  // Fixed generated directory only: never accept a caller-controlled removal target.
  if(path.resolve(out)!==path.join(path.resolve(root),'_site'))throw new Error('Output must be <repo>/_site');
  const files=publicFiles(root),site=loadSite(root);
  fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
  let pages=0,redirects=0;
  for(const file of files){const target=path.join(out,file);fs.mkdirSync(path.dirname(target),{recursive:true});
    if(!file.endsWith('.html')){fs.copyFileSync(path.join(root,file),target);continue}
    const html=fs.readFileSync(path.join(root,file),'utf8');
    if(/data-page-type="redirect"/i.test(html)){fs.writeFileSync(target,html);redirects++;continue}
    const route=file==='index.html'?'/':'/'+file.replace(/index\.html$/,'');
    let built=applyLayout(renderPage(html,route,site),root,site.config);
    if(!/src="\/assets\/js\/components\.js/.test(built)){
      built=built.replace(/<script\b[^>]*src="\/assets\/js\/app\.js[^"]*"[^>]*>/i,
        '<script src="/assets/js/components.js"></script>$&');
    }
    built=built.replace(/(src|href)="(\/assets\/[^"?]+\.(?:js|css))(?:\?[^"]*)?"/g,(_,attr,url)=>{
      const hash=createHash('sha256').update(fs.readFileSync(path.join(root,url.slice(1)))).digest('hex').slice(0,12);
      return attr+'="'+url+'?v='+hash+'"';
    });
    fs.writeFileSync(target,built);pages++;
  }
  fs.writeFileSync(path.join(out,'.nojekyll'),'');
  console.log(`SITE_BUILT ${pages} indexable pages + ${redirects} unchanged redirects; no added dependencies`);
  return {pages,redirects,files};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1]))buildSite();
