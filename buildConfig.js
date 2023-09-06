/*
 * Build uv.config.js using esbuild
 */

import { expand } from 'dotenv-expand';
import { config } from 'dotenv-flow';
import { build } from 'esbuild';

process.env.NODE_ENV ??= process.argv.includes('--prod')
	? 'production'
	: 'development';
process.env.VITE_PUBLIC_PATH ??= '';

expand(config());

/**
 * import.meta.env replacements for VITE_ env
 */
const defineEnv = Object.fromEntries(
	Object.keys(process.env)
		.filter((key) => key.startsWith('VITE_'))
		.map((key) => [`import.meta.env.${key}`, JSON.stringify(process.env[key])]),
);

await build({
	target: 'ES2020',
	format: 'iife',
	entryPoints: ['./config/uv/uv.config.ts'],
	minify: true,
	define: defineEnv,
	outfile: './public/uv/uv.config.js',
});
