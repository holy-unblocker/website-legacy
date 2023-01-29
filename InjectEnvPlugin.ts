import { envRaw } from './env.js';
import webpack from 'webpack';
import type {
	Compiler,
	Compilation,
	AssetInfo,
	WebpackPluginInstance,
} from 'webpack';

export default class InjectEnvPlugin implements WebpackPluginInstance {
	private injectAssets: string[];
	constructor(injectAssets: string[]) {
		this.injectAssets = injectAssets;
	}
	apply(compiler: Compiler) {
		compiler.hooks.compilation.tap(
			'InjectEnvPlugin',
			(compilation: Compilation) => {
				compilation.hooks.processAssets.tap(
					{
						name: 'InjectEnvPlugin',
						stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
					},
					(assets: AssetInfo) => {
						for (const injectAsset of this.injectAssets) {
							const assetInfo = assets[injectAsset];

							if (!assetInfo) continue;

							const content = assetInfo.buffer().toString();

							assets[injectAsset] = new webpack.sources.RawSource(
								content.replace(
									/process\.env\.(\w+)/g,
									(match: string, target: string) =>
										target in envRaw
											? JSON.stringify(envRaw[target])
											: 'undefined'
								)
							);
						}
					}
				);
			}
		);
	}
}
