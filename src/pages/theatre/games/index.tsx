import type { HolyPage } from '../../../App';
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
import type { Category } from '../../../gameCategories';
import isAbortError from '../../../isAbortError';
import { Obfuscated } from '../../../obfuscate';
import resolveRoute from '../../../resolveRoute';
import styles from '../../../styles/TheatreCategory.module.scss';
import { ArrowForward } from '@mui/icons-material';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const entryLimit = 8;
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

const categoryQuery = categories.map((category) => category.id).join(',');

const Popular: HolyPage = () => {
	const [data, setData] = useState<LoadingCategoryData | CategoryData>(
		loadingCategories
	);

	const [error, setError] = useState<string | null>(null);

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
			} catch (error) {
				if (error instanceof Error && !isAbortError(error)) {
					console.error(error);
					setError(error.toString());
				}
			}
		})();

		return () => abort.abort();
	}, []);

	if (error) {
		return (
			<main className="error">
				<span>
					An error occured when loading popular <Obfuscated>games</Obfuscated>
					:
					<br />
					<pre>{error}</pre>
				</span>
				<p>
					Try again by clicking{' '}
					<a
						href="i:"
						onClick={(event) => {
							event.preventDefault();
							global.location.reload();
						}}
					>
						here
					</a>
					.
					<br />
					If this problem still occurs, check{' '}
					<ThemeLink to={resolveRoute('/', 'faq')} target="_parent">
						Support
					</ThemeLink>{' '}
					or{' '}
					<ThemeLink to={resolveRoute('/', 'contact')} target="_parent">
						Contact Us
					</ThemeLink>
					.
				</p>
			</main>
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

	for (const item of data.entries)
		_categories[item.category[0]].entries.push(item);

	return (
		<main className={styles.main}>
			<SearchBar
				showCategory
				category={categoryQuery}
				placeholder="Search by game name"
			/>
			{Object.values(_categories).map((section) => {
				return (
					<section className={styles.expand} key={section.category.id}>
						<div className={styles.name}>
							<h1>{section.category.name}</h1>
							<Link
								to={`${resolveRoute('/theatre/', 'category')}?id=${
									section.category.id
								}`}
								className="theme-link see-all"
							>
								See All
								<ArrowForward />
							</Link>
						</div>
						<ItemList
							className={clsx(styles.items, styles.flex)}
							items={section.entries}
						/>
					</section>
				);
			})}
		</main>
	);
};

export default Popular;
