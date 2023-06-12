// @ts-ignore
import { getRoutes } from './appRoutes';
// @ts-ignore
import type { Hot, RouteType, SomeAlias } from './appRoutes';
import { OFFICIAL } from './consts';

// should NOT be set when running the dev server
export const VITE_PUBLIC_PATH = import.meta.env.VITE_PUBLIC_PATH || '';

export const routeType = OFFICIAL
	? 'file'
	: (import.meta.env.VITE_ROUTER! as RouteType);

export const hotRoutes = getRoutes(routeType, VITE_PUBLIC_PATH);

export function getHot(alias: SomeAlias): Hot {
	for (const hot of hotRoutes) {
		if (hot.alias === alias) return hot;
	}

	throw new Error('bad alias');
}
