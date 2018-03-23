var workbox=function(){'use strict';try{self.workbox.v['workbox:sw:3.0.0']=1;}catch(t){}const t='https://storage.googleapis.com/workbox-cdn/releases/3.0.0',e={backgroundSync:'background-sync',core:'core',expiration:'cache-expiration',googleAnalytics:'google-analytics',strategies:'strategies',precaching:'precaching',routing:'routing',cacheableResponse:'cacheable-response',broadcastUpdate:'broadcast-cache-update',rangeRequests:'range-requests'};return new class{constructor(){return this.v={},this.t={debug:'localhost'===self.location.hostname,modulePathPrefix:null,modulePathCb:null},this.e=this.t.debug?'dev':'prod',this.s=!1,new Proxy(this,{get(t,s){if(t[s])return t[s];const o=e[s];return o&&t.loadModule(`workbox-${o}`),t[s];}});}setConfig(t={}){if(this.s)throw new Error('Config must be set before accessing workbox.* modules');Object.assign(this.t,t),this.e=this.t.debug?'dev':'prod';}skipWaiting(){self.addEventListener('install',()=>self.skipWaiting());}clientsClaim(){self.addEventListener('activate',()=>self.clients.claim());}loadModule(t){const e=this.o(t);try{importScripts(e),this.s=!0;}catch(s){throw console.error(`Unable to import module '${t}' from '${e}'.`),s;}}o(e){if(this.t.modulePathCb)return this.t.modulePathCb(e,this.t.debug);let s=[t];const o=`${e}.${this.e}.js`,r=this.t.modulePathPrefix;return r&&''===(s=r.split('/'))[s.length-1]&&s.splice(s.length-1,1),s.push(o),s.join('/');}};}();

if (workbox) {
    workbox.setConfig({ debug: false });
    workbox.core.setLogLevel(workbox.core.LOG_LEVELS.warn);
    workbox.precaching.precacheAndRoute([
        {
            'url': '%RootUrl%dist/src/cui.lib.min.js',
            'revision': 'b0e2344aa18579c77ab0d8ad3a4da527'
        },
        {
            'url': '%RootUrl%dist/src/cui.min.js',
            'revision': 'd78fbe48914763ba10b4c263897a4bb3'
        },
        {
            'url': '%RootUrl%dist/src/cui.min.css',
            'revision': '1c9f781d5f7e0286c968b6fe199a797f'
        },
        {
            'url': '%RootUrl%dist/src/fonts/fonticon.eot',
            'revision': '59d2b4a90adde6e75c21d84730f9c041'
        },
        {
            'url': '%RootUrl%dist/src/fonts/fonticon.svg',
            'revision': '20a3e08b01796e15a5c733378fba8167'
        },
        {
            'url': '%RootUrl%dist/src/fonts/fonticon.ttf',
            'revision': 'b567f3d1fc557a5de064313d4a0b05c9'
        },
        {
            'url': '%RootUrl%dist/src/fonts/fonticon.woff',
            'revision': 'a2a9afc701fdacb2a93ea1a27162cd93'
        },
        {
            'url': '%RootUrl%dist/src/fonts/roboto-light-webfont.eot',
            'revision': '76847c872286234d3fde9bb5f2eb7a40'
        },
        {
            'url': '%RootUrl%dist/src/fonts/roboto-light-webfont.svg',
            'revision': '6b55c2ed6657fac9a5da7dbf5148095e'
        },
        {
            'url': '%RootUrl%dist/src/fonts/roboto-light-webfont.ttf',
            'revision': 'db08a16cd1d876758b90f7d3264272e9'
        },
        {
            'url': '%RootUrl%dist/src/fonts/roboto-light-webfont.woff',
            'revision': 'fbbda5c3c13fe35df6d64356ce7b63ad'
        },
        {
            'url': '%RootUrl%dist/src/fonts/roboto-medium-webfont.eot',
            'revision': 'd46a876cf3a9a6ab54c8c91e50383c84'
        },
        {
            'url': '%RootUrl%dist/src/fonts/roboto-medium-webfont.svg',
            'revision': '288a02b948bcce5e508e47360f805c75'
        },
        {
            'url': '%RootUrl%dist/src/fonts/roboto-medium-webfont.ttf',
            'revision': '9de9538d732201e628636d8fcac1f6b0'
        },
        {
            'url': '%RootUrl%dist/src/fonts/roboto-medium-webfont.woff',
            'revision': 'ba0f9a2aad6a1ce010eec8c4ac53b49f'
        },
        {
            'url': '%RootUrl%dist/src/fonts/roboto-thin-webfont.eot',
            'revision': '4d199f84bb4ad09a084eb2ae07be7e0a'
        },
        {
            'url': '%RootUrl%dist/src/fonts/roboto-thin-webfont.svg',
            'revision': '364ca57a51c2db494f8879c0ced33758'
        },
        {
            'url': '%RootUrl%dist/src/fonts/roboto-thin-webfont.ttf',
            'revision': '4e47b254ab246dc94b3dcb34467b227f'
        },
        {
            'url': '%RootUrl%dist/src/fonts/roboto-thin-webfont.woff',
            'revision': 'e7c35d7cfd978bf2bb754e91e23153ba'
        },
        {
            'url': '%RootUrl%dist/src/doc/src/doc.css',
            'revision': 'ecd0f4da5cc0b410910cee44a37148be'
        },
        {
            'url': '%RootUrl%dist/src/doc/src/doc.js',
            'revision': '73f79c8d54220b538b4c656ab8cc9ff8'
        },
        {
            'url': '%RootUrl%dist/src/doc/src/favicon.ico',
            'revision': '5b98a7c9d81ba110a84c1eb1db6d95fc'
        },
        {
            'url': '%RootUrl%dist/src/doc/src/manifest.json',
            'revision': '9535f9578482a16d3e96721e2779b77c'
        },
        {
            'url': '%RootUrl%index.html',
            'revision': '7c9cbaaec51bee61eb80204db9986884'
        }
    ]);

    workbox.routing.registerRoute(/.*(googleapis|gstatic)\.com.*$/, workbox.strategies.staleWhileRevalidate());
    workbox.routing.registerRoute(/.*\.(js|css|ico|jpg|gif|jpeg|png|svg|ttf|eot|woff)/, new workbox.strategies.CacheFirst({
        cacheName: 'static',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: 7 * 24 * 60 * 60
            }),
        ],
    }) );
}
