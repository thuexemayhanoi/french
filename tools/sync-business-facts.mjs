#!/usr/bin/env node
// The owner's confirmed JSON is the source for browser-visible business facts.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const facts=JSON.parse(fs.readFileSync('data/seo-business-facts.json','utf8'));
const prices=facts.reference_prices;
const config={
  siteName:facts.name,shortName:facts.name.replace(/^Thuê xe máy /,''),domain:'https://fr.rentbikehanoi.com',locale:'fr-FR',language:'fr',
  phone:facts.phone_e164,phoneDisplay:facts.phone_display,email:null,
  address:facts.postal_address,
  standardAddress:facts.address,hours:{open:facts.hours.open,close:facts.hours.close,timezone:facts.hours.timezone},
  contacts:{whatsapp:'https://wa.me/'+facts.phone_e164.slice(1),zalo:'https://zalo.me/'+facts.phone_e164.slice(1),
    maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(facts.address)},
  businessName:facts.name,businessWebsite:'https://fr.rentbikehanoi.com/',
  rental:{currency:facts.currency,referenceOnly:true,confirmationRequired:true,prices:{
    semiAutomatic:prices.semi_automatic,scooter:prices.automatic_scooter,
    vision:prices.vision,airBlade:{daily:prices.air_blade.daily,weekly:prices.air_blade.weekly,monthly:prices.air_blade.monthly},
    scooter50cc:prices.scooter_50cc,electric:prices.electric
  }}
};
const path='assets/js/site-config.js',start='  // BUSINESS_FACTS:START',end='  // BUSINESS_FACTS:END';
let source=fs.readFileSync(path,'utf8');
const block=start+'\n'+Object.entries(config).map(([key,value])=>'  '+key+':'+JSON.stringify(value)+',').join('\n')+'\n'+end;
if(source.includes(start)){
  const a=source.indexOf(start),b=source.indexOf(end,a);
  assert.ok(b>a,'Business facts marker must be complete');
  source=source.slice(0,a)+block+source.slice(b+end.length);
}else{
  const a=source.indexOf('\n')+1,b=source.indexOf('  cta:');
  assert.ok(a>0&&b>a,'Cannot identify the legacy business configuration');
  source=source.slice(0,a)+block+'\n'+source.slice(b);
}
if(process.argv.includes('--check')){
  assert.equal(fs.readFileSync(path,'utf8'),source,'Confirmed business JSON and browser configuration differ');
  console.log('BUSINESS_FACTS_OK');
}else{
  fs.writeFileSync(path,source);
  console.log('BUSINESS_FACTS_SYNCED');
}
