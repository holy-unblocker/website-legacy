import type { HolyPage } from '../../App';
import type { ScriptsRef } from '../../CompatLayout';
import { getDestination, Script, Scripts } from '../../CompatLayout';
import { BARE_API, SERVICEWORKERS } from '../../consts';
import { VITE_PUBLIC_PATH } from '../../routes';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

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
	const { t } = useTranslation('compat');

	const uvBundle = useRef<ScriptsRef | null>(null);
	const location = useLocation();

	useEffect(() => {
		(async function () {
			if (!compatLayout.current || !uvBundle.current) return;

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

				errorCause = t('error.generic', { what: 'Ultraviolet' });
				await uvBundle.current.promise;
				errorCause = undefined;

				const config = __uv$config;

				// register sw
				errorCause = t('error.registeringSW');
				await navigator.serviceWorker.register(`${VITE_PUBLIC_PATH}/uv/sw.js`, {
					scope: config.prefix,
					updateViaCache: 'none',
				});
				errorCause = undefined;

				errorCause = t('error.unreachable', { what: 'Bare' });
				{
					const bare = await fetch(BARE_API);
					if (!bare.ok) {
						throw await bare.json();
					}
				}
				errorCause = undefined;

				globalThis.location.replace(
					new URL(
						config.encodeUrl(getDestination(location)),
						new URL(config.prefix, globalThis.location.toString()),
					),
				);
			} catch (err) {
				compatLayout.current.report(err, errorCause, 'Ultraviolet');
			}
		})();
	}, [compatLayout, location, t]);

	return (
		<main>
			<Scripts ref={uvBundle}>
				<Script src={`${import.meta.env.VITE_PUBLIC_PATH}/uv/uv.bundle.js`} />
				<Script src={`${import.meta.env.VITE_PUBLIC_PATH}/uv/uv.config.js`} />
			</Scripts>
			{t('loading', { what: 'Ultraviolet' })}
		</main>
	);
};

export default Ultraviolet;
