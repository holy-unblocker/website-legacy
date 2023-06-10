// Quite the hack just to load appRoutes.ts without also loading the lazy imports

// We aren't supposed to import things from src in here
// @ts-ignore
import type * as appRoutes from './src/appRoutes';
import { build } from 'esbuild';
import Module from 'node:module';
import { dirname, resolve } from 'node:path';
import { Script } from 'node:vm';

const path = resolve('src/appRoutes.ts');

const built = await build({
	target: 'ES2020',
	format: 'cjs',
	entryPoints: [path],
	write: false,
	bundle: false,
	outfile: 'appRoutes',
});

// Decode the virtual file
const code = new TextDecoder().decode(built.outputFiles[0].contents);

// Create a CommonJS module
const mod = new Module(path);

const wrapper = new Script(Module.wrap(code)).runInThisContext() as (
	exports: Module['exports'],
	require: Module['require'],
	module: Module,
	__filename: Module['filename'],
	__dirname: string
) => void;

wrapper(mod.exports, mod.require, mod, path, dirname(path));

const { getRoutes } = mod.exports as typeof appRoutes;

export { getRoutes };

export type * from './src/appRoutes';
