import type { HolyPage } from '../../App';
import { useGlobalSettings } from '../../Layout';
import { ThemeSelect } from '../../ThemeElements';
import engines from '../../engines';
import { Obfuscated } from '../../obfuscate';
import styles from '../../styles/Settings.module.scss';
import { useTranslation } from 'react-i18next';

const Search: HolyPage = () => {
	const { t } = useTranslation();
	const [settings, setSettings] = useGlobalSettings();

	return (
		<section>
			<div>
				<p>
					<Obfuscated>{t('settings.proxy')}</Obfuscated>:
				</p>
				<ThemeSelect
					className={styles.ThemeSelect}
					onChange={(event) =>
						setSettings({
							...settings,
							proxy: event.target.value,
						})
					}
					defaultValue={settings.proxy}
				>
					<option value="automatic">{t('settings.automaticProxy')}</option>
					<option value="ultraviolet">Ultraviolet</option>
					<option value="rammerhead">Rammerhead</option>
					<option value="stomp">Stomp</option>
				</ThemeSelect>
			</div>
			<div>
				<p>
					<Obfuscated>{t('settings.searchEngine')}</Obfuscated>:
				</p>
				<ThemeSelect
					className={styles.ThemeSelect}
					onChange={(event) =>
						setSettings({
							...settings,
							search: event.target.value,
						})
					}
					defaultValue={settings.search}
				>
					{engines.map(({ name, format }) => (
						<option key={format} value={format}>
							{name}
						</option>
					))}
				</ThemeSelect>
			</div>
		</section>
	);
};

export default Search;
