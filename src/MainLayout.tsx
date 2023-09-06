import Footer from './Footer';
import { ReactComponent as HatBeta } from './assets/hat-beta.svg';
import { ReactComponent as HatDev } from './assets/hat-dev.svg';
import { ReactComponent as HatPlain } from './assets/hat.svg';
import type { categoryKey } from './gameCategories';
import categories from './gameCategories';
import { Obfuscated, ObfuscatedA } from './obfuscate';
import { VITE_PUBLIC_PATH, getHot } from './routes';
import styles from './styles/Navigation.module.scss';
import Apps from '@mui/icons-material/Apps';
import Home from '@mui/icons-material/Home';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import List from '@mui/icons-material/List';
import Menu from '@mui/icons-material/Menu';
import QuestionMark from '@mui/icons-material/QuestionMark';
import Settings from '@mui/icons-material/Settings';
import SortRounded from '@mui/icons-material/SortRounded';
import StarOutlineRounded from '@mui/icons-material/StarOutlineOutlined';
import StarRounded from '@mui/icons-material/StarRounded';
import WebAsset from '@mui/icons-material/WebAsset';
import clsx from 'clsx';
import type { MouseEventHandler, ReactNode, SVGAttributes } from 'react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

function Hat(props: SVGAttributes<{}>) {
	switch (import.meta.env.VITE_HAT_BADGE) {
		case 'DEV':
			return <HatDev {...props} />;
		case 'BETA':
			return <HatBeta {...props} />;
		default:
			return <HatPlain {...props} />;
	}
}

export function MenuTab({
	route,
	href,
	name,
	className,
	onClick,
	iconClassName,
	iconFilled,
	iconOutlined,
	tabIndex,
	isNew,
}: {
	route?: string;
	href?: string;
	name: string;
	className?: string;
	onClick?: MouseEventHandler;
	iconClassName?: string;
	iconFilled: ReactNode;
	iconOutlined?: ReactNode;
	tabIndex?: number;
	isNew?: boolean;
}) {
	const location = useLocation();
	const selected = location.pathname === route;
	const content = (
		<>
			<span className={clsx(styles.icon, iconClassName)}>
				{(selected && iconFilled) || iconOutlined || iconFilled}
			</span>
			<span className={styles.name}>
				<Obfuscated ellipsis>{name}</Obfuscated>
			</span>
			{isNew && <span className={styles.new}>new</span>}
		</>
	);

	if (route === undefined) {
		return (
			<ObfuscatedA
				href={href!}
				data-selected={Number(selected)}
				className={clsx(styles.entry, className)}
				onClick={onClick}
				title={name}
				tabIndex={tabIndex}
			>
				{content}
			</ObfuscatedA>
		);
	} else {
		return (
			<Link
				to={route}
				data-selected={Number(selected)}
				className={clsx(styles.entry, className)}
				title={name}
				onClick={onClick}
				tabIndex={tabIndex}
			>
				{content}
			</Link>
		);
	}
}

export interface MainLayoutRef {
	expanded: boolean;
	setExpanded: (state: boolean | ((prevState: boolean) => boolean)) => void;
}

const MainLayout = forwardRef<
	MainLayoutRef,
	{
		children?: ReactNode;
	}
