import type { HolyPage } from '../../App';
import type { ScriptsRef } from '../../CompatLayout';
import { getDestination, Script, Scripts } from '../../CompatLayout';
import { BARE_API, SERVICEWORKERS } from '../../consts';
import i18n from '../../i18n';
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
	const { t } = useTranslation();

	const uvBundle = useRef<ScriptsRef | null>(null);
	const location = useLocation();

	useEffect(() => {
		(async function () {
			if (!compatLayout.current || !uvBundle.current) return;

			let errorCause: string | undefined;

			try {
				if (!SERVICEWORKERS) {
					errorCause = i18n.t('compat.error.swHTTPS');
					throw new Error(errorCause);
				}

				if (!navigator.serviceWorker) {
					errorCause = i18n.t('compat.error.swSupport');
					throw new Error(errorCause);
				}

				errorCause = i18n.t('compat.error.genericBootstrapper');
				await uvBundle.current.promise;
				errorCause = undefined;

				const config = __uv$config;

				// register sw
				errorCause = i18n.t('compat.error.registeringSW');
				await navigator.serviceWorker.register('/uv/sw.js', {
					scope: config.prefix,
					updateViaCache: 'none',
				});
				errorCause = undefined;

				errorCause = i18n.t('compat.error.unreachable', { what: 'Bare' });
				{
					const bare = await fetch(BARE_API);
					if (!bare.ok) {
						throw await bare.json();
					}
				}
				errorCause = undefined;

				global.location.replace(
					new URL(
						config.encodeUrl(getDestination(location)),
						new URL(config.prefix, global.location.toString())
					)
				);
			} catch (err) {
				compatLayout.current.report(err, errorCause, 'Ultraviolet');
			}
		})();
	}, [compatLayout, location]);

	return (
		<main>
			<Scripts ref={uvBundle}>
				<Script src="/uv/uv.bundle.js" />
				<Script src="/uv/uv.config.js" />
			</Scripts>
			{t('compat.loading', { what: 'Ultraviolet' })}
		</main>
	);
};

export default Ultraviolet;
