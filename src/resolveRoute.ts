import routes from './routes';

export default function resolveRoute(
	dir: string,
	page: string,
	absolute = true
) {
	let pages: string[] | void;
	let routeI: number;

	for (routeI = 0; routeI < routes.length; routeI++) {
		const route = routes[routeI];

		if (dir === route.dir) {
			pages = route.pages;
			break;
		}
	}

	if (!pages) throw new Error(`Unknown directory ${dir}`);

	let resDir = '';
	let resFile = '';

	if (page !== '') {
		switch (process.env.REACT_APP_ROUTER) {
			case 'id': {
				const index = pages.indexOf(page);

				if (index === -1) {
					throw new TypeError(`Unknown page ${page}`);
				}

				resFile = `${index}.html`;
				break;
			}
			default:
			case 'file':
				resFile = `${page}.html`;
				break;
		}
	}

	if (dir === '/') {
		resDir = '/';
	} else {
		switch (process.env.REACT_APP_ROUTER) {
			case 'id': {
				resDir = `/${routeI}/`;
				break;
			}
			default:
			case 'file':
				resDir = dir;
				break;
		}
	}

	if (absolute) {
		return `${resDir}${resFile}`;
	} else {
		return resFile;
	}
}
