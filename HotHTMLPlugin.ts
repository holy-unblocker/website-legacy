import type { Hot } from './src/appRoutes.js';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { extname } from 'node:path';
import webpack from 'webpack';
import type { Compilation, Compiler, WebpackPluginInstance } from 'webpack';

type FindFileCallback = (outputName: string) => Hot | void;

/**
 * Locates the compiled paths of nested chunks for individual hot routes and includes them in the HTML asset tags.
 */
export default class HotHTMLPlugin implements WebpackPluginInstance {
	findFile: FindFileCallback;
	constructor(findFile: FindFileCallback) {
		this.findFile = findFile;
	}
	apply(compiler: Compiler) {
		compiler.hooks.thisCompilation.tap(
			'HotHTML',
			(compilation: Compilation) => {
				compilation.hooks.processAssets.tap(
					{
						name: 'HotHTML',
						stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
					},
					() => {
						const stats = compilation.getStats().toJson();

						HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tap(
							'HotHTML',
							(data) => {
								const hot = this.findFile(data.outputName);
								if (!hot) return data;

								type ChunkID = string | number;

								const chunkIDs = new Map<string, ChunkID[]>();

								for (const chunk of stats.chunks!) {
									const origin = chunk.origins![0].request;
									const pattern =
										origin && !chunk.entry
											? origin === hot.src
												? hot.path
												: undefined
											: '*';

									if (pattern)
										chunkIDs.set(chunk.id as string, [
											chunk.id!,
											...chunk.siblings!,
										]);
								}

								const assets: string[] = [];

								for (const [, page] of chunkIDs) {
									for (const chunk of stats.chunks!) {
										if (!page.includes(chunk.id!)) continue;

										for (const asset of chunk.files!)
											if (!assets.includes(asset)) assets.push(asset);

										for (const module of chunk.modules!)
											for (const asset of module.assets!)
												if (!assets.includes(asset as string))
													assets.push(asset as string);
									}
								}

								// reset assets, by default the main bundle is injected
								// we don't do anything beyond correcting styles and scripts
								// html-webpack-plugin can catch a manifest or favicon we missed

								data.assetTags.styles.length = 0;
								data.assetTags.scripts.length = 0;

								for (const asset of assets.reverse()) {
									const abs = data.publicPath + asset;

									switch (extname(asset)) {
										case '.js':
											data.assetTags.scripts.push({
												tagName: 'script',
												attributes: {
													src: abs,
													defer: true,
												},
												meta: {},
												voidTag: false,
											});
											break;
										case '.css':
											data.assetTags.styles.push({
												tagName: 'link',
												attributes: {
													rel: 'stylesheet',
													href: abs,
												},
												meta: {},
												voidTag: true,
											});
											break;
									}
								}

								return data;
							}
						);
					}
				);
			}
		);
	}
}
