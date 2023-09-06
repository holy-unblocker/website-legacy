const { host, hostname, protocol } = window.location;

export const BARE_APIS = /*#__PURE__*/ import.meta.env
	.VITE_BARE_APIS!.split(',')
	.map(format);
// TODO: pick a random API based on the location
export const BARE_API = BARE_APIS[0];
export const RH_API = /*#__PURE__*/ format(import.meta.env.VITE_RH_API!);
export const DB_API = /*#__PURE__*/ format(import.meta.env.VITE_DB_API!);
export const THEATRE_CDN = /*#__PURE__*/ format(
	import.meta.env.VITE_THEATRE_CDN!,
);

export const DEFAULT_PROXY = /*#__PURE__*/ format(
	import.meta.env.VITE_DEFAULT_PROXY!,
);
export const TN_DISCORD_URL = /*#__PURE__*/ format(
	import.meta.env.VITE_TN_DISCORD_URL!,
);
export const HU_DISCORD_URL = /*#__PURE__*/ format(
	import.meta.env.VITE_HU_DISCORD_URL!,
);

export const SUPPORT_EMAIL = /*#__PURE__*/ format(
	import.meta.env.VITE_SUPPORT_EMAIL!,
);

export const OFFICIAL = false; // hostname === 'holyubofficial.net';

export const OBFUSCATE = !OFFICIAL;

export const SERVICEWORKERS =
	import.meta.env.NODE_ENV !== 'production' ||
	protocol === 'https:' ||
	hostname === 'localhost' ||
	hostname === '127.0.0.1';

function format(env: string) {
	return env
		.replace('%{location.host}', host)
		.replace('%{location.hostname}', hostname)
		.replace('%{location.protocol}', protocol);
}
