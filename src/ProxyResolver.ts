import CompatAPI from './CompatAPI';
import { DB_API, DEFAULT_PROXY } from './consts';
import { encryptURL } from './cryptURL';
import resolveRoute from './resolveRoute';

export default async function resolveProxy(src: string, setting: string) {
	if (setting === 'automatic') {
		const { host } = new URL(src);
		const api = new CompatAPI(DB_API);

		try {
			setting = (await api.compat(host)).proxy;
		} catch (error: any) {
			if (error && error.message === 'Not Found') {
				setting = DEFAULT_PROXY;
			} else {
				console.error(error);
				throw error;
			}
		}
	}

	let route;

	switch (setting) {
		case 'stomp':
			route = resolveRoute('/compat/', 'stomp');
			break;
		case 'ultraviolet':
			route = resolveRoute('/compat/', 'ultraviolet');
			break;
		default:
		case 'rammerhead':
			route = resolveRoute('/compat/', 'rammerhead');
			break;
	}

	return `${route}#${encryptURL(src)}`;
}
