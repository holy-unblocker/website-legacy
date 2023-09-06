// adopted from https://github.com/Widen/i18next-async-backend
// we add support for loading individual namespaces and every namespace

import type {
	BackendModule,
	ReadCallback,
	Services,
	TypeOptions,
	CallbackError,
} from 'i18next';

type Resources = TypeOptions['resources'];

export type AllNamespaces = () => Promise<Resources>;

export type Namespaces = {
	[T in keyof Resources]: () => Promise<Resources[T]>;
};

export interface AsyncBackendOptions {
	resources?: {
		[language: string]: AllNamespaces | Namespaces;
	};
}

export default class AsyncBackend
	implements BackendModule<AsyncBackendOptions>
{
	// i18next is dumb as TypeScript requires the class property for `type`
	// but the runtime requires the static `type` property.
	static type = 'backend';
	type = 'backend' as const;
	private options: AsyncBackendOptions = null!;
	constructor(services: Services, options: AsyncBackendOptions) {
		this.init(services, options);
	}
	init(_: Services, options: AsyncBackendOptions): void {
		this.options = { ...this.options, ...options };
	}
	async read(lng: string, ns: string, callback: ReadCallback) {
		const fetcher = this.options.resources?.[lng];

		try {
			if (!fetcher) throw new Error(`Unknown language '${lng}'`);

			if (typeof fetcher === 'object') {
				if (ns in fetcher)
					callback(null, await fetcher[ns as keyof Resources]());
				else
					throw new Error(
						`Language '${lng}' doesn't contain namespace '${ns};`,
					);
			} else {
				const res = await fetcher();
				if (ns in res) callback(null, res[ns as keyof Resources]);
				else throw new Error(`Resource doesn't contain namespace '${ns};`);
			}
		} catch (err) {
			callback(err as CallbackError, false);
		}
	}
}
