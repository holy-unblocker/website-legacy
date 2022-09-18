import type { HolyPage } from '../../../App';
import Category from '../../../TheatreCategory';
import categories from '../../../gameCategories';
import { useTranslation } from 'react-i18next';

const All: HolyPage = (props) => {
	const { t } = useTranslation();

	return (
		<Category
			name={t('theatre.allGames')}
			id="all"
			key="all"
			showCategory
			category={categories.map((category) => category.id).join(',')}
			placeholder={t('theatre.searchByGame')}
			{...props}
		/>
	);
};

export default All;
