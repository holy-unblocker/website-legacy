import CommonError from './CommonError';
import type { CategoryData, LoadingCategoryData } from './TheatreCommon';
import { isLoading } from './TheatreCommon';
import { ItemList, TheatreAPI } from './TheatreCommon';
import SearchBar from './TheatreSearchBar';
import { ThemeSelect } from './ThemeElements';
import { DB_API } from './consts';
import isAbortError from './isAbortError';
import { Obfuscated } from './obfuscate';
import styles from './styles/TheatreCategory.module.scss';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

const Category = ({
	name,
	category,
	placeholder,
	showCategory,
}: {
	name: string;
	category: string;
	placeholder?: string;
	showCategory?: boolean;
}) => {
	const { t } = useTranslation(['theatre', 'commonError']);
	const [search, setSearch] = useSearchParams();
	let page = parseInt(search.get('page')!);
	if (isNaN(page)) page = 0;
	const [lastTotal, setLastTotal] = useState(LIMIT * 2);
	const [data, setData] = useState<CategoryData | null>(null);
	const foundData = data || createLoading(lastTotal);
	const maxPage = Math.floor(foundData.total / LIMIT);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setData(null);

		const abort = new AbortController();

		(async function () {
			let leastGreatest = false;
			let sort;

			switch (search.get('sort')) {
				case 'leastPopular':
					leastGreatest = true;
				// fallthrough
				case 'mostPopular':
					sort = 'plays';
					break;
				case 'nameASC':
					leastGreatest = true;
				// fallthrough
				case 'nameDES':
					sort = 'name';
					break;
			}

			const api = new TheatreAPI(DB_API, abort.signal);

			try {
				const data = await api.category({
					category,
					sort,
					leastGreatest,
					offset: page * LIMIT,
					limit: LIMIT,
				});

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
	}, [page, category, search, t]);

	if (error)
		return (
			<CommonError
				cause={t('theatre:error.category.fetch')}
				error={error}
				message={t('theatre:error.category.generic')}
			/>
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
							search.delete('page');
							setSearch({
								...Object.fromEntries(search),
								sort: event.target.value,
							});
						}}
					>
						<option value="mostPopular">{t('theatre:mostPopular')}</option>
						<option value="leastPopular">{t('theatre:leastPopular')}</option>
						<option value="nameASC">{t('theatre:nameASC')}</option>
						<option value="nameDES">{t('theatre:nameDES')}</option>
					</ThemeSelect>
				</div>
				<ItemList className={styles.items} items={foundData.entries} />
			</section>
			<div className={clsx(styles.pages, maxPage === 0 && styles.useless)}>
				<ChevronLeft
					className={clsx(styles.button, !page && styles.disabled)}
					onClick={() => {
						if (!isLoading(foundData) && page)
							setSearch({
								...Object.fromEntries(search),
								page: Math.max(page - 1, 0).toString(),
							});
					}}
				/>
				<ChevronRight
					className={clsx(styles.button, page >= maxPage && styles.disabled)}
					onClick={() => {
						if (!isLoading(foundData) && page < maxPage)
							setSearch({
								...Object.fromEntries(search),
								page: (page + 1).toString(),
							});
					}}
				/>
			</div>
		</main>
	);
};

export default Category;
