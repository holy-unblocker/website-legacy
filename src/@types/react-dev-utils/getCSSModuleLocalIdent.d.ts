/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { LoaderContext } from 'webpack';

/**
 * Creates a class name for CSS Modules that uses either the filename or folder
 * name if named `index.module.css`.
 *
 * For `MyFolder/MyComponent.module.css` and class `MyClass` the output will be
 * `MyComponent.module_MyClass__[hash]`. For `MyFolder/index.module.css` and
 * class `MyClass` the output will be `MyFolder_MyClass__[hash]`
 */
declare function getCSSModuleLocalIdent(
	context: LoaderContext<unknown>,
	localIdentName: string,
	localName: string,
	options?: { regExp?: RegExp; content?: Buffer }
): string;

export = getCSSModuleLocalIdent;
