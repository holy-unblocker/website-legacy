/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { PathLike } from 'fs';
import type { Compiler, WebpackError, WebpackPluginInstance } from 'webpack';

declare class ModuleNotFoundPlugin implements WebpackPluginInstance {
	appPath: string;
	yarnLockFile?: string;
	constructor(appPath: string, yarnLockFile?: string);
	useYarnCommand(): boolean;
	getRelativePath(_file: PathLike): string;
	prettierError(err: WebpackError): WebpackError;
	apply(compiler: Compiler): void;
}

export = ModuleNotFoundPlugin;
