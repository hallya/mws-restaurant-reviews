!function a(i,s,u){function c(t,e){if(!s[t]){if(!i[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(l)return l(t,!0);var r=new Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}var o=s[t]={exports:{}};i[t][0].call(o.exports,function(e){return c(i[t][1][e]||e)},o,o.exports,a,i,s,u)}return s[t].exports}for(var l="function"==typeof require&&require,e=0;e<u.length;e++)c(u[e]);return c}({1:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r,a=function(){function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}}(),i=(r=e("./indexedb"))&&r.__esModule?r:{default:r},o=function(){function o(){!function(e,t){if(!(e instanceof o))throw new TypeError("Cannot call a class as a function")}(this)}return a(o,null,[{key:"fetchRestaurants",value:function(){return i.default.getAll("restaurants").then(function(e){return e.length<10?fetch(o.DATABASE_URL).then(function(e){return e.json()}).then(function(e){return console.log("fetch Restaurants called !"),e.forEach(function(e){return i.default.set("restaurants",e)}),e}).then(function(e){return window.navigator.standalone?e.restaurants:e}).catch(function(e){return console.error("Request failed. Returned status of "+e)}):e}).catch(function(e){return console.error(e)})}},{key:"fetchRestaurantById",value:function(n){return i.default.get("restaurants",Number(n)).then(function(e){return e||(console.log("No cache found"),fetch(o.DATABASE_URL).then(function(e){return e.json()}).then(function(e){var t=e[n-1];return i.default.set("restaurants",t),t}).catch(function(e){return console.error("Restaurant does not exist: "+e)}))})}},{key:"fetchRestaurantByCuisine",value:function(t){return o.fetchRestaurants().then(function(e){return e.restaurants.filter(function(e){return e.cuisine_type==t})}).catch(function(e){return console.error(e)})}},{key:"fetchRestaurantByNeighborhood",value:function(t){return o.fetchRestaurants().then(function(e){return e.restaurants.filter(function(e){return e.neighborhood==t})}).catch(function(e){return console.error(e)})}},{key:"fetchRestaurantByCuisineAndNeighborhood",value:function(n,r){return i.default.getAll("restaurants").then(function(e){return e.length<10?o.fetchRestaurants().then(function(e){var t=e;return t.forEach(function(e){return i.default.set("restaurants",e)}),o.filterResults(t,n,r)}).catch(function(e){return console.error(e)}):o.filterResults(e,n,r)}).catch(function(e){return console.error(e)})}},{key:"filterResults",value:function(e,t,n){return"all"!==t&&(e=e.filter(function(e){return e.cuisine_type==t})),"all"!==n&&(e=e.filter(function(e){return e.neighborhood==n})),e}},{key:"fetchNeighborhoods",value:function(){return o.fetchRestaurants().then(function(e){var n=e.map(function(e){return e.neighborhood});return n.filter(function(e,t){return n.indexOf(e)==t})}).catch(function(e){return console.error(e)})}},{key:"fetchCuisines",value:function(){return o.fetchRestaurants().then(function(e){var n=e.map(function(e){return e.cuisine_type});return n.filter(function(e,t){return n.indexOf(e)==t})}).catch(function(e){return console.error(e)})}},{key:"urlForRestaurant",value:function(e){return"restaurant.html?id="+e.id}},{key:"imageUrlForRestaurant",value:function(e){return"assets/img/jpg/"+e.photograph}},{key:"imageWebpUrlForRestaurant",value:function(e){return"assets/img/webp/"+e.photograph}},{key:"mapMarkerForRestaurant",value:function(e,t){return new google.maps.Marker({position:e.latlng,title:e.name,url:o.urlForRestaurant(e),map:t,animation:google.maps.Animation.DROP})}},{key:"DATABASE_URL",get:function(){return window.navigator.standalone?"data/restaurants.json":"http://localhost:1337/restaurants"}}]),o}();n.default=o},{"./indexedb":3}],2:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r={lazyLoading:function(){var e=[].slice.call(document.querySelectorAll(".lazy"));if("IntersectionObserver"in window){var n=new IntersectionObserver(function(e,t){e.forEach(function(e){if(e.isIntersecting){var t=e.target;"source"===t.localName?t.srcset=t.dataset.srcset:t.src=t.dataset.src,t.classList.remove("lazy"),n.unobserve(t)}})});e.forEach(function(e){n.observe(e)})}else{var r=[].slice.call(document.querySelectorAll(".lazy")),t=!1,o=function e(){!1===t&&(t=!0,setTimeout(function(){r.forEach(function(t){t.getBoundingClientRect().top<=window.innerHeight+50&&0<=t.getBoundingClientRect().bottom&&"none"!==getComputedStyle(t).display&&(t.src=t.dataset.src,t.srcset=t.dataset.srcset,t.classList.remove("lazy"),0===(r=r.filter(function(e){return e!==t})).length&&(document.removeEventListener("scroll",e),window.removeEventListener("resize",e),window.removeEventListener("orientationchange",e)))}),t=!1},200))};document.addEventListener("scroll",o),window.addEventListener("resize",o),window.addEventListener("orientationchange",o),"complete"===window.document.readyState&&o()}},switchLoaderToMap:function(){document.getElementById("map").classList.contains("hidden")&&(document.getElementById("map").classList.remove("hidden"),document.getElementById("map-loader").classList.add("hidden"))}};n.default=r},{}],3:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r,o=(r=e("../node_modules/idb/lib/idb"))&&r.__esModule?r:{default:r},a=function(){if(navigator.serviceWorker)return o.default.open("restaurant-reviews",1,function(e){switch(e.oldVersion){case 0:e.createObjectStore("restaurants",{keyPath:"id"})}})},i={get:function(t,n){return a().then(function(e){if(e)return e.transaction(t).objectStore(t).get(n)}).catch(function(e){return console.error(e)})},set:function(t,n){return a().then(function(e){if(e)return e.transaction(t,"readwrite").objectStore(t).put(n).complete}).catch(function(e){return console.error(e)})},getAll:function(t){return a().then(function(e){if(e)return e.transaction(t).objectStore(t).getAll()}).catch(function(e){return console.error(e)})}};n.default=i},{"../node_modules/idb/lib/idb":5}],4:[function(e,t,n){"use strict";var w=o(e("./dbhelper")),r=o(e("./helpers"));function o(e){return e&&e.__esModule?e:{default:e}}var a=[],i=document.querySelector("main"),s=document.querySelector("footer"),u=document.querySelector(".filter-options"),c=document.querySelector(".filter-options h3"),l=document.querySelector("#menuFilter"),d=document.querySelector("#restaurants-list"),f=(document.getElementById("#map-container"),document.querySelector("#neighborhoods-select")),p=document.querySelector("#cuisines-select"),m=(document.querySelector("#map"),document.querySelector("#map-loader"));function h(){u.classList.remove("optionsOpen"),u.classList.add("optionsClose"),u.setAttribute("aria-hidden","true"),l.classList.remove("pressed"),i.classList.remove("moveDown"),i.classList.add("moveUp"),s.classList.remove("moveDown"),s.classList.add("moveUp"),c.removeAttribute("tabindex")}document.addEventListener("DOMContentLoaded",function(){console.log("DOMContentLoaded"),window.navigator.standalone||-1!==window.navigator.userAgent.indexOf("Android")||-1!==window.navigator.userAgent.indexOf("Linux")||R(),g().then(y).catch(function(e){return console.error(e)})}),l.addEventListener("click",function(){u.classList.contains("optionsClose")?(u.classList.remove("optionsClose"),i.classList.remove("moveUp"),s.classList.remove("moveUp"),u.classList.add("optionsOpen"),u.setAttribute("aria-hidden","false"),i.classList.add("moveDown"),s.classList.add("moveDown"),l.classList.add("pressed"),l.blur(),c.setAttribute("tabindex","-1"),c.focus()):h()}),"serviceWorker"in navigator&&window.addEventListener("load",function(){var e="hallya.github.io"===window.location.hostname?"/mws-restaurant-stage-1/sw.js":"../sw.js";navigator.serviceWorker.register(e).then(function(e){return console.log("registration to serviceWorker complete with scope :",e.scope)})}),document.onkeypress=function(e){13===e.charCode&&u.classList.contains("optionsOpen")&&(h(),d.setAttribute("tabindex","0"),d.focus())};var g=function(){return w.default.fetchNeighborhoods().then(function(e){self.neighborhoods=e,v()}).catch(function(e){return console.error(e)})},v=function(){var n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.neighborhoods,r=f;n.forEach(function(e){var t=document.createElement("option");t.innerHTML=e,t.value=e,t.setAttribute("role","option"),t.setAttribute("aria-setsize","4"),t.setAttribute("aria-posinset",n.indexOf(e)+2),r.append(t)})},y=function(){w.default.fetchCuisines().then(function(e){self.cuisines=e,b()}).catch(function(e){return console.error(e)})},b=function(){var n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.cuisines,r=p;n.forEach(function(e){var t=document.createElement("option");t.innerHTML=e,t.value=e,t.setAttribute("role","option"),t.setAttribute("aria-setsize","4"),t.setAttribute("aria-posinset",n.indexOf(e)+2),r.append(t)})};window.initMap=function(){var e=document.createElement("div");e.setAttribute("tabindex","-1"),e.setAttribute("aria-hidden","true"),e.id="map",self.map=new google.maps.Map(e,{zoom:12,center:{lat:40.722216,lng:-73.987501},scrollwheel:!1}),document.getElementById("map-container").appendChild(e),self.map.addListener("tilesloaded",function(e){m.remove()}),x().then(r.default.lazyLoading).then(A).catch(function(e){return console.error(e)})};var x=function(){var e=p,t=f,n=e.selectedIndex,r=t.selectedIndex,o=e[n].value,a=t[r].value;return w.default.fetchRestaurantByCuisineAndNeighborhood(o,a).then(_).then(E).catch(function(e){return console.error(e)})},_=function(e){self.restaurants=[],document.getElementById("restaurants-list").innerHTML="",0<a.length&&self.markers.forEach(function(e){return e.setMap(null)}),self.markers=[],self.restaurants=e},E=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurants,t=document.getElementById("restaurants-list");e.forEach(function(e){t.append(L(e))})},L=function(e){var t,n,r=document.createElement("li"),o=document.createElement("figure"),a=document.createElement("figcaption"),i=document.createElement("picture"),s=document.createElement("source"),u=document.createElement("source"),c=document.createElement("source"),l=document.createElement("source"),d=document.createElement("source"),f=document.createElement("source"),p=document.createElement("img"),m=document.createElement("aside"),h=document.createElement("p");l.dataset.srcset=w.default.imageWebpUrlForRestaurant(e)+"-large_x1.webp 1x, "+w.default.imageWebpUrlForRestaurant(e)+"-large_x2.webp 2x",l.srcset=w.default.imageWebpUrlForRestaurant(e)+"-lazy.webp",l.media="(min-width: 1000px)",l.className="lazy",l.type="image/webp",s.dataset.srcset=w.default.imageUrlForRestaurant(e)+"-large_x1.jpg 1x, "+w.default.imageUrlForRestaurant(e)+"-large_x2.jpg 2x",s.srcset=w.default.imageUrlForRestaurant(e)+"-lazy.jpg",s.media="(min-width: 1000px)",s.className="lazy",s.type="image/jpeg",d.dataset.srcset=w.default.imageWebpUrlForRestaurant(e)+"-medium_x1.webp 1x, "+w.default.imageWebpUrlForRestaurant(e)+"-medium_x2.webp 2x",d.srcset=w.default.imageWebpUrlForRestaurant(e)+"-lazy.webp",d.media="(min-width: 420px)",d.className="lazy",d.type="image/webp",u.dataset.srcset=w.default.imageUrlForRestaurant(e)+"-medium_x1.jpg 1x, "+w.default.imageUrlForRestaurant(e)+"-medium_x2.jpg 2x",u.srcset=w.default.imageUrlForRestaurant(e)+"-lazy.jpg",u.media="(min-width: 420px)",u.className="lazy",u.type="image/jpeg",f.dataset.srcset=w.default.imageWebpUrlForRestaurant(e)+"-small_x2.webp 2x, "+w.default.imageWebpUrlForRestaurant(e)+"-small_x1.webp 1x",f.srcset=w.default.imageWebpUrlForRestaurant(e)+"-lazy.webp",f.media="(min-width: 320px)",f.className="lazy",f.type="image/webp",c.dataset.srcset=w.default.imageUrlForRestaurant(e)+"-small_x2.jpg 2x, "+w.default.imageUrlForRestaurant(e)+"-small_x1.jpg 1x",c.srcset=w.default.imageUrlForRestaurant(e)+"-lazy.jpg",c.media="(min-width: 320px)",c.className="lazy",c.type="image/jpeg",p.dataset.src=w.default.imageUrlForRestaurant(e)+"-small_x1.jpg",p.src=w.default.imageUrlForRestaurant(e)+"-lazy.jpg",p.className="restaurant-img lazy",p.setAttribute("sizes","(max-width: 1100px) 85vw, (min-width: 1101px) 990px"),p.alt=e.name+"'s restaurant",p.type="image/jpeg",h.innerHTML=(t=e.reviews,n=0,t.forEach(function(e){n+=Number(e.rating)}),n/=t.length,Math.round(10*n)/10+"/5"),m.append(h),i.append(l),i.append(s),i.append(d),i.append(u),i.append(f),i.append(c),i.append(p),o.append(i),o.append(a),r.append(m),r.append(o);var g=document.createElement("h2");g.innerHTML=e.name,a.append(g);var v=document.createElement("p");v.innerHTML=e.neighborhood,r.append(v);var y=document.createElement("p");y.innerHTML=e.address,r.append(y);var b=document.createElement("a");return b.innerHTML="View Details",b.href=w.default.urlForRestaurant(e),b.setAttribute("aria-label","View details of "+e.name),b.setAttribute("rel","noopener"),r.append(b),r.setAttribute("role","listitem"),r.setAttribute("aria-setsize","10"),r.setAttribute("aria-posinset",e.id),r},A=function(){(0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurants).forEach(function(e){var t=w.default.mapMarkerForRestaurant(e,self.map);google.maps.event.addListener(t,"click",function(){window.location.href=t.url}),self.markers.push(t)})},R=function(){var e=document.createElement("aside"),t=document.createElement("p"),n=document.createElement("p"),r=document.createElement("span");e.id="pop",e.className="popup",n.className="popup msg",n.setAttribute("tabindex","2"),t.className="popup note",t.setAttribute("tabindex","1"),r.className="iconicfill-arrow-down",t.innerHTML="(Tap to close)",n.innerHTML='Add <img src="assets/img/svg/share-apple.svg" alt=""> this app to your home screen and enjoy it as a real application !',e.setAttribute("tabindex","-1"),e.addEventListener("click",function(){e.classList.add("hide"),setTimeout(function(){e.style="display: none;"},1e3)}),e.append(t),e.append(n),e.append(r),document.getElementById("maincontent").appendChild(e),e.focus(),setTimeout(function(){e.classList.add("hide")},7e3)}},{"./dbhelper":1,"./helpers":2}],5:[function(e,p,t){"use strict";!function(){function i(n){return new Promise(function(e,t){n.onsuccess=function(){e(n.result)},n.onerror=function(){t(n.error)}})}function a(n,r,o){var a,e=new Promise(function(e,t){i(a=n[r].apply(n,o)).then(e,t)});return e.request=a,e}function e(e,n,t){t.forEach(function(t){Object.defineProperty(e.prototype,t,{get:function(){return this[n][t]},set:function(e){this[n][t]=e}})})}function t(t,n,r,e){e.forEach(function(e){e in r.prototype&&(t.prototype[e]=function(){return a(this[n],e,arguments)})})}function n(t,n,r,e){e.forEach(function(e){e in r.prototype&&(t.prototype[e]=function(){return this[n][e].apply(this[n],arguments)})})}function r(e,r,t,n){n.forEach(function(n){n in t.prototype&&(e.prototype[n]=function(){return e=this[r],(t=a(e,n,arguments)).then(function(e){if(e)return new s(e,t.request)});var e,t})})}function o(e){this._index=e}function s(e,t){this._cursor=e,this._request=t}function u(e){this._store=e}function c(n){this._tx=n,this.complete=new Promise(function(e,t){n.oncomplete=function(){e()},n.onerror=function(){t(n.error)},n.onabort=function(){t(n.error)}})}function l(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new c(n)}function d(e){this._db=e}e(o,"_index",["name","keyPath","multiEntry","unique"]),t(o,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),r(o,"_index",IDBIndex,["openCursor","openKeyCursor"]),e(s,"_cursor",["direction","key","primaryKey","value"]),t(s,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(n){n in IDBCursor.prototype&&(s.prototype[n]=function(){var t=this,e=arguments;return Promise.resolve().then(function(){return t._cursor[n].apply(t._cursor,e),i(t._request).then(function(e){if(e)return new s(e,t._request)})})})}),u.prototype.createIndex=function(){return new o(this._store.createIndex.apply(this._store,arguments))},u.prototype.index=function(){return new o(this._store.index.apply(this._store,arguments))},e(u,"_store",["name","keyPath","indexNames","autoIncrement"]),t(u,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),r(u,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),n(u,"_store",IDBObjectStore,["deleteIndex"]),c.prototype.objectStore=function(){return new u(this._tx.objectStore.apply(this._tx,arguments))},e(c,"_tx",["objectStoreNames","mode"]),n(c,"_tx",IDBTransaction,["abort"]),l.prototype.createObjectStore=function(){return new u(this._db.createObjectStore.apply(this._db,arguments))},e(l,"_db",["name","version","objectStoreNames"]),n(l,"_db",IDBDatabase,["deleteObjectStore","close"]),d.prototype.transaction=function(){return new c(this._db.transaction.apply(this._db,arguments))},e(d,"_db",["name","version","objectStoreNames"]),n(d,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(a){[u,o].forEach(function(e){e.prototype[a.replace("open","iterate")]=function(){var e,t=(e=arguments,Array.prototype.slice.call(e)),n=t[t.length-1],r=this._store||this._index,o=r[a].apply(r,t.slice(0,-1));o.onsuccess=function(){n(o.result)}}})}),[o,u].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,n){var r=this,o=[];return new Promise(function(t){r.iterateCursor(e,function(e){e?(o.push(e.value),void 0===n||o.length!=n?e.continue():t(o)):t(o)})})})});var f={open:function(e,t,n){var r=a(indexedDB,"open",[e,t]),o=r.request;return o.onupgradeneeded=function(e){n&&n(new l(o.result,e.oldVersion,o.transaction))},r.then(function(e){return new d(e)})},delete:function(e){return a(indexedDB,"deleteDatabase",[e])}};void 0!==p?(p.exports=f,p.exports.default=p.exports):self.idb=f}()},{}]},{},[4]);