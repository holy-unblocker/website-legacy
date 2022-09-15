/* eslint-disable no-undef */
importScripts('/uv/uv.bundle.js');
importScripts('/uv/uv.config.js');
importScripts('/uv/uv.sw.js');
const sw = new UVServiceWorker();

globalThis.addEventListener('fetch', (event) => {
	event.respondWith(sw.fetch(event));
});
