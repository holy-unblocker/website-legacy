export type LayoutID = 'main' | 'compat' | 'settings';

export interface Hot {
	path: string;
	file: string;
	/**
	 * used to resolve path names
	 */
	alias: SomeAlias;
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
			src: './pages/index.tsx',
			layout: 'main',
		},
		{
			...lazyLoc('/faq'),
			alias: 'faq',
			src: './pages/faq.tsx',
			layout: 'main',
		},
		{
			...lazyLoc('/contact'),
			alias: 'contact',
			src: './pages/contact.tsx',
			layout: 'main',
		},
		{
			...lazyLoc('/privacy'),
			alias: 'privacy',
			src: './pages/privacy.tsx',
			layout: 'main',
		},
		{
			...lazyLoc('/terms'),
			alias: 'terms',
			src: './pages/terms.tsx',
			layout: 'main',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/credits'),
			alias: 'credits',
			src: './pages/credits.tsx',
			layout: 'main',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/proxy'),
			alias: 'proxy',
			src: './pages/proxy.tsx',
			layout: 'main',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/compat/ultraviolet'),
			alias: 'compat ultraviolet',
			src: './pages/compat/ultraviolet.tsx',
			layout: 'compat',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/compat/rammerhead'),
			alias: 'compat rammerhead',
			src: './pages/compat/rammerhead.tsx',
			layout: 'compat',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/compat/flash'),
			alias: 'compat flash',
			src: './pages/compat/flash.tsx',
			layout: 'compat',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/settings/proxy'),
			alias: 'settings proxy',
			src: './pages/settings/proxy.tsx',
			layout: 'settings',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/settings/appearance'),
			alias: 'settings appearance',
			src: './pages/settings/appearance.tsx',
			layout: 'settings',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/settings/tabcloak'),
			alias: 'settings tabcloak',
			src: './pages/settings/tabcloak.tsx',
			layout: 'settings',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/theatre/favorites'),
			alias: 'theatre favorites',
			src: './pages/theatre/favorites.tsx',
			layout: 'main',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/theatre/apps'),
			alias: 'theatre apps',
			src: './pages/theatre/apps.tsx',
			layout: 'main',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/theatre/player'),
			alias: 'theatre player',
			src: './pages/theatre/player.tsx',
			layout: 'main',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/theatre/category'),
			alias: 'theatre games category',
			src: './pages/theatre/category.tsx',
			layout: 'main',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/theatre/games/'),
			alias: 'theatre games popular',
			src: './pages/theatre/games/index.tsx',
			layout: 'main',
		},
		{
			...lazyLoc(routeType === 'id' ? '/' + i++ : '/theatre/games/all'),
			alias: 'theatre games all',
			src: './pages/theatre/games/all.tsx',
			layout: 'main',
		},
		{
			// 404 is odd, components shouldn't attempt to use the path defined here as its fed directly to react-dom-router
			path: '*',
			// 404.html is recognized by static site hosts
			// needs to be manually configured in NGINX: `error_page 404 /404.html;`
			file: '404.html',
			alias: '404',
			src: './pages/404.tsx',
			layout: 'main',
		},
	] as Hot[];
}
