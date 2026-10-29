window.SITE_CONFIG=Object.freeze({
  // BUSINESS_FACTS:START
  siteName:"Thuê xe máy Nguyễn Hà",
  shortName:"Nguyễn Hà",
  domain:"https://fr.rentbikehanoi.com",
  locale:"fr-FR",
  language:"fr",
  phone:"+84334699969",
  phoneDisplay:"0334 699 969",
  email:null,
  address:{"street":"Ngõ 5 Nguyễn Văn Cừ","ward":"Bồ Đề","district":"Long Biên","city":"Hà Nội","country":"Việt Nam"},
  standardAddress:"Ngõ 5 Nguyễn Văn Cừ, Bồ Đề, Long Biên, Hà Nội (gần Bến xe Gia Lâm)",
  hours:{"open":"09:00","close":"21:00","timezone":"Asia/Ho_Chi_Minh"},
  contacts:{"whatsapp":"https://wa.me/84334699969","zalo":"https://zalo.me/84334699969","maps":"https://www.google.com/maps/search/?api=1&query=Ng%C3%B5%205%20Nguy%E1%BB%85n%20V%C4%83n%20C%E1%BB%AB%2C%20B%E1%BB%93%20%C4%90%E1%BB%81%2C%20Long%20Bi%C3%AAn%2C%20H%C3%A0%20N%E1%BB%99i%20(g%E1%BA%A7n%20B%E1%BA%BFn%20xe%20Gia%20L%C3%A2m)"},
  businessName:"Thuê xe máy Nguyễn Hà",
  businessWebsite:"https://fr.rentbikehanoi.com/",
  rental:{"currency":"VND","referenceOnly":true,"confirmationRequired":true,"prices":{"semiAutomatic":{"daily":[150000,200000],"weekly":[700000,800000],"monthly":[1000000,1200000]},"scooter":{"daily":[150000,200000],"weekly":[600000,1000000],"monthly":[1200000,2000000]},"vision":{"daily":200000,"weekly":1000000,"monthly":2000000},"airBlade":{"daily":200000,"weekly":900000,"monthly":1500000},"scooter50cc":{"daily":200000,"weekly":1000000,"monthly":2000000},"electric":{"daily":null,"daily_note":"Selon le modèle, à confirmer","weekly":[600000,800000],"monthly":[1500000,1800000]}}},
  // BUSINESS_FACTS:END
  cta:{eyebrow:"Hanoi · Long Biên",title:"Besoin d’une moto à Hanoi ?",description:"Appelez ou écrivez sur Zalo ou WhatsApp pour confirmer le véhicule, les dates et le prix avant de venir à Long Biên (09:00–21:00).",callLabel:"Appeler",contactLabel:"Contact",contactHref:"/contact/"},
  footerGroups:[{title:"Location & motos",ids:["location-hanoi","honda","yamaha","types","prix"]},{title:"Voyager",ids:["hanoi","nord","centre-sud"]},{title:"Guides",links:[["Permis & sécurité","/permis-securite/"],["FAQ","/faq/"],["Blog","/blog/"]]},{title:"Entreprise",links:[["Accueil","/"],["À propos","/a-propos/"],["Contact","/contact/"],["Confidentialité","/confidentialite/"],["Conditions","/conditions/"]]}],
  related:{limit:6,cross:{"location-hanoi":["types","prix","permis","hanoi"],honda:["types","yamaha","prix"],yamaha:["types","honda","nord","prix"],types:["location-hanoi","prix","permis","honda","yamaha"],prix:["location-hanoi","types"],permis:["types","location-hanoi","nord"],hanoi:["location-hanoi","nord"],nord:["types","permis","hanoi"],"centre-sud":["types","permis","nord"]}},
  slots:{beforeMain:true,afterArticle:true,beforeFooter:true},
  featureFlags:{themeToggle:true,businessStatus:true,globalCTA:true,related:true,schema:true,breadcrumbs:true,quickContact:true,localChatbot:true},
  navGroups:[
    {label:"Accueil",href:"/"},
    {label:"À propos",href:"/a-propos/"},
    {label:"Location",silos:["location-hanoi","honda","yamaha","types","prix"]},
    {label:"Voyager",silos:["hanoi","nord","centre-sud"]},
    {label:"Conseils",items:[
      {label:"Permis & sécurité",href:"/permis-securite/"}
    ]},
    {label:"FAQ",href:"/faq/"},
    {label:"Contact",href:"/contact/"},
    {label:"Confidentialité",href:"/confidentialite/"},
    {label:"Conditions",href:"/conditions/"}
  ]
});