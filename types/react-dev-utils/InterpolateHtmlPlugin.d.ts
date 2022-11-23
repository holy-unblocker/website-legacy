/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type HtmlWebpackPlugin from 'html-webpack-plugin';
import type { Compiler, WebpackPluginInstance } from 'webpack';

export default class InterpolateHtmlPlugin implements WebpackPluginInstance {
	constructor(
		htmlWebpackPlugin: typeof HtmlWebpackPlugin,
		replacements: Record<string, string>
	);
	apply(compiler: Compiler): void;
}
