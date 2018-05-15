!function(){return function e(t,n,r){function o(a,i){if(!n[a]){if(!t[a]){var c="function"==typeof require&&require;if(!i&&c)return c(a,!0);if(s)return s(a,!0);var u=new Error("Cannot find module '"+a+"'");throw u.code="MODULE_NOT_FOUND",u}var l=n[a]={exports:{}};t[a][0].call(l.exports,function(e){return o(t[a][1][e]||e)},l,l.exports,e,t,n,r)}return n[a].exports}for(var s="function"==typeof require&&require,a=0;a<r.length;a++)o(r[a]);return o}}()({1:[function(e,t,n){const r=e("./indexedb"),o={DATABASE_URL:()=>/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)?"data/restaurants.json":"http://localhost:1337/restaurants",fetchRestaurants:()=>{return r.getAll("restaurants").then(e=>e.length<10?fetch(o.DATABASE_URL()).then(e=>e.json()).then(e=>(console.log("- Restaurants data fetched !"),e.restaurants||e)).then(e=>(e.forEach(e=>r.set("restaurants",e)),e)).catch(e=>console.error(`Request failed. Returned status of ${e}`)):e).catch(e=>{console.error(e)})},fetchRestaurantById:e=>{return r.get("restaurants",Number(e)).then(t=>t||(console.log("- No cache found"),fetch(o.DATABASE_URL()).then(e=>e.json()).then(t=>{const n=t[e-1];return r.set("restaurants",n),n}).catch(e=>console.error(`Restaurant does not exist: ${e}`))))},fetchRestaurantByCuisine:e=>o.fetchRestaurants().then(t=>t.restaurants.filter(t=>t.cuisine_type==e)).catch(e=>console.error(e)),fetchRestaurantByNeighborhood:e=>o.fetchRestaurants().then(t=>t.restaurants.filter(t=>t.neighborhood==e)).catch(e=>console.error(e)),fetchRestaurantByCuisineAndNeighborhood:(e,t)=>{return r.getAll("restaurants").then(n=>n.length<10?o.fetchRestaurants().then(n=>{const s=n;return s.forEach(e=>r.set("restaurants",e)),o.filterResults(s,e,t)}).catch(e=>console.error(e)):o.filterResults(n,e,t)).catch(e=>console.error(e))},filterResults:(e,t,n)=>("all"!==t&&(e=e.filter(e=>e.cuisine_type==t)),"all"!==n&&(e=e.filter(e=>e.neighborhood==n)),e),fetchNeighborhoods:()=>o.fetchRestaurants().then(e=>{const t=e.map(e=>e.neighborhood);return t.filter((e,n)=>t.indexOf(e)==n)}).catch(e=>console.error(e)),fetchCuisines:()=>o.fetchRestaurants().then(e=>{const t=e.map(e=>e.cuisine_type);return t.filter((e,n)=>t.indexOf(e)==n)}).catch(e=>console.error(e)),urlForRestaurant:e=>`restaurant.html?id=${e.id}`,imageUrlForRestaurant:e=>`assets/img/jpg/${e.photograph}`,imageWebpUrlForRestaurant:e=>`assets/img/webp/${e.photograph}`,mapMarkerForRestaurant:(e,t)=>{return new google.maps.Marker({position:e.latlng,title:e.name,url:o.urlForRestaurant(e),map:t,animation:google.maps.Animation.DROP})}};t.exports=o},{"./indexedb":3}],2:[function(e,t,n){const r={lazyLoading:()=>{var e=[].slice.call(document.querySelectorAll(".lazy"));if("IntersectionObserver"in window){let t=new IntersectionObserver(function(e,n){e.forEach(function(e){if(e.isIntersecting){let n=e.target;"source"===n.localName?n.srcset=n.dataset.srcset:n.src=n.dataset.src,n.classList.remove("lazy"),t.unobserve(n)}})},{root:null,threshold:[0],rootMargin:"200px"});e.forEach(function(e){t.observe(e)})}else{let e=[].slice.call(document.querySelectorAll(".lazy")),t=!1;const n=function(){!1===t&&(t=!0,setTimeout(function(){e.forEach(function(t){t.getBoundingClientRect().top<=window.innerHeight+200&&t.getBoundingClientRect().bottom>=0&&"none"!==getComputedStyle(t).display&&(t.src=t.dataset.src,t.srcset=t.dataset.srcset,t.classList.remove("lazy"),0===(e=e.filter(function(e){return e!==t})).length&&(document.removeEventListener("scroll",n),window.removeEventListener("resize",n),window.removeEventListener("orientationchange",n)))}),t=!1},200))};document.addEventListener("scroll",n),window.addEventListener("resize",n),window.addEventListener("orientationchange",n),"complete"==document.readyState&&(console.log("document ready for lazy load"),n()),document.onreadystatechange=function(){"complete"==document.readyState&&(console.log("document ready for lazy load"),n())}}},sortByNote:(e,t)=>{const n=r.getAverageNote(e.reviews),o=r.getAverageNote(t.reviews);return o>n?1:o<n?-1:0},sortByName:(e,t)=>e.name>t.name,sortByNameInverted:(e,t)=>e.name<t.name,getAverageNote:e=>{let t=0;return e.forEach(e=>{t+=Number(e.rating)}),t/=e.length,Math.round(10*t)/10}};t.exports=r},{}],3:[function(e,t,n){const r=e("../node_modules/idb/lib/idb"),o=()=>{if(navigator.serviceWorker)return r.open("restaurant-reviews",1,e=>{switch(e.oldVersion){case 0:e.createObjectStore("restaurants",{keyPath:"id"})}})},s={get:(e,t)=>o().then(n=>{if(n)return n.transaction(e).objectStore(e).get(t)}).catch(e=>console.error(e)),set:(e,t)=>o().then(n=>{if(!n)return;return n.transaction(e,"readwrite").objectStore(e).put(t).complete}).catch(e=>console.error(e)),getAll:e=>o().then(t=>{if(t)return t.transaction(e).objectStore(e).getAll()}).catch(e=>console.error(e))};t.exports=s},{"../node_modules/idb/lib/idb":5}],4:[function(e,t,n){const r=e("./dbhelper"),o=e("./helpers");let s,a,i,c=[];const u=document.querySelector("main"),l=document.querySelector("footer"),d=document.querySelector(".filter-options"),p=document.querySelector(".filter-options h3"),m=document.querySelector("#menuFilter"),h=document.querySelector("#restaurants-list"),f=(document.getElementById("#map-container"),document.querySelector("#neighborhoods-select")),g=document.querySelector("#cuisines-select"),y=document.querySelector("#sort-select"),b=(document.querySelector("#map"),document.querySelector("#map-loader"));function v(){d.classList.remove("optionsOpen"),d.classList.add("optionsClose"),d.setAttribute("aria-hidden","true"),m.classList.remove("pressed"),u.classList.remove("moveDown"),u.classList.add("moveUp"),l.classList.remove("moveDown"),l.classList.add("moveUp"),p.removeAttribute("tabindex")}document.addEventListener("DOMContentLoaded",()=>{window.navigator.standalone||-1!==window.navigator.userAgent.indexOf("Android")||-1!==window.navigator.userAgent.indexOf("Linux")||I(),g.addEventListener("change",_),f.addEventListener("change",_),y.addEventListener("change",_),x().then(E).then(_).then(R).catch(e=>console.error(e))}),m.addEventListener("click",()=>{d.classList.contains("optionsClose")?(d.classList.remove("optionsClose"),u.classList.remove("moveUp"),l.classList.remove("moveUp"),d.classList.add("optionsOpen"),d.setAttribute("aria-hidden","false"),u.classList.add("moveDown"),l.classList.add("moveDown"),m.classList.add("pressed"),m.blur(),p.setAttribute("tabindex","-1"),p.focus()):v()}),"serviceWorker"in navigator&&window.addEventListener("load",()=>{const e="hallya.github.io"===window.location.hostname?"/mws-restaurant-stage-1/sw.js":"../sw.js";navigator.serviceWorker.register(e).then(e=>console.log("registration to serviceWorker complete with scope :",e.scope))}),document.onkeypress=function(e){13===e.charCode&&d.classList.contains("optionsOpen")&&(v(),h.setAttribute("tabindex","-1"),h.focus(),document.getElementById("skip").click())};const x=()=>r.fetchNeighborhoods().then(e=>{self.neighborhoods=e,w()}).catch(e=>console.error(e)),w=(e=self.neighborhoods)=>{const t=f;e.forEach(n=>{const r=document.createElement("option");r.innerHTML=n,r.value=n,r.setAttribute("role","option"),r.setAttribute("aria-setsize","4"),r.setAttribute("aria-posinset",e.indexOf(n)+2),t.append(r)})},E=()=>{r.fetchCuisines().then(e=>{self.cuisines=e,A()}).catch(e=>console.error(e))},A=(e=self.cuisines)=>{const t=g;e.forEach(n=>{const r=document.createElement("option");r.innerHTML=n,r.value=n,r.setAttribute("role","option"),r.setAttribute("aria-setsize","4"),r.setAttribute("aria-posinset",e.indexOf(n)+2),t.append(r)})};window.initMap=(()=>{const e=document.createElement("div");e.setAttribute("tabindex","-1"),e.setAttribute("aria-hidden","true"),e.id="map";self.map=new google.maps.Map(e,{zoom:12,center:{lat:40.722216,lng:-73.987501},scrollwheel:!1}),document.getElementById("map-container").appendChild(e),self.map.addListener("tilesloaded",function(){b.remove(),_().then(j)})});const _=()=>{const e=g,t=f,n=y,c=e.selectedIndex,u=t.selectedIndex,l=n.selectedIndex;return s===e[c].value&&a===t[u].value&&i===n[l].value?(console.log("- Restaurants list already update"),Promise.resolve()):(s=e[c].value,a=t[u].value,i=n[l].value,r.fetchRestaurantByCuisineAndNeighborhood(s,a).then(L).then(N).then(B).then(o.lazyLoading).then(()=>console.log("- Restaurants list updated !")).catch(e=>console.error(e)))},L=e=>{return self.restaurants=[],document.getElementById("restaurants-list").innerHTML="",c.length>0&&self.markers.forEach(e=>e.setMap(null)),self.markers=[],self.restaurants=e,e},R=()=>{sortOptions=["Note","A-Z","Z-A"],sortOptions.forEach(e=>{const t=document.createElement("option");t.innerHTML=e,t.value=e,t.setAttribute("role","option"),t.setAttribute("aria-setsize","4"),t.setAttribute("aria-posinset",sortOptions.indexOf(e)+2),y.append(t)})},N=(e=self.restaurants)=>{const t=y.selectedIndex;switch(y[t].value){case"Relevant":return e;case"Note":return e.sort(o.sortByNote);case"A-Z":return e.sort(o.sortByName);case"Z-A":return e.sort(o.sortByNameInverted)}},B=(e=self.restaurants)=>{const t=document.getElementById("restaurants-list");e.forEach(e=>{t.append(S(e))})},S=e=>{const t=document.createElement("li"),n=document.createElement("figure"),s=document.createElement("figcaption"),a=document.createElement("picture"),i=document.createElement("source"),c=document.createElement("source"),u=document.createElement("source"),l=document.createElement("source"),d=document.createElement("source"),p=document.createElement("source"),m=document.createElement("img"),h=document.createElement("aside"),f=document.createElement("p");l.dataset.srcset=`${r.imageWebpUrlForRestaurant(e)}-large_x1.webp 1x, ${r.imageWebpUrlForRestaurant(e)}-large_x2.webp 2x`,l.srcset="assets/img/svg/puff.svg",l.media="(min-width: 1000px)",l.className="lazy",l.type="image/webp",i.dataset.srcset=`${r.imageUrlForRestaurant(e)}-large_x1.jpg 1x, ${r.imageUrlForRestaurant(e)}-large_x2.jpg 2x`,i.srcset="assets/img/svg/puff.svg",i.media="(min-width: 1000px)",i.className="lazy",i.type="image/jpeg",d.dataset.srcset=`${r.imageWebpUrlForRestaurant(e)}-medium_x1.webp 1x, ${r.imageWebpUrlForRestaurant(e)}-medium_x2.webp 2x`,d.srcset="assets/img/svg/puff.svg",d.media="(min-width: 420px)",d.className="lazy",d.type="image/webp",c.dataset.srcset=`${r.imageUrlForRestaurant(e)}-medium_x1.jpg 1x, ${r.imageUrlForRestaurant(e)}-medium_x2.jpg 2x`,c.srcset="assets/img/svg/puff.svg",c.media="(min-width: 420px)",c.className="lazy",c.type="image/jpeg",p.dataset.srcset=`${r.imageWebpUrlForRestaurant(e)}-small_x2.webp 2x, ${r.imageWebpUrlForRestaurant(e)}-small_x1.webp 1x`,p.srcset="assets/img/svg/puff.svg",p.media="(min-width: 320px)",p.className="lazy",p.type="image/webp",u.dataset.srcset=`${r.imageUrlForRestaurant(e)}-small_x2.jpg 2x, ${r.imageUrlForRestaurant(e)}-small_x1.jpg 1x`,u.srcset="assets/img/svg/puff.svg",u.media="(min-width: 320px)",u.className="lazy",u.type="image/jpeg",m.dataset.src=`${r.imageUrlForRestaurant(e)}-small_x1.jpg`,m.src="assets/img/svg/puff.svg",m.className="restaurant-img lazy",m.setAttribute("sizes","(max-width: 1100px) 85vw, (min-width: 1101px) 990px"),m.alt=`${e.name}'s restaurant`,m.type="image/jpeg",f.innerHTML=`${o.getAverageNote(e.reviews)}/5`,h.append(f),a.append(l),a.append(i),a.append(d),a.append(c),a.append(p),a.append(u),a.append(m),n.append(a),n.append(s),t.append(h),t.append(n);const g=document.createElement("h2");g.innerHTML=e.name,s.append(g);const y=document.createElement("p");y.innerHTML=e.neighborhood,t.append(y);const b=document.createElement("p");b.innerHTML=e.address,t.append(b);const v=document.createElement("a");return v.innerHTML="View Details",v.href=r.urlForRestaurant(e),v.setAttribute("aria-label",`View details of ${e.name}`),v.setAttribute("rel","noopener"),t.append(v),t.setAttribute("role","listitem"),t.setAttribute("aria-setsize","10"),t.setAttribute("aria-posinset",e.id),t},j=(e=self.restaurants)=>{e.forEach(e=>{const t=r.mapMarkerForRestaurant(e,self.map);google.maps.event.addListener(t,"click",()=>{window.location.href=t.url}),self.markers.push(t)})},I=()=>{const e=document.createElement("aside"),t=document.createElement("p"),n=document.createElement("p"),r=document.createElement("span");e.id="pop",e.className="popup",n.className="popup msg",n.setAttribute("tabindex","2"),t.className="popup note",t.setAttribute("tabindex","1"),r.className="iconicfill-arrow-down",t.innerHTML="(Tap to close)",n.innerHTML='Add <img src="assets/img/svg/share-apple.svg" alt=""> this app to your home screen and enjoy it as a real application !',e.setAttribute("tabindex","-1"),e.addEventListener("click",()=>{e.classList.add("hide"),setTimeout(()=>{e.style="display: none;"},1e3)}),e.append(t),e.append(n),e.append(r),document.getElementById("maincontent").appendChild(e),e.focus(),setTimeout(()=>{e.classList.add("hide")},7e3)}},{"./dbhelper":1,"./helpers":2}],5:[function(e,t,n){"use strict";!function(){function e(e){return new Promise(function(t,n){e.onsuccess=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function n(t,n,r){var o,s=new Promise(function(s,a){e(o=t[n].apply(t,r)).then(s,a)});return s.request=o,s}function r(e,t,n){n.forEach(function(n){Object.defineProperty(e.prototype,n,{get:function(){return this[t][n]},set:function(e){this[t][n]=e}})})}function o(e,t,r,o){o.forEach(function(o){o in r.prototype&&(e.prototype[o]=function(){return n(this[t],o,arguments)})})}function s(e,t,n,r){r.forEach(function(r){r in n.prototype&&(e.prototype[r]=function(){return this[t][r].apply(this[t],arguments)})})}function a(e,t,r,o){o.forEach(function(o){o in r.prototype&&(e.prototype[o]=function(){return e=this[t],(r=n(e,o,arguments)).then(function(e){if(e)return new c(e,r.request)});var e,r})})}function i(e){this._index=e}function c(e,t){this._cursor=e,this._request=t}function u(e){this._store=e}function l(e){this._tx=e,this.complete=new Promise(function(t,n){e.oncomplete=function(){t()},e.onerror=function(){n(e.error)},e.onabort=function(){n(e.error)}})}function d(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new l(n)}function p(e){this._db=e}r(i,"_index",["name","keyPath","multiEntry","unique"]),o(i,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),a(i,"_index",IDBIndex,["openCursor","openKeyCursor"]),r(c,"_cursor",["direction","key","primaryKey","value"]),o(c,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(t){t in IDBCursor.prototype&&(c.prototype[t]=function(){var n=this,r=arguments;return Promise.resolve().then(function(){return n._cursor[t].apply(n._cursor,r),e(n._request).then(function(e){if(e)return new c(e,n._request)})})})}),u.prototype.createIndex=function(){return new i(this._store.createIndex.apply(this._store,arguments))},u.prototype.index=function(){return new i(this._store.index.apply(this._store,arguments))},r(u,"_store",["name","keyPath","indexNames","autoIncrement"]),o(u,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),a(u,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),s(u,"_store",IDBObjectStore,["deleteIndex"]),l.prototype.objectStore=function(){return new u(this._tx.objectStore.apply(this._tx,arguments))},r(l,"_tx",["objectStoreNames","mode"]),s(l,"_tx",IDBTransaction,["abort"]),d.prototype.createObjectStore=function(){return new u(this._db.createObjectStore.apply(this._db,arguments))},r(d,"_db",["name","version","objectStoreNames"]),s(d,"_db",IDBDatabase,["deleteObjectStore","close"]),p.prototype.transaction=function(){return new l(this._db.transaction.apply(this._db,arguments))},r(p,"_db",["name","version","objectStoreNames"]),s(p,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(e){[u,i].forEach(function(t){t.prototype[e.replace("open","iterate")]=function(){var t,n=(t=arguments,Array.prototype.slice.call(t)),r=n[n.length-1],o=this._store||this._index,s=o[e].apply(o,n.slice(0,-1));s.onsuccess=function(){r(s.result)}}})}),[i,u].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,t){var n=this,r=[];return new Promise(function(o){n.iterateCursor(e,function(e){e?(r.push(e.value),void 0===t||r.length!=t?e.continue():o(r)):o(r)})})})});var m={open:function(e,t,r){var o=n(indexedDB,"open",[e,t]),s=o.request;return s.onupgradeneeded=function(e){r&&r(new d(s.result,e.oldVersion,s.transaction))},o.then(function(e){return new p(e)})},delete:function(e){return n(indexedDB,"deleteDatabase",[e])}};void 0!==t?(t.exports=m,t.exports.default=t.exports):self.idb=m}()},{}]},{},[4]);