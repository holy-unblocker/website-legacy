import type { HolyPage } from './App';
import type { CategoryData, LoadingCategoryData } from './TheatreCommon';
import { isLoading } from './TheatreCommon';
import { ItemList, TheatreAPI } from './TheatreCommon';
import SearchBar from './TheatreSearchBar';
import { ThemeLink, ThemeSelect } from './ThemeElements';
import { DB_API } from './consts';
import isAbortError from './isAbortError';
import { Obfuscated } from './obfuscate';
import { getHot } from './routes';
import styles from './styles/TheatreCategory.module.scss';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const LIMIT = 30;

function createLoading(total: number) {
	const loading: LoadingCategoryData = {
		total,
		entries: [],
		loading: true,
	};

	for (let i = 0; i < LIMIT; i++) {
		loading.entries.push({
			id: i.toString(),
			loading: true,
			category: [],
		});
	}

	return loading;
}

const Category: HolyPage<{
	name: string;
	category: string;
	placeholder?: string;
	id: string;
	showCategory?: boolean;
}> = ({ name, category, placeholder, id, showCategory }) => {
	const [search, setSearch] = useSearchParams();
	let page = parseInt(search.get('page')!);
	if (isNaN(page)) page = 0;
	const [lastTotal, setLastTotal] = useState(LIMIT * 2);
	const [data, setData] = useState<LoadingCategoryData | CategoryData>(() =>
		createLoading(lastTotal)
	);
	const maxPage = Math.floor(data.total / LIMIT);
	const errorCause = useRef<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const abort = new AbortController();

		(async function () {
			let leastGreatest = false;
			let sort;

			switch (search.get('sort')) {
				case 'Least Popular':
					leastGreatest = true;
				// falls through
				case 'Most Popular':
					sort = 'plays';
					break;
				case 'Least Favorites':
					leastGreatest = true;
				// falls through
				case 'Most Favorites':
					sort = 'favorites';
					break;
				case 'Name (Z-A)':
					leastGreatest = true;
				// falls through
				case 'Name (A-Z)':
					sort = 'name';
					break;
			}

			const api = new TheatreAPI(DB_API, abort.signal);

			errorCause.current = 'Unable to fetch the category data.';

			try {
				const data = await api.category({
					category,
					sort,
					leastGreatest,
					offset: page * LIMIT,
					limit: LIMIT,
				});

				errorCause.current = null;
				setData(data);
				setLastTotal(data.total);
			} catch (err) {
				if (!isAbortError(err)) {
					console.error(err);
					setError(String(err));
				}
			}
		})();

		return () => abort.abort();
	}, [page, category, search]);

	if (error)
		return (
			<main className="error">
				<span>
					An error occured when loading the category:
					<br />
					<pre>{errorCause.current || error.toString()}</pre>
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
					<ThemeLink to={getHot('faq').path} target="_parent">
						Support
					</ThemeLink>{' '}
					or{' '}
					<ThemeLink to={getHot('contact').path} target="_parent">
						Contact Us
					</ThemeLink>
					.
				</p>
			</main>
		);

	return (
		<main className={styles.main}>
			<SearchBar
				showCategory={showCategory}
				category={category}
				placeholder={placeholder}
			/>
			<section>
				<div className={styles.name}>
					<h1>
						<Obfuscated ellipsis>{name}</Obfuscated>
					</h1>
					<ThemeSelect
						className={styles.sort}
						defaultValue={search.get('sort')!}
						onChange={(event) => {
							setData(createLoading(lastTotal));
							setSearch({
								...Object.fromEntries(search),
								sort: event.target.value,
							});
						}}
					>
						<option value="Most Popular">Most Popular</option>
						<option value="Least Popular">Least Popular</option>
						<option value="Name (A-Z)">Name (A-Z)</option>
						<option value="Name (Z-A)">Name (Z-A)</option>
					</ThemeSelect>
				</div>
				<ItemList className={styles.items} items={data.entries} />
			</section>
			<div className={clsx(styles.pages, maxPage === 0 && styles.useless)}>
				<ChevronLeft
					className={clsx(styles.button, !page && styles.disabled)}
					onClick={() => {
						if (!isLoading(data) && page) {
							setSearch({
								...Object.fromEntries(search),
								page: Math.max(page - 1, 0).toString(),
							});
						}
					}}
				/>
				<ChevronRight
					className={clsx(styles.button, page >= maxPage && styles.disabled)}
					onClick={() => {
						if (!isLoading(data) && page < maxPage) {
							setSearch({
								...Object.fromEntries(search),
								page: (page + 1).toString(),
							});
						}
					}}
				/>
			</div>
		</main>
	);
};

export default Category;
