import { hotRoutes } from './src/routes.js';
import type { Compiler } from 'webpack';
import webpack from 'webpack';

export default class RouterPlugin {
	apply(compiler: Compiler) {
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

						const files = ['404.html'];

						for (const hot of hotRoutes) files.push(hot.file);

						for (const file of files) assets[file] = index;
					}
				);
			}
		);
	}
}
