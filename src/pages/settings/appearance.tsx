import type { HolyPage } from '../../App';
import { ThemeSelect } from '../../ThemeElements';
import styles from '../../styles/Settings.module.scss';

const Appearance: HolyPage = ({ layout }) => {
	return (
		<section>
			<div>
				<span>Theme:</span>
				<ThemeSelect
					className={styles.themeSelect}
					defaultValue={layout.current!.settings.theme}
					onChange={(event) => {
						layout.current!.setSettings({
							...layout.current!.settings,
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
