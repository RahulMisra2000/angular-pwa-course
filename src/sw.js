
const VERSION = 'v17';


log('Installing Service Worker');


self.addEventListener('install', event => event.waitUntil(installServiceWorker()));


async function installServiceWorker() {

    log("Service Worker installation started ");

    const cache = await caches.open(getCacheName());

    self.skipWaiting();

  
    // This SW will make http requests for all the urls listed and store the httpResponse of the requests in the cache.
    // These assets are already being downloaded by Angular in its normal functioning..... 
    // This is in addition to that ..... 
    // and these requests you will see in the Network tab, preceeded by a gear symbol... meaning these requests are initiated
    // by the SW. So, for example you will see  main.bundle.js 2 times ... one when it is downloaded because it is in a <script
    // tag in index.html and the second time because of this cache.addAll .... Of course this duplicate is only happening when the SW
    // is getting installed -- we are here in the install event handler ...
    // The real advantage is on subsequent runs ... if we in the fetch event's handler we can pull them out from the cache and return
    // them and that makes the application fast !
    return cache.addAll([
        '/',
        '/polyfills.bundle.js',
        '/inline.bundle.js',
        '/styles.bundle.js',
        '/vendor.bundle.js',
        '/main.bundle.js',
        '/assets/bundle.css',
        '/assets/angular-pwa-course.png',
        '/assets/main-page-logo-small-hat.png'
    ]);

}

self.addEventListener('activate', () => activateSW());


async function activateSW() {

    log('Service Worker activated');

    const cacheKeys = await caches.keys();

    cacheKeys.forEach(cacheKey => {
        if (cacheKey !== getCacheName() ) {
            caches.delete(cacheKey);
        }
    });

    return clients.claim();
}


self.addEventListener('fetch', event => event.respondWith(cacheThenNetwork(event)));



async function cacheThenNetwork(event) {

    log('Intercepting request: ' + event.request.url);

    const cache = await caches.open(getCacheName());

    const cachedResponse = await cache.match(event.request);

    if (cachedResponse) {
        log('From Cache: ' + event.request.url);
        return cachedResponse;
    }

    const networkResponse = await fetch(event.request);

    log('Calling network: ' + event.request.url);

    return networkResponse;


}




function getCacheName() {
    return "app-cache-" + VERSION;
}


function log(message, ...data) {
    if (data.length > 0) {
        console.log(VERSION, message, data);
    }
    else {
        console.log(VERSION, message);
    }
}

















