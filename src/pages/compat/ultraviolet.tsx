import type { HolyPage } from '../../App';
import type { ScriptsRef } from '../../CompatLayout';
import { Script, Scripts } from '../../CompatLayout';
import { BARE_API } from '../../consts';
import { Obfuscated } from '../../obfuscate';
import { useEffect, useRef } from 'react';

type UVEncode = (encoded: string) => string;
type UVDecode = (encoded: string) => string;

interface UVConfig {
	bare: string;
	prefix: string;
	handler: string;
	bundle: string;
	config: string;
	sw: string;
	encodeUrl: UVEncode;
	decodeUrl: UVDecode;
}

declare const __uv$config: UVConfig;

const Ultraviolet: HolyPage = ({ compatLayout }) => {
	const uvBundle = useRef<ScriptsRef | null>(null);

	useEffect(() => {
		(async function () {
			if (!compatLayout.current || !uvBundle.current) return;

			let errorCause: string | undefined;

			try {
				if (
					process.env.NODE_ENV !== 'development' &&
					global.location.protocol !== 'https:'
				) {
					errorCause = 'Stomp must be used under HTTPS.';
					throw new Error(errorCause);
				}

				if (!('serviceWorker' in navigator)) {
					errorCause = "Your browser doesn't support service workers.";
					throw new Error(errorCause);
				}

				errorCause = 'Failure loading the Ultraviolet bundle.';
				await uvBundle.current.promise;
				errorCause = undefined;

				const config = __uv$config;

				// register sw
				errorCause = 'Failure registering the Ultraviolet Service Worker.';
				await navigator.serviceWorker.register('/uv/sw.js', {
					scope: config.prefix,
					updateViaCache: 'none',
				});
				errorCause = undefined;

				errorCause = 'Bare server is unreachable.';
				{
					const bare = await fetch(BARE_API);
					if (!bare.ok) {
						throw await bare.json();
					}
				}
				errorCause = undefined;

				global.location.replace(
					new URL(
						config.encodeUrl(compatLayout.current.destination),
						new URL(config.prefix, global.location.toString())
					)
				);
			} catch (error) {
				compatLayout.current.report(error, errorCause, 'Ultraviolet');
			}
		})();
	}, [compatLayout]);

	return (
		<main className="compat">
			<Scripts ref={uvBundle}>
				<Script src="/uv/uv.bundle.js" />
				<Script src="/uv/uv.config.js" />
			</Scripts>
			Loading <Obfuscated>Ultraviolet</Obfuscated>...
		</main>
	);
};

export default Ultraviolet;
