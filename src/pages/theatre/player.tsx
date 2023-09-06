import type { HolyPage } from '../../App';
import CommonError from '../../CommonError';
import { useGlobalSettings } from '../../Layout';
import Meta from '../../Meta';
import resolveProxy from '../../ProxyResolver';
import { TheatreAPI } from '../../TheatreCommon';
import type { TheatreEntry } from '../../TheatreCommon';
import { DB_API, THEATRE_CDN } from '../../consts';
import { encryptURL } from '../../cryptURL';
import isAbortError from '../../isAbortError';
import { Obfuscated } from '../../obfuscate';
import { getHot } from '../../routes';
import styles from '../../styles/TheatrePlayer.module.scss';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import ArrowDropUp from '@mui/icons-material/ArrowDropUp';
import ArrowLeft from '@mui/icons-material/ArrowLeft';
import ArrowRight from '@mui/icons-material/ArrowRight';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import Close from '@mui/icons-material/Close';
import Fullscreen from '@mui/icons-material/Fullscreen';
import Panorama from '@mui/icons-material/Panorama';
import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import VideogameAsset from '@mui/icons-material/VideogameAsset';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

async function resolveSrc(
	src: TheatreEntry['src'],
	type: TheatreEntry['type'],
) {
	switch (type) {
		case 'proxy':
			return await resolveProxy(src, 'automatic');
		case 'embed':
			return src;
		case 'flash':
			return `${getHot('compat flash').path}#${encryptURL(src)}`;
		case 'emulator':
		case 'emulator.gba':
		case 'emulator.nes':
		case 'emulator.n64':
		case 'emulator.genesis':
			return new URL(
				'./html5/webretro/?' +
					new URLSearchParams({
						rom: src,
						core: 'autodetect',
					}),
				THEATRE_CDN,
			).toString();
		default:
			throw new TypeError(`Unrecognized target: ${type}`);
	}
}

// Play ... may not be appropiate for apps
// Play TikTok
const PlayerMeta = ({ name }: { name?: string }) => (
	<Meta
		title={name || 'Player'}
		description={name ? `${name} on Holy Unblocker.` : undefined}
	/>
);

