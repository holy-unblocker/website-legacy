import type { HolyPage } from '../../App';
import TheatreCategory from '../../TheatreCategory';
import categories from '../../gameCategories';
import { useSearchParams } from 'react-router-dom';

const Category: HolyPage = (props) => {
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id')!;
	const category = categories.find((category) => category.id === id);

	if (!category) return <>Bad category ID</>;

	return (
		<TheatreCategory
			{...props}
			key={id}
			name={category.name}
			category={id}
			id={id}
			placeholder="Search by game name"
		/>
	);
};

export default Category;
