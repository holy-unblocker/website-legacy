/**
 * @typedef {(encoded: string) => string} UVEncode
 */

/**
 * @typedef {(encoded: string) => string} UVDecode
 */

/**
 * @typedef {{ encode: UVEncode, decode: UVDecode }} UVCodec
 */

/**
 * @typedef {{ codec: Record<string, { codec: Record<string, UVCodec> } }} Ultraviolet
 */

/**
 * @typedef {{ bare: string; prefix: string; handler: string; bundle: string; config: string; sw: string; encodeUrl: UVEncode; decodeUrl: UVDecode }} UVConfig
 */

{
	/** @type {Ultraviolet} */
	const Ultraviolet = globalThis.Ultraviolet;

	/**
	 *
	 * @param {string} env
	 */
	const format = (env) => {
		const { host, hostname, protocol } = globalThis.location;

		return env
			.replace('%{location.host}', host)
			.replace('%{location.hostname}', hostname)
			.replace('%{location.protocol}', protocol);
	};

	/**
	 * @type {UVConfig}
	 */
	const config = {
		prefix: '/uv/service/',
		bare: format(process.env.REACT_APP_BARE_API),
		encodeUrl: Ultraviolet.codec.xor.encode,
		decodeUrl: Ultraviolet.codec.xor.decode,
		handler: '/uv/uv.handler.js',
		bundle: '/uv/uv.bundle.js',
		config: '/uv/uv.config.js',
		sw: '/uv/uv.sw.js',
	};

	globalThis.__uv$config = config;
}
