import CompatAPI from './CompatAPI';
import { DB_API, DEFAULT_PROXY } from './consts';
import { encryptURL } from './cryptURL';
import { isError } from './isAbortError';
import { getHot } from './routes';

export type FixedProxy = 'ultraviolet' | 'rammerhead';

export function resolveProxyFixed(src: string, setting: FixedProxy) {
	let route;

	switch (setting) {
		case 'ultraviolet':
			route = getHot('compat ultraviolet').path;
			break;
		default:
		case 'rammerhead':
			route = getHot('compat rammerhead').path;
			break;
	}

	return `${route}#${encryptURL(src)}`;
}

export default async function resolveProxy(
	src: string,
	setting: string,
	signal?: AbortSignal,
) {
	if (setting === 'automatic') {
		const { host } = new URL(src);
		const api = new CompatAPI(DB_API, signal);

		try {
			setting = (await api.compat(host)).proxy;
		} catch (err) {
			if (isError(err) && err.message === 'Not Found') {
				setting = DEFAULT_PROXY;
			} else {
				console.error(err);
				throw err;
			}
		}
	}

	return resolveProxyFixed(src, setting as FixedProxy);
}
