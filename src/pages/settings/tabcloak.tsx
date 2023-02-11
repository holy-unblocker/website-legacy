import type { HolyPage } from '../../App';
import { useGlobalCloakSettings } from '../../Layout';
import Meta from '../../Meta';
import { ThemeButton, ThemeInputBar, themeStyles } from '../../ThemeElements';
import { extractData } from '../../mask';
import { Obfuscated } from '../../obfuscate';
import styles from '../../styles/Settings.module.scss';
import Check from '@mui/icons-material/Check';
import clsx from 'clsx';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

const TabCloakMeta = () => <Meta title="Tab Cloak Settings" />;

const TabCloak: HolyPage = ({ layout }) => {
	const { t } = useTranslation(['settings', 'commonError']);
	const [cloak, setCloak] = useGlobalCloakSettings();
	const input = useRef<HTMLInputElement | null>(null);

	async function onSubmit() {
		try {
			layout.current!.notifications.current!({
				description: t('settings:tabMask.notification.fetching'),
				type: 'info',
			});

			const data = await extractData(input.current!.value);
			input.current!.value = data.url;
			setCloak(data);

			layout.current!.notifications.current!({
				description: t('settings:tabMask.notification.set'),
				type: 'success',
			});
		} catch (err) {
			console.error(err);

			layout.current!.notifications.current!({
				title: t('settings:tabMask.notification.failure'),
				description:
					err instanceof Error
						? err.message
						: (t('commonError:unknownError') as string),
				type: 'error',
			});
		}
	}

	return (
		<>
			<TabCloakMeta />
			<section>
				<p>
					<Obfuscated>{t('settings:tabMask.description')}</Obfuscated>
				</p>
				<div>
					<p>
						<Obfuscated>{t('settings:tabMask.urlField')}</Obfuscated>:
					</p>
					<form
						onSubmit={(event) => {
							event.preventDefault();
							onSubmit();
						}}
					>
						<ThemeInputBar className={styles.ThemeInputBar}>
							<input
								className={themeStyles.themePadRight}
								defaultValue={cloak.url}
								placeholder="https://example.org/"
								ref={input}
							/>
							<Check
								onClick={onSubmit}
								className={clsx(themeStyles.button, themeStyles.right)}
							/>
						</ThemeInputBar>
					</form>
				</div>
				<div>
					<ThemeButton
						onClick={() => {
							setCloak({
								title: '',
								icon: '',
								url: '',
							});

							input.current!.value = '';

							layout.current!.notifications.current!({
								description: t('settings:tabMask.notification.reset'),
								type: 'info',
							});
						}}
					>
						<Obfuscated>{t('settings:tabMask.resetButton')}</Obfuscated>
					</ThemeButton>
				</div>
			</section>
		</>
	);
};

export default TabCloak;
