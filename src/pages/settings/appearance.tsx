import type { HolyPage } from '../../App';
import { useGlobalSettings } from '../../Layout';
import Meta from '../../Meta';
import { ThemeSelect } from '../../ThemeElements';
import type { i18nLanguage } from '../../i18n';
import { getLanguage, setLanguage } from '../../i18n';
import styles from '../../styles/Settings.module.scss';
import { useTranslation } from 'react-i18next';

const AppearanceMeta = () => <Meta title="Appearance Settings" />;

const Appearance: HolyPage = () => {
	const { t } = useTranslation('settings');
	const [settings, setSettings] = useGlobalSettings();

	return (
		<>
			<AppearanceMeta />
			<section>
				<div>
					<p>{t('language')}:</p>
					<ThemeSelect
						className={styles.ThemeSelect}
						defaultValue={getLanguage()}
						onChange={(event) => {
							setLanguage(event.target.value as i18nLanguage);
						}}
					>
						<option value="en">English</option>
						<option value="fr">Français</option>
					</ThemeSelect>
				</div>
				<div>
					<p>{t('theme')}:</p>
					<ThemeSelect
						className={styles.ThemeSelect}
						defaultValue={settings.theme}
						onChange={(event) => {
							setSettings({
								...settings,
								theme: event.target.value,
							});
						}}
					>
						<option value="day">{t('themeDay')}</option>
						<option value="night">{t('themeNight')}</option>
					</ThemeSelect>
				</div>
			</section>
		</>
	);
};

export default Appearance;
