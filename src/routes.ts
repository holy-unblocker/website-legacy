import type { Hot, RouteType, SomeAlias } from './appRoutes';
import { getRoutes } from './appRoutes';

// should NOT be set when running the dev server
export const PUBLIC_PATH = process.env.PUBLIC_PATH || '';

export const routeType = process.env.REACT_APP_ROUTER! as RouteType;

export const hotRoutes = getRoutes(routeType, PUBLIC_PATH);

export function getHot(alias: SomeAlias): Hot {
	for (const hot of hotRoutes) {
		if (hot.alias === alias) return hot;
	}

	throw new Error('bad alias');
}
