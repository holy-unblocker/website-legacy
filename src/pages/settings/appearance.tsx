import type { HolyPage } from '../../App';
import { useGlobalSettings } from '../../Layout';
import { ThemeSelect } from '../../ThemeElements';
import styles from '../../styles/Settings.module.scss';

const Appearance: HolyPage = ({ layout }) => {
	const [settings, setSettings] = useGlobalSettings();

	return (
		<section>
			<div>
				<span>Theme:</span>
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
					<option value="day">Day</option>
					<option value="night">Night</option>
				</ThemeSelect>
			</div>
		</section>
	);
};

export default Appearance;
