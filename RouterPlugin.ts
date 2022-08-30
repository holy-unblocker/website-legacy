import routes from './src/routes.js';
import path from 'path';
import webpack from 'webpack';

function pathsID() {
	/**
	 * @type {string[]}
	 */
	const paths = [];

	for (const dirI in routes) {
		const { dir, pages } = routes[dirI];
		const dirName = dir === '/' ? '' : dirI;

		for (const pageI in pages) {
			// const page = pages[pageI];
			const pageName = pages[pageI] === '' ? 'index.html' : `${pageI}.html`;
			const pageAbs = path.join(dirName, pageName);

			paths.push(pageAbs);
		}
	}

	return paths;
}

function filesID() {
	/**
	 * @type {string[]}
	 */
	const paths = [];

	for (const { dir, pages } of routes) {
		const dirName = dir;

		for (const page of pages) {
			const pageName = page === '' ? 'index.html' : `${page}.html`;
			const pageAbs = path.join(dirName, pageName);

			paths.push(pageAbs);
		}
	}

	return paths;
}

export default class HolyUnblockerRouterPlugin {
	/**
	 *
	 * @param {import('webpack').Compiler} compiler
	 */
	apply(compiler) {
		compiler.hooks.compilation.tap(
			'HolyUnblockerRouterPlugin',
			(compilation) => {
				compilation.hooks.processAssets.tap(
					{
						name: 'HolyUnblockerRouterPlugin',
						stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
					},
					(assets) => {
						const index = assets['index.html'];

						if (!index) return;

						for (const file of [
							'404.html',
							...(process.env.REACT_APP_ROUTER === 'id'
								? pathsID()
								: filesID()),
						])
							assets[file] = index;
					}
				);
			}
		);
	}
}
