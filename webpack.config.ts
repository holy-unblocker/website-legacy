import './env.js';
import RouterPlugin from './RouterPlugin.js';
import type { CSSLoaderOptions } from './css-loader.js';
import { envRaw, envRawHash, envRawStringified } from './env.js';
import type swcrcSchema from './swcrc.js';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import type { JsMinifyOptions } from '@swc/core';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import glob from 'glob';
import { stompPath, uvPath } from 'holy-dump';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { createRequire } from 'module';
import { relative, basename, resolve, join } from 'path';
import InlineChunkHtmlPlugin from 'react-dev-utils/InlineChunkHtmlPlugin.js';
import ModuleNotFoundPlugin from 'react-dev-utils/ModuleNotFoundPlugin.js';
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent.js';
import TerserPlugin from 'terser-webpack-plugin';
import { promisify } from 'util';
import type {
	Compiler,
	Compilation,
	AssetInfo,
	Configuration,
	RuleSetRule,
} from 'webpack';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';

const globA = promisify(glob);
// import BasicWebpackObfuscator from 'basic-webpack-obfuscator';

const require = createRequire(import.meta.url);

type ArrElement<ArrType> = ArrType extends readonly (infer ElementType)[]
	? ElementType
	: never;

type PluginEntry = ArrElement<Required<Configuration>['plugins']>;

declare module 'webpack' {
	interface Configuration {
		devServer?: WebpackDevServerConfiguration;
	}
}

const shouldLint = process.env.DISABLE_LINT !== 'true';

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

// Some apps do not need the benefits of saving a web request, so not inlining the chunk
// makes for a smoother build process.
const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false';

const emitErrorsAsWarnings = process.env.ESLINT_NO_DEV_ERRORS === 'true';

const imageInlineSizeLimit = parseInt(
	process.env.IMAGE_INLINE_SIZE_LIMIT || '10000'
);

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const isDevelopment = process.env.NODE_ENV !== 'production';

// Variable used for enabling profiling in Production
// passed into alias object. Uses a flag if passed into the build command
const isEnvProductionProfile =
	!isDevelopment && process.argv.includes('--profile');

const shouldUseReactRefresh = envRaw.FAST_REFRESH;

// common function to get style loaders
const getStyleLoaders = (
	cssOptions: CSSLoaderOptions,
	preProcessor?: string
) => {
	const loaders: (RuleSetRule | string | false)[] = [
		isDevelopment && 'style-loader',
		!isDevelopment && {
			loader: MiniCssExtractPlugin.loader,
			// css is located in `static/css`, use '../../' to locate index.html folder
			// in production `paths.publicUrlOrPath` can be a relative path
		},
		{
			loader: 'css-loader',
			options: cssOptions,
		},
		{
			// Options for PostCSS as we reference these options twice
			// Adds vendor prefixing based on your specified browser support in
			// package.json
			loader: 'postcss-loader',
			options: {
				postcssOptions: {
					// Necessary for external CSS imports to work
					// https://github.com/facebook/create-react-app/issues/2677
					ident: 'postcss',
					config: false,
					plugins: [
						'postcss-flexbugs-fixes',
						[
							'postcss-preset-env',
							{
								autoprefixer: {
									flexbox: 'no-2009',
								},
								stage: 3,
							},
						],
						// Adds PostCSS Normalize as the reset css with default options,
						// so that it honors browserslist config in package.json
						// which in turn let's users customize the target behavior as per their needs.
						'postcss-normalize',
					],
				},
				sourceMap: shouldUseSourceMap,
			},
		},
	].filter(Boolean);

	if (preProcessor) {
		loaders.push(
			{
				loader: 'resolve-url-loader',
				options: {
					sourceMap: shouldUseSourceMap,
					root: resolve('src'),
				},
			},
			{
				loader: preProcessor,
				options: {
					sourceMap: true,
				},
			}
		);
	}
	return loaders as (RuleSetRule | string)[];
};

const distPath = resolve('./dist/');

const copyPluginPatterns: {
	from: string;
	to?: string;
	filter?: CopyPlugin.Filter;
}[] = [
	{
		from: stompPath,
		to: 'stomp',
	},
	{
		from: uvPath,
		to: 'uv',
	},
	{
		from: './uv',
		to: 'uv',
	},
	{
		from: resolve('node_modules/@ruffle-rs/ruffle'),
		// don't filter licenses!
		filter: (file) => !['package.json', 'README.md'].includes(basename(file)),
		to: 'ruffle',
	},
	{
		from: './public',
		filter: (file) => file !== resolve('public/index.html'),
	},
];

// https://github.com/webpack-contrib/terser-webpack-plugin/issues/31
const terserPluginExclude: string[] = [];

