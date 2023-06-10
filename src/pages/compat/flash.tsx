import type { HolyPage } from '../../App';
import type { ScriptRef } from '../../CompatLayout';
import { getDestination, Script } from '../../CompatLayout';
import { VITE_PUBLIC_PATH } from '../../routes';
import styles from '../../styles/CompatFlash.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface RufflePlayerElement extends HTMLElement {
	load(data: { url: string }): void;
	remove(): void;
}

declare const RufflePlayer: {
	newest(): {
		createPlayer(): RufflePlayerElement;
	};
};

const Flash: HolyPage = ({ compatLayout }) => {
	const { t } = useTranslation('compat');
	const location = useLocation();
	const container = useRef<HTMLElement | null>(null);
	const ruffleBundle = useRef<ScriptRef | null>(null);
	const [ruffleLoaded, setRuffleLoaded] = useState(false);

	useEffect(() => {
		let player: RufflePlayerElement | undefined;

		(async function () {
			if (!ruffleBundle.current || !container.current) return;

			let errorCause: string | undefined;

			try {
				errorCause = t('error.generic', { what: 'Ruffle' });
				await ruffleBundle.current.promise;
				errorCause = undefined;

				const ruffle = RufflePlayer.newest();
				player = ruffle.createPlayer();
				container.current.append(player);

				player.addEventListener('loadeddata', () => {
					setRuffleLoaded(true);
				});

				player.addEventListener('error', (event) => {
					throw event.error;
				});

				player.load({
					url: getDestination(location),
				});
			} catch (err) {
				compatLayout.current!.report(err, errorCause, 'Rammerhead');
			}
		})();

		return () => {
			player?.remove();
		};
	}, [compatLayout, location, ruffleBundle, t]);

	return (
		<main
			className={styles.main}
			data-loaded={Number(ruffleLoaded)}
			ref={container}
		>
			<Script src={`${VITE_PUBLIC_PATH}/ruffle/ruffle.js`} ref={ruffleBundle} />
			{!ruffleLoaded && t('loading', { what: 'Flash Player' })}
		</main>
	);
};

export default Flash;
