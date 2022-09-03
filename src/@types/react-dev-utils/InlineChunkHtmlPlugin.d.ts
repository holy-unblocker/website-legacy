/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type HtmlWebpackPlugin from 'html-webpack-plugin';
import type { Compiler, Compilation, WebpackPluginInstance } from 'webpack';

declare class InlineChunkHtmlPlugin implements WebpackPluginInstance {
	htmlWebpackPlugin: typeof HtmlWebpackPlugin;
	tests: ReadonlyArray<RegExp>;
	constructor(
		htmlWebpackPlugin: typeof HtmlWebpackPlugin,
		tests: ReadonlyArray<RegExp>
	);
	getInlinedTag(
		publicPath: string,
		assets: Compilation['assets'],
		tag: HtmlWebpackPlugin.HtmlTagObject
	):
		| HtmlWebpackPlugin.HtmlTagObject
		| {
				tagName: string;
				innerHTML: string | Buffer;
				closeTag: boolean;
		  };
	apply(compiler: Compiler): void;
}

export = InlineChunkHtmlPlugin;
