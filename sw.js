!function(){return function e(n,s,t){function a(o,r){if(!s[o]){if(!n[o]){var i="function"==typeof require&&require;if(!r&&i)return i(o,!0);if(c)return c(o,!0);var h=new Error("Cannot find module '"+o+"'");throw h.code="MODULE_NOT_FOUND",h}var p=s[o]={exports:{}};n[o][0].call(p.exports,function(e){return a(n[o][1][e]||e)},p,p.exports,e,n,s,t)}return s[o].exports}for(var c="function"==typeof require&&require,o=0;o<t.length;o++)a(t[o]);return a}}()({1:[function(e,n,s){const t=["index.html","manifest.webmanifest","restaurant.html","assets/css/fonts/iconicfill.woff2","assets/css/fonts/fontawesome.woff2","assets/css/fonts/1cXxaUPXBpj2rGoU7C9WiHGFq8Kk1Q.woff2","assets/css/fonts/JTURjIg1_i6t8kCHKm45_ZpC3gnD_vx3rCs.woff2","assets/img/png/launchScreen-ipad-9.7.png","assets/img/png/launchScreen-ipadpro-10.5.png","assets/img/png/launchScreen-ipadpro-12.9.png","assets/img/png/launchScreen-iphone-8.png","assets/img/png/launchScreen-iphone-8plus.png","assets/img/png/launchScreen-iphone-x.png","assets/img/png/launchScreen-iphone-se.png","assets/img/png/logo-64.png","assets/img/png/logo-128.png","assets/img/png/logo-256.png","assets/img/png/logo-512.png","assets/css/index.css","assets/css/restaurant_info.css","js/main.js","js/restaurant_info.js"];self.addEventListener("install",e=>{console.log('- Cache version : "static-cache-8"'),e.waitUntil(caches.open("static-cache-8").then(e=>e.addAll(t)).then(()=>{console.log("- All resources cached."),self.skipWaiting(),console.log("- SW version skipped.")}).catch(e=>console.error("Open cache failed :",e)))}),self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(e=>Promise.all(e.map(e=>{if("static-cache-8"!==e&&"cache-map-api-3"!==e)return console.log("- Deleting",e),caches.delete(e)}))).then(()=>console.log('- "static-cache-8" now ready to handle fetches!')))}),self.addEventListener("fetch",e=>{const n=new URL(e.request.url);let s;n.hostname.indexOf("maps")>-1?e.respondWith(caches.open("cache-map-api-3").then(s=>s.match(e.request).then(e=>e||fetch(n.href,{mode:"no-cors"})).then(n=>(s.put(e.request,n.clone()),n),e=>console.error(e)))):n.pathname.indexOf("restaurant.html")>-1?(s=n.href.replace(/[?&]id=\d/,""),e.respondWith(caches.open("static-cache-8").then(n=>n.match(s).then(n=>n||fetch(e.request)).then(e=>(n.put(s,e.clone()),e),e=>console.error(e))))):n.pathname.indexOf("browser-sync")>-1||n.pathname.endsWith("restaurants.json")?e.respondWith(fetch(e.request)):n.hostname.indexOf(["localhost","hally.github.io"])>-1&&e.respondWith(caches.open("static-cache-8").then(n=>n.match(e.request).then(n=>n||fetch(e.request)).then(s=>(n.put(e.request,s.clone()),s),e=>console.error(e))))})},{}]},{},[1]);