import type { HolyPage } from '../../../App';
import CommonError from '../../../CommonError';
import Meta from '../../../Meta';
import type {
	CategoryData,
	LoadingCategoryData,
	LoadingTheatreEntry,
	TheatreEntry,
} from '../../../TheatreCommon';
import { ItemList, TheatreAPI } from '../../../TheatreCommon';
import SearchBar from '../../../TheatreSearchBar';
import { ThemeLink } from '../../../ThemeElements';
import { DB_API } from '../../../consts';
import categories from '../../../gameCategories';
import type { Category, categoryKey } from '../../../gameCategories';
import isAbortError from '../../../isAbortError';
import { getHot } from '../../../routes';
import styles from '../../../styles/TheatreCategory.module.scss';
import ArrowForward from '@mui/icons-material/ArrowForward';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const entryLimit = 8;

const categoryQuery = categories.map((category) => category.id).join(',');

const PopularMeta = () => (
	<Meta title="Popular Games" description="Popular games on Holy Unblocker." />
);

const Popular: HolyPage = () => {
	const { t } = useTranslation(['theatre', 'gameCategory']);

	const [data, setData] = useState<CategoryData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const foundData = data || getPopularLoadingCategories();

	useEffect(() => {
		const abort = new AbortController();

		(async function () {
			const api = new TheatreAPI(DB_API, abort.signal);

			try {
				const data = await api.category({
					sort: 'plays',
					category: categoryQuery,
					limitPerCategory: entryLimit,
				});

				setData(data);
			} catch (err) {
				if (!isAbortError(err)) {
					console.error(err);
					setError(String(err));
				}
			}
		})();

		return () => abort.abort();
	}, []);

	if (error) {
		return (
			<>
				<PopularMeta />
				<CommonError
					error={error}
					message={t('theatre:error.category.popularGames')}
				/>
			</>
		);
	}

	const _categories: Record<
		string,
		{ entries: (TheatreEntry | LoadingTheatreEntry)[]; category: Category }
	> = {};

	for (const category of categories)
		_categories[category.id] = {
			entries: [],
			category: category,
		};

	for (const item of foundData.entries)
		_categories[item.category[0]].entries.push(item);

	return (
		<>
			<PopularMeta />
			<main className={styles.main}>
				<SearchBar
					showCategory
					category={categoryQuery}
					placeholder={t('theatre:searchByGame')}
				/>
				{Object.values(_categories).map((section) => {
					return (
						<section className={styles.expand} key={section.category.id}>
							<div className={styles.name}>
								<h1>
									{t(
										`gameCategory:${section.category.id as categoryKey}`,
									).toString()}
								</h1>
								<ThemeLink
									to={`${getHot('theatre games category').path}?id=${
										section.category.id
									}`}
									className={styles.seeAll}
								>
									{t('theatre:seeAll')}
									<ArrowForward />
								</ThemeLink>
							</div>
							<ItemList
								className={clsx(styles.items, styles.flex)}
								items={section.entries}
							/>
						</section>
					);
				})}
			</main>
		</>
	);
};

export default Popular;

function getPopularLoadingCategories() {
	const loadingCategories: LoadingCategoryData = {
		total: 0,
		entries: [],
		loading: true,
	};

	for (const category of categories)
		for (let i = 0; i < entryLimit; i++)
			loadingCategories.entries.push({
				id: i.toString(),
				loading: true,
				category: [category.id],
			});

	return loadingCategories;
}
