import type { HolyPage } from '../../App';
import type { ScriptRef } from '../../CompatLayout';
import { Script } from '../../CompatLayout';
import { Obfuscated } from '../../obfuscate';
import styles from '../../styles/CompatFlash.module.scss';
import { useEffect, useRef, useState } from 'react';

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
	const container = useRef<HTMLElement | null>(null);
	const ruffleBundle = useRef<ScriptRef | null>(null);
	const [ruffleLoaded, setRuffleLoaded] = useState(false);

	useEffect(() => {
		let player: RufflePlayerElement | undefined;

		(async function () {
			if (!ruffleBundle.current || !container.current) return;

			let errorCause: string | undefined;

			try {
				errorCause = 'Error loading Ruffle player.';
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
					url: compatLayout.current!.destination.toString(),
				});
			} catch (error) {
				compatLayout.current!.report(error, errorCause, 'Rammerhead');
			}
		})();

		return () => {
			player?.remove();
		};
	}, [compatLayout, ruffleBundle]);

	return (
		<main
			className={styles.main}
			data-loaded={Number(ruffleLoaded)}
			ref={container}
		>
			<Script src="/ruffle/ruffle.js" ref={ruffleBundle} />
			{!ruffleLoaded && (
				<>
					Loading <Obfuscated>Flash Player</Obfuscated>...
				</>
			)}
		</main>
	);
};

export default Flash;
