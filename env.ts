import { createHash } from 'crypto';
import { expand } from 'dotenv-expand';
import { config } from 'dotenv-flow';

// set env at import-time

if (!process.env.NODE_ENV)
	throw new Error(
		'The NODE_ENV environment variable is required but was not specified.'
	);

expand(config());

export const envRaw: typeof process.env = {
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
	FAST_REFRESH: (process.env.FAST_REFRESH !== 'false').toString(),
};

const envRequired: string[] = [
	'REACT_APP_ROUTER',
	'REACT_APP_HAT_BADGE',
	'REACT_APP_DEFAULT_PROXY',
	'REACT_APP_TN_DISCORD_URL',
	'REACT_APP_HU_DISCORD_URL',
	'REACT_APP_BARE_API',
	'REACT_APP_RH_API',
	'REACT_APP_DB_API',
	'REACT_APP_THEATRE_CDN',
];

for (const env of envRequired) {
	if (!(env in process.env))
		throw new Error(`Missing required environment variable: ${env}`);

	envRaw[env] = process.env[env];
}

const envHash = createHash('md5');
envHash.update(JSON.stringify(envRaw));
export const envRawHash = envHash.digest('hex');

export const envRawStringified: Record<string, string> = {};

for (const key in envRaw) envRawStringified[key] = JSON.stringify(envRaw[key]);
