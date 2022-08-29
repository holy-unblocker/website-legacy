const { host, hostname, protocol } = global.location;

function format(env: string) {
	// eslint-disable-next-line no-template-curly-in-string
	return env
		.replace('%{location.host}', host)
		.replace('%{location.hostname}', hostname)
		.replace('%{location.protocol}', protocol);
}

const swAllowedHostnames = ['localhost', '127.0.0.1'];

export const SERVICEWORKERS =
	process.env.NODE_ENV !== 'production' ||
	global.location.protocol === 'https:' ||
	/*#__PURE__*/ swAllowedHostnames.includes(hostname);

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
