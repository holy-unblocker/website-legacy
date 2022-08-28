import type { HolyPage } from '../../App';
import { ThemeSelect } from '../../ThemeElements';
import engines from '../../engines';
import { Obfuscated } from '../../obfuscate';
import styles from '../../styles/Settings.module.scss';

const Search: HolyPage = ({ layout }) => {
	return (
		<section>
			<div>
				<span>
					<Obfuscated>Proxy</Obfuscated>:
				</span>
				<ThemeSelect
					className={styles.themeSelect}
					onChange={(event) =>
						layout.current!.setSettings({
							...layout.current!.settings,
							proxy: event.target.value,
						})
					}
					defaultValue={layout.current!.settings.proxy}
				>
					<option value="automatic">Automatic (Default)</option>
					<option value="ultraviolet">Ultraviolet</option>
					<option value="rammerhead">Rammerhead</option>
					<option value="stomp">Stomp</option>
				</ThemeSelect>
			</div>
			<div>
				<span>
					<Obfuscated>Search Engine</Obfuscated>:
				</span>
				<ThemeSelect
					className={styles.themeSelect}
					onChange={(event) =>
						layout.current!.setSettings({
							...layout.current!.settings,
							search: event.target.value,
						})
					}
					defaultValue={layout.current!.settings.search}
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
