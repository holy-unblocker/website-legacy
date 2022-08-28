import type { HolyPage } from '../../App';
import type { LoadingTheatreEntry, TheatreEntry } from '../../TheatreCommon';
import { ItemList, TheatreAPI } from '../../TheatreCommon';
import { DB_API } from '../../consts';
import { Obfuscated } from '../../obfuscate';
import styles from '../../styles/TheatreCategory.module.scss';
import { useEffect, useState } from 'react';

const FETCH_FAILED = /TypeError: Failed to fetch/;

const Favorites: HolyPage = ({ layout }) => {
	const [data, setData] = useState<(TheatreEntry | LoadingTheatreEntry)[]>(() =>
		layout.current!.settings.favorites.map((id) => ({
			loading: true,
			id,
			category: [],
		}))
	);

	useEffect(() => {
		const abort = new AbortController();

		(async function () {
			const api = new TheatreAPI(DB_API, abort.signal);
			const data = [];

			for (const id of layout.current!.settings.favorites) {
				try {
					data.push(await api.show(id));
				} catch (error) {
					// cancelled? page unload?
					if (error instanceof Error && !FETCH_FAILED.test(error.toString())) {
						console.warn('Unable to fetch entry:', id, error);
						layout.current!.settings.favorites.splice(
							layout.current!.settings.favorites.indexOf(id),
							1
						);
					}
				}
			}

			// update settings
			layout.current!.setSettings({
				...layout.current!.settings,
			});

			setData(data);
		})();

		return () => abort.abort();
	}, [layout]);

	if (layout.current!.settings.favorites.length === 0) {
		return (
			<main className="error">
				<p>You haven't added any favorites.</p>
			</main>
		);
	} else {
		return (
			<main className={styles.main}>
				<section>
					<div className={styles.name}>
						<h1>
							<Obfuscated>Favorites</Obfuscated>
						</h1>
					</div>
					<div className={styles.items}>
						<ItemList items={data} />
					</div>
				</section>
			</main>
		);
	}
};

export default Favorites;