const Player: HolyPage = () => {
	const { t } = useTranslation('theatre');
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id')!;
	if (!id) throw new Error('Bad ID');
	const [settings, setSettings] = useGlobalSettings();
	const [favorited, setFavorited] = useState(() =>
		settings.favorites.includes(id),
	);
	const [panorama, setPanorama] = useState(false);
	const [controlsExpanded, setControlsExpanded] = useState(false);
	const [error, setError] = useState<{
		cause?: string;
		message: string;
	} | null>(null);
	const [data, setData] = useState<TheatreEntry | null>(null);
	const iframe = useRef<HTMLIFrameElement | null>(null);
	const controlsOpen = useRef<HTMLDivElement | null>(null);
	const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);
	const controlsPopup = useRef<HTMLDivElement | null>(null);
	const [iframeFocused, setIFrameFocused] = useState(true);

	useEffect(() => {
		const abort = new AbortController();

		(async function () {
			let errorCause: string | undefined;

			const api = new TheatreAPI(DB_API, abort.signal);

			try {
				errorCause = t('error.player.fetch');
				const data = await api.show(id);
				errorCause = undefined;
				errorCause = t('error.player.resolve');
				const resolvedSrc = await resolveSrc(
					new URL(data.src, THEATRE_CDN).toString(),
					data.type,
				);
				errorCause = undefined;
				setData(data);
				setResolvedSrc(resolvedSrc);

				if (!settings.seenGames.includes(id)) {
					errorCause = t('error.player.plays');
					await api.plays(id);
					const { seenGames } = settings;
					seenGames.push(id);
					setSettings({
						...settings,
						seenGames,
					});

					errorCause = undefined;
				}
			} catch (err) {
				if (!isAbortError(err)) {
					console.error(err);
					setError({
						cause: errorCause,
						message: String(err),
					});
				}
			}
		})();

		return () => abort.abort();
	}, [id, settings, setSettings, t]);

	useEffect(() => {
		function focusListener() {
			if (iframeFocused && iframe.current) iframe.current.focus();
		}

		if (iframeFocused && iframe.current) iframe.current.focus();

		document.documentElement.dataset.lockFrameScroll =
			Number(iframeFocused).toString();
		window.addEventListener('focus', focusListener);

		return () => {
			window.removeEventListener('focus', focusListener);
			delete document.documentElement.dataset.scroll;
		};
	}, [iframeFocused, iframe]);

	useEffect(() => {
		if (!iframe.current) return;

		function clickListener() {
			if (iframeFocused) setIFrameFocused(false);
		}

		if (iframeFocused) {
			document.documentElement.scrollTo(0, 0);
		} else {
			iframe.current!.blur();
		}

		// window.addEventListener('blur', blurListener);
		window.addEventListener('click', clickListener);
		document.documentElement.dataset.lockFrameScroll =
			Number(iframeFocused).toString();

		return () => {
			delete document.documentElement.dataset.lockFrameScroll;
			window.removeEventListener('click', clickListener);
		};
	}, [data, iframeFocused]);

	useEffect(() => {
		const listener = () => {
			setIFrameFocused(document.fullscreenElement === iframe.current);
		};

		document.addEventListener('fullscreenchange', listener);

		return () => {
			document.removeEventListener('fullscreenchange', listener);
		};
	}, []);

	if (error)
		return (
			<>
				<PlayerMeta />
				<CommonError
					cause={error.cause}
					error={error.message}
					message={t('error.player.errorMessage')}
				/>
			</>
		);

	if (!data) {
		return (
			<>
				<PlayerMeta />
				<main
					className={clsx(styles.main, styles.loading)}
					data-panorama={Number(panorama)}
					data-controls={Number(controlsExpanded)}
				>
					<div className={styles.frame}></div>
					<div className={styles.title}>
						{
							// eslint-disable-next-line jsx-a11y/heading-has-content
							<h3 className={styles.name} />
						}
						<div className={styles.shiftRight}></div>
						<div className={styles.button} />
						<div className={styles.button} />
						<div className={styles.button} />
						<div className={styles.button} />
					</div>
				</main>
			</>
		);
	}

	const controls = [];

	for (const control of data.controls) {
		const visuals = [];

		for (const key of control.keys) {
			switch (key) {
				case 'arrows':
					visuals.push(
						<div key={key} className={styles.move}>
							<ArrowDropUp className={styles.controlKey} />
							<ArrowLeft className={styles.controlKey} />
							<ArrowDropDown className={styles.controlKey} />
							<ArrowRight className={styles.controlKey} />
						</div>,
					);
					break;
				case 'wasd':
					visuals.push(
						<div key={key} className={styles.move}>
							<div className={styles.controlKey}>W</div>
							<div className={styles.controlKey}>A</div>
							<div className={styles.controlKey}>S</div>
							<div className={styles.controlKey}>D</div>
						</div>,
					);
					break;
				default:
					visuals.push(
						<div
							key={key}
							className={clsx(styles.controlKey, styles[`key${key}`])}
						>
							{key}
						</div>,
					);
					break;
			}
		}

		controls.push(
			<div key={control.label} className={styles.control}>
				<div className={styles.visuals}>{visuals}</div>
				<span className={styles.label}>{control.label}</span>
			</div>,
		);
	}

	return (
		<>
			<PlayerMeta name={data.name} />
			<main
				className={styles.main}
				data-panorama={Number(panorama)}
				data-controls={Number(controlsExpanded)}
			>
				<div className={styles.frame}>
					<div className={styles.iframeContainer}>
						<div
							className={styles.iframeCover}
							title={t('click')}
							onClick={(event) => {
								event.stopPropagation();
								setIFrameFocused(true);
							}}
						/>
						<iframe ref={iframe} title="Embed" src={resolvedSrc || undefined} />
					</div>
					<div
						tabIndex={0}
						className={styles.controls}
						ref={controlsPopup}
						onBlur={(event) => {
							if (
								!event.target.contains(event.relatedTarget) &&
								!controlsOpen.current!.contains(event.relatedTarget)
							) {
								setControlsExpanded(false);
							}
						}}
					>
						<Close
							className={styles.close}
							onClick={() => setControlsExpanded(false)}
						/>
						<div className={styles.controls}>{controls}</div>
					</div>
				</div>
				<div className={styles.title}>
					<h3 className={styles.name}>
						<Obfuscated>{data.name}</Obfuscated>
					</h3>
					<div className={styles.shiftRight}></div>
					<div
						className={styles.button}
						onClick={() => {
							iframe.current!.requestFullscreen();
						}}
						title={t('fullscreen')}
					>
						<Fullscreen />
					</div>
					{controls.length !== 0 && (
						<div
							className={styles.button}
							tabIndex={0}
							ref={controlsOpen}
							onClick={async () => {
								setControlsExpanded(!controlsExpanded);
								controlsPopup.current!.focus();
							}}
							title={t('controls')}
						>
							<VideogameAsset />
						</div>
					)}
					<div
						className={styles.button}
						onClick={() => {
							const favorites = settings.favorites;
							const i = favorites.indexOf(id);

							if (i === -1) {
								favorites.push(id);
							} else {
								favorites.splice(i, 1);
							}

							setSettings({
								...settings,
								favorites,
							});

							setFavorited(favorites.includes(id));
						}}
						title={t('favorite')}
					>
						{favorited ? <Star /> : <StarBorder />}
					</div>
					<div
						className={styles.button}
						onClick={async () => {
							setPanorama(!panorama);
						}}
						title={t('panorama')}
					>
						{panorama ? <ChevronLeft /> : <Panorama />}
					</div>
				</div>
			</main>
		</>
	);
};

export default Player;
