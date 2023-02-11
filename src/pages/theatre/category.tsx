import type { HolyPage } from '../../App';
import Meta from '../../Meta';
import TheatreCategory from '../../TheatreCategory';
import type { categoryKey } from '../../gameCategories';
import categories from '../../gameCategories';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

const CategoryMeta = ({ name }: { name: string }) => (
	<Meta title={name} description={`Find ${name} games on Holy Unblocker.`} />
);

const Category: HolyPage = (props) => {
	const { t } = useTranslation(['theatre', 'gameCategory']);
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id')!;
	const category = categories.find((category) => category.id === id);

	if (!category) return <>Bad category ID</>;

	const name = t(`gameCategory:${category.id as categoryKey}`);

	return (
		<>
			<CategoryMeta name={name} />
			<TheatreCategory
				{...props}
				key={id}
				name={name}
				category={id}
				placeholder={t('theatre:searchByGame')}
			/>
		</>
	);
};

export default Category;
