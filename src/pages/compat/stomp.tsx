import type { HolyPage } from '../../App';
import type { ScriptRef } from '../../CompatLayout';
import { Script } from '../../CompatLayout';
import { BARE_API } from '../../consts';
import { Obfuscated } from '../../obfuscate';
import { useEffect, useRef } from 'react';

declare interface StompBootConfig {
	bare: string;
	directory: string;
	loglevel: number;
	codec: number;
}

declare class StompBoot {
	static readonly CODEC_PLAIN: number;
	static readonly CODEC_XOR: number;
	static readonly LOG_DEBUG: number;
	static readonly LOG_ERROR: number;
	static readonly LOG_INFO: number;
	static readonly LOG_SILENT: number;
	static readonly LOG_TRACE: number;
	static readonly LOG_WARN: number;
	constructor(config: StompBootConfig);
	html(url: string): string;
	ready: Promise<void>;
}

const Stomp: HolyPage = ({ compatLayout }) => {
	const bootstrapper = useRef<ScriptRef | null>(null);

	useEffect(() => {
		(async function () {
			if (!compatLayout.current || !bootstrapper.current) return;

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

				errorCause = 'Failure loading the Stomp bootstrapper.';
				await bootstrapper.current.promise;
				errorCause = undefined;

				const config = {
					bare: BARE_API,
					directory: '/stomp/',
				} as Partial<StompBootConfig>;

				if (process.env.NODE_ENV === 'development') {
					config.loglevel = StompBoot.LOG_TRACE;
					config.codec = StompBoot.CODEC_PLAIN;
				} else {
					config.loglevel = StompBoot.LOG_ERROR;
					config.codec = StompBoot.CODEC_XOR;
				}

				const boot = new StompBoot(config as StompBootConfig);

				errorCause = 'Failure registering the Stomp Service Worker.';
				await boot.ready;
				errorCause = undefined;

				errorCause = 'Bare server is unreachable.';
				{
					const bare = await fetch(BARE_API);
					if (!bare.ok) {
						throw await bare.json();
					}
				}
				errorCause = undefined;

				global.location.replace(boot.html(compatLayout.current.destination));
			} catch (error) {
				compatLayout.current.report(error, errorCause, 'Stomp');
			}
		})();
	}, [compatLayout, bootstrapper]);

	return (
		<main className="compat">
			<Script src="/stomp/bootstrapper.js" ref={bootstrapper} />
			Loading <Obfuscated>Stomp</Obfuscated>...
		</main>
	);
};

export default Stomp;
