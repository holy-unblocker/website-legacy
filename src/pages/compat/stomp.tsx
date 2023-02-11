import type { HolyPage } from '../../App';
import type { ScriptRef } from '../../CompatLayout';
import { getDestination } from '../../CompatLayout';
import { Script } from '../../CompatLayout';
import { BARE_API, SERVICEWORKERS, STOMP_DIR } from '../../consts';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface StompBootConfig {
	bare_server: string;
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
	const { t } = useTranslation('compat');
	const location = useLocation();
	const bootstrapper = useRef<ScriptRef | null>(null);

	useEffect(() => {
		(async function () {
			if (!compatLayout.current || !bootstrapper.current) return;

			let errorCause: string | undefined;

			try {
				if (!SERVICEWORKERS) {
					errorCause = t('error.swHTTPS');
					throw new Error(errorCause);
				}

				if (!navigator.serviceWorker) {
					errorCause = t('error.swSupport');
					throw new Error(errorCause);
				}

				errorCause = t('error.generic', { what: 'Stomp' });
				await bootstrapper.current.promise;
				errorCause = undefined;

				const config = {
					// eslint-disable-next-line camelcase
					bare_server: BARE_API,
					directory: `/${STOMP_DIR}/`,
				} as Partial<StompBootConfig>;

				if (process.env.NODE_ENV === 'development') {
					config.loglevel = StompBoot.LOG_TRACE;
					config.codec = StompBoot.CODEC_PLAIN;
				} else {
					config.loglevel = StompBoot.LOG_ERROR;
					config.codec = StompBoot.CODEC_XOR;
				}

				const boot = new StompBoot(config as StompBootConfig);

				errorCause = t('error.registeringSW');
				await boot.ready;
				errorCause = undefined;

				errorCause = t('error.unreachable', { what: 'Bare' });
				{
					const bare = await fetch(BARE_API);
					if (!bare.ok) {
						throw await bare.json();
					}
				}
				errorCause = undefined;

				global.location.replace(boot.html(getDestination(location)));
			} catch (err) {
				compatLayout.current.report(err, errorCause, 'Stomp');
			}
		})();
	}, [compatLayout, bootstrapper, location, t]);

	return (
		<main>
			<Script
				src={`${process.env.PUBLIC_PATH}/${STOMP_DIR}/bootstrapper.js`}
				ref={bootstrapper}
			/>
			{t('loading', { what: 'Stomp' })}
		</main>
	);
};

export default Stomp;
