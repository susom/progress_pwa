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
import { RangeRequestsPlugin } from 'workbox-range-requests';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Your service worker needs to import dexie and you should declare your db within the service worker itself or in a script that it will import.
// You can also use es6 imports and compile the service worker using webpack but in any case the db instance has to live within the service worker. You can also have another db instance in the DOM that talks to the same DB.
import { db_audios } from "./database/db"

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA


// This will filter out all manifest entries with URLs ending in .m4a
// Adjust the criteria as needed.
//https://stackoverflow.com/questions/67118051/filtering-out-assets-from-precaching-in-create-react-app
// const filteredManifest = self.__WB_MANIFEST;
const filteredManifest = self.__WB_MANIFEST.filter((entry) => {
  return !entry.url.endsWith('.m4a');
});
precacheAndRoute(filteredManifest);

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

// All new code beyond this point

/**
 * 
 * @param {*} fetchResponse response from fetch
 * @param {*} fileName Title
 */
async function cacheSuccessfulResponse(fetchResponse, fileName) {
  let clone = fetchResponse.clone()
  const data_clone = await clone.arrayBuffer();

  const audio = {
    title: fileName,
    data: data_clone
  };
  console.log('caching data...', audio)
  db_audios.files.put(audio);
}

/**
 * 
 * @param {*} request event request
 * @param {*} arrayBuffer audio buffer
 * @returns response: 206 | 416
 */
async function parseArrayBuffer(request, arrayBuffer) {
  const bytes = /^bytes\=(\d+)\-(\d+)?$/g.exec(
    request.headers.get('range')
  );
  if (bytes) {
    const start = Number(bytes[1]);
    const end = Number(bytes[2]) || arrayBuffer.byteLength - 1;
    console.log(`Returning bytes ${start} - ${end}`)
    return new Response(arrayBuffer.slice(start, end + 1), {
      status: 206,
      statusText: 'Partial Content',
      headers: [
        ['Content-Range', `bytes ${start}-${end}/${arrayBuffer.byteLength}`]
      ]
    });
  } else {
    return new Response(null, {
      status: 416,
      statusText: 'Range Not Satisfiable',
      headers: [['Content-Range', `*/${arrayBuffer.byteLength}`]]
    });
  }
}

/**
 * 
 * @param {*} request event request
 * @param {*} fileName Title of file
 * @returns http response
 */
async function returnRangeRequest(request, fileName) {
  console.log('Request has been made with a range request', request);
  let audioRecord = await db_audios.files.where({ title: fileName }).first(); // Attempt to fetch audio from cache

  if (!audioRecord) { //Network operating
    console.log(`${fileName} not found in cache, fetching...`);
    const fetchResponse = await fetch(request)

    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch data from URL: ${request}`);
    } else {
      cacheSuccessfulResponse(fetchResponse, fileName);
    }

    const arrayBuffer = await fetchResponse.arrayBuffer()
    return parseArrayBuffer(request, arrayBuffer);

  } else {
    console.log(`Cache HIT ${fileName}`);
    return parseArrayBuffer(request, audioRecord.data);
  }

}


/**
 * 
 * @param {*} request event request
 * @param {*} fileName Title of file
 * @returns http response
 */
async function returnFromCacheOrFetch(request, fileName) {
  console.log('Request has been made without a range request', request)
  let audioRecord = await db_audios.files.where({ title: fileName }).first();

  if (!audioRecord) { //Network operating
    console.log(`Cache not found for ${fileName}`);

    const fetchResponse = await fetch(request)
    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch data from URL: ${request}`);
    } else {
      cacheSuccessfulResponse(fetchResponse, fileName);
    }

    return fetchResponse;

  } else {
    console.log('Cache hit!')
    var headers = {
      'Content-Type': 'audio/mpeg',
      'Accept-Ranges': 'bytes',
      'Content-Length': audioRecord.data.size
    };

    return new Response(audioRecord.data, {
      status: 200,
      headers: headers
    });

  }
}

// On each network request
self.addEventListener('fetch', function (event) {
  const url = new URL(event.request.url);
  const fileName = url.pathname.split('/').pop();

  if (fileName.endsWith(".m4a")) { //If audiofile is requested
    if (event.request.headers.get('range')) { //If range headers are present in the request (Safari)
      event.respondWith(returnRangeRequest(event.request, fileName))
    } else {
      event.respondWith(returnFromCacheOrFetch(event.request, fileName))
    }
  } else { //Otherwise serve regularly (intercepted by precache)
    event.respondWith(fetch(event.request));
    // console.log('precache')
  }
});

//Fires first upon every service worker installation 
self.addEventListener('install', function (event) {
  // const url       = new URL(event.request.url);
  // const fileName  = url.pathname.split('/').pop();
  event.waitUntil(
    Promise.all([
      fetch('/static/media/R01_Beth_wBeats.4fcd5f87321d58e6cbc5.m4a'), //make a network request to fetch audio
      fetch('/static/media/Audio_short.10c2e3048c4bd646040f.m4a'),
      fetch('/static/media/binaural_spanish_20m.aa26669a73d3bc993b9b.m4a')
  ]).then( async ([res, res2, res3]) => {
      if (!res.ok || !res2.ok || !res3.ok) {
        throw new TypeError("bad response status");
      }
      let cloneLong = res.clone()
      let cloneShort = res2.clone()
      let cloneSpanish= res3.clone()
      
      return [await cloneLong.arrayBuffer(), await cloneShort.arrayBuffer(), await cloneSpanish.arrayBuffer()]
    })
    .then( async buffers => { //store full audiofile buffer in indexDB
      const audio = {
        title: 'R01_Beth_wBeats.4fcd5f87321d58e6cbc5.m4a',
        data: buffers[0]
      }
      const audio2 = {
        title: 'Audio_short.10c2e3048c4bd646040f.m4a',
        data: buffers[1]
      }
      const audio3 = {
        title: 'binaural_spanish_20m.aa26669a73d3bc993b9b.m4a',
        data: buffers[2]
      }

      console.log('Performing initial cache of full audio files', audio, audio2, audio3)
      // db_audios.files.put(audio)
      // db_audios.files.put(audio2)
      return await db_audios.files.bulkPut([audio,audio2, audio3])
    })
  );
  
})


