!function(){return function e(t,n,r){function o(a,i){if(!n[a]){if(!t[a]){var c="function"==typeof require&&require;if(!i&&c)return c(a,!0);if(s)return s(a,!0);var l=new Error("Cannot find module '"+a+"'");throw l.code="MODULE_NOT_FOUND",l}var u=n[a]={exports:{}};t[a][0].call(u.exports,function(e){return o(t[a][1][e]||e)},u,u.exports,e,t,n,r)}return n[a].exports}for(var s="function"==typeof require&&require,a=0;a<r.length;a++)o(r[a]);return o}}()({1:[function(e,t,n){const r=e("./indexedb"),o="/restaurants/",s="/reviews/",a="?is_favorite=",i="http://localhost:1337",c={DATABASE_URL:{GET:{allRestaurants:()=>fetch(i+o),allReviews:()=>fetch(i+s),restaurant:e=>fetch(i+o+e),setFavoriteRestaurants:e=>fetch(i+o+a+e)},POST:{newReview:e=>fetch(i+s,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})},PUT:{favoriteRestaurant:(e,t)=>fetch(i+o+e+a+t,{method:"PUT"}),updateReview:e=>fetch(i+s+e,{method:"PUT"})},DELETE:{review:e=>fetch(i+s+e,{method:"DELETE"})}},fetchRestaurants:()=>{return r.getAll("restaurants").then(e=>e.length<10?c.DATABASE_URL.GET.allRestaurants().then(e=>e.json()).then(e=>(console.log("- Restaurants data fetched !"),e.restaurants||e)).then(e=>(e.forEach(e=>r.set("restaurants",e)),e)).catch(e=>console.error(`Request failed. Returned status of ${e}`)):e).catch(e=>{console.error(e)})},fetchReviews:()=>{return r.getAll("reviews").then(e=>e.reverse()).then(e=>e.length<10?c.DATABASE_URL.GET.allReviews().then(e=>e.json()).then(e=>(console.log("- Reviews data fetched !"),e.reviews||e)).then(e=>(e.forEach(e=>r.set("reviews",e)),e)).catch(e=>console.error(`Request failed. Returned status of ${e}`)):e).catch(e=>{console.error(e)})},fetchRestaurantById:e=>{return r.get("restaurants",Number(e)).then(t=>t||(console.log("- No restaurant cached"),c.DATABASE_URL.GET.restaurant(e).then(e=>e.json()).then(e=>(r.set("restaurants",e),e)).catch(e=>console.error(`Restaurant does not exist: ${e}`))))},fetchRestaurantByCuisineAndNeighborhood:(e,t)=>{return r.getAll("restaurants").then(n=>n.length<10?c.fetchRestaurants().then(n=>{const o=n;return o.forEach(e=>r.set("restaurants",e)),c.filterResults(o,e,t)}).catch(e=>console.error(e)):c.filterResults(n,e,t)).catch(e=>console.error(e))},filterResults:(e,t,n)=>("all"!==t&&(e=e.filter(e=>e.cuisine_type==t)),"all"!==n&&(e=e.filter(e=>e.neighborhood==n)),e),addNeighborhoodsOptions:e=>{const t=e.map(e=>e.neighborhood);return t.filter((e,n)=>t.indexOf(e)==n)},addCuisinesOptions:e=>{const t=e.map(e=>e.cuisine_type);return t.filter((e,n)=>t.indexOf(e)==n)},urlForRestaurant:e=>`restaurant.html?id=${e.id}`,imageUrlForRestaurant:e=>`assets/img/jpg/${e.photograph}`,imageWebpUrlForRestaurant:e=>`assets/img/webp/${e.photograph}`,postReview:async e=>{console.log("Trying to post review..."),e.preventDefault();const t=document.querySelector("#title-container form").elements,n={restaurant_id:Number(window.location.search.match(/\d+/)[0]),name:t.name.value,rating:Number(t.rating.value),comments:t.comments.value,createdAt:Date.now(),updatedAt:Date.now()};await r.set("posts",n),await r.addReview("reviews",n);const o=await navigator.serviceWorker.ready;Notification.requestPermission().then(function(e){"denied"!==e?"default"!==e?"granted"===e&&console.log("Notification allowed"):console.log("The permission request was dismissed."):console.log("Permission wasn't granted. Allow a retry.")}),o.sync.register("post-review"),location.reload(),o.sync.getTags().then(e=>console.log(e))},mapMarkerForRestaurant:(e,t)=>{return new google.maps.Marker({position:{lat:e.lat||e.latlng.lat,lng:e.lng||e.latlng.lng},title:e.name,url:c.urlForRestaurant(e),map:t,animation:google.maps.Animation.DROP,icon:"assets/img/svg/marker.svg"})}};t.exports=c},{"./indexedb":2}],2:[function(e,t,n){const r=e("../../node_modules/idb/lib/idb"),o=()=>r.open("restaurant-reviews",3,e=>{switch(e.oldVersion){case 0:e.createObjectStore("restaurants",{keyPath:"id"});case 1:e.createObjectStore("reviews",{keyPath:"id",autoIncrement:!0});case 1:e.createObjectStore("posts",{keyPath:"restaurant_id"})}}),s={get:(e,t)=>o().then(n=>{if(n)return n.transaction(e).objectStore(e).get(t)}).catch(e=>console.error(e)),set:(e,t)=>o().then(n=>{if(!n)return;return n.transaction(e,"readwrite").objectStore(e).put(t).complete}).catch(e=>console.error(e)),getAll:e=>o().then(t=>{if(t)return t.transaction(e).objectStore(e).getAll()}).catch(e=>console.error(e)),delete:(e,t)=>o().then(n=>{if(n)return n.transaction(e,"readwrite").objectStore(e).delete(t)}).catch(e=>console.error(e)),addReview:(e,t)=>o().then(n=>{if(n)return n.transaction(e,"readwrite").objectStore(e).add(t)}).catch(e=>console.error(e)),getRestaurantReviews:(e,t)=>o().then(n=>{if(n)return n.transaction(e).objectStore(e).getAll().then(e=>e.filter(e=>e.restaurant_id===t))}).catch(e=>console.error(e))};t.exports=s},{"../../node_modules/idb/lib/idb":4}],3:[function(e,t,n){(function(t){const n="object"==typeof self&&self.self===self&&self||"object"==typeof t&&t.global===t&&t||this,r=e("./js/indexedb"),o=e("./js/dbhelper"),s={CACHE_STATIC:"static-cache-6",CACHE_MAP:"map-api-6",CACHE_FONT:"google-fonts-3"},a=["index.html","manifest.webmanifest","restaurant.html","assets/css/fonts/iconicfill.woff2","assets/css/fonts/fontawesome.woff2","assets/img/svg/puff.svg","assets/img/png/launchScreen-ipad-9.7.png","assets/img/png/launchScreen-ipadpro-10.5.png","assets/img/png/launchScreen-ipadpro-12.9.png","assets/img/png/launchScreen-iphone-8.png","assets/img/png/launchScreen-iphone-8plus.png","assets/img/png/launchScreen-iphone-x.png","assets/img/png/launchScreen-iphone-se.png","assets/img/png/logo-64.png","assets/img/png/logo-128.png","assets/img/png/logo-256.png","assets/img/png/logo-512.png","assets/css/index.css","assets/css/restaurant_info.css","js/main.js","js/restaurant_info.js"];function i(e,t){return caches.open(e).then(e=>e.match(t).then(e=>e||fetch(t)).then(n=>(e.put(t,n.clone()),n),e=>console.error("Error :",e)),e=>console.error("Error: ",e))}self.addEventListener("install",e=>{console.log(`SW - Cache version : "${s.CACHE_STATIC}"`),e.waitUntil(caches.open(s.CACHE_STATIC).then(e=>e.addAll(a)).then(()=>{console.log("SW - All resources cached."),self.skipWaiting(),console.log("SW - SW version skipped.")}).catch(e=>console.error("SW - Open cache failed :",e)))}),self.addEventListener("activate",e=>{const t=Object.keys(s).map(e=>s[e]);e.waitUntil(caches.keys().then(e=>Promise.all(e.map(e=>{if(-1==t.indexOf(e))return console.log("SW - Deleting",e),caches.delete(e)}))).then(()=>console.log(`SW - "${s.CACHE_STATIC}" now ready to handle fetches!`)))}),self.addEventListener("fetch",e=>{const t=new URL(e.request.url),r=n.location;switch(t.hostname){case"maps.gstatic.com":e.respondWith(i(s.CACHE_MAP,e.request));break;case"fonts.gstatic.com":e.respondWith(i(s.CACHE_FONT,e.request));break;case r.hostname:if(t.pathname.startsWith("/restaurant.html")){const n=t.href.replace(/[?&]id=\d{1,}/,"");e.respondWith(i(s.CACHE_STATIC,n))}else t.pathname.endsWith("restaurants.json")?e.respondWith(fetch(e.request)):"POST"!==e.request.method?e.respondWith(i(s.CACHE_STATIC,e.request)):e.respondWith(fetch(e.request));break;default:e.respondWith(fetch(e.request))}});self.addEventListener("sync",function(e){"post-review"===e.tag&&e.waitUntil(async function(){const e=await r.getAll("posts").catch(e=>console.error(e));await Promise.all(e.map(e=>o.DATABASE_URL.POST.newReview(e).then(t=>(console.log("Response after post request",t,"\nStatus :",t.status),201===t.status&&self.registration.showNotification("Review synchronised to server").then(()=>r.delete("posts",e.restaurant_id)),t)).catch(e=>{self.registration.showNotification("Your review will be posted later"),self.registration.showNotification("You can quit this app if needed"),console.error("Review not posted",e)})))}()),e.lastChance&&console.log("Last time trying to sync"),"fetch-new-reviews"===e.tag&&e.waitUntil((async()=>{const e=await o.DATABASE_URL.GET.allReviews();(await e.json()).forEach(e=>r.set("reviews",e))})())})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./js/dbhelper":1,"./js/indexedb":2}],4:[function(e,t,n){"use strict";!function(){function e(e){return new Promise(function(t,n){e.onsuccess=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function n(t,n,r){var o,s=new Promise(function(s,a){e(o=t[n].apply(t,r)).then(s,a)});return s.request=o,s}function r(e,t,n){n.forEach(function(n){Object.defineProperty(e.prototype,n,{get:function(){return this[t][n]},set:function(e){this[t][n]=e}})})}function o(e,t,r,o){o.forEach(function(o){o in r.prototype&&(e.prototype[o]=function(){return n(this[t],o,arguments)})})}function s(e,t,n,r){r.forEach(function(r){r in n.prototype&&(e.prototype[r]=function(){return this[t][r].apply(this[t],arguments)})})}function a(e,t,r,o){o.forEach(function(o){o in r.prototype&&(e.prototype[o]=function(){return e=this[t],(r=n(e,o,arguments)).then(function(e){if(e)return new c(e,r.request)});var e,r})})}function i(e){this._index=e}function c(e,t){this._cursor=e,this._request=t}function l(e){this._store=e}function u(e){this._tx=e,this.complete=new Promise(function(t,n){e.oncomplete=function(){t()},e.onerror=function(){n(e.error)},e.onabort=function(){n(e.error)}})}function h(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new u(n)}function f(e){this._db=e}r(i,"_index",["name","keyPath","multiEntry","unique"]),o(i,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),a(i,"_index",IDBIndex,["openCursor","openKeyCursor"]),r(c,"_cursor",["direction","key","primaryKey","value"]),o(c,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(t){t in IDBCursor.prototype&&(c.prototype[t]=function(){var n=this,r=arguments;return Promise.resolve().then(function(){return n._cursor[t].apply(n._cursor,r),e(n._request).then(function(e){if(e)return new c(e,n._request)})})})}),l.prototype.createIndex=function(){return new i(this._store.createIndex.apply(this._store,arguments))},l.prototype.index=function(){return new i(this._store.index.apply(this._store,arguments))},r(l,"_store",["name","keyPath","indexNames","autoIncrement"]),o(l,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),a(l,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),s(l,"_store",IDBObjectStore,["deleteIndex"]),u.prototype.objectStore=function(){return new l(this._tx.objectStore.apply(this._tx,arguments))},r(u,"_tx",["objectStoreNames","mode"]),s(u,"_tx",IDBTransaction,["abort"]),h.prototype.createObjectStore=function(){return new l(this._db.createObjectStore.apply(this._db,arguments))},r(h,"_db",["name","version","objectStoreNames"]),s(h,"_db",IDBDatabase,["deleteObjectStore","close"]),f.prototype.transaction=function(){return new u(this._db.transaction.apply(this._db,arguments))},r(f,"_db",["name","version","objectStoreNames"]),s(f,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(e){[l,i].forEach(function(t){e in t.prototype&&(t.prototype[e.replace("open","iterate")]=function(){var t,n=(t=arguments,Array.prototype.slice.call(t)),r=n[n.length-1],o=this._store||this._index,s=o[e].apply(o,n.slice(0,-1));s.onsuccess=function(){r(s.result)}})})}),[i,l].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,t){var n=this,r=[];return new Promise(function(o){n.iterateCursor(e,function(e){e?(r.push(e.value),void 0===t||r.length!=t?e.continue():o(r)):o(r)})})})});var p={open:function(e,t,r){var o=n(indexedDB,"open",[e,t]),s=o.request;return s&&(s.onupgradeneeded=function(e){r&&r(new h(s.result,e.oldVersion,s.transaction))}),o.then(function(e){return new f(e)})},delete:function(e){return n(indexedDB,"deleteDatabase",[e])}};void 0!==t?(t.exports=p,t.exports.default=t.exports):self.idb=p}()},{}]},{},[3]);