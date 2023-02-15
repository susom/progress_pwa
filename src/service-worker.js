/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import {RangeRequestsPlugin} from 'workbox-range-requests';
import {CacheableResponsePlugin} from 'workbox-cacheable-response';

// Your service worker needs to import dexie and you should declare your db within the service worker itself or in a script that it will import.
// You can also use es6 imports and compile the service worker using webpack but in any case the db instance has to live within the service worker. You can also have another db instance in the DOM that talks to the same DB.
import { db_audios } from "./database/db"

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA

precacheAndRoute(self.__WB_MANIFEST);

// This will filter out all manifest entries with URLs ending in .jpg
// Adjust the criteria as needed.
//https://stackoverflow.com/questions/67118051/filtering-out-assets-from-precaching-in-create-react-app
// const filteredManifest = self.__WB_MANIFEST.filter((entry) => {
//     return !entry.url.endsWith('.m4a');
// });
// precacheAndRoute(filteredManifest);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false;
    } // If this is a URL that starts with /_, skip.

    if (url.pathname.startsWith('/_')) {
      return false;
    } // If this looks like a URL for a resource, because it contains // a file extension, skip.

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    } // Return true to signal that we want to use the handler.

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'), // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
        // Ensure that once this runtime cache reaches a maximum size the
        // least-recently used images are removed.
        new ExpirationPlugin({ maxEntries: 100 }),
        // Only requests that return with a 200 status are cached
        new CacheableResponsePlugin({
            statuses: [200],
        }),
    ],
  })
);
console.log("man this blackbox");
registerRoute(
    /.*\.m4a/,
    new CacheFirst({
        cacheName: 'audios',
        plugins: [
            new CacheableResponsePlugin({statuses: [200]}),
            new RangeRequestsPlugin(),
        ],
    }),
);

//TODO REFACTOR TO GENERALIZE , BUT THIS WORKS FOR NOW
// async function fetchCacheAudio(url, title){
//     try {
//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error(`Failed to fetch data from URL: ${url}`);
//         }
//
//         const data = await response.blob();
//
//         //has data! , stuff it in IndexDB
//         const audio = {
//             title: title,
//             data: data
//         };
//         db_audios.files.put(audio);
//
//         console.log("4a inside the network fetch to get m4a file, return the blob", data);
//
//         return data;
//     } catch (error) {
//         console.error(error);
//     }
// }
// async function getAudioFileByTitle(title, event) {
//     const audioRecord = await db_audios.files.where({ title: title }).first();
//     console.log("2 inside getAudioFileByTitle check indexDb for file", audioRecord);
//
//     if(!audioRecord){
//         console.log("3 none found, so fetch from network");
//         let audioBlob = await fetchCacheAudio(event.request, title);
//
//         console.log("4b fetched data , cached in indexDB, returning the blob itself", audioBlob);
//         const filesize = audioBlob.size;
//         return new Response(audioBlob, {
//             headers: {
//                 "Content-Type": "audio/x-m4a"
//                 ,"Content-Length" :  filesize
//                 ,"Accept-Ranges" : "bytes"
//                 ,"Cache-Control" : "public, max-age=31536000"
//             }
//         });
//     }else{
//         console.log("3 & 4 found in INDEXDB!!", title, audioRecord.data);
//         const filesize = audioRecord.data.size;
//         return new Response(audioRecord.data, {
//             headers: {
//                 "Content-Type": "audio/x-m4a"
//                 ,"Content-Length" : filesize
//                 ,"Accept-Ranges" : "bytes"
//                 ,"Cache-Control" : "public, max-age=31536000"
//             }
//         });
//     }
// }
//
// self.addEventListener('fetch', function(event) {
//     const url       = new URL(event.request.url);
//     const fileName  = url.pathname.split('/').pop();
//
//     if (fileName.endsWith(".m4a")) {
//         console.log("1 found fileName partial ends with m4a", fileName);
//         event.respondWith(
//             new Promise(async (resolve) => {
//                 let response = await getAudioFileByTitle(fileName, event);
//                 console.log("5 , should return a response object with proper headers", response.headers.get("Content-Type"), response.headers.get("Accept-Ranges"), response.headers.get("Cache-Control"), response.headers.get("Content-Length"));
//                 resolve(response);
//             })
//         );
//     }else{
//         event.respondWith(fetch(event.request));
//     }
// });

// Any other custom service worker logic can go here.
// var version = '2'
// registerRoute(
//   /.*\.m4a/,
//   cacheFirst({
//     cacheName: 'your-cache-name-here',
//     plugins: [
//       new workbox.cacheableResponse.Plugin({statuses: [200]}),
//       new workbox.rangeRequests.Plugin(),
//     ],
//   }),
// );
// registerRoute(
//   ({url, request, event}) => {
//     const {destination} = request;
//     console.log('url', url)
//     console.log('request', request)
//     console.log('event', event)
//     return destination === 'video' || destination === 'audio'
//   },
//   new CacheFirst({
//     cacheName: 'v1-cache-audio',
//     plugins: [
//       new CacheableResponsePlugin({
//         statuses: [200]
//       }),
//       new RangeRequestsPlugin(),
//     ],
//   }),
// );

// var version = 2;
// var staticCacheName = `cache-v${version}`
// self.addEventListener('fetch', function(event) {
//   var url = new URL(event.request.url);
//   if (url.pathname.match(/^\/((assets|images)\/|manifest.json$)/)) {
//     if (event.request.headers.get('range')) {
//       event.respondWith(returnRangeRequest(event.request, staticCacheName));
//     } else {
//       event.respondWith(returnFromCacheOrFetch(event.request, staticCacheName));
//     }
//   }
//   // other strategies
// });

// function returnRangeRequest(request, cacheName) {
//   return caches
//     .open(cacheName)
//     .then(function(cache) {
//       return cache.match(request.url);
//     })
//     .then(function(res) {
//       if (!res) {
//         return fetch(request)
//           .then(res => {
//             const clonedRes = res.clone();
//             return caches
//               .open(cacheName)
//               .then(cache => cache.put(request, clonedRes))
//               .then(() => res);
//           })
//           .then(res => {
//             return res.arrayBuffer();
//           });
//       }
//       return res.arrayBuffer();
//     })
//     .then(function(arrayBuffer) {
//       const bytes = /^bytes\=(\d+)\-(\d+)?$/g.exec(
//         request.headers.get('range')
//       );
//       if (bytes) {
//         const start = Number(bytes[1]);
//         const end = Number(bytes[2]) || arrayBuffer.byteLength - 1;
//         return new Response(arrayBuffer.slice(start, end + 1), {
//           status: 206,
//           statusText: 'Partial Content',
//           headers: [
//             ['Content-Range', `bytes ${start}-${end}/${arrayBuffer.byteLength}`]
//           ]
//         });
//       } else {
//         return new Response(null, {
//           status: 416,
//           statusText: 'Range Not Satisfiable',
//           headers: [['Content-Range', `*/${arrayBuffer.byteLength}`]]
//         });
//       }
//     });
// }