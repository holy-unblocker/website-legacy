import type { RouteType } from './src/appRoutes.js';
import { getRoutes } from './src/appRoutes.js';
import { stompPath } from '@sysce/stomp';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import react from '@vitejs/plugin-react-swc';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import svgr from 'vite-plugin-svgr';

process.env.VITE_PUBLIC_PATH ??= '';

const require = createRequire(import.meta.url);

const routes = getRoutes(
	process.env.VITE_ROUTER as RouteType,
	process.env.VITE_PUBLIC_PATH
);

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		sourcemap: true,
		rollupOptions: {
			plugins: [
				{
					name: 'copy index.html to all the hot routes',
					async generateBundle(options, bundle) {
						const index = bundle['index.html'];

						for (const file of routes)
							bundle[file.file] = {
								...index,
								fileName: file.file,
							};
					},
				},
			],
		},
	},
	plugins: [
		{
			name: 'serve index.html for all the hot routes',
			configureServer(server) {
				server.middlewares.use((req, _res, next) => {
					let url = req.url;
					const search = url.indexOf('?');
					if (search !== -1) url = url.slice(0, search);
					if (routes.some((route) => route.path === url))
						req.url = '/index.html';
					next();
				});
			},
		},
		react(),
		svgr(),
		viteStaticCopy({
			targets: [
				{
					src: uvPath,
					dest: '',
					rename: 'uv',
					overwrite: false,
				},
				{
					src: stompPath,
					dest: '',
					rename: 'stomp',
				},
				{
					src: resolve(require.resolve('@ruffle-rs/ruffle'), '..'),
					dest: '',
					rename: 'ruffle',
				},
			],
		}),
	],
});
