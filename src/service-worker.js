/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

import { db_audios } from "./database/db"

clientsClaim();

// Safari requires range request support for audio seeking/scrubbing, which
// workbox precaching doesn't handle. Audio files are excluded from the precache
// manifest and instead manually fetched and stored in IndexedDB on install.
// The fetch handler below serves them with proper range request support.
const isAudioFile = (url) => url.endsWith('.m4a') || url.endsWith('.mp3');

const manifest = self.__WB_MANIFEST;
const audioManifestEntries = manifest.filter(entry => isAudioFile(entry.url));
const filteredManifest = manifest.filter(entry => !isAudioFile(entry.url));
precacheAndRoute(filteredManifest);

const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  ({ request, url }) => {
    if (request.mode !== 'navigate') {
      return false;
    }
    if (url.pathname.startsWith('/_')) {
      return false;
    }
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'),
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({ maxEntries: 100 }),
      new CacheableResponsePlugin({ statuses: [200] }),
    ],
  })
);

async function cacheSuccessfulResponse(fetchResponse, fileName) {
  const data = await fetchResponse.clone().arrayBuffer();
  db_audios.files.put({ title: fileName, data });
}

async function parseArrayBuffer(request, arrayBuffer) {
  const bytes = /^bytes\=(\d+)\-(\d+)?$/g.exec(request.headers.get('range'));
  if (bytes) {
    const start = Number(bytes[1]);
    const end = Number(bytes[2]) || arrayBuffer.byteLength - 1;
    return new Response(arrayBuffer.slice(start, end + 1), {
      status: 206,
      statusText: 'Partial Content',
      headers: [['Content-Range', `bytes ${start}-${end}/${arrayBuffer.byteLength}`]]
    });
  } else {
    return new Response(null, {
      status: 416,
      statusText: 'Range Not Satisfiable',
      headers: [['Content-Range', `*/${arrayBuffer.byteLength}`]]
    });
  }
}

async function returnRangeRequest(request, fileName) {
  let audioRecord = await db_audios.files.where({ title: fileName }).first();

  if (!audioRecord) {
    const fetchResponse = await fetch(request);
    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch: ${request.url}`);
    }
    cacheSuccessfulResponse(fetchResponse, fileName);
    const arrayBuffer = await fetchResponse.arrayBuffer();
    return parseArrayBuffer(request, arrayBuffer);
  } else {
    return parseArrayBuffer(request, audioRecord.data);
  }
}

async function returnFromCacheOrFetch(request, fileName) {
  let audioRecord = await db_audios.files.where({ title: fileName }).first();

  if (!audioRecord) {
    const fetchResponse = await fetch(request);
    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch: ${request.url}`);
    }
    cacheSuccessfulResponse(fetchResponse, fileName);
    return fetchResponse;
  } else {
    return new Response(audioRecord.data, {
      status: 200,
      headers: {
        'Content-Type': fileName.endsWith('.mp3') ? 'audio/mpeg' : 'audio/mp4',
        'Accept-Ranges': 'bytes',
        'Content-Length': audioRecord.data.byteLength,
      }
    });
  }
}

self.addEventListener('fetch', function (event) {
  const url = new URL(event.request.url);
  const fileName = url.pathname.split('/').pop();

  if (isAudioFile(fileName)) {
    if (event.request.headers.get('range')) { // Safari sends range headers for audio
      event.respondWith(returnRangeRequest(event.request, fileName));
    } else {
      event.respondWith(returnFromCacheOrFetch(event.request, fileName));
    }
  } else {
    event.respondWith(fetch(event.request));
  }
});

// On install, fetch all audio files and store in IndexedDB.
// URLs are pulled from the build manifest so hashes are always current.
self.addEventListener('install', function (event) {
  const audioUrls = audioManifestEntries.map(entry => entry.url);
  event.waitUntil(
    Promise.all(audioUrls.map(url => fetch(url)))
      .then(async responses => {
        if (responses.some(res => !res.ok)) {
          throw new TypeError("Failed to pre-cache audio files");
        }
        const buffers = await Promise.all(responses.map(res => res.clone().arrayBuffer()));
        const audioFiles = audioUrls.map((url, i) => ({
          title: url.split('/').pop(),
          data: buffers[i]
        }));
        return await db_audios.files.bulkPut(audioFiles);
      })
  );
});
