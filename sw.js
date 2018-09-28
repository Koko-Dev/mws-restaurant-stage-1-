var staticCacheName = 'restaurants-157';
var cacheURLs = [
  '/',
  '/index.html',
  '/js/main.js',
  '/css/styles2.css',
  '/restaurant.html',
  '/js/dbhelper.js',
  '/js/register.js',
  '/node_modules/idb/lib/idb.js',
  '/js/restaurant_info.js',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg',
  '/img/2x-1.jpg',
  '/img/2x-2.jpg',
  '/img/2x-3.jpg',
  '/img/2x-4.jpg',
  '/img/2x-5.jpg',
  '/img/2x-6.jpg',
  '/img/2x-7.jpg',
  '/img/2x-8.jpg',
  '/img/2x-9.jpg',
  '/img/2x-10.jpg'
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName)
          .then(cache => cache.addAll(cacheURLs))
          .then(() => self.skipWaiting())
  )
});

self.addEventListener('activate', event => {
  // console.log("[Service Worker] At Activate Event", event);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if(cacheName !== staticCacheName) {
            return caches.delete(cacheName);
          }
        })
      )
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  // console.log("[Service Worker] fetch event in SW");
  event.respondWith(
    caches.match(event.request)
          .then(response => {
            if(response) {
              // console.log('The event.request was found in the cache');
              return response;
            }
            return fetch(event.request).then(networkResponse => {
              if(networkResponse === 404) return;
              return caches.open(staticCacheName)
                           .then(cache => {
                             cache.put(event.request.url,  networkResponse.clone());
                             // console.log('The event.request was put in the cache');
                             return networkResponse;
                           })
            })
          })
          .catch(error => {
            console.log('Error in the fetch event: ', error);
            return;
          })
  )
});

/*self.addEventListener('message', event => {
  console.log(`[sw.js] message event: ${event}`);
  
  if(event.data.action === 'skipWaiting') {
    self.skipWaiting();
  } 
});

// Information on backgroundSync from https://ponyfoo.com/articles/backgroundsync

self.addEventListener('sync', event => {
  if(event.tag === 'submit-review') {
    
  }
})*/

// This works
/*self.addEventListener('sync', function(event) {
  if(event.tag === 'myFirstSync') {
    event.waitUntil(doSomeStuff())
  }
  
})

function doSomeStuff() {
  console.log('[SW] myFirstSync');
  
}*/

self.addEventListener('sync', function(event) {
  if(event.tag == 'oneTimeSync') {
    console.log('One time Sync event fired: ', self.registration);
    
  }
});




