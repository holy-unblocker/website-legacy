import type { HolyPage } from '../../App';
import { getDestination } from '../../CompatLayout';
import { RammerheadAPI, StrShuffler } from '../../RammerheadAPI';
import { RH_API } from '../../consts';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const Rammerhead: HolyPage = ({ compatLayout }) => {
	const { t } = useTranslation('compat');
	const location = useLocation();

	useEffect(() => {
		(async function () {
			let errorCause: string | undefined;

			try {
				const api = new RammerheadAPI(RH_API);

				// according to our NGINX config
				if (import.meta.env.NODE_ENV === 'production')
					Cookies.set('auth_proxy', '1', {
						domain: `.${globalThis.location.host}`,
						expires: 1000 * 60 * 60 * 24 * 7, // 1 week
						secure: globalThis.location.protocol === 'https:',
						sameSite: 'lax',
					});

				errorCause = t('error.unreachable', { what: 'Rammerhead' });
				await fetch(RH_API);
				errorCause = undefined;

				errorCause = t('error.rammerheadSavedSession');

				if (
					localStorage.rammerhead_session &&
					(await api.sessionExists(localStorage.rammerhead_session))
				) {
					const test = await fetch(
						new URL(localStorage.rammerhead_session, RH_API)
					);

					await api.deleteSession(localStorage.rammerhead_session);

					// 404 = good, 403 = Sessions must come from the same IP
					if (test.status === 403) delete localStorage.rammerhead_session;
				} else {
					delete localStorage.rammerhead_session;
				}

				errorCause = t('error.rammerheadNewSession');
				const session =
					localStorage.rammerhead_session || (await api.newSession());
				errorCause = undefined;

				errorCause = undefined;

				errorCause = t('error.rammerheadEditSession');
				await api.editSession(session, false, true);
				errorCause = undefined;

				errorCause = t('error.rammerheadDict');
				const dict = await api.shuffleDict(session);
				errorCause = undefined;

				const shuffler = new StrShuffler(dict);

				globalThis.location.replace(
					new URL(
						`${session}/${shuffler.shuffle(getDestination(location))}`,
						RH_API
					)
				);
			} catch (err) {
				compatLayout.current!.report(err, errorCause, 'Rammerhead');
			}
		})();
	}, [compatLayout, location, t]);

	return <main>{t('loading', { what: 'Rammerhead' })}</main>;
};

export default Rammerhead;
