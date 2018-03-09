var expectedCaches = ['version-4'];

self.addEventListener('install', function(event) {
    console.log('WORKER: install event in progress.');
    event.waitUntil(
        caches
            .open('version-4').then(function() {
                console.log('WORKER: install completed');
            })
    );
});

self.addEventListener('activate', event => {
    // delete any caches that aren't in expectedCaches
    // which will get rid of static-v1
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (!expectedCaches.includes(key)) {
                    console.log('delete cache'+ key);
                    return caches.delete(key);
                }
            })
        )).then(() => {
            console.log('V4 now ready to handle fetches!');
        })
    );
});

self.addEventListener('fetch', function(event) {
    console.log('WORKER: fetch event in progress.');
    if (event.request.method !== 'GET') {
        console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
        return;
    }
    event.respondWith(
        caches
            .match(event.request)
            .then(function(cached) {
                var networked = fetch(event.request)
                    .then(fetchedFromNetwork, unableToResolve)
                    .catch(unableToResolve);
                console.log('WORKER: fetch event', cached ? '(cached)' : '(network)', event.request.url);
                return cached || networked;
                function fetchedFromNetwork(response) {
                    var cacheCopy = response.clone();
                    console.log('WORKER: fetch response from network.', event.request.url);
                    caches
                        .open('cacheFiles')
                        .then(function add(cache) {
                            cache.put(event.request, cacheCopy);
                        })
                        .then(function() {
                            console.log('WORKER: fetch response stored in cache.', event.request.url);
                        });
                    return response;
                }
                function unableToResolve () {
                    console.log('WORKER: fetch request failed in both cache and network.');
                    return new Response('<h1>亲,快去找个有网络的地方.</h1>', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: new Headers({
                            'Content-Type': 'text/html'
                        })
                    });
                }
            })
    );
});
