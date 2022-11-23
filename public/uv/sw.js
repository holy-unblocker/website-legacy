/* eslint-disable no-undef */
importScripts('uv.bundle.js');
importScripts('uv.config.js');
importScripts('uv.sw.js');
const sw = new UVServiceWorker();

globalThis.addEventListener('fetch', (event) => {
	event.respondWith(sw.fetch(event));
});
