import { ThemeA, ThemeLink } from './ThemeElements';
import { decryptURL } from './cryptURL';
import { ObfuscateLayout, Obfuscated } from './obfuscate';
import { getHot } from './routes';
import type { ReactNode } from 'react';
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useMemo,
	useState,
} from 'react';
import { useLocation } from 'react-router-dom';

function loadScript(
	src: string
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
export const Scripts = forwardRef<ScriptsRef, { children: ReactNode }>(
	function Scripts({ children }, ref) {
		const [promise, promiseExternal] = useMemo(
			() => createPromiseExternal<void>(),
			[]
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
	}
);

export interface ScriptRef {
	promise: Promise<void>;
}

/**
 * Load a script
 * For loading multiple scripts (in order), use <Scripts>
 */
export const Script = forwardRef<ScriptRef, { src: string }>(function Script(
	props,
	ref
) {
	const [promise, promiseExternal] = useMemo(
		() => createPromiseExternal<void>(),
		[]
	);

	useImperativeHandle(
		ref,
		() => ({
			promise,
		}),
		[promise]
	);

	useEffect(() => {
		const [promise, script] = loadScript(props.src);

		promise.then(promiseExternal.resolve).catch(promiseExternal.reject);

		return () => {
			script.remove();
		};
	}, [promise, promiseExternal, props.src]);

	return <></>;
});

export interface CompatLayoutRef {
	destination: string;
	report: (error: unknown, cause: string | undefined, origin: string) => void;
}

export default forwardRef<CompatLayoutRef, { children: ReactNode }>(
	function CompatLayout({ children }, ref) {
		const location = useLocation();

		const [error, setError] = useState<{
			error: string;
			cause: string;
			origin: string;
		} | null>(null);

		useImperativeHandle(
			ref,
			() => ({
				get destination() {
					if (location.hash === '') throw new Error('No hash was provided');

					return decryptURL(location.hash.slice(1));
				},
				report: (error: unknown, cause: string | undefined, origin: string) => {
					console.error(error);

					setError({
						error: String(error),
						cause: cause || 'unknown',
						origin,
					});
				},
			}),
			[location]
		);

		return (
			<>
				<ObfuscateLayout />
				{error ? (
					<main className="error">
						{' '}
						<span>
							An error occured when loading{' '}
							<Obfuscated>{error.origin}</Obfuscated>:
							<br />
							<pre>{error.cause || error.error}</pre>
						</span>
						<p>
							Try again by clicking{' '}
							<ThemeA
								href="i:"
								onClick={(event) => {
									event.preventDefault();
									global.location.reload();
								}}
							>
								here
							</ThemeA>
							.
							<br />
							If this problem still occurs, check our{' '}
							<ThemeLink to={getHot('faq').path} target="_parent">
								FAQ
							</ThemeLink>{' '}
							or{' '}
							<ThemeLink to={getHot('contact').path} target="_parent">
								Contact Us
							</ThemeLink>
							.
						</p>
					</main>
				) : (
					children
				)}
			</>
		);
	}
);
