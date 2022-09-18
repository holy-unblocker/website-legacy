import type { HolyPage } from '../../App';
import TheatreCategory from '../../TheatreCategory';
import categories from '../../gameCategories';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

const Category: HolyPage = (props) => {
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id')!;
	const category = categories.find((category) => category.id === id);

	if (!category) return <>Bad category ID</>;

	return (
		<TheatreCategory
			{...props}
			key={id}
			name={t(`gameCategory.${category.id}`)}
			category={id}
			id={id}
			placeholder={t('theatre.searchByGame')}
		/>
	);
};

export default Category;
