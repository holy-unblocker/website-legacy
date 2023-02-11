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
		prefix: `${process.env.PUBLIC_PATH}/${process.env.REACT_APP_UV_DIR}/service/`,
		bare: process.env.REACT_APP_BARE_APIS.split(',').map(format),
		encodeUrl: Ultraviolet.codec.xor.encode,
		decodeUrl: Ultraviolet.codec.xor.decode,
		handler: `${process.env.PUBLIC_PATH}/${process.env.REACT_APP_UV_DIR}/uv.handler.js`,
		bundle: `${process.env.PUBLIC_PATH}/${process.env.REACT_APP_UV_DIR}/uv.bundle.js`,
		config: `${process.env.PUBLIC_PATH}/${process.env.REACT_APP_UV_DIR}/uv.config.js`,
		sw: `${process.env.PUBLIC_PATH}/${process.env.REACT_APP_UV_DIR}/uv.sw.js`,
	};

	globalThis.__uv$config = config;
}
