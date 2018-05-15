const CACHE_STATIC="static-cache-17",CACHE_MAP="cache-map-api-4",URLS_TO_CACHE=["index.html","manifest.webmanifest","restaurant.html","assets/css/fonts/iconicfill.woff2","assets/css/fonts/fontawesome.woff2","assets/img/png/launchScreen-ipad-9.7.png","assets/img/png/launchScreen-ipadpro-10.5.png","assets/img/png/launchScreen-ipadpro-12.9.png","assets/img/png/launchScreen-iphone-8.png","assets/img/png/launchScreen-iphone-8plus.png","assets/img/png/launchScreen-iphone-x.png","assets/img/png/launchScreen-iphone-se.png","assets/img/png/logo-64.png","assets/img/png/logo-128.png","assets/img/png/logo-256.png","assets/img/png/logo-512.png","assets/css/index.css","assets/css/restaurant_info.css","js/main.js","js/restaurant_info.js"];self.addEventListener("install",e=>{console.log('- Cache version : "static-cache-17"'),e.waitUntil(caches.open(CACHE_STATIC).then(e=>e.addAll(URLS_TO_CACHE)).then(()=>{console.log("- All resources cached."),self.skipWaiting(),console.log("- SW version skipped.")}).catch(e=>console.error("Open cache failed :",e)))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.map(e=>{if(e!==CACHE_STATIC&&e!==CACHE_MAP)return console.log("- Deleting",e),caches.delete(e)}))).then(()=>console.log('- "static-cache-17" now ready to handle fetches!')))}),self.addEventListener("fetch",e=>{const s=new URL(e.request.url);let n;s.hostname.indexOf("maps")>-1?e.respondWith(caches.open(CACHE_MAP).then(n=>n.match(e.request).then(e=>e||fetch(s.href,{mode:"no-cors"})).then(s=>(n.put(e.request,s.clone()),s),e=>console.error(e)))):s.pathname.indexOf("restaurant.html")>-1?(n=s.href.replace(/[?&]id=\d/,""),e.respondWith(caches.open(CACHE_STATIC).then(s=>s.match(n).then(s=>s||fetch(e.request)).then(e=>(s.put(n,e.clone()),e),e=>console.error(e))))):s.pathname.indexOf("browser-sync")>-1||s.pathname.endsWith("restaurants.json")?e.respondWith(fetch(e.request)):(s.hostname.indexOf("localhost")>-1||s.hostname.indexOf("hally.github.io")>-1)&&e.respondWith(caches.open(CACHE_STATIC).then(s=>s.match(e.request).then(s=>s||fetch(e.request)).then(n=>(s.put(e.request,n.clone()),n),e=>console.error(e)),e=>console.error(e)))});