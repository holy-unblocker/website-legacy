import CompatAPI from './CompatAPI';
import { isDatabaseError } from './DatabaseAPI';
import { DB_API, DEFAULT_PROXY } from './consts';
import { encryptURL } from './cryptURL';
import { getHot } from './routes';

export default async function resolveProxy(src: string, setting: string) {
	if (setting === 'automatic') {
		const { host } = new URL(src);
		const api = new CompatAPI(DB_API);

		try {
			setting = (await api.compat(host)).proxy;
		} catch (err) {
			if (isDatabaseError(err) && err.message === 'Not Found') {
				setting = DEFAULT_PROXY;
			} else {
				console.error(err);
				throw err;
			}
		}
	}

	let route;

	switch (setting) {
		case 'stomp':
			route = getHot('compat stomp').path;
			break;
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
