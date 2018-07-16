!function(){return function e(t,n,r){function o(a,i){if(!n[a]){if(!t[a]){var c="function"==typeof require&&require;if(!i&&c)return c(a,!0);if(s)return s(a,!0);var l=new Error("Cannot find module '"+a+"'");throw l.code="MODULE_NOT_FOUND",l}var u=n[a]={exports:{}};t[a][0].call(u.exports,function(e){return o(t[a][1][e]||e)},u,u.exports,e,t,n,r)}return n[a].exports}for(var s="function"==typeof require&&require,a=0;a<r.length;a++)o(r[a]);return o}}()({1:[function(e,t,n){const r=e("./indexedb"),o="/restaurants/",s="/reviews/",a="?is_favorite=",i="?restaurant_id=",c="http://localhost:1337";console.log(c+s+i+2);const l={DATABASE_URL:{GET:{allRestaurants:()=>fetch(c+o),allReviews:()=>fetch(c+s),restaurant:e=>fetch(c+o+e),restaurantReviews:e=>fetch(c+s+i+e),setFavoriteRestaurants:e=>fetch(c+o+a+e)},POST:{newReview:e=>fetch(c+s,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})},PUT:{favoriteRestaurant:(e,t)=>fetch(c+o+e+a+t,{method:"PUT"}),updateReview:e=>fetch(c+s+e,{method:"PUT"})},DELETE:{review:e=>fetch(c+s+e,{method:"DELETE"})}},fetchRestaurants:()=>{return r.getAll("restaurants").then(e=>e.length<10?l.DATABASE_URL.GET.allRestaurants().then(e=>e.json()).then(e=>(console.log("- Restaurants data fetched !"),e.restaurants||e)).then(e=>(e.forEach(e=>r.set("restaurants",e)),e)).catch(e=>console.error(`Request failed. Returned status of ${e}`)):e).catch(e=>{console.error(e)})},fetchReviews:()=>{return r.getAll("reviews").then(e=>e.reverse()).then(e=>e.length<10?l.DATABASE_URL.GET.allReviews().then(e=>e.json()).then(e=>(console.log("- Reviews data fetched !"),e.reviews||e)).catch(e=>console.error(`Request failed. Returned status of ${e}`)):e).catch(e=>{console.error(e)})},fetchRestaurantReviews:e=>{return r.getAll("reviews").then(e=>e.reverse()).then(t=>t.filter(t=>t.restaurant_id===e).length<10?l.DATABASE_URL.GET.restaurantReviews(e).then(e=>e.json()).then(e=>(console.log("- Restaurant reviews fetched !"),e.reviews||e)).then(e=>(e.forEach(e=>r.set("reviews",e)),e)).catch(e=>console.error(`Request failed. Returned status of ${e}`)):t).catch(e=>{console.error(e)})},fetchRestaurantById:e=>{return r.get("restaurants",Number(e)).then(t=>t||(console.log("- No restaurant cached"),l.DATABASE_URL.GET.restaurant(e).then(e=>e.json()).then(e=>(r.set("restaurants",e),e)).catch(e=>console.error(`Restaurant does not exist: ${e}`))))},fetchRestaurantByCuisineAndNeighborhood:(e,t)=>{return r.getAll("restaurants").then(n=>n.length<10?l.fetchRestaurants().then(n=>{const o=n;return o.forEach(e=>r.set("restaurants",e)),l.filterResults(o,e,t)}).catch(e=>console.error(e)):l.filterResults(n,e,t)).catch(e=>console.error(e))},filterResults:(e,t,n)=>("all"!==t&&(e=e.filter(e=>e.cuisine_type==t)),"all"!==n&&(e=e.filter(e=>e.neighborhood==n)),e),addNeighborhoodsOptions:e=>{const t=e.map(e=>e.neighborhood);return t.filter((e,n)=>t.indexOf(e)==n)},addCuisinesOptions:e=>{const t=e.map(e=>e.cuisine_type);return t.filter((e,n)=>t.indexOf(e)==n)},urlForRestaurant:e=>`restaurant.html?id=${e.id}`,imageUrlForRestaurant:e=>`assets/img/jpg/${e.photograph}`,imageWebpUrlForRestaurant:e=>`assets/img/webp/${e.photograph}`,postReview:async e=>{console.log("Trying to post review..."),e.preventDefault();const t=document.querySelector("#title-container form").elements,n={restaurant_id:Number(window.location.search.match(/\d+/)[0]),name:t.name.value,rating:Number(t.rating.value),comments:t.comments.value};await r.set("posts",n),await r.addReview("reviews",n);const o=await navigator.serviceWorker.ready;Notification.requestPermission().then(function(e){"denied"!==e?"default"!==e?"granted"===e&&console.log("Notification allowed"):console.log("The permission request was dismissed."):console.log("Permission wasn't granted. Allow a retry.")}),o.sync.register("post-review"),location.reload(),o.sync.getTags().then(e=>console.log(e))},mapMarkerForRestaurant:(e,t)=>{return new google.maps.Marker({position:{lat:e.lat||e.latlng.lat,lng:e.lng||e.latlng.lng},title:e.name,url:l.urlForRestaurant(e),map:t,animation:google.maps.Animation.DROP,icon:"assets/img/svg/marker.svg"})}};t.exports=l},{"./indexedb":3}],2:[function(e,t,n){const r=document.querySelector(".filter-options"),o=document.getElementById("menuFilter");filterResultHeading=document.querySelector(".filter-options h3");const s={goToRestaurantPage:e=>{e.target.classList.toggle("move-left"),window.location.assign(e.target.dataset.url)},fixedOnViewport:(e,t)=>{const n=t.cloneNode(!0);if(n.className="fixed exclude",t.appendChild(n),"IntersectionObserver"in window){new IntersectionObserver(function(e,r){e.forEach(function(e){e.intersectionRatio<=.01?(n.classList.remove("exclude"),n.classList.add("shadow"),t.classList.add("shadow")):(t.classList.contains("shadow")&&t.classList.remove("shadow"),n.classList.remove("shadow"),n.classList.add("exclude"))})},{root:null,threshold:[.01],rootMargin:"0px"}).observe(e)}},toggleMenu:()=>{r.classList.toggle("optionsOpen"),r.setAttribute("aria-hidden","false"),o.classList.toggle("pressed"),o.blur(),filterResultHeading.setAttribute("tabindex","-1"),filterResultHeading.focus()},isFormValid:()=>{document.querySelector("form").checkValidity()?document.querySelector('form input[type="submit"]').style.color="green":document.querySelector('form input[type="submit"]').style.color="#ca0000"},toggleForm:()=>{document.getElementById("title-container").classList.toggle("reviews-toggled"),document.getElementById("reviews-list").classList.toggle("reviews-toggled"),document.querySelector("section form").classList.toggle("toggled-display"),setTimeout(()=>{document.querySelector("section form").classList.toggle("toggled-translate")},800)},lazyLoading:()=>{const e=[].slice.call(document.querySelectorAll(".lazy"));if("IntersectionObserver"in window){const t={root:null,threshold:[],rootMargin:"200px"};for(let e=0;e<=1;e+=.01)t.threshold.push(Math.round(100*e)/100);let n=new IntersectionObserver(function(e,t){e.forEach(function(e){if(e.isIntersecting||e.intersectionRatio>=.01){let t=e.target;"source"===t.localName?t.srcset=t.dataset.srcset:t.src=t.dataset.src,t.classList.remove("lazy"),n.unobserve(t)}})},t);e.forEach(function(e){n.observe(e)}),document.onreadystatechange=(()=>{"complete"==document.readyState&&s.lazyLoading()})}else{let e=[].slice.call(document.querySelectorAll(".lazy")),t=!1;const n=function(){if(!1===t){t=!0;const r=window.innerHeight+200;e.forEach(function(t){t.getBoundingClientRect().top<=r&&t.getBoundingClientRect().bottom>=0&&"none"!==getComputedStyle(t).display&&(t.src=t.dataset.src,t.srcset=t.dataset.srcset,t.classList.remove("lazy"),0===(e=e.filter(function(e){return e!==t})).length&&(document.removeEventListener("scroll",n),window.removeEventListener("resize",n),window.removeEventListener("orientationchange",n)))}),t=!1}};document.addEventListener("scroll",n),window.addEventListener("resize",n),window.addEventListener("orientationchange",n),"complete"==document.readyState&&(console.log("document ready for lazy load"),n()),document.onreadystatechange=function(){"complete"==document.readyState&&(console.log("document ready for lazy load"),n())}}},sortByNote:(e,t)=>{const n=s.getAverageNote(e.reviews),r=s.getAverageNote(t.reviews);return r>n?1:r<n?-1:0},sortByName:(e,t)=>e.name>t.name,sortByNameInverted:(e,t)=>e.name<t.name,getAverageNote:(e,t=self.reviews)=>{let n=0,r=0;return t.forEach(t=>{t.restaurant_id===e&&(n+=Number(t.rating),r++)}),n/=r,Math.round(10*n)/10}};t.exports=s},{}],3:[function(e,t,n){const r=e("../../node_modules/idb/lib/idb"),o=()=>r.open("restaurant-reviews",3,e=>{switch(e.oldVersion){case 0:e.createObjectStore("restaurants",{keyPath:"id"});case 1:e.createObjectStore("reviews",{keyPath:"id",autoIncrement:!0});case 1:e.createObjectStore("posts",{keyPath:"restaurant_id"})}}),s={get:(e,t)=>o().then(n=>{if(n)return n.transaction(e).objectStore(e).get(t)}).catch(e=>console.error(e)),set:(e,t)=>o().then(n=>{if(!n)return;return n.transaction(e,"readwrite").objectStore(e).put(t).complete}).catch(e=>console.error(e)),getAll:e=>o().then(t=>{if(t)return t.transaction(e).objectStore(e).getAll()}).catch(e=>console.error(e)),delete:(e,t)=>o().then(n=>{if(n)return n.transaction(e,"readwrite").objectStore(e).delete(t)}).catch(e=>console.error(e)),addReview:(e,t)=>o().then(n=>{if(n)return n.transaction(e,"readwrite").objectStore(e).add(t)}).catch(e=>console.error(e)),getRestaurantReviews:(e,t)=>o().then(n=>{if(n)return n.transaction(e).objectStore(e).getAll().then(e=>e.filter(e=>e.restaurant_id===t))}).catch(e=>console.error(e))};t.exports=s},{"../../node_modules/idb/lib/idb":5}],4:[function(e,t,n){const r=e("./dbhelper"),o=e("./helpers");let s,a,i,c=[];const l=document.querySelector(".filter-options"),u=document.getElementById("menuFilter"),d=document.querySelector("#restaurants-list"),p=document.querySelector("#neighborhoods-select"),m=document.querySelector("#cuisines-select"),g=document.querySelector("#sort-select"),h=document.querySelector("#map-loader");document.addEventListener("DOMContentLoaded",()=>{b().then(E).then(v).then(f).catch(e=>console.error(e))}),window.addEventListener("load",()=>{if("serviceWorker"in navigator){console.log("Service worker available !");const e="hallya.github.io"===window.location.hostname?"/mws-restaurant-stage-1/sw.js":"../sw.js";navigator.serviceWorker.register(e).then(e=>console.log("Registration to serviceWorker complete with scope :",e.scope))}!window.navigator.standalone&&-1===window.navigator.userAgent.indexOf("Android")&&-1===window.navigator.userAgent.indexOf("Linux")&&window.innerWidth<550&&S(),m.addEventListener("change",b),p.addEventListener("change",b),g.addEventListener("change",b)}),u.addEventListener("click",o.toggleMenu),document.onkeypress=function(e){13===e.charCode&&l.classList.contains("optionsOpen")&&(closeMenu(),d.setAttribute("tabindex","-1"),d.focus(),document.getElementById("skip").click())};const f=(e=self.restaurants)=>{self.neighborhoods=r.addNeighborhoodsOptions(e),y()},v=(e=self.restaurants)=>{self.cuisines=r.addCuisinesOptions(e),w()},y=(e=self.neighborhoods)=>{const t=p;e.forEach(n=>{const r=document.createElement("option");r.innerHTML=n,r.value=n,r.setAttribute("role","option"),r.setAttribute("aria-setsize","4"),r.setAttribute("aria-posinset",e.indexOf(n)+2),t.append(r)})},w=(e=self.cuisines)=>{const t=m;e.forEach(n=>{const r=document.createElement("option");r.innerHTML=n,r.value=n,r.setAttribute("role","option"),r.setAttribute("aria-setsize","4"),r.setAttribute("aria-posinset",e.indexOf(n)+2),t.append(r)})};window.initMap=(()=>{const e=document.createElement("div");e.setAttribute("tabindex","-1"),e.setAttribute("aria-hidden","true"),e.id="map";self.map=new google.maps.Map(e,{center:{lat:40.722216,lng:-73.987501},zoom:12,streetViewControl:!1,mapTypeId:"roadmap",mapTypeControl:!1}),document.getElementById("map-container").appendChild(e),self.map.addListener("tilesloaded",function(){h.remove(),L()})});const b=async()=>{const e=m,t=p,n=g,o=e.selectedIndex,c=t.selectedIndex,l=n.selectedIndex;return s===e[o].value&&a===t[c].value&&i===n[l].value?(console.log("- Restaurants list already update"),Promise.resolve()):(s=e[o].value,a=t[c].value,i=n[l].value,Promise.all([r.fetchReviews(),r.fetchRestaurantByCuisineAndNeighborhood(s,a)]).then(e=>(self.reviews=e[0],self.restaurants=e[1],e[1])).then(x).then(R).then(A).then(()=>console.log("- Restaurants list updated !")).catch(e=>console.error(e)))},x=e=>{return self.restaurants=[],document.getElementById("restaurants-list").innerHTML="",c.length>0&&self.markers.forEach(e=>e.setMap(null)),self.markers=[],self.restaurants=e,e},E=()=>{sortOptions=["Note","A-Z","Z-A"],sortOptions.forEach(e=>{const t=document.createElement("option");t.innerHTML=e,t.value=e,t.setAttribute("role","option"),t.setAttribute("aria-setsize","4"),t.setAttribute("aria-posinset",sortOptions.indexOf(e)+2),g.append(t)})},R=(e=self.restaurants)=>{const t=g.selectedIndex;switch(g[t].value){case"Relevant":return e;case"Note":return e.sort(o.sortByNote);case"A-Z":return e.sort(o.sortByName);case"Z-A":return e.sort(o.sortByNameInverted)}};const A=(e=self.restaurants)=>{const t=document.getElementById("restaurants-list");return e.forEach(e=>t.append(_(e))),o.lazyLoading()},_=e=>{const t=document.createElement("li"),n=document.createElement("figure"),s=document.createElement("figcaption"),a=document.createElement("picture"),i=document.createElement("source"),c=document.createElement("source"),l=document.createElement("source"),u=document.createElement("source"),d=document.createElement("source"),p=document.createElement("source"),m=document.createElement("img"),g=document.createElement("aside"),h=document.createElement("p");u.dataset.srcset=`${r.imageWebpUrlForRestaurant(e)}-large_x1.webp 1x, ${r.imageWebpUrlForRestaurant(e)}-large_x2.webp 2x`,u.srcset="assets/img/svg/puff.svg",u.media="(min-width: 1000px)",u.className="lazy",u.type="image/webp",i.dataset.srcset=`${r.imageUrlForRestaurant(e)}-large_x1.jpg 1x, ${r.imageUrlForRestaurant(e)}-large_x2.jpg 2x`,i.srcset="assets/img/svg/puff.svg",i.media="(min-width: 1000px)",i.className="lazy",i.type="image/jpeg",d.dataset.srcset=`${r.imageWebpUrlForRestaurant(e)}-medium_x1.webp 1x, ${r.imageWebpUrlForRestaurant(e)}-medium_x2.webp 2x`,d.srcset="assets/img/svg/puff.svg",d.media="(min-width: 420px)",d.className="lazy",d.type="image/webp",c.dataset.srcset=`${r.imageUrlForRestaurant(e)}-medium_x1.jpg 1x, ${r.imageUrlForRestaurant(e)}-medium_x2.jpg 2x`,c.srcset="assets/img/svg/puff.svg",c.media="(min-width: 420px)",c.className="lazy",c.type="image/jpeg",p.dataset.srcset=`${r.imageWebpUrlForRestaurant(e)}-small_x2.webp 2x, ${r.imageWebpUrlForRestaurant(e)}-small_x1.webp 1x`,p.srcset="assets/img/svg/puff.svg",p.media="(min-width: 320px)",p.className="lazy",p.type="image/webp",l.dataset.srcset=`${r.imageUrlForRestaurant(e)}-small_x2.jpg 2x, ${r.imageUrlForRestaurant(e)}-small_x1.jpg 1x`,l.srcset="assets/img/svg/puff.svg",l.media="(min-width: 320px)",l.className="lazy",l.type="image/jpeg",m.dataset.src=`${r.imageUrlForRestaurant(e)}-small_x1.jpg`,m.src="assets/img/svg/puff.svg",m.className="restaurant-img lazy",m.setAttribute("sizes","(max-width: 1100px) 85vw, (min-width: 1101px) 990px"),m.alt=`${e.name}'s restaurant`,m.type="image/jpeg",h.innerHTML=`${e.average_rating||o.getAverageNote(e.id)}/5`,g.append(h),g.id="container-note",a.append(u),a.append(i),a.append(d),a.append(c),a.append(p),a.append(l),a.append(m);const f=document.createElement("a");f.innerHTML="",f.className="fontawesome-arrow-right",f.dataset.url=r.urlForRestaurant(e),f.addEventListener("click",o.goToRestaurantPage),f.setAttribute("aria-label",`View details of ${e.name}`),f.setAttribute("rel","noopener"),n.append(a),s.append(f),n.append(s),t.append(g),t.append(n);const v=document.createElement("h2");v.innerHTML=e.name,s.append(v);const y=document.createElement("p");y.innerHTML=e.neighborhood,t.append(y);const w=document.createElement("p");return w.innerHTML=e.address,t.append(w),t.setAttribute("role","listitem"),t.setAttribute("aria-setsize","10"),t.setAttribute("aria-posinset",e.id),t},L=(e=self.restaurants)=>{e.forEach(e=>{const t=r.mapMarkerForRestaurant(e,self.map);google.maps.event.addListener(t,"click",()=>{window.location.href=t.url}),self.markers.push(t)})},S=()=>{const e=document.createElement("aside"),t=document.createElement("p"),n=document.createElement("p"),r=document.createElement("span");e.id="pop",e.className="popup",n.className="popup msg",n.setAttribute("tabindex","2"),t.className="popup note",t.setAttribute("tabindex","1"),r.className="iconicfill-arrow-down",t.innerHTML="(Tap to close)",n.innerHTML='Add <img src="assets/img/svg/share-apple.svg" alt=""> this app to your home screen and enjoy it as a real application !',e.setAttribute("tabindex","-1"),e.addEventListener("click",()=>{e.classList.add("hide"),setTimeout(()=>{e.style="display: none;"},1e3)}),e.append(t),e.append(n),e.append(r),document.getElementById("maincontent").appendChild(e),e.focus(),setTimeout(()=>{e.classList.add("hide")},7e3)}},{"./dbhelper":1,"./helpers":2}],5:[function(e,t,n){"use strict";!function(){function e(e){return new Promise(function(t,n){e.onsuccess=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function n(t,n,r){var o,s=new Promise(function(s,a){e(o=t[n].apply(t,r)).then(s,a)});return s.request=o,s}function r(e,t,n){n.forEach(function(n){Object.defineProperty(e.prototype,n,{get:function(){return this[t][n]},set:function(e){this[t][n]=e}})})}function o(e,t,r,o){o.forEach(function(o){o in r.prototype&&(e.prototype[o]=function(){return n(this[t],o,arguments)})})}function s(e,t,n,r){r.forEach(function(r){r in n.prototype&&(e.prototype[r]=function(){return this[t][r].apply(this[t],arguments)})})}function a(e,t,r,o){o.forEach(function(o){o in r.prototype&&(e.prototype[o]=function(){return e=this[t],(r=n(e,o,arguments)).then(function(e){if(e)return new c(e,r.request)});var e,r})})}function i(e){this._index=e}function c(e,t){this._cursor=e,this._request=t}function l(e){this._store=e}function u(e){this._tx=e,this.complete=new Promise(function(t,n){e.oncomplete=function(){t()},e.onerror=function(){n(e.error)},e.onabort=function(){n(e.error)}})}function d(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new u(n)}function p(e){this._db=e}r(i,"_index",["name","keyPath","multiEntry","unique"]),o(i,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),a(i,"_index",IDBIndex,["openCursor","openKeyCursor"]),r(c,"_cursor",["direction","key","primaryKey","value"]),o(c,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(t){t in IDBCursor.prototype&&(c.prototype[t]=function(){var n=this,r=arguments;return Promise.resolve().then(function(){return n._cursor[t].apply(n._cursor,r),e(n._request).then(function(e){if(e)return new c(e,n._request)})})})}),l.prototype.createIndex=function(){return new i(this._store.createIndex.apply(this._store,arguments))},l.prototype.index=function(){return new i(this._store.index.apply(this._store,arguments))},r(l,"_store",["name","keyPath","indexNames","autoIncrement"]),o(l,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),a(l,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),s(l,"_store",IDBObjectStore,["deleteIndex"]),u.prototype.objectStore=function(){return new l(this._tx.objectStore.apply(this._tx,arguments))},r(u,"_tx",["objectStoreNames","mode"]),s(u,"_tx",IDBTransaction,["abort"]),d.prototype.createObjectStore=function(){return new l(this._db.createObjectStore.apply(this._db,arguments))},r(d,"_db",["name","version","objectStoreNames"]),s(d,"_db",IDBDatabase,["deleteObjectStore","close"]),p.prototype.transaction=function(){return new u(this._db.transaction.apply(this._db,arguments))},r(p,"_db",["name","version","objectStoreNames"]),s(p,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(e){[l,i].forEach(function(t){e in t.prototype&&(t.prototype[e.replace("open","iterate")]=function(){var t,n=(t=arguments,Array.prototype.slice.call(t)),r=n[n.length-1],o=this._store||this._index,s=o[e].apply(o,n.slice(0,-1));s.onsuccess=function(){r(s.result)}})})}),[i,l].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,t){var n=this,r=[];return new Promise(function(o){n.iterateCursor(e,function(e){e?(r.push(e.value),void 0===t||r.length!=t?e.continue():o(r)):o(r)})})})});var m={open:function(e,t,r){var o=n(indexedDB,"open",[e,t]),s=o.request;return s&&(s.onupgradeneeded=function(e){r&&r(new d(s.result,e.oldVersion,s.transaction))}),o.then(function(e){return new p(e)})},delete:function(e){return n(indexedDB,"deleteDatabase",[e])}};void 0!==t?(t.exports=m,t.exports.default=t.exports):self.idb=m}()},{}]},{},[4]);