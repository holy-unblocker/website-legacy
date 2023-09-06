import type { CategoryData } from './TheatreCommon';
import { TheatreAPI } from './TheatreCommon';
import { ThemeInputBar, themeStyles } from './ThemeElements';
import { DB_API } from './consts';
import type { categoryKey } from './gameCategories';
import categories from './gameCategories';
import isAbortError from './isAbortError';
import { Obfuscated } from './obfuscate';
import { getHot } from './routes';
import styles from './styles/TheatreSearch.module.scss';
import Search from '@mui/icons-material/Search';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

const LIMIT = 8;

const SearchBar = ({
	category,
	placeholder,
	showCategory,
}: {
	category: string;
	placeholder?: string;
	showCategory?: boolean;
}) => {
	const { t } = useTranslation('gameCategory');
	const navigate = useNavigate();
	const input = useRef<HTMLInputElement | null>(null);
	const bar = useRef<HTMLDivElement | null>(null);
	const [categoryData, setCategoryData] = useState<CategoryData>({
		total: 0,
		entries: [],
	});
	const [lastSelect, setLastSelect] = useState(-1);
	const [inputFocused, setInputFocused] = useState(false);
	const searchAbort = useRef(new AbortController());

	async function search(query: string) {
		searchAbort.current.abort();
		searchAbort.current = new AbortController();

		const api = new TheatreAPI(DB_API, searchAbort.current.signal);

		try {
			const categoryData = await api.category({
				sort: 'search',
				search: query,
				limit: LIMIT,
				category,
			});

			setCategoryData(categoryData);
		} catch (err) {
			if (!isAbortError(err)) {
				console.error(err);
			}
		}
	}

	const renderSuggested = inputFocused && categoryData.entries.length !== 0;

	return (
		<div
			className={styles.search}
			data-focused={Number(inputFocused)}
			data-suggested={Number(renderSuggested)}
			ref={bar}
			onBlur={(event) => {
				if (!bar.current!.contains(event.relatedTarget)) {
					setInputFocused(false);
				}
			}}
		>
			<ThemeInputBar className={styles.ThemeInputBar}>
				<Search className={themeStyles.icon} />
				<input
					ref={input}
					type="text"
					className={themeStyles.thinPadLeft}
					placeholder={placeholder}
					onFocus={() => {
						setInputFocused(true);
						setLastSelect(-1);
						search(input.current!.value);
					}}
					onClick={() => {
						setInputFocused(true);
						setLastSelect(-1);
						search(input.current!.value);
					}}
					onKeyDown={(event) => {
						let preventDefault = true;

						switch (event.code) {
							case 'Escape':
								setInputFocused(false);
								break;
							case 'ArrowDown':
							case 'ArrowUp':
								{
									const lastI = lastSelect;

									let next;

									switch (event.code) {
										case 'ArrowDown':
											if (lastI >= categoryData.entries.length - 1) {
												next = 0;
											} else {
												next = lastI + 1;
											}
											break;
										case 'ArrowUp':
											if (lastI <= 0) {
												next = categoryData.entries.length - 1;
											} else {
												next = lastI - 1;
											}
											break;
										// no default
									}

									setLastSelect(next);
								}
								break;
							case 'Enter':
								{
									const entry = categoryData.entries[lastSelect];

									if (entry) {
										input.current!.blur();
										setInputFocused(false);
										navigate(`${getHot('theatre player').path}?id=${entry.id}`);
									}
								}
								break;
							default:
								preventDefault = false;
								break;
							// no default
						}

						if (preventDefault) {
							event.preventDefault();
						}
					}}
					onChange={(event) => {
						search(event.target.value);
						setLastSelect(-1);
					}}
				></input>
			</ThemeInputBar>
			<div
				className={styles.suggested}
				onMouseLeave={() => {
					setLastSelect(-1);
				}}
			>
				{renderSuggested &&
					categoryData.entries.map((entry, i) => (
						<Link
							tabIndex={0}
							key={entry.id}
							onClick={() => setInputFocused(false)}
							onMouseOver={() => setLastSelect(i)}
							to={`${getHot('theatre player').path}?id=${entry.id}`}
							title={entry.name}
							className={clsx(styles.option, i === lastSelect && styles.hover)}
						>
							<div className={styles.name}>
								<Obfuscated ellipsis>{entry.name}</Obfuscated>
							</div>
							{showCategory && entry.category[0] && (
								<div className={styles.category}>
									{t(
										categories.find(
											(category) => category.id === entry.category[0],
										)?.id as categoryKey,
									)}
								</div>
							)}
						</Link>
					))}
			</div>
		</div>
	);
};

export default SearchBar;