// simulate CopyPlugin logic to resolve all output files
for (const pattern of copyPluginPatterns) {
	const fromRes = resolve(pattern.from);
	const toRes = resolve(
		distPath,
		typeof pattern.to === 'string'
			? pattern.to
			: relative(process.cwd(), fromRes)
	);

	for (const x of await globA(join(fromRes, '{*.mjs,*.js}'))) {
		const xRel = relative(fromRes, x);
		terserPluginExclude.push(relative(distPath, join(toRes, xRel)));
	}
}

const webpackConfig: Configuration = {
	target: ['browserslist'],
	devServer: {
		port: 3000,
		// https://webpack.js.org/configuration/dev-server/#devserverhistoryapifallback
		// to test our 404 pages
		historyApiFallback: true,
	},
	// Webpack noise constrained to errors and warnings
	// stats: 'errors-warnings',
	mode: isDevelopment ? 'development' : 'production',
	// Stop compilation early in production
	// bail: isEnvProduction,
	devtool: isDevelopment ? 'eval' : shouldUseSourceMap ? 'source-map' : false,
	// These are the "entry points" to our application.
	// This means they will be the "root" imports that are included in JS bundle.
	entry: './src/index.tsx',
	output: {
		// The build folder.
		path: distPath,
		// Add /* filename */ comments to generated require()s in the output.
		pathinfo: isDevelopment,
		// There will be one main bundle, and one file per asynchronous chunk.
		// In development, it does not produce real files.
		filename: isDevelopment
			? 'static/js/bundle.js'
			: 'static/js/[name].[contenthash:8].js',
		// There are also additional JS chunk files if you use code splitting.
		chunkFilename: isDevelopment
			? 'static/js/[name].chunk.js'
			: 'static/js/[name].[contenthash:8].chunk.js',
		assetModuleFilename: 'static/media/[name].[hash][ext]',
		// webpack uses `publicPath` to determine where the app is being served from.
		// It requires a trailing slash, or the file assets will get an incorrect path.
		// We inferred the "public path" (such as / or /my-project) from homepage.
		publicPath: '/',
	},
	cache: {
		type: 'filesystem',
		version: envRawHash,
		cacheDirectory: resolve('node_modules/.cache'),
		store: 'pack',
		buildDependencies: {
			defaultWebpack: ['webpack/lib/'],
			config: [resolve('webpack.config.ts')],
			tsconfig: [resolve('tsconfig.json')],
			routes: [resolve('src/routes.ts')],
		},
	},
	resolve: {
		// These are the reasonable defaults supported by the Node ecosystem.
		// We also include JSX as a common component filename extension to support
		// some tools, although we do not recommend using it, see:
		// https://github.com/facebook/create-react-app/issues/290
		// `web` extension prefixes have been added for better support
		// for React Native Web.
		extensions: ['.mjs', '.js', '.ts', '.tsx', '.json', '.jsx'],
		alias: {
			// Support React Native Web
			// https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
			'react-native': 'react-native-web',
			// Allows for better profiling with ReactDevTools
			...(isEnvProductionProfile && {
				'react-dom$': 'react-dom/profiling',
				'scheduler/tracing': 'scheduler/tracing-profiling',
			}),
		},
	},
	optimization: {
		minimize: !isDevelopment,
		minimizer: [
			new TerserPlugin<JsMinifyOptions>({
				minify: TerserPlugin.swcMinify,
				exclude: terserPluginExclude,
			}),
			new CssMinimizerPlugin(),
		],
	},
	module: {
		strictExportPresence: true,
		rules: [
			// Handle node_modules packages that contain sourcemaps
			shouldUseSourceMap && {
				enforce: 'pre',
				test: /\.(js|mjs|jsx|ts|tsx|css)$/,
				exclude: /@swc(?:\/|\\{1,2})helpers/,
				loader: 'source-map-loader',
			},
			{
				// "oneOf" will traverse all following loaders until one will
				// match the requirements. When no loader matches it will fall
				// back to the "file" loader at the end of the loader list.
				oneOf: [
					// "url" loader works like "file" loader except that it embeds assets
					// smaller than specified limit in bytes as data URLs to avoid requests.
					// A missing `test` is equivalent to a match.
					{
						test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.avif$/],
						type: 'asset',
						parser: {
							dataUrlCondition: {
								maxSize: imageInlineSizeLimit,
							},
						},
					},
					{
						test: /\.svg$/,
						use: [
							{
								loader: '@svgr/webpack',
								options: {
									prettier: false,
									svgo: false,
									svgoConfig: {
										plugins: [{ removeViewBox: false }],
									},
									titleProp: true,
									ref: true,
								},
							},
							{
								loader: 'file-loader',
								options: {
									name: 'static/media/[name].[hash].[ext]',
								},
							},
						],
						issuer: {
							and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
						},
					},
					// Process application JS with SWC.
					// The preset includes JSX, Flow, TypeScript, and some ESnext features.
					{
						test: /\.[mc]?[jt]sx?$/,
						include: resolve('src'),
						loader: 'swc-loader',
						options: {
							sourceMaps: shouldUseSourceMap,
							minify: !isDevelopment,
							jsc: {
								parser: {
									syntax: 'typescript',
									tsx: true,
									decorators: false,
									dynamicImport: true,
								},
								transform: {
									react: {
										runtime: 'automatic',
									},
								},
								target: 'es2015',
								externalHelpers: true,
							},
						} as swcrcSchema,
					},
					// Process any JS outside of the app with SWC.
					// Unlike the application JS, we only compile the standard ES features.
					{
						test: /\.(js|mjs)$/,
						exclude: /@swc(?:\/|\\{1,2})helpers/,
						loader: 'swc-loader',
						options: {
							minify: !isDevelopment,
							sourceMaps: shouldUseSourceMap,
							jsc: {
								target: 'es2015',
								externalHelpers: true,
							},
						} as swcrcSchema,
					},
					// "postcss" loader applies autoprefixer to our CSS.
					// "css" loader resolves paths in CSS and adds assets as dependencies.
					// "style" loader turns CSS into JS modules that inject <style> tags.
					// In production, we use MiniCSSExtractPlugin to extract that CSS
					// to a file, but in development "style" loader enables hot editing
					// of CSS.
					// By default we support CSS Modules with the extension .module.css
					{
						test: cssRegex,
						exclude: cssModuleRegex,
						use: getStyleLoaders({
							importLoaders: 1,
							sourceMap: shouldUseSourceMap,
							modules: {
								mode: 'icss',
							},
						}),
						// Don't consider CSS imports dead code even if the
						// containing package claims to have no side effects.
						// Remove this when webpack adds a warning or an error for this.
						// See https://github.com/webpack/webpack/issues/6571
						sideEffects: true,
					},
					// Adds support for CSS Modules (https://github.com/css-modules/css-modules)
					// using the extension .module.css
					{
						test: cssModuleRegex,
						use: getStyleLoaders({
							importLoaders: 1,
							sourceMap: shouldUseSourceMap,
							modules: {
								mode: 'local',
								getLocalIdent: getCSSModuleLocalIdent,
							},
						}),
					},
					// Opt-in support for SASS (using .scss or .sass extensions).
					// By default we support SASS Modules with the
					// extensions .module.scss or .module.sass
					{
						test: sassRegex,
						exclude: sassModuleRegex,
						use: getStyleLoaders(
							{
								importLoaders: 3,
								sourceMap: shouldUseSourceMap,
								modules: {
									mode: 'icss',
								},
							},
							'sass-loader'
						),
						// Don't consider CSS imports dead code even if the
						// containing package claims to have no side effects.
						// Remove this when webpack adds a warning or an error for this.
						// See https://github.com/webpack/webpack/issues/6571
						sideEffects: true,
					},
					// Adds support for CSS Modules, but using SASS
					// using the extension .module.scss or .module.sass
					{
						test: sassModuleRegex,
						use: getStyleLoaders(
							{
								importLoaders: 3,
								sourceMap: shouldUseSourceMap,
								modules: {
									mode: 'local',
									getLocalIdent: getCSSModuleLocalIdent,
								},
							},
							'sass-loader'
						),
					},
					// "file" loader makes sure those assets get served by WebpackDevServer.
					// When you `import` an asset, you get its (virtual) filename.
					// In production, they would get copied to the `build` folder.
					// This loader doesn't use a "test" so it will catch all modules
					// that fall through the other loaders.
					{
						// Exclude `js` files to keep "css" loader working as it injects
						// its runtime that would otherwise be processed through "file" loader.
						// Also exclude `html` and `json` extensions so they get processed
						// by webpacks internal loaders.
						exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
						type: 'asset/resource',
					},
					// ** STOP ** Are you adding a new loader?
					// Make sure to add the new loader(s) before the "file" loader.
				],
			},
		].filter(Boolean) as RuleSetRule[],
	},
	plugins: (
		[
			new CleanWebpackPlugin(),
			new CopyPlugin({
				patterns: copyPluginPatterns,
			}),
			// Inlines the webpack runtime script. This script is too small to warrant
			// a network request.
			// https://github.com/facebook/create-react-app/issues/5358
			!isDevelopment &&
				shouldInlineRuntimeChunk &&
				new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
			// Generates an `index.html` file with the <script> injected.
			new HtmlWebpackPlugin({
				inject: true,
				template: resolve('public/index.html'),
				...(isDevelopment
					? {}
					: {
							minify: {
								removeComments: true,
								collapseWhitespace: true,
								removeRedundantAttributes: true,
								useShortDoctype: true,
								removeEmptyAttributes: true,
								removeStyleLinkTypeAttributes: true,
								keepClosingSlash: true,
								minifyJS: true,
								minifyCSS: true,
								minifyURLs: true,
							},
					  }),
			}),
			// This gives some necessary context to module not found errors, such as
			// the requesting resource.
			new ModuleNotFoundPlugin(resolve('.')),
			// Makes some environment variables available to the JS code, for example:
			// if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
			// It is absolutely essential that NODE_ENV is set to production
			// during a production build.
			// Otherwise React will be compiled in the very slow development mode.
			// new webpack.DefinePlugin(env.stringified),
			new webpack.DefinePlugin({
				'process.env': envRawStringified,
			}),
			// Experimental hot reloading for React .
			// https://github.com/facebook/react/tree/main/packages/react-refresh
			isDevelopment &&
				shouldUseReactRefresh &&
				new ReactRefreshWebpackPlugin({
					overlay: false,
				}),
			// Watcher doesn't work well if you mistype casing in a path so we use
			// a plugin that prints an error when you attempt to do this.
			// See https://github.com/facebook/create-react-app/issues/240
			isDevelopment && new CaseSensitivePathsPlugin(),
			!isDevelopment &&
				new MiniCssExtractPlugin({
					// Options similar to the same options in webpackOptions.output
					// both options are optional
					filename: 'static/css/[name].[contenthash:8].css',
					chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
				}),
			// Generate an asset manifest file with the following content:
			// - "files" key: Mapping of all asset filenames to their corresponding
			//   output file so that tools can pick it up without having to parse
			//   `index.html`
			// - "entrypoints" key: Array of files which are included in `index.html`,
			//   can be used to reconstruct the HTML if necessary
			new WebpackManifestPlugin({
				fileName: 'asset-manifest.json',
				publicPath: '/',
				generate: (seed, files, entrypoints) => {
					const manifestFiles = files.reduce((manifest, file) => {
						manifest[file.name] = file.path;
						return manifest;
					}, seed);
					const entrypointFiles = entrypoints.main.filter(
						(fileName) => !fileName.endsWith('.map')
					);

					return {
						files: manifestFiles,
						entrypoints: entrypointFiles,
					};
				},
			}),
			// Moment.js is an extremely popular library that bundles large locale files
			// by default due to how webpack interprets its code. This is a practical
			// solution that requires the user to opt into importing specific locales.
			// https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
			// You can remove this if you don't use Moment.js:
			new webpack.IgnorePlugin({
				resourceRegExp: /^\.\/locale$/,
			}),
			process.env.WEBPACK_BUNDLE_ANALYZER === 'true' &&
				new BundleAnalyzerPlugin({
					analyzerMode: 'static',
				}),
			shouldLint && new ForkTsCheckerWebpackPlugin(),
			shouldLint &&
				new ESLintPlugin({
					// Plugin options
					extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
					formatter: require.resolve('react-dev-utils/eslintFormatter'),
					eslintPath: 'eslint',
					failOnError: !(isDevelopment && emitErrorsAsWarnings),
					cache: true,
					cacheLocation: resolve('node_modules/.cache/.eslintcache'),
				}),
			{
				apply: (compiler: Compiler) => {
					compiler.hooks.compilation.tap(
						'DefineUV',
						(compilation: Compilation) => {
							compilation.hooks.processAssets.tap(
								{
									name: 'DefineUV',
									stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
								},
								(assets: AssetInfo) => {
									const config = assets['uv/uv.config.js'];

									if (!config) return;

									const content = config.buffer().toString();

									assets['uv/uv.config.js'] = new webpack.sources.RawSource(
										content.replace(
											/process\.env\.(\w+)/g,
											(match: string, target: string) =>
												target in envRaw
													? JSON.stringify(envRaw[target])
													: 'undefined'
										)
									);
								}
							);
						}
					);
				},
			},
			/*!isDevelopment &&
				new BasicWebpackObfuscator({
					sourceMap: shouldUseSourceMap,
				}),*/
			new RouterPlugin(),
		] as (PluginEntry | false)[]
	).filter(Boolean) as PluginEntry[],
	// Turn off performance processing because we utilize
	// our own hints via the FileSizeReporter
	performance: false,
};

export default webpackConfig;
