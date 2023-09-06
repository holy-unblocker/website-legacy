import type { HolyPage } from '../../App';
import { useGlobalSettings } from '../../Layout';
import Meta from '../../Meta';
import { ThemeSelect } from '../../ThemeElements';
import engines from '../../engines';
import { Obfuscated } from '../../obfuscate';
import styles from '../../styles/Settings.module.scss';
import { useTranslation } from 'react-i18next';

const SearchMeta = () => <Meta title="Proxy Settings" />;

const Search: HolyPage = () => {
	const { t } = useTranslation(['settings', 'link']);
	const [settings, setSettings] = useGlobalSettings();

	return (
		<>
			<SearchMeta />
			<section>
				<div>
					<p>
						<Obfuscated>{t('settings:proxy.engine')}</Obfuscated>:
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
						<option value="automatic">{t('settings:automaticProxy')}</option>
						<option value="ultraviolet">Ultraviolet</option>
						<option value="rammerhead">Rammerhead</option>
					</ThemeSelect>
				</div>
				<div>
					<p>
						<Obfuscated>{t('settings:proxy.mode')}</Obfuscated>:
					</p>
					<ThemeSelect
						className={styles.ThemeSelect}
						onChange={(event) =>
							setSettings({
								...settings,
								proxyMode: event.target.value,
							})
						}
						defaultValue={settings.proxyMode}
					>
						<option value="embedded">
							{t('settings:proxy.setting.embedded')}
						</option>
						<option value="redirect">
							{t('settings:proxy.setting.redirect')}
						</option>
						<option value="about:blank">
							{t('settings:proxy.setting.ab')}
						</option>
					</ThemeSelect>
				</div>
				<div>
					<p>
						<Obfuscated>{t('settings:searchEngine')}</Obfuscated>:
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
		</>
	);
};

export default Search;
