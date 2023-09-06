import CommonError from './CommonError';
import { decryptURL } from './cryptURL';
import i18n from './i18n';
import type { ReactNode } from 'react';
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useMemo,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import type { Location } from 'react-router-dom';

function loadScript(
	src: string,
): [load: Promise<void>, script: HTMLScriptElement] {
	const script = document.createElement('script');
	script.src = src;
	script.async = true;

	const promise = new Promise<void>((resolve, reject) => {
		script.addEventListener('load', () => {
			resolve();
		});

		script.addEventListener('error', () => {
			reject();
		});
	});

	document.body.append(script);

	return [promise, script];
}

interface ExternalPromise<T> {
	resolve: (value: T | PromiseLike<T>) => void;
	reject: () => void;
}

function createPromiseExternal<T>(): [Promise<T>, ExternalPromise<T>] {
	let promiseExternal: ExternalPromise<T>;
	const promise = new Promise<T>((resolve, reject) => {
		promiseExternal = { resolve, reject };
	});

	return [promise, promiseExternal!];
}

export interface ScriptsRef {
	promise: Promise<void>;
}

/**
 * Loads multiple scripts
 */
export const Scripts = forwardRef<ScriptsRef, { children?: ReactNode }>(
	function Scripts({ children }, ref) {
		const [promise, promiseExternal] = useMemo(
			() => createPromiseExternal<void>(),
			[],
		);

		useImperativeHandle(ref, () => ({
			promise,
		}));

		useEffect(() => {
			const abort = new AbortController();
			const scripts: HTMLScriptElement[] = [];

			(async function () {
				const iterableChildren = !children
					? []
					: Array.isArray(children)
					? children
					: [children];

				for (const child of iterableChildren) {
					if (child.type !== Script) continue;

					const [load, script] = loadScript(child.props.src);

					scripts.push(script);

					try {
						await load;
					} catch (err) {
						promiseExternal.reject();
					}
				}

				promiseExternal.resolve();
			})();

			return () => {
				abort.abort();
				for (const script of scripts) {
					script.remove();
				}
			};
		}, [promise, promiseExternal, children]);

		return <></>;
	},
);

export interface ScriptRef {
	promise: Promise<void>;
}

/**
 * Load a script
 * For loading multiple scripts (in order), use <Scripts>
 */
export const Script = forwardRef<ScriptRef, { src: string }>(
	function Script(props, ref) {
		const [promise, promiseExternal] = useMemo(
			() => createPromiseExternal<void>(),
			[],
		);

		useImperativeHandle(
			ref,
			() => ({
				promise,
			}),
			[promise],
		);

		useEffect(() => {
			const [promise, script] = loadScript(props.src);

			promise.then(promiseExternal.resolve).catch(promiseExternal.reject);

			return () => {
				script.remove();
			};
		}, [promise, promiseExternal, props.src]);

		return <></>;
	},
);

/**
 *
 * @param location Derived from useLocation
 * @returns
 */
export const getDestination = (location: Location) => {
	if (location.hash === '') throw new Error(i18n.t('compat:error.hash'));

	try {
		return decryptURL(location.hash.slice(1));
	} catch (err) {
		throw new Error(i18n.t('compat:error.decryptURL'));
	}
};

export interface CompatLayoutRef {
	report: (error: unknown, cause: string | undefined, origin: string) => void;
}

export default forwardRef<CompatLayoutRef, { children?: ReactNode }>(
	function CompatLayout({ children }, ref) {
		const { t } = useTranslation('compat');

		const [error, setError] = useState<{
			error: string;
			cause: string;
			origin: string;
		} | null>(null);

		useImperativeHandle(
			ref,
			() => ({
				report: (err: unknown, cause: string | undefined, origin: string) => {
					console.error(err);

					setError({
						error: String(err),
						cause: cause || 'unknown',
						origin,
					});
				},
			}),
			[],
		);

		return (
			<>
				{error ? (
					<CommonError
						cause={error.cause}
						error={error.error}
						message={t('error.generic', { what: error.origin })}
					/>
				) : (
					children
				)}
			</>
		);
	},
);
