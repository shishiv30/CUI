var cacheConfig = {
    versionName: (+new Date() / 6000).toString(),
    whiteList: [],
    blackList: []
};
self.needCache = function (url) {
    var i = null;
    if(cacheConfig.whiteList && cacheConfig.whiteList.length) {
        for(i = 0; i < cacheConfig.whiteList.length; i++) {
            if(cacheConfig.whiteList[i].test(url)) {
                return true;
            } else {
                continue;
            }
        }
    }
    if(cacheConfig.blackList && cacheConfig.blackList.length) {
        for(i = 0; i < cacheConfig.blackList.length; i++) {
            if(cacheConfig.blackList[i].test(url)) {
                return false;
            } else {
                continue;
            }
        }
    }
    return true;
};
self.addEventListener('install', function (event) {
    event.waitUntil(caches.open(cacheConfig.versionName));
});

self.addEventListener('activate', function(event){
    event.waitUntil(
        caches.keys().then(function(keys) {
            Promise.all(
                keys.map(function(key) {
                    if (cacheConfig.versionName != key) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    if(!self.needCache(event.request.url)) {
        return;
    }
    event.respondWith(caches.match(event.request).then(function (cached) {
        var networked = fetch(event.request).then(fetchedFromNetwork, unableToResolve).catch(unableToResolve);
        return cached || networked;

        function fetchedFromNetwork(response) {
            var cacheCopy = response.clone();
            caches.open(cacheConfig.versionName).then(function add(cache) {
                cache.put(event.request, cacheCopy);
            });
            return response;
        }

        function unableToResolve() {
            return new Response('<h1>Oh My God.</h1>', {
                status: 404,
                statusText: 'Service Unavailable',
                headers: new Headers({
                    'Content-Type': 'text/html'
                })
            });
        }
    }));
});
