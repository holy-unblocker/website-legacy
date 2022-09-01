import type { LoaderContext } from 'webpack';

export interface CSSLoaderOptions {
	url?:
		| boolean
		| {
				filter: (url: string, resourcePath: string) => boolean;
		  };
	import?:
		| boolean
		| { filter: (url: string, media: string, resourcePath: string) => boolean };
	modules?:
		| boolean
		| 'local'
		| 'global'
		| 'pure'
		| 'icss'
		| {
				auto?: boolean | RegExp | ((resourcePath: string) => boolean);
				mode?:
					| 'local'
					| 'global'
					| 'pure'
					| 'icss'
					| ((resourcePath: string) => 'local' | 'global' | 'pure' | 'icss');
				localIdentName?: string;
				localIdentContext?: string;
				localIdentHashSalt?: string;
				localIdentHashFunction?: string;
				localIdentHashDigest?: string;
				localIdentRegExp?: string | RegExp;
				getLocalIdent?: (
					context: LoaderContext<unknown>,
					localIdentName: string,
					localName: string
				) => string;
				namedExport?: boolean;
				exportGlobals?: boolean;
				exportLocalsConvention?:
					| 'asIs'
					| 'camelCase'
					| 'camelCaseOnly'
					| 'dashes'
					| 'dashesOnly'
					| ((name: string) => string);
				exportOnlyLocals?: boolean;
		  };
	sourceMap?: boolean;
	importLoaders?: number;
	esModule?: boolean;
	exportType?: 'array' | 'string' | 'css-style-sheet';
}
