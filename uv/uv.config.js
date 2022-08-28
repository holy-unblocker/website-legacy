/* eslint-disable */
{
	function format(env) {
		const { host, hostname, protocol } = location;

		return env
			.replace('%{location.host}', host)
			.replace('%{location.hostname}', hostname)
			.replace('%{location.protocol}', protocol);
	}

	self.__uv$config = {
		prefix: '/uv/service/',
		bare: format(process.env.REACT_APP_BARE_API),
		encodeUrl: Ultraviolet.codec.xor.encode,
		decodeUrl: Ultraviolet.codec.xor.decode,
		handler: '/uv/uv.handler.js',
		bundle: '/uv/uv.bundle.js',
		config: '/uv/uv.config.js',
		sw: '/uv/uv.sw.js',
	};
}
