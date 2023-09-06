import type { LayoutDump } from './App';
import { useGlobalSettings } from './Layout';
import { BARE_API } from './consts';
import { isError } from './isAbortError';
import { Obfuscated } from './obfuscate';
import styles from './styles/Service.module.scss';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import Fullscreen from '@mui/icons-material/Fullscreen';
import OpenInNew from '@mui/icons-material/OpenInNew';
import Public from '@mui/icons-material/Public';
import { BareClient } from '@tomphttp/bare-client';
import { useRef } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type ServiceFrameSrc = [src: string, proxySrc: string];

const ServiceFrame = ({
	layout,
	src,
	close,
}: {
	layout: LayoutDump['layout'];
	src: ServiceFrameSrc | null;
	/**
	 * Callback to handle closing the ServiceFrame.
	 * Logic should be:
	 * 	- Clear the src attribute
	 */
	close: () => void;
}) => {
	const iframe = useRef<HTMLIFrameElement | null>(null);
	const [firstLoad, setFirstLoad] = useState(false);
	const [revokeIcon, setRevokeIcon] = useState(false);
	const [lastSrc, setLastSrc] = useState('');
	const bare = useMemo(() => new BareClient(BARE_API), []);
	const linksTried = useMemo(() => new WeakMap(), []);
	const [settings] = useGlobalSettings();
	const [title, setTitle] = useState<string | null>(src?.[0] || null);
	const [icon, setIcon] = useState('');
	const { t } = useTranslation();

	useEffect(() => {
		if (src) {
			if (!iframe.current || !iframe.current.contentWindow) return;

			try {
				iframe.current.contentWindow.location.href = src[1];
				setLastSrc(src[1]);
			} catch (err) {
				console.error(err);
				layout.current!.notifications.current!({
					title: t('error.compatibleProxy'),
					description: isError(err) ? err.message : String(err),
					type: 'error',
				});
			}
		} else {
			if (!iframe.current || !iframe.current.contentWindow) return;
			setFirstLoad(false);
			setTitle('');
			setIcon('');
			iframe.current.contentWindow.location.href = 'about:blank';
			setLastSrc('about:blank');
		}
	}, [iframe, layout, settings.proxy, src, t]);

	useEffect(() => {
		function focusListener() {
			if (!iframe.current || !iframe.current.contentWindow) return;

			iframe.current.contentWindow.focus();
		}

		window.addEventListener('focus', focusListener);

		return () => window.removeEventListener('focus', focusListener);
	}, [iframe]);

	const testProxyUpdate = useCallback(
		async function testProxyUpdate() {
			if (!iframe.current || !iframe.current.contentWindow) return;

			const contentWindow = iframe.current
				.contentWindow as unknown as typeof globalThis;

			// * didn't hook our call to new Function
			try {
				setLastSrc(contentWindow.location.href);
			} catch (err) {
				// possibly an x-frame error
				return;
			}

			const location = new contentWindow.Function('return location')();

			if (location === contentWindow.location) setTitle(src?.[0] || null);
			else {
				const currentTitle = contentWindow.document.title;

				setTitle(currentTitle || location.toString());
				const selector = contentWindow.document.querySelector(
					'link[rel*="icon"]',
				) as HTMLLinkElement | null;

				const icon =
					selector && selector.href !== ''
						? selector.href
						: new URL('/favicon.ico', location).toString();

				if (!linksTried.has(location)) linksTried.set(location, new Set());

				if (!linksTried.get(location).has(icon)) {
					linksTried.get(location).add(icon);

					const outgoing = await bare.fetch(icon);

					setIcon(URL.createObjectURL(await outgoing.blob()));
					setRevokeIcon(true);
				}
			}
		},
		[bare, iframe, linksTried, src],
	);

	useEffect(() => {
		const interval = setInterval(testProxyUpdate, 50);
		testProxyUpdate();
		return () => clearInterval(interval);
	}, [testProxyUpdate]);

	useEffect(() => {
		document.documentElement.dataset.service = Number(Boolean(src)).toString();

		return () => {
			delete document.documentElement.dataset.service;
		};
	}, [src]);

	return (
		<div className={styles.service}>
			<div className={styles.buttons}>
				<ChevronLeft className={styles.button} onClick={close} />
				{icon ? (
					<img
						className={styles.icon}
						alt=""
						src={icon}
						onError={() => setIcon('')}
						onLoad={() => {
							if (revokeIcon) {
								URL.revokeObjectURL(icon);
								setRevokeIcon(false);
							}
						}}
					/>
				) : (
					<Public className={styles.icon} />
				)}
				<p className={styles.title}>
					<Obfuscated ellipsis>{title}</Obfuscated>
				</p>
				<div className={styles.shiftRight}></div>
				<a href={lastSrc} className={styles.button}>
					<OpenInNew />
				</a>
				<Fullscreen
					className={styles.button}
					onClick={() => iframe.current && iframe.current.requestFullscreen()}
				/>
			</div>
			<iframe
				className={styles.embed}
				title="embed"
				ref={iframe}
				data-first-load={Number(firstLoad)}
				onLoad={() => {
					testProxyUpdate();

					if (src) {
						setFirstLoad(true);
					}
				}}
			></iframe>
		</div>
	);
};

export default ServiceFrame;
