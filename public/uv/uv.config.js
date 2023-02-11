/*global Ultraviolet*/
{
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

	const config = {
		prefix: `${process.env.PUBLIC_PATH}/${process.env.REACT_APP_UV_DIR}/service/`,
		bare: process.env.REACT_APP_BARE_APIS.split(',').map(format),
		encodeUrl: Ultraviolet.codec.xor.encode,
		decodeUrl: Ultraviolet.codec.xor.decode,
		handler: `${process.env.PUBLIC_PATH}/${process.env.REACT_APP_UV_DIR}/uv.handler.js`,
		bundle: `${process.env.PUBLIC_PATH}/${process.env.REACT_APP_UV_DIR}/uv.bundle.js`,
		config: `${process.env.PUBLIC_PATH}/${process.env.REACT_APP_UV_DIR}/uv.config.js`,
		client: `${process.env.PUBLIC_PATH}/${process.env.REACT_APP_UV_DIR}/uv.client.js`,
		sw: `${process.env.PUBLIC_PATH}/${process.env.REACT_APP_UV_DIR}/uv.sw.js`,
	};

	globalThis.__uv$config = config;
}
