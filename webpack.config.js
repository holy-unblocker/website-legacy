import HolyUnblockerRouterPlugin from './router.js';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import BasicWebpackObfuscator from 'basic-webpack-obfuscator';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { createHash } from 'crypto';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { expand } from 'dotenv-expand';
import { config } from 'dotenv-flow';
import ESLintPlugin from 'eslint-webpack-plugin';
import { stompPath, rufflePath, uvPath } from 'holy-dump';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import InlineChunkHtmlPlugin from 'react-dev-utils/InlineChunkHtmlPlugin.js';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin.js';
import ModuleNotFoundPlugin from 'react-dev-utils/ModuleNotFoundPlugin.js';
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent.js';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';

if (!process.env.NODE_ENV)
	throw new Error(
		'The NODE_ENV environment variable is required but was not specified.'
	);

expand(config());

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

// Some apps do not need the benefits of saving a web request, so not inlining the chunk
// makes for a smoother build process.
const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false';

const emitErrorsAsWarnings = process.env.ESLINT_NO_DEV_ERRORS === 'true';

const imageInlineSizeLimit = parseInt(
	process.env.IMAGE_INLINE_SIZE_LIMIT || '10000'
);

const moduleFileExtensions = [
	'web.mjs',
	'mjs',
	'web.js',
	'js',
	'web.ts',
	'ts',
	'web.tsx',
	'tsx',
	'json',
	'web.jsx',
	'jsx',
];

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const isEnvProduction = process.env.NODE_ENV === 'production';

// Variable used for enabling profiling in Production
// passed into alias object. Uses a flag if passed into the build command
const isEnvProductionProfile =
	isEnvProduction && process.argv.includes('--profile');

// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in webpack configuration.
const REACT_APP = /^REACT_APP_/i;

const envRaw = Object.keys(process.env)
	.filter((key) => REACT_APP.test(key))
	.reduce(
		(env, key) => {
			env[key] = process.env[key];
			return env;
		},
		{
			// Useful for determining whether we’re running in production mode.
			// Most importantly, it switches React into the correct mode.
			NODE_ENV: process.env.NODE_ENV || 'development',
			// Useful for resolving the correct path to static assets in `public`.
			// For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
			// This should only be used as an escape hatch. Normally you would put
			// images into the `src` and `import` them in code to get their paths.
			PUBLIC_URL: '/',
			// We support configuring the sockjs pathname during development.
			// These settings let a developer run multiple simultaneous projects.
			// They are used as the connection `hostname`, `pathname` and `port`
			// in webpackHotDevClient. They are used as the `sockHost`, `sockPath`
			// and `sockPort` options in webpack-dev-server.
			WDS_SOCKET_HOST: process.env.WDS_SOCKET_HOST,
			WDS_SOCKET_PATH: process.env.WDS_SOCKET_PATH,
			WDS_SOCKET_PORT: process.env.WDS_SOCKET_PORT,
			// Whether or not react-refresh is enabled.
			// It is defined here so it is available in the webpackHotDevClient.
			FAST_REFRESH: process.env.FAST_REFRESH !== 'false',
		}
	);

const envHash = createHash('md5');
envHash.update(JSON.stringify(envRaw));

const envRawHash = envHash.digest('hex');

const shouldUseReactRefresh = envRaw.FAST_REFRESH;

