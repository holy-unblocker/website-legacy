import type { HolyPage } from '../../App';
import TheatreCategory from '../../TheatreCategory';
import { useTranslation } from 'react-i18next';

const Apps: HolyPage = (props) => {
	const { t } = useTranslation('theatre');

	return (
		<TheatreCategory
			{...props}
			name={t('apps')}
			id="apps"
			key="apps"
			category="app"
			placeholder={t('searchByApp')}
		/>
	);
};

export default Apps;
