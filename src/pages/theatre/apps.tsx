import type { HolyPage } from '../../App';
import TheatreCategory from '../../TheatreCategory';

const Apps: HolyPage = (props) => {
	return (
		<TheatreCategory
			{...props}
			name="Apps"
			id="apps"
			key="apps"
			category="app"
			placeholder="Search by app name"
		/>
	);
};

export default Apps;