// common function to get style loaders
const getStyleLoaders = (cssOptions, preProcessor) => {
	const loaders = [
		!isEnvProduction && 'style-loader',
		isEnvProduction && {
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
				sourceMap: isEnvProduction ? shouldUseSourceMap : true,
			},
		},
	].filter(Boolean);

	if (preProcessor) {
		loaders.push(
			{
				loader: 'resolve-url-loader',
				options: {
					sourceMap: isEnvProduction ? shouldUseSourceMap : !isEnvProduction,
					root: path.resolve('src'),
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
	return loaders;
};

/**
 * @type {import('webpack').Configuration}
 */
const webpackConfig = {
	target: ['browserslist'],
	devServer: {
		port: 3000,
		hot: false,
	},
	// Webpack noise constrained to errors and warnings
	// stats: 'errors-warnings',
	mode: isEnvProduction ? 'production' : 'development',
	// Stop compilation early in production
	// bail: isEnvProduction,
	devtool: isEnvProduction
		? shouldUseSourceMap
			? 'source-map'
			: false
		: 'eval',
	// These are the "entry points" to our application.
	// This means they will be the "root" imports that are included in JS bundle.
	entry: './src/index.tsx',
	output: {
		// The build folder.
		path: path.resolve('./build/'),
		// Add /* filename */ comments to generated require()s in the output.
		pathinfo: !isEnvProduction,
		// There will be one main bundle, and one file per asynchronous chunk.
		// In development, it does not produce real files.
		filename: isEnvProduction
			? 'static/js/[name].[contenthash:8].js'
			: !isEnvProduction && 'static/js/bundle.js',
		// There are also additional JS chunk files if you use code splitting.
		chunkFilename: isEnvProduction
			? 'static/js/[name].[contenthash:8].chunk.js'
			: !isEnvProduction && 'static/js/[name].chunk.js',
		assetModuleFilename: 'static/media/[name].[hash][ext]',
		// webpack uses `publicPath` to determine where the app is being served from.
		// It requires a trailing slash, or the file assets will get an incorrect path.
		// We inferred the "public path" (such as / or /my-project) from homepage.
		publicPath: '/',
		// Point sourcemap entries to original disk location (format as URL on Windows)
		devtoolModuleFilenameTemplate: isEnvProduction
			? (info) =>
					path
						.relative(path.resolve('src'), info.absoluteResourcePath)
						.replace(/\\/g, '/')
			: !isEnvProduction &&
			  ((info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
	},
	cache: {
		type: 'filesystem',
		version: envRawHash,
		cacheDirectory: path.resolve('node_modules/.cache'),
		store: 'pack',
		buildDependencies: {
			defaultWebpack: ['webpack/lib/'],
			config: [path.resolve('webpack.config.js')],
			tsconfig: [path.resolve('tsconfig.json')],
		},
	},
	infrastructureLogging: {
		level: 'none',
	},
	optimization: {
		minimize: isEnvProduction,
		minimizer: [
			// This is only used in production mode
			new TerserPlugin({
				terserOptions: {
					parse: {
						// We want terser to parse ecma 8 code. However, we don't want it
						// to apply any minification steps that turns valid ecma 5 code
						// into invalid ecma 5 code. This is why the 'compress' and 'output'
						// sections only apply transformations that are ecma 5 safe
						// https://github.com/facebook/create-react-app/pull/4234
						ecma: 8,
					},
					compress: {
						ecma: 5,
						warnings: false,
						// Disabled because of an issue with Uglify breaking seemingly valid code:
						// https://github.com/facebook/create-react-app/issues/2376
						// Pending further investigation:
						// https://github.com/mishoo/UglifyJS2/issues/2011
						comparisons: false,
						// Disabled because of an issue with Terser breaking valid code:
						// https://github.com/facebook/create-react-app/issues/5250
						// Pending further investigation:
						// https://github.com/terser-js/terser/issues/120
						inline: 2,
					},
					mangle: {
						safari10: true,
					},
					// Added for profiling in devtools
					keep_classnames: isEnvProductionProfile,
					keep_fnames: isEnvProductionProfile,
					output: {
						ecma: 5,
						comments: false,
						// Turned on because emoji and regex is not minified properly using default
						// https://github.com/facebook/create-react-app/issues/2488
						ascii_only: true,
					},
				},
			}),
			// This is only used in production mode
			new CssMinimizerPlugin(),
		],
	},
	resolve: {
		// These are the reasonable defaults supported by the Node ecosystem.
		// We also include JSX as a common component filename extension to support
		// some tools, although we do not recommend using it, see:
		// https://github.com/facebook/create-react-app/issues/290
		// `web` extension prefixes have been added for better support
		// for React Native Web.
		extensions: moduleFileExtensions.map((ext) => `.${ext}`),
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
	module: {
		strictExportPresence: true,
		rules: [
			// Handle node_modules packages that contain sourcemaps
			shouldUseSourceMap && {
				enforce: 'pre',
				exclude: /@babel(?:\/|\\{1,2})runtime/,
				test: /\.(js|mjs|jsx|ts|tsx|css)$/,
				loader: 'source-map-loader',
			},
			{
				// "oneOf" will traverse all following loaders until one will
				// match the requirements. When no loader matches it will fall
				// back to the "file" loader at the end of the loader list.
				oneOf: [
					// TODO: Merge this config once `image/avif` is in the mime-db
					// https://github.com/jshttp/mime-db
					{
						test: [/\.avif$/],
						type: 'asset',
						mimetype: 'image/avif',
						parser: {
							dataUrlCondition: {
								maxSize: imageInlineSizeLimit,
							},
						},
					},
					// "url" loader works like "file" loader except that it embeds assets
					// smaller than specified limit in bytes as data URLs to avoid requests.
					// A missing `test` is equivalent to a match.
					{
						test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
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
					// Process application JS with Babel.
					// The preset includes JSX, Flow, TypeScript, and some ESnext features.
					{
						test: /\.[mc]?[jt]sx?$/,
						include: path.resolve('src'),
						use: [
							{
								loader: 'babel-loader',
								options: {
									customize: path.resolve(
										'node_modules/babel-preset-react-app/webpack-overrides.js'
									),
									presets: [
										[
											'@babel/preset-typescript',
											{
												allowDeclareFields: true,
											},
										],
										[
											'babel-preset-react-app',
											{
												runtime: 'automatic',
											},
										],
									],

									plugins: [
										!isEnvProduction &&
											shouldUseReactRefresh &&
											'react-refresh/babel',
									].filter(Boolean),
									// This is a feature of `babel-loader` for webpack (not Babel itself).
									// It enables caching results in ./node_modules/.cache/babel-loader/
									// directory for faster rebuilds.
									cacheDirectory: true,
									// See #6846 for context on why cacheCompression is disabled
									cacheCompression: false,
									compact: isEnvProduction,
								},
							},
						],
					},
					// Process any JS outside of the app with Babel.
					// Unlike the application JS, we only compile the standard ES features.
					{
						test: /\.(js|mjs)$/,
						exclude: /@babel(?:\/|\\{1,2})runtime/,
						loader: 'babel-loader',
						options: {
							babelrc: false,
							configFile: false,
							compact: false,
							presets: [
								['babel-preset-react-app/dependencies', { helpers: true }],
							],
							cacheDirectory: true,
							// See #6846 for context on why cacheCompression is disabled
							cacheCompression: false,

							// Babel sourcemaps are needed for debugging into node_modules
							// code.  Without the options below, debuggers like VSCode
							// show incorrect code and set breakpoints on the wrong lines.
							sourceMaps: shouldUseSourceMap,
							inputSourceMap: shouldUseSourceMap,
						},
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
							sourceMap: isEnvProduction
								? shouldUseSourceMap
								: !isEnvProduction,
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
							sourceMap: isEnvProduction
								? shouldUseSourceMap
								: !isEnvProduction,
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
								sourceMap: isEnvProduction
									? shouldUseSourceMap
									: !isEnvProduction,
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
								sourceMap: isEnvProduction
									? shouldUseSourceMap
									: !isEnvProduction,
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
		].filter(Boolean),
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyPlugin({
			patterns: [
				{
					from: stompPath,
					to: 'stomp',
				},
				{
					from: uvPath,
					to: 'uv',
				},
				{
					from: rufflePath,
					to: 'ruffle',
				},
				{
					from: './public',
					filter: (file) => file !== path.resolve('public/index.html'),
				},
				{
					from: './uv',
					to: 'uv',
				},
			],
		}),
		// Generates an `index.html` file with the <script> injected.
		new HtmlWebpackPlugin({
			inject: true,
			template: path.resolve('public/index.html'),
			...(isEnvProduction
				? {
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
				  }
				: {}),
		}),
		// Inlines the webpack runtime script. This script is too small to warrant
		// a network request.
		// https://github.com/facebook/create-react-app/issues/5358
		isEnvProduction &&
			shouldInlineRuntimeChunk &&
			new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
		// Makes some environment variables available in index.html.
		// The public URL is available as %PUBLIC_URL% in index.html, e.g.:
		// <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
		// It will be an empty string unless you specify "homepage"
		// in `package.json`, in which case it will be the pathname of that URL.
		new InterpolateHtmlPlugin(HtmlWebpackPlugin, envRaw),
		// This gives some necessary context to module not found errors, such as
		// the requesting resource.
		new ModuleNotFoundPlugin(path.resolve('.')),
		// Makes some environment variables available to the JS code, for example:
		// if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
		// It is absolutely essential that NODE_ENV is set to production
		// during a production build.
		// Otherwise React will be compiled in the very slow development mode.
		// new webpack.DefinePlugin(env.stringified),
		new webpack.DefinePlugin({
			'process.env': Object.keys(envRaw).reduce((env, key) => {
				env[key] = JSON.stringify(envRaw[key]);
				return env;
			}, {}),
		}),
		// Experimental hot reloading for React .
		// https://github.com/facebook/react/tree/main/packages/react-refresh
		!isEnvProduction &&
			shouldUseReactRefresh &&
			new ReactRefreshWebpackPlugin({
				overlay: false,
			}),
		// Watcher doesn't work well if you mistype casing in a path so we use
		// a plugin that prints an error when you attempt to do this.
		// See https://github.com/facebook/create-react-app/issues/240
		!isEnvProduction && new CaseSensitivePathsPlugin(),
		isEnvProduction &&
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
		!isEnvProduction &&
			new ESLintPlugin({
				// Plugin options
				extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
				formatter: 'react-dev-utils/eslintFormatter',
				eslintPath: 'eslint',
				failOnError: !(!isEnvProduction && emitErrorsAsWarnings),
				cache: true,
				cacheLocation: path.resolve('node_modules/.cache/.eslintcache'),
			}),
		{
			/**
			 *
			 * @param {import('webpack').Compiler} compiler
			 */
			apply: (compiler) => {
				compiler.hooks.compilation.tap('DefineUV', (compilation) => {
					compilation.hooks.processAssets.tap(
						{
							name: 'WebpackObfuscator',
							stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
						},
						(assets) => {
							const config = assets['uv/uv.config.js'];

							if (!config) return;

							const content = config.buffer().toString();

							assets['uv/uv.config.js'] = new webpack.sources.RawSource(
								content.replace(/process\.env\.(\w+)/g, (_match, target) =>
									target in envRaw
										? JSON.stringify(envRaw[target])
										: 'undefined'
								)
							);
						}
					);
				});
			},
		},
		new HolyUnblockerRouterPlugin(),
		isEnvProduction &&
			new BasicWebpackObfuscator({
				sourceMap: true,
				compact: true,
			}),
	].filter(Boolean),
	// Turn off performance processing because we utilize
	// our own hints via the FileSizeReporter
	performance: false,
};

export default webpackConfig;