>(function MainLayout({ children }, ref) {
	const [expanded, setExpanded] = useState(false);

	useImperativeHandle(
		ref,
		() => ({
			expanded,
			setExpanded,
		}),
		[expanded, setExpanded],
	);

	useEffect(() => {
		function keydown(event: KeyboardEvent) {
			if (expanded && event.key === 'Escape') {
				setExpanded(false);
			}
		}

		document.addEventListener('keydown', keydown);

		return () => document.removeEventListener('keydown', keydown);
	}, [expanded]);

	useEffect(() => {
		document.documentElement.dataset.expanded = Number(expanded).toString();

		return () => {
			delete document.documentElement.dataset.expanded;
		};
	}, [expanded]);

	function closeMenu() {
		setExpanded(false);
	}

	const { t } = useTranslation(['link', 'gameCategory']);

	const menuTabIndex = expanded ? undefined : -1;

	return (
		<>
			<nav className={styles.nav}>
				<button
					className={styles.button}
					onClick={() =>
						// user may toggle this button again when using tab
						setExpanded(!expanded)
					}
				>
					<Menu />
				</button>
				<Link
					to={VITE_PUBLIC_PATH + '/'}
					className={clsx(styles.entry, styles.logo)}
					title="Home"
				>
					<Hat />
				</Link>
				<div className={styles.shiftRight}></div>
				{/* we want the user to tab into the button, not the link so it looks right */}
				<Link
					to={getHot('settings appearance').path}
					title="Home"
					tabIndex={-1}
				>
					<button className={styles.button}>
						<Settings />
					</button>
				</Link>
			</nav>
			<div className={styles.content}>
				<div
					tabIndex={-1}
					className={clsx(styles.cover)}
					onClick={() => setExpanded(false)}
				/>
				<div className={styles.menu}>
					<div className={styles.top}>
						<div
							className={styles.button}
							onClick={closeMenu}
							tabIndex={expanded ? -1 : undefined}
						>
							<Menu />
						</div>
						<Link
							to={VITE_PUBLIC_PATH + '/'}
							className={clsx(styles.entry, styles.logo)}
							title="Home"
							onClick={closeMenu}
							tabIndex={menuTabIndex}
						>
							<Hat />
						</Link>
					</div>
					<div className={styles.menuList}>
						<MenuTab
							route={getHot('home').path}
							name={t('link:home')}
							iconFilled={<Home />}
							iconOutlined={<HomeOutlined />}
							onClick={closeMenu}
							tabIndex={menuTabIndex}
						/>
						<MenuTab
							route={getHot('proxy').path}
							name={t('link:proxy')}
							iconFilled={<WebAsset />}
							onClick={closeMenu}
							tabIndex={menuTabIndex}
						/>
						<MenuTab
							route={getHot('faq').path}
							name={t('link:faq')}
							iconFilled={<QuestionMark />}
							onClick={closeMenu}
							tabIndex={menuTabIndex}
						/>

						<div className={styles.bar} />

						<MenuTab
							route={getHot('theatre apps').path}
							name={t('link:theatreApps')}
							iconFilled={<Apps />}
							onClick={closeMenu}
							tabIndex={menuTabIndex}
						/>

						<MenuTab
							route={getHot('theatre favorites').path}
							name={t('link:theatreFavorites')}
							iconFilled={<StarRounded />}
							iconOutlined={<StarOutlineRounded />}
							onClick={closeMenu}
							tabIndex={menuTabIndex}
						/>

						<div className={styles.bar} />

						<div className={styles.title}>
							<Obfuscated>{t('link:nav.games')}</Obfuscated>
						</div>

						<MenuTab
							route={getHot('theatre games popular').path}
							name={t('link:theatreGamesPopular')}
							iconFilled={<SortRounded />}
							onClick={closeMenu}
							tabIndex={menuTabIndex}
						/>
						<MenuTab
							route={getHot('theatre games all').path}
							name={t('link:theatreGamesAll')}
							iconFilled={<List />}
							onClick={closeMenu}
							tabIndex={menuTabIndex}
						/>
						<div className={styles.title}>{t('link:nav.genre')}</div>
						<div className={styles.genres}>
							{categories.map((category) => (
								<Link
									key={category.id}
									to={`${getHot('theatre games category').path}?id=${
										category.id
									}`}
									title={t(
										`gameCategory:${
											(category.id + (category.short ? '_' : '')) as categoryKey
										}`,
									)}
									className={clsx(styles.entry, styles.text)}
									onClick={() => setExpanded(false)}
									tabIndex={menuTabIndex}
								>
									<Obfuscated>
										{t(
											`gameCategory:${
												(category.id +
													(category.short ? '_' : '')) as categoryKey
											}`,
										)}
									</Obfuscated>
								</Link>
							))}
						</div>
					</div>
				</div>
				{children}
				<Footer />
			</div>
		</>
	);
});

export { styles as navStyles };

export default MainLayout;
