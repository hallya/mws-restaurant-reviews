!function(){return function e(t,n,r){function o(s,i){if(!n[s]){if(!t[s]){var c="function"==typeof require&&require;if(!i&&c)return c(s,!0);if(a)return a(s,!0);var l=new Error("Cannot find module '"+s+"'");throw l.code="MODULE_NOT_FOUND",l}var u=n[s]={exports:{}};t[s][0].call(u.exports,function(e){return o(t[s][1][e]||e)},u,u.exports,e,t,n,r)}return n[s].exports}for(var a="function"==typeof require&&require,s=0;s<r.length;s++)o(r[s]);return o}}()({1:[function(e,t,n){const r=e("./indexedb"),o={DATABASE_URL:{GET:{allRestaurants:()=>/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)?"data/restaurants.json":"http://localhost:1337/restaurants",restaurant:e=>`http://localhost:1337/restaurants/${e}`,favoriteRestaurants:()=>"http://localhost:1337/restaurants/?is_favorite=true",allReviews:()=>"http://localhost:1337/reviews/",allRestaurantReviews:e=>`http://localhost:1337/reviews/?restaurant_id=${e}`,restaurantReview:e=>`http://localhost:1337/reviews/${e}`},POST:{newReview:()=>"http://localhost:1337/reviews/"},PUT:{favoriteRestaurant:e=>`http://localhost:1337/restaurants/${e}/?is_favorite=true`,unfavoriteRestaurant:e=>`http://localhost:1337/restaurants/${e}/?is_favorite=false`,updateReview:e=>`http://localhost:1337/reviews/${e}`},DELETE:{review:e=>`http://localhost:1337/reviews/${e}`}},fetchRestaurants:()=>{return r.getAll("restaurants").then(e=>e.length<10?fetch(o.DATABASE_URL.GET.allRestaurants()).then(e=>e.json()).then(e=>(console.log("- Restaurants data fetched !"),e.restaurants||e)).then(e=>(e.forEach(e=>r.set("restaurants",e)),e)).catch(e=>console.error(`Request failed. Returned status of ${e}`)):e).catch(e=>{console.error(e)})},fetchRestaurantById:e=>{return r.get("restaurants",Number(e)).then(t=>t||(console.log("- No cache found"),fetch(o.DATABASE_URL.GET.restaurant(e)).then(e=>e.json()).then(e=>(r.set("restaurants",e),e)).catch(e=>console.error(`Restaurant does not exist: ${e}`))))},fetchRestaurantByCuisine:e=>o.fetchRestaurants().then(t=>t.restaurants.filter(t=>t.cuisine_type==e)).catch(e=>console.error(e)),fetchRestaurantByNeighborhood:e=>o.fetchRestaurants().then(t=>t.restaurants.filter(t=>t.neighborhood==e)).catch(e=>console.error(e)),fetchRestaurantByCuisineAndNeighborhood:(e,t)=>{return r.getAll("restaurants").then(n=>n.length<10?o.fetchRestaurants().then(n=>{const a=n;return a.forEach(e=>r.set("restaurants",e)),o.filterResults(a,e,t)}).catch(e=>console.error(e)):o.filterResults(n,e,t)).catch(e=>console.error(e))},filterResults:(e,t,n)=>("all"!==t&&(e=e.filter(e=>e.cuisine_type==t)),"all"!==n&&(e=e.filter(e=>e.neighborhood==n)),e),fetchNeighborhoods:e=>{const t=e.map(e=>e.neighborhood);return t.filter((e,n)=>t.indexOf(e)==n)},fetchCuisines:e=>{const t=e.map(e=>e.cuisine_type);return t.filter((e,n)=>t.indexOf(e)==n)},urlForRestaurant:e=>`restaurant.html?id=${e.id}`,imageUrlForRestaurant:e=>`assets/img/jpg/${e.photograph}`,imageWebpUrlForRestaurant:e=>`assets/img/webp/${e.photograph}`,postReview:e=>{e.preventDefault();const t=document.querySelector("#title-container form").elements,n={restaurant_id:window.location.search.match(/\d+/)[0],name:t.name.value,rating:t.rating.value,comments:t.comments.value};fetch("http://localhost:1337/reviews/",{method:"POST",body:n}).then(e=>console.log(e))},mapMarkerForRestaurant:(e,t)=>{return new google.maps.Marker({position:e.latlng,title:e.name,url:o.urlForRestaurant(e),map:t,animation:google.maps.Animation.DROP,icon:"/assets/img/svg/marker.svg"})}};t.exports=o},{"./indexedb":3}],2:[function(e,t,n){const r={isFormValid:()=>{document.querySelector("form").checkValidity()?document.querySelector('form input[type="submit"]').style.color="green":document.querySelector('form input[type="submit"]').style.color="#ca0000"},toggleForm:()=>{document.getElementById("title-container").classList.toggle("reviews-toggled"),document.getElementById("reviews-list").classList.toggle("reviews-toggled"),document.querySelector("section form").classList.toggle("toggled-display"),setTimeout(()=>{document.querySelector("section form").classList.toggle("toggled-translate")},800)},lazyLoading:()=>{const e=[].slice.call(document.querySelectorAll(".lazy"));if("IntersectionObserver"in window){let t=new IntersectionObserver(function(e,n){e.forEach(function(e){if(e.isIntersecting){let n=e.target;"source"===n.localName?n.srcset=n.dataset.srcset:n.src=n.dataset.src,n.classList.remove("lazy"),t.unobserve(n)}})},{root:null,threshold:[0],rootMargin:"200px"});e.forEach(function(e){t.observe(e)})}else{let e=[].slice.call(document.querySelectorAll(".lazy")),t=!1;const n=function(){if(!1===t){t=!0;const r=window.innerHeight+200;e.forEach(function(t){t.getBoundingClientRect().top<=r&&t.getBoundingClientRect().bottom>=0&&"none"!==getComputedStyle(t).display&&(t.src=t.dataset.src,t.srcset=t.dataset.srcset,t.classList.remove("lazy"),0===(e=e.filter(function(e){return e!==t})).length&&(document.removeEventListener("scroll",n),window.removeEventListener("resize",n),window.removeEventListener("orientationchange",n)))}),t=!1}};document.addEventListener("scroll",n),window.addEventListener("resize",n),window.addEventListener("orientationchange",n),"complete"==document.readyState&&(console.log("document ready for lazy load"),n()),document.onreadystatechange=function(){"complete"==document.readyState&&(console.log("document ready for lazy load"),n())}}},sortByNote:(e,t)=>{const n=r.getAverageNote(e.reviews),o=r.getAverageNote(t.reviews);return o>n?1:o<n?-1:0},sortByName:(e,t)=>e.name>t.name,sortByNameInverted:(e,t)=>e.name<t.name,getAverageNote:e=>{let t=0;return e.forEach(e=>{t+=Number(e.rating)}),t/=e.length,Math.round(10*t)/10}};t.exports=r},{}],3:[function(e,t,n){const r=e("../../node_modules/idb/lib/idb"),o=()=>{if(navigator.serviceWorker)return r.open("restaurant-reviews",1,e=>{switch(e.oldVersion){case 0:e.createObjectStore("restaurants",{keyPath:"id"})}})},a={get:(e,t)=>o().then(n=>{if(n)return n.transaction(e).objectStore(e).get(t)}).catch(e=>console.error(e)),set:(e,t)=>o().then(n=>{if(!n)return;return n.transaction(e,"readwrite").objectStore(e).put(t).complete}).catch(e=>console.error(e)),getAll:e=>o().then(t=>{if(t)return t.transaction(e).objectStore(e).getAll()}).catch(e=>console.error(e))};t.exports=a},{"../../node_modules/idb/lib/idb":5}],4:[function(e,t,n){const r=e("./dbhelper"),o=e("./helpers");const a=document.getElementById("map-loader");"serviceWorker"in navigator&&window.addEventListener("load",()=>{const e="hallya.github.io"===window.location.hostname?"/mws-restaurant-stage-1/sw.js":"../sw.js";navigator.serviceWorker.register(e).then(e=>console.log("registration to serviceWorker complete with scope :",e.scope))}),window.initMap=(()=>{s().then(e=>{const t=document.createElement("div");t.setAttribute("tabindex","-1"),t.setAttribute("aria-hidden","true"),t.id="map",self.map=new google.maps.Map(t,{zoom:16,center:e.latlng,streetViewControl:!1,mapTypeId:"roadmap",mapTypeControl:!1}),document.getElementById("map-container").appendChild(t),self.map.addListener("tilesloaded",function(){a.classList.toggle("hidden")}),r.mapMarkerForRestaurant(self.restaurant,self.map),p()}).then(o.lazyLoading).catch(e=>console.error(e))});const s=()=>{if(self.restaurant)return void console.log("- Restaurant already fetch");const e=h("id");return e?r.fetchRestaurantById(e).then(e=>self.restaurant=e).then(i).catch(e=>console.error(e)):console.error("No restaurant id in URL")},i=(e=self.restaurant)=>{document.getElementById("restaurant-name").innerHTML=e.name;const t=document.getElementById("restaurant-address");t.innerHTML=e.address,t.setAttribute("aria-label",`located at ${e.address}`);const n=document.getElementsByTagName("figure")[0],o=document.getElementsByTagName("figcaption")[0],a=document.createElement("picture"),s=document.createElement("source");s.dataset.srcset=`${r.imageWebpUrlForRestaurant(e)}-large_x1.webp 1x, ${r.imageWebpUrlForRestaurant(e)}-large_x2.webp 2x`,s.srcset="assets/img/svg/puff.svg",s.className="lazy",s.media="(min-width: 1000px)",s.type="image/webp";const i=document.createElement("source");i.dataset.srcset=`${r.imageUrlForRestaurant(e)}-large_x1.jpg 1x, ${r.imageUrlForRestaurant(e)}-large_x2.jpg 2x`,i.srcset="assets/img/svg/puff.svg",i.className="lazy",i.media=s.media,i.type="image/jpeg";const u=document.createElement("source");u.dataset.srcset=`${r.imageWebpUrlForRestaurant(e)}-medium_x1.webp 1x, ${r.imageWebpUrlForRestaurant(e)}-medium_x2.webp 2x`,u.srcset="assets/img/svg/puff.svg",u.className="lazy",u.media="(min-width: 420px)",u.type="image/webp";const d=document.createElement("source");d.dataset.srcset=`${r.imageUrlForRestaurant(e)}-medium_x1.jpg 1x, ${r.imageUrlForRestaurant(e)}-medium_x2.jpg 2x`,d.srcset="assets/img/svg/puff.svg",d.className="lazy",d.media=u.media,d.type="image/jpeg";const m=document.createElement("source");m.dataset.srcset=`${r.imageWebpUrlForRestaurant(e)}-small_x2.webp 2x, ${r.imageWebpUrlForRestaurant(e)}-small_x1.webp 1x`,m.srcset="assets/img/svg/puff.svg",m.className="lazy",m.media="(min-width: 320px)",m.type="image/webp";const p=document.createElement("source");p.dataset.srcset=`${r.imageUrlForRestaurant(e)}-small_x2.jpg 2x, ${r.imageUrlForRestaurant(e)}-small_x1.jpg 1x`,p.srcset="assets/img/svg/puff.svg",p.className="lazy",p.media=m.media,p.type="image/jpeg";const h=document.createElement("img");h.className="restaurant-img lazy",h.dataset.src=`${r.imageUrlForRestaurant(e)}-large_x1.jpg`,h.src="assets/img/svg/puff.svg",h.setAttribute("sizes","(max-width: 1100px) 85vw, (min-width: 1101px) 990px"),h.alt=`${e.name}'s  restaurant`,h.type="image/jpeg",a.appendChild(s),a.appendChild(i),a.appendChild(u),a.appendChild(d),a.appendChild(m),a.appendChild(p),a.appendChild(h),n.insertBefore(a,o);const g=document.getElementById("restaurant-cuisine");g.innerHTML=e.cuisine_type;const f=document.createElement("label");return f.innerHTML=`${e.cuisine_type} food`,f.setAttribute("hidden","hidden"),f.id="foodType",g.parentNode.insertBefore(f,g.nextSibling),e.operating_hours&&c(),l(),e},c=(e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let n in e){const r=document.createElement("tr"),o=document.createElement("td");o.innerHTML=n,o.setAttribute("aria-label",`open on ${n}`),r.appendChild(o);const a=document.createElement("td");a.innerHTML=e[n],a.setAttribute("aria-label",`${e[n]},`),r.appendChild(a),r.setAttribute("role","row"),t.appendChild(r)}},l=(e=self.restaurant.reviews)=>{const t=document.getElementById("reviews-container"),n=document.createElement("div"),r=document.createElement("h3"),o=document.createElement("button"),a=document.createElement("span"),s=document.createElement("span");if(r.innerHTML="Reviews",a.innerHTML="+",s.innerHTML="-",s.className="toggled",n.id="title-container",o.addEventListener("click",u),o.appendChild(a),o.appendChild(s),n.appendChild(r),n.appendChild(o),t.appendChild(n),!e){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void t.appendChild(e)}const i=document.getElementById("reviews-list");e.forEach(e=>{i.appendChild(m(e))}),t.appendChild(i)},u=()=>{const e=document.createElement("form"),t=document.createElement("label"),n=document.createElement("input"),a=document.createElement("fieldset");e.autocomplete="on",n.id="form-name",n.type="text",n.name="name",n.placeholder="Your name",n.minLength="2",n.maxLength="50",n.pattern="^[a-zA-Zs]+$",n.required=!0,t.setAttribute("for",n.id),t.className="visuallyHidden",t.innerHTML="Enter your name",a.className="new-rating";for(let e=5;e>0;e--){const t=document.createElement("input"),n=document.createElement("label");t.type="radio",t.id=`star${e}`,t.name="rating",t.value=e,t.class="visuallyHidden",t.required=!0,t.addEventListener("input",o.isFormValid),n.setAttribute("for",`star${e}`),n.title="It was",a.appendChild(t),a.appendChild(n)}const s=document.createElement("label"),i=document.createElement("textarea"),c=document.createElement("label"),l=document.createElement("input");document.createElement("img");i.id="form-comment",i.name="comments",i.type="text",i.required=!0,i.minLength=3,i.maxLength=5e3,i.placeholder="Your comment",i.addEventListener("keydown",g),s.setAttribute("for",i.id),s.className="visuallyHidden",s.innerHTML="Enter your opinion about this restaurant",l.id="form-submit",l.type="submit",l.value="Save",c.setAttribute("for",l.id),c.className="visuallyHidden",n.addEventListener("change",o.isFormValid),i.addEventListener("input",o.isFormValid),e.appendChild(t),e.appendChild(n),e.appendChild(a),e.appendChild(s),e.appendChild(i),e.appendChild(l),e.appendChild(c),e.addEventListener("submit",r.postReview),document.getElementById("title-container").style.height="300px",document.getElementById("title-container").appendChild(e),e.classList.toggle("form-toggled"),setTimeout(()=>{},300),document.querySelector("#title-container button").removeEventListener("click",u),document.querySelector("#title-container button").addEventListener("click",d),document.querySelectorAll("#title-container button span").forEach(e=>e.classList.toggle("toggled"))},d=()=>{document.querySelector("#title-container form").classList.toggle("form-toggled"),setTimeout(()=>{document.querySelector("#title-container form").remove()},300),document.querySelectorAll("#title-container button span").forEach(e=>e.classList.toggle("toggled")),document.getElementById("title-container").style.height="50px",document.querySelector("#title-container button").removeEventListener("click",d),document.querySelector("#title-container button").addEventListener("click",u)},m=e=>{const t=document.createElement("li"),n=document.createElement("p");n.className="userName",n.innerHTML=e.name,n.setAttribute("aria-label",`${e.name},`),t.appendChild(n);const r=document.createElement("p");r.className="dateReview",r.innerHTML=e.date,r.setAttribute("aria-label",`${e.date},`),t.appendChild(r);const o=document.createElement("p");let a=document.createElement("span");o.className="userRating",a.className="ratingStars";for(let t=0;t<e.rating;t++){const e=document.createElement("span");e.innerHTML+="★",e.id=`star${t+1}`,a.appendChild(e)}a.setAttribute("aria-label",`${e.rating} stars on 5,`),o.innerHTML="Rating: ",o.appendChild(a),t.appendChild(o);const s=document.createElement("p");return s.className="userComments",s.innerHTML=e.comments,t.appendChild(s),t.setAttribute("role","listitem"),t.setAttribute("aria-setsize",self.restaurant.reviews.length),t.setAttribute("aria-posinset",self.restaurant.reviews.indexOf(e)+1),t},p=(e=self.restaurant)=>{const t=document.getElementById("breadcrumb"),n=document.createElement("li");n.innerHTML=` ${e.name}`,n.className="fontawesome-arrow-right",n.setAttribute("aria-current","page"),t.appendChild(n)},h=(e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const n=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null};function g(){document.getElementById("title-container").style.height="auto",this.style.cssText="height:auto; padding:0",this.style.cssText="height:"+this.scrollHeight+"px"}},{"./dbhelper":1,"./helpers":2}],5:[function(e,t,n){"use strict";!function(){function e(e){return new Promise(function(t,n){e.onsuccess=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function n(t,n,r){var o,a=new Promise(function(a,s){e(o=t[n].apply(t,r)).then(a,s)});return a.request=o,a}function r(e,t,n){n.forEach(function(n){Object.defineProperty(e.prototype,n,{get:function(){return this[t][n]},set:function(e){this[t][n]=e}})})}function o(e,t,r,o){o.forEach(function(o){o in r.prototype&&(e.prototype[o]=function(){return n(this[t],o,arguments)})})}function a(e,t,n,r){r.forEach(function(r){r in n.prototype&&(e.prototype[r]=function(){return this[t][r].apply(this[t],arguments)})})}function s(e,t,r,o){o.forEach(function(o){o in r.prototype&&(e.prototype[o]=function(){return e=this[t],(r=n(e,o,arguments)).then(function(e){if(e)return new c(e,r.request)});var e,r})})}function i(e){this._index=e}function c(e,t){this._cursor=e,this._request=t}function l(e){this._store=e}function u(e){this._tx=e,this.complete=new Promise(function(t,n){e.oncomplete=function(){t()},e.onerror=function(){n(e.error)},e.onabort=function(){n(e.error)}})}function d(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new u(n)}function m(e){this._db=e}r(i,"_index",["name","keyPath","multiEntry","unique"]),o(i,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),s(i,"_index",IDBIndex,["openCursor","openKeyCursor"]),r(c,"_cursor",["direction","key","primaryKey","value"]),o(c,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(t){t in IDBCursor.prototype&&(c.prototype[t]=function(){var n=this,r=arguments;return Promise.resolve().then(function(){return n._cursor[t].apply(n._cursor,r),e(n._request).then(function(e){if(e)return new c(e,n._request)})})})}),l.prototype.createIndex=function(){return new i(this._store.createIndex.apply(this._store,arguments))},l.prototype.index=function(){return new i(this._store.index.apply(this._store,arguments))},r(l,"_store",["name","keyPath","indexNames","autoIncrement"]),o(l,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),s(l,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),a(l,"_store",IDBObjectStore,["deleteIndex"]),u.prototype.objectStore=function(){return new l(this._tx.objectStore.apply(this._tx,arguments))},r(u,"_tx",["objectStoreNames","mode"]),a(u,"_tx",IDBTransaction,["abort"]),d.prototype.createObjectStore=function(){return new l(this._db.createObjectStore.apply(this._db,arguments))},r(d,"_db",["name","version","objectStoreNames"]),a(d,"_db",IDBDatabase,["deleteObjectStore","close"]),m.prototype.transaction=function(){return new u(this._db.transaction.apply(this._db,arguments))},r(m,"_db",["name","version","objectStoreNames"]),a(m,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(e){[l,i].forEach(function(t){e in t.prototype&&(t.prototype[e.replace("open","iterate")]=function(){var t,n=(t=arguments,Array.prototype.slice.call(t)),r=n[n.length-1],o=this._store||this._index,a=o[e].apply(o,n.slice(0,-1));a.onsuccess=function(){r(a.result)}})})}),[i,l].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,t){var n=this,r=[];return new Promise(function(o){n.iterateCursor(e,function(e){e?(r.push(e.value),void 0===t||r.length!=t?e.continue():o(r)):o(r)})})})});var p={open:function(e,t,r){var o=n(indexedDB,"open",[e,t]),a=o.request;return a.onupgradeneeded=function(e){r&&r(new d(a.result,e.oldVersion,a.transaction))},o.then(function(e){return new m(e)})},delete:function(e){return n(indexedDB,"deleteDatabase",[e])}};void 0!==t?(t.exports=p,t.exports.default=t.exports):self.idb=p}()},{}]},{},[4]);