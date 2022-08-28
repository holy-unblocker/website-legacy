import type { HolyPage } from '../../../App';
import Category from '../../../TheatreCategory';
import categories from '../../../gameCategories';

const All: HolyPage = (props) => {
	return (
		<Category
			name="All Games"
			id="all"
			key="all"
			showCategory
			category={categories.map((category) => category.id).join(',')}
			placeholder="Search by game name"
			{...props}
		/>
	);
};

export default All;
