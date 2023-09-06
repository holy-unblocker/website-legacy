import type { HolyPage } from '../../App';
import { useGlobalSettings } from '../../Layout';
import Meta from '../../Meta';
import type { LoadingTheatreEntry, TheatreEntry } from '../../TheatreCommon';
import { ItemList, TheatreAPI } from '../../TheatreCommon';
import { DB_API } from '../../consts';
import { isFailedToFetch } from '../../isAbortError';
import { Obfuscated } from '../../obfuscate';
import styles from '../../styles/TheatreCategory.module.scss';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const FavoritesMeta = () => <Meta title="Favorites" />;

const Favorites: HolyPage = ({ layout }) => {
	const [settings, setSettings] = useGlobalSettings();
	const { t } = useTranslation('theatre');

	const [data, setData] = useState<(TheatreEntry | LoadingTheatreEntry)[]>(() =>
		settings.favorites.map((id) => ({
			loading: true,
			id,
			category: [],
		})),
	);

	useEffect(() => {
		const abort = new AbortController();

		(async function () {
			const api = new TheatreAPI(DB_API, abort.signal);
			const data = [];

			for (const id of settings.favorites) {
				try {
					data.push(await api.show(id));
				} catch (err) {
					// cancelled? page unload?
					if (!isFailedToFetch(err)) {
						console.warn('Unable to fetch entry:', id, err);
						settings.favorites.splice(settings.favorites.indexOf(id), 1);
					}
				}
			}

			// update settings
			setSettings({
				...settings,
			});

			setData(data);
		})();

		return () => abort.abort();
	}, [layout, setSettings, settings]);

	if (settings.favorites.length === 0)
		return (
			<>
				<FavoritesMeta />
				<main className="error">
					<p>{t('noFavorites')}</p>
				</main>
			</>
		);

	return (
		<>
			<FavoritesMeta />{' '}
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
		</>
	);
};

export default Favorites;
