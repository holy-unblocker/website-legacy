import type { HolyPage } from '../../App';
import { useGlobalSettings } from '../../Layout';
import { ThemeSelect } from '../../ThemeElements';
import type { i18nLanguage } from '../../i18n';
import { getLanguage, setLanguage } from '../../i18n';
import styles from '../../styles/Settings.module.scss';
import { useTranslation } from 'react-i18next';

const Appearance: HolyPage = ({ layout }) => {
	const { t } = useTranslation();
	const [settings, setSettings] = useGlobalSettings();

	return (
		<section>
			<div>
				<p>{t('settings.language')}:</p>
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
				<p>{t('settings.theme')}:</p>
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
					<option value="day">{t('settings.themeDay')}</option>
					<option value="night">{t('settings.themeNight')}</option>
				</ThemeSelect>
			</div>
		</section>
	);
};

export default Appearance;
