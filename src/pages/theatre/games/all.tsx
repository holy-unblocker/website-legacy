import type { HolyPage } from '../../../App';
import Meta from '../../../Meta';
import Category from '../../../TheatreCategory';
import categories from '../../../gameCategories';
import { useTranslation } from 'react-i18next';

const AllGamesMeta = () => (
	<Meta title="Games" description="Find games on Holy Unblocker." />
);

const AllGames: HolyPage = (props) => {
	const { t } = useTranslation('theatre');

	return (
		<>
			<AllGamesMeta />
			<Category
				name={t('allGames')}
				key="all"
				showCategory
				category={categories.map((category) => category.id).join(',')}
				placeholder={t('searchByGame')}
				{...props}
			/>
		</>
	);
};

export default AllGames;
