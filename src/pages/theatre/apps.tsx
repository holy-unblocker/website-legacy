import type { HolyPage } from '../../App';
import TheatreCategory from '../../TheatreCategory';
import { useTranslation } from 'react-i18next';

const Apps: HolyPage = (props) => {
	const { t } = useTranslation();

	return (
		<TheatreCategory
			{...props}
			name={t('theatre.apps')}
			id="apps"
			key="apps"
			category="app"
			placeholder={t('theatre.searchByApp')}
		/>
	);
};

export default Apps;
