/**
 * This module is used in both the compiler and the website. Don't use any JSX modules unless its for typedefs or in imports.
 */
import type { HolyPage } from './App';

export type LayoutID = 'main' | 'compat' | 'settings';

export interface Hot {
	path: string;
	file: string;
	/**
	 * used to resolve path names
	 */
	alias: SomeAlias;
	/**
	 * import the page
	 * default should be HolyPage
	 */
	import: () => Promise<{ default: HolyPage }>;
	src: string;
	layout: LayoutID;
}

export type RouteType = 'id' | 'file';

export type SomeAlias =
	| 'home'
	| 'contact'
	| 'faq'
	| 'privacy'
	| 'proxy'
	| 'terms'
	| 'credits'
	| '404'
	| 'compat ultraviolet'
	| 'compat rammerhead'
	| 'compat stomp'
	| 'compat flash'
	| 'settings proxy'
	| 'settings appearance'
	| 'settings tabcloak'
	| 'theatre favorites'
	| 'theatre apps'
	| 'theatre player'
	| 'theatre games popular'
	| 'theatre games category'
	| 'theatre games all';

export function getRoutes(routeType: RouteType, publicPath: string) {
	let i = 0;

	/**
	 * @returns posix-like path
	 */
	const lazyLoc = (path: string) => {
		if (!path.startsWith('/')) throw new Error('path did not start with /');

		let file = path.slice(1);

		// directory
		if (path.endsWith('/')) {
			file += 'index.html';
		} else {
			file += '.html';
			path += '.html';
		}

		return {
			path: publicPath + path,
			file,
		};
	};

	// export const determineHotChunkName =

	// wrap in React.lazy()
	return [
		{
			...lazyLoc('/'),
			alias: 'home',
			import: () => import(/* webpackPrefetch: true */ './pages/index'),
			src: './pages/index',
			layout: 'main',
		},
		{
			...lazyLoc('/faq'),
			alias: 'faq',
			import: () => import(/* webpackPrefetch: true */ './pages/faq'),
			src: './pages/faq',
			layout: 'main',
		},
		{
			...lazyLoc('/contact'),
			alias: 'contact',
			import: () => import(/* webpackPrefetch: true */ './pages/contact'),
			src: './pages/contact',
			layout: 'main',
		},
		{
			...lazyLoc('/privacy'),
			alias: 'privacy',
			import: () => import(/* webpackPrefetch: true */ './pages/privacy'),
			src: './pages/privacy',
			layout: 'main',
		},
		{
			...lazyLoc('/terms'),
			alias: 'terms',
			import: () => import(/* webpackPrefetch: true */ './pages/terms'),
			src: './pages/terms',
			layout: 'main',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/credits'),
			alias: 'credits',
			import: () => import(/* webpackPrefetch: true */ './pages/credits'),
			src: './pages/credits',
			layout: 'main',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/proxy'),
			alias: 'proxy',
			import: () => import(/* webpackPrefetch: true */ './pages/proxy'),
			src: './pages/proxy',
			layout: 'main',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/compat/ultraviolet'),
			alias: 'compat ultraviolet',
			import: () =>
				import(/* webpackPrefetch: true */ './pages/compat/ultraviolet'),
			src: './pages/compat/ultraviolet',
			layout: 'compat',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/compat/rammerhead'),
			alias: 'compat rammerhead',
			import: () =>
				import(/* webpackPrefetch: true */ './pages/compat/rammerhead'),
			src: './pages/compat/rammerhead',
			layout: 'compat',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/compat/stomp'),
			alias: 'compat stomp',
			import: () => import(/* webpackPrefetch: true */ './pages/compat/stomp'),
			src: './pages/compat/stomp',
			layout: 'compat',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/compat/flash'),
			alias: 'compat flash',
			import: () => import(/* webpackPrefetch: true */ './pages/compat/flash'),
			src: './pages/compat/flash',
			layout: 'compat',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/settings/proxy'),
			alias: 'settings proxy',
			import: () =>
				import(/* webpackPrefetch: true */ './pages/settings/proxy'),
			src: './pages/settings/proxy',
			layout: 'settings',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/settings/appearance'),
			alias: 'settings appearance',
			import: () =>
				import(/* webpackPrefetch: true */ './pages/settings/appearance'),
			src: './pages/settings/appearance',
			layout: 'settings',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/settings/tabcloak'),
			alias: 'settings tabcloak',
			import: () =>
				import(/* webpackPrefetch: true */ './pages/settings/tabcloak'),
			src: './pages/settings/tabcloak',
			layout: 'settings',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/theatre/favorites'),
			alias: 'theatre favorites',
			import: () =>
				import(/* webpackPrefetch: true */ './pages/theatre/favorites'),
			src: './pages/theatre/favorites',
			layout: 'main',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/theatre/apps'),
			alias: 'theatre apps',
			import: () => import(/* webpackPrefetch: true */ './pages/theatre/apps'),
			src: './pages/theatre/apps',
			layout: 'main',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/theatre/player'),
			alias: 'theatre player',
			import: () =>
				import(/* webpackPrefetch: true */ './pages/theatre/player'),
			src: './pages/theatre/player',
			layout: 'main',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/theatre/category'),
			alias: 'theatre games category',
			import: () =>
				import(/* webpackPrefetch: true */ './pages/theatre/category'),
			src: './pages/theatre/category',
			layout: 'main',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/theatre/games/'),
			alias: 'theatre games popular',
			import: () =>
				import(/* webpackPrefetch: true */ './pages/theatre/games/index'),
			src: './pages/theatre/games/index',
			layout: 'main',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/theatre/games/all'),
			alias: 'theatre games all',
			import: () =>
				import(/* webpackPrefetch: true */ './pages/theatre/games/all'),
			src: './pages/theatre/games/all',
			layout: 'main',
		},
		{
			// 404 is odd, components shouldn't attempt to use the path defined here as its fed directly to react-dom-router
			path: '*',
			// 404.html is recognized by static site hosts
			// needs to be manually configured in NGINX: `error_page 404 /404.html;`
			file: '404.html',
			alias: '404',
			import: () => import(/* webpackPrefetch: true */ './pages/404'),
			src: './pages/404',
			layout: 'main',
		},
	] as Hot[];
}
