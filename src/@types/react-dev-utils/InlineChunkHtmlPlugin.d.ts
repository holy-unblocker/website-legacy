import type HtmlWebpackPlugin from 'html-webpack-plugin';

/**
 * This Webpack plugin inlines script chunks into `index.html`.
 */
declare class InlineChunkHtmlPlugin {
	constructor(
		htmlWebpackPlugin: typeof HtmlWebpackPlugin,
		tests: ReadonlyArray<RegExp>
	);
}

export = InlineChunkHtmlPlugin;
