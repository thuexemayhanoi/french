(()=>{
"use strict";
const C=window.SITE_CONFIG;if(!C)return;
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/œ/g,"oe").replace(/[^a-z0-9\s-]/g," ").replace(/\s+/g," ").trim();
const STOP=new Set("le la les un une des du de d au aux a à et ou en pour avec sur dans est sont je tu vous nous mon ma mes votre vos ce cet cette ces quel quelle quels quelles combien comment ou où svp merci bonjour salut".split(" "));
const SYN={prix:["tarif","cout","coût","price","cost"],location:["louer","rent","rental","hire"],moto:["motorbike","motorcycle","bike","scooter"],permis:["license","licence","idp"],adresse:["map","carte","location","where"],hanoi:["ha noi"],mensuel:["mois","monthly"],semaine:["weekly"],jour:["daily"],essence:["carburant","fuel","petrol"],panne:["breakdown"],antivol:["vol","theft","lock"],pluie:["rain"],itineraire:["route","trip","road"]};
const expand=q=>{const base=norm(q).split(" ").filter(x=>x.length>1&&!STOP.has(x)),out=new Set(base);for(const w of base){for(const [k,vs] of Object.entries(SYN)){if(w===k||vs.includes(w)){out.add(k);vs.forEach(x=>out.add(norm(x)))}}}return [...out]};
function link(h,l,ext=false){return '<a href="'+esc(h)+'"'+(ext?' target="_blank" rel="noopener"':'')+'>'+esc(l)+'</a>'}
function icon(type){
 const d={
 phone:'<path d="M21 16.5v3a1.5 1.5 0 0 1-1.7 1.5A18.5 18.5 0 0 1 3 4.7 1.5 1.5 0 0 1 4.5 3h3A1.5 1.5 0 0 1 9 4.3c.1 1 .4 2 .7 2.9a1.5 1.5 0 0 1-.3 1.6L8 10.2a15 15 0 0 0 5.8 5.8l1.4-1.4a1.5 1.5 0 0 1 1.6-.3c.9.3 1.9.6 2.9.7a1.5 1.5 0 0 1 1.3 1.5z"/>',
 chat:'<path d="M21 12a8.5 8.5 0 0 1-12.4 7.5L4 21l1.6-4.4A8.5 8.5 0 1 1 21 12z"/><path d="M9 11.5h.01M12.5 11.5h.01M16 11.5h.01"/>',
 map:'<path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
 message:'<path d="M4 5.5h16v11H8l-4 3v-14z"/><path d="M8 10h8M8 13h5"/>'
 }[type]||'';
 return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+d+'</svg>';
}
function mount(){
 if(document.getElementById("quick-contact"))return;
 const quick=document.createElement("div");quick.className="quick-contact";quick.id="quick-contact";quick.dataset.open="false";
 quick.innerHTML='<button class="qc-main" type="button" aria-expanded="false" aria-label="Contacts rapides">'+icon("phone")+'</button><div class="qc-actions">'+
  '<a class="qc-btn" href="tel:'+esc(C.phone)+'" aria-label="Appeler">'+icon("phone")+'<span class="qc-tip">Appeler</span></a>'+
  '<a class="qc-btn" href="'+esc(C.contacts?.zalo||"https://zalo.me/84942467674")+'" target="_blank" rel="noopener" aria-label="Zalo">'+icon("message")+'<span class="qc-tip">Zalo</span></a>'+
  '<a class="qc-btn" href="'+esc(C.contacts?.whatsapp||"https://wa.me/84942467674")+'" target="_blank" rel="noopener" aria-label="WhatsApp">'+icon("message")+'<span class="qc-tip">WhatsApp</span></a>'+
  '<a class="qc-btn" href="'+esc(C.contacts?.maps||"#")+'" target="_blank" rel="noopener" aria-label="Google Maps">'+icon("map")+'<span class="qc-tip">Carte</span></a></div>';
 document.body.appendChild(quick);
 const fab=document.createElement("button");fab.className="chat-fab";fab.id="chat-fab";fab.type="button";fab.setAttribute("aria-expanded","false");fab.setAttribute("aria-controls","chat-panel");fab.setAttribute("aria-label","Assistant local");fab.innerHTML=icon("chat")+'<span class="chat-tip">Assistant</span>';document.body.appendChild(fab);
 const panel=document.createElement("div");panel.className="chat-panel";panel.id="chat-panel";panel.hidden=true;panel.setAttribute("role","dialog");panel.setAttribute("aria-label","Assistant local Nguyen Tu");
 panel.innerHTML='<div class="chat-head"><div><span class="chat-title">Assistant Nguyen Tu</span><span class="chat-subtitle">Local · sans API · réponses depuis le site</span></div><button class="chat-close" type="button" aria-label="Fermer">×</button></div><div class="chat-log" aria-live="polite"></div><div class="chat-quick"><button data-q="Quel est le prix d’un scooter 50cc ?">50cc</button><button data-q="Quel dépôt faut-il prévoir ?">Dépôt</button><button data-q="Où êtes-vous à Hanoi ?">Adresse</button><button data-q="Quels sont vos horaires ?">Horaires</button><button data-q="Quel permis faut-il au Vietnam ?">Permis</button><button data-q="Conseils pour un road trip depuis Hanoi">Road trip</button></div><form class="chat-input"><input type="text" placeholder="Posez une question sur la location…" aria-label="Votre question" autocomplete="off"><button type="submit" aria-label="Envoyer">➜</button></form>';
 document.body.appendChild(panel);
 wire(quick,fab,panel);
}
class SiteSearch{
 constructor(){this.data=null;this.state="idle";this.promise=null}
 load(){if(this.promise)return this.promise;this.state="loading";this.promise=fetch("/assets/chat/search-index.json?v=20261007-fr1",{cache:"no-cache"}).then(r=>{if(!r.ok)throw new Error("index");return r.json()}).then(j=>{this.data=j;this.state="ready";return j}).catch(()=>{this.state="error";return null});return this.promise}
 search(q){if(!this.data?.e?.length)return null;const terms=expand(q),phrase=norm(q);let best=null,bs=0;
  for(const e of this.data.e){const title=norm(e.t+" "+(e.d||"")+" "+(e.h||"")),body=norm((e.s||[]).map(x=>x.h+" "+(x.p||[]).join(" ")).join(" "));let score=0;if(phrase.length>4&&title.includes(phrase))score+=18;
   for(const w of terms){if(title.includes(w))score+=7;if(body.includes(w))score+=1}if(score>bs){let sec=null,ss=0;for(const s of e.s||[]){const st=norm(s.h+" "+(s.p||[]).join(" "));let z=0;for(const w of terms)if(st.includes(w))z+=2;if(z>ss){ss=z;sec=s}}bs=score;best={e,sec,score}}}
  return best&&best.score>=3?best:null
 }
}
const search=new SiteSearch(),memory={topic:null};
function fixedAnswer(raw){
 const q=norm(raw);
 if(/disponib|stock|encore une moto|avez vous une moto/.test(q))return "Je ne peux pas vérifier la disponibilité en temps réel. Appelez ou écrivez-nous pour confirmer le modèle et les dates.";
 if(/horaire|heure|ouvert|ferme|fermé/.test(q))return "Horaires habituels : 09:00–21:30, heure de Hanoi.";
 if(/adresse|ou etes|où êtes|localisation|carte|map/.test(raw.toLowerCase())||/adresse|localisation/.test(q))return "Nous sommes au 112 Nguyen Van Cu, Long Bien, Hanoi. "+link(C.contacts.maps,"Ouvrir la carte",true)+".";
 if(/contact|telephone|téléphone|appeler|zalo|whatsapp/.test(raw.toLowerCase())||/contact|telephone|appeler/.test(q))return "Téléphone : "+link("tel:"+C.phone,C.phoneDisplay)+". Vous pouvez aussi utiliser Zalo ou WhatsApp via le bouton rapide en bas à gauche.";
 if(/depot|dépôt|caution|passeport/.test(raw.toLowerCase())||/depot|caution|passeport/.test(q))return "Pour le scooter 50cc vérifié : dépôt de 4 000 000 VND, ou passeport comme alternative. Pour un autre modèle, demandez confirmation avant la location.";
 if(/50\s*cc/.test(q)&&/prix|tarif|cout|coût|jour|3 jours/.test(raw.toLowerCase()))return "Le tarif vérifié du scooter automatique 50cc est de 200 000 VND par jour. Pour 3 jours : 600 000 VND.";
 if(/livraison|delivery|giao/.test(q))return "La livraison ou reprise peut être disponible pour les contrats d’au moins 800 000 VND, avec frais supplémentaires selon le trajet. Confirmez le lieu avant de réserver.";
 return null;
}
function pickExcerpt(hit,q){
 const ps=hit?.sec?.p?.length?hit.sec.p:(hit?.e?.p||[]);
 if(!ps?.length)return "";
 const terms=expand(q),scored=[];
 for(const p of ps){const n=norm(p);let score=0;for(const w of terms)if(n.includes(w))score++;scored.push({p,score})}
 scored.sort((a,b)=>b.score-a.score);
 let t=scored.slice(0,2).map(x=>x.p).join(" ");
 if(t.length>620)t=t.slice(0,617).replace(/\s+\S*$/,"")+"…";
 return t;
}
function legal(q){return /permis|license|licence|loi|legal|légal|police|vitesse|autoroute|documents/.test(norm(q))}
async function answer(q){
 const fixed=fixedAnswer(q);if(fixed)return fixed;
 await search.load();const hit=search.search(q);
 if(hit){memory.topic=hit.e.u;const excerpt=pickExcerpt(hit,q);const warn=legal(q)?"Information générale : vérifiez toujours les règles actuelles auprès d’une source officielle. ":"";return warn+(excerpt||"J’ai trouvé une page pertinente sur ce sujet.")+'<span class="chat-source">'+link(hit.e.u,"Lire la page source →")+"</span>"}
 return "Je n’ai pas trouvé de réponse assez fiable dans les pages publiées. Essayez avec le modèle, le prix, la durée, le permis ou la destination. "+link("/contact/","Contactez-nous")+" si vous avez besoin d’une confirmation.";
}
function suggestions(q){
 const n=norm(q);if(/prix|tarif|50cc/.test(n))return [["Location au mois","Prix location au mois"],["Types de motos","Quels types de motos louer ?"],["Adresse","Où êtes-vous ?"]];
 if(/permis|legal|légal|loi/.test(n))return [["Sécurité","Conseils sécurité moto Vietnam"],["50cc","Scooter 50cc à Hanoi"],["Contact","Contact"]];
 if(/road|voyage|trip|ha giang|sapa|ninh binh/.test(n))return [["Ha Giang","Ha Giang Loop à moto"],["Sapa","Sapa à moto"],["Trail","Moto trail pour voyager"]];
 return [["Prix","Prix location moto Hanoi"],["50cc","Scooter 50cc"],["Adresse","Adresse"],["Horaires","Horaires"]];
}
function wire(quick,fab,panel){
 const main=quick.querySelector(".qc-main"),close=panel.querySelector(".chat-close"),log=panel.querySelector(".chat-log"),form=panel.querySelector(".chat-input"),input=form.querySelector("input");
 let greeted=false;
 const setQuick=o=>{quick.dataset.open=String(o);main.setAttribute("aria-expanded",String(o))};
 const setChat=o=>{panel.hidden=!o;fab.setAttribute("aria-expanded",String(o));if(o){setQuick(false);search.load();if(!greeted){greeted=true;msg("Bonjour ! Je réponds uniquement à partir des informations vérifiées et des pages publiées de ce site. Aucun API ni modèle externe n’est utilisé.","bot")}setTimeout(()=>input.focus({preventScroll:true}),60)}};
 const msg=(html,who)=>{const d=document.createElement("div");d.className="chat-msg "+who;d.innerHTML=html;log.appendChild(d);log.scrollTop=log.scrollHeight};
 const send=async text=>{text=String(text||"").trim();if(!text)return;msg(esc(text),"user");const t=document.createElement("div");t.className="chat-msg bot chat-typing";t.textContent="…";log.appendChild(t);log.scrollTop=log.scrollHeight;const a=await answer(text);t.remove();msg(a,"bot");const wrap=document.createElement("div");wrap.className="chat-suggest";suggestions(text).slice(0,4).forEach(([label,q])=>{const b=document.createElement("button");b.type="button";b.textContent=label;b.onclick=()=>send(q);wrap.appendChild(b)});log.appendChild(wrap);log.scrollTop=log.scrollHeight};
 main.onclick=()=>setQuick(quick.dataset.open!=="true");fab.onclick=()=>setChat(panel.hidden);close.onclick=()=>setChat(false);
 document.addEventListener("click",e=>{if(quick.dataset.open==="true"&&!quick.contains(e.target)&&e.target!==main)setQuick(false)});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"){setQuick(false);setChat(false)}});
 form.onsubmit=e=>{e.preventDefault();const v=input.value;input.value="";send(v)};
 panel.querySelectorAll(".chat-quick button").forEach(b=>b.onclick=()=>send(b.dataset.q||b.textContent));
 const vv=window.visualViewport;
 const syncViewport=()=>{if(!vv)return;document.documentElement.style.setProperty("--vv-h",vv.height+"px");const keyboard=window.innerHeight-vv.height>150&&document.activeElement===input;panel.dataset.keyboardOpen=String(keyboard);document.body.classList.toggle("chat-keyboard-open",keyboard);if(keyboard){document.documentElement.style.setProperty("--chat-vv-top",Math.max(8,vv.offsetTop+8)+"px");document.documentElement.style.setProperty("--chat-vv-height",Math.max(280,vv.height-16)+"px")}};
 vv?.addEventListener("resize",syncViewport);vv?.addEventListener("scroll",syncViewport);input.addEventListener("focus",()=>setTimeout(syncViewport,80));input.addEventListener("blur",()=>setTimeout(syncViewport,80));syncViewport();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount);else mount();
})();