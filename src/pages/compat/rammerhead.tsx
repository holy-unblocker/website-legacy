import type { HolyPage } from '../../App';
import { getDestination } from '../../CompatLayout';
import { RammerheadAPI, StrShuffler } from '../../RammerheadAPI';
import { RH_API } from '../../consts';
import i18n from '../../i18n';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const Rammerhead: HolyPage = ({ compatLayout }) => {
	const { t } = useTranslation();
	const location = useLocation();

	useEffect(() => {
		(async function () {
			let errorCause: string | undefined;

			try {
				const api = new RammerheadAPI(RH_API);

				// according to our NGINX config
				if (process.env.NODE_ENV === 'production')
					Cookies.set('auth_proxy', '1', {
						domain: `.${global.location.host}`,
						expires: 1000 * 60 * 60 * 24 * 7, // 1 week
						secure: global.location.protocol === 'https:',
						sameSite: 'lax',
					});

				errorCause = i18n.t('compat.error.unreachable', { what: 'Rammerhead' });
				await fetch(RH_API);
				errorCause = undefined;

				errorCause = i18n.t('compat.error.rammerheadSavedSession');

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

				errorCause = i18n.t('compat.error.rammerheadNewSession');
				const session =
					localStorage.rammerhead_session || (await api.newSession());
				errorCause = undefined;

				errorCause = undefined;

				errorCause = i18n.t('compat.error.rammerheadEditSession');
				await api.editSession(session, false, true);
				errorCause = undefined;

				errorCause = i18n.t('compat.error.rammerheadDict');
				const dict = await api.shuffleDict(session);
				errorCause = undefined;

				const shuffler = new StrShuffler(dict);

				global.location.replace(
					new URL(
						`${session}/${shuffler.shuffle(getDestination(location))}`,
						RH_API
					)
				);
			} catch (err) {
				compatLayout.current!.report(err, errorCause, 'Rammerhead');
			}
		})();
	}, [compatLayout, location]);

	return <main>{t('compat.loading', { what: 'Rammerhead' })}</main>;
};

export default Rammerhead;
