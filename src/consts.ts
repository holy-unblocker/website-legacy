const { host, hostname, protocol } = global.location;

export const BARE_API = /*#__PURE__*/ format(process.env.REACT_APP_BARE_API!);
export const RH_API = /*#__PURE__*/ format(process.env.REACT_APP_RH_API!);
export const DB_API = /*#__PURE__*/ format(process.env.REACT_APP_DB_API!);
export const THEATRE_CDN = /*#__PURE__*/ format(
	process.env.REACT_APP_THEATRE_CDN!
);

export const DEFAULT_PROXY = /*#__PURE__*/ format(
	process.env.REACT_APP_DEFAULT_PROXY!
);
export const TN_DISCORD_URL = /*#__PURE__*/ format(
	process.env.REACT_APP_TN_DISCORD_URL!
);
export const HU_DISCORD_URL = /*#__PURE__*/ format(
	process.env.REACT_APP_HU_DISCORD_URL!
);

export const SUPPORT_EMAIL = /*#__PURE__*/ format(
	process.env.REACT_APP_SUPPORT_EMAIL!
);

export const UV_DIR = /*#__PURE__*/ format(process.env.REACT_APP_UV_DIR!);

export const STOMP_DIR = /*#__PURE__*/ format(process.env.REACT_APP_STOMP_DIR!);

export const RUFFLE_DIR = /*#__PURE__*/ format(
	process.env.REACT_APP_RUFFLE_DIR!
);

export const OFFICIAL = false; // hostname === 'holyubofficial.net';

export const OBFUSCATE = !OFFICIAL;

export const SERVICEWORKERS =
	process.env.NODE_ENV !== 'production' ||
	protocol === 'https:' ||
	hostname === 'localhost' ||
	hostname === '127.0.0.1';

function format(env: string) {
	// eslint-disable-next-line no-template-curly-in-string
	return env
		.replace('%{location.host}', host)
		.replace('%{location.hostname}', hostname)
		.replace('%{location.protocol}', protocol);
}
