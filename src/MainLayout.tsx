import Footer from './Footer';
import { ReactComponent as HatBeta } from './assets/hat-beta.svg';
import { ReactComponent as HatDev } from './assets/hat-dev.svg';
import { ReactComponent as HatPlain } from './assets/hat.svg';
import categories from './gameCategories';
import { ObfuscateLayout, Obfuscated, ObfuscatedA } from './obfuscate';
import { getHot } from './routes';
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
import { Link, useLocation } from 'react-router-dom';

function Hat(props: SVGAttributes<{}>) {
	switch (process.env.REACT_APP_HAT_BADGE) {
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
	iconFilled,
	iconOutlined,
}: {
	route?: string;
	href?: string;
	name: string;
	className?: string;
	onClick?: MouseEventHandler;
	iconFilled: ReactNode;
	iconOutlined?: ReactNode;
}) {
	const location = useLocation();
	const selected = location.pathname === route;
	const content = (
		<>
			<span className={styles.icon}>
				{(selected && iconFilled) || iconOutlined || iconFilled}
			</span>
			<span className={styles.name}>
				<Obfuscated ellipsis>{name}</Obfuscated>
			</span>
		</>
	);

	if (route === undefined) {
		return (
			<ObfuscatedA
				href={href!}
				data-selected={Number(selected)}
				className={clsx(styles.entry, className)}
				onClick={onClick}
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
				onClick={onClick}
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
		children: ReactNode;
	}
>(function MainLayout({ children }, ref) {
	const [expanded, setExpanded] = useState(false);

	useImperativeHandle(
		ref,
		() => ({
			expanded,
			setExpanded,
		}),
		[expanded, setExpanded]
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

	return (
		<>
			<ObfuscateLayout />
			<nav className={styles.nav}>
				<div className={styles.button} onClick={() => setExpanded(true)}>
					<Menu />
				</div>
				<Link to="/" className={clsx(styles.entry, styles.logo)}>
					<Hat />
				</Link>
				<div className={styles.shiftRight}></div>
				<Link className={styles.button} to={getHot('settings search').path}>
					<Settings />
				</Link>
			</nav>
			<div className={styles.content}>
				<div className={clsx(styles.cover)} onClick={closeMenu}></div>
				<div tabIndex={0} className={styles.menu}>
					<div className={styles.top}>
						<div className={styles.button} onClick={closeMenu}>
							<Menu />
						</div>
						<Link
							to="/"
							className={clsx(styles.entry, styles.logo)}
							onClick={closeMenu}
						>
							<Hat />
						</Link>
					</div>
					<div className={styles.menuList}>
						<MenuTab
							route={getHot('home').path}
							name="Home"
							iconFilled={<Home />}
							iconOutlined={<HomeOutlined />}
							onClick={closeMenu}
						/>
						<MenuTab
							route={getHot('proxy').path}
							name="Proxy"
							iconFilled={<WebAsset />}
							onClick={closeMenu}
						/>
						<MenuTab
							route={getHot('faq').path}
							name="FAQ"
							iconFilled={<QuestionMark />}
							onClick={closeMenu}
						/>

						<div className={styles.bar} />

						<MenuTab
							route={getHot('theatre apps').path}
							name="Apps"
							iconFilled={<Apps />}
							onClick={closeMenu}
						/>

						<MenuTab
							route={getHot('theatre favorites').path}
							name="Favorites"
							iconFilled={<StarRounded />}
							iconOutlined={<StarOutlineRounded />}
							onClick={closeMenu}
						/>

						<div className={styles.bar} />

						<div className={styles.title}>
							<Obfuscated>Games</Obfuscated>
						</div>

						<MenuTab
							route={getHot('theatre games popular').path}
							name="Popular"
							iconFilled={<SortRounded />}
							onClick={closeMenu}
						/>
						<MenuTab
							route={getHot('theatre games all').path}
							name="All"
							iconFilled={<List />}
							onClick={closeMenu}
						/>
						<div className={styles.title}>Genre</div>
						<div className={styles.genres}>
							{categories.map((category) => (
								<Link
									key={category.id}
									to={`${getHot('theatre games category').path}?id=${
										category.id
									}`}
									className={clsx(styles.entry, styles.text)}
									onClick={() => setExpanded(false)}
								>
									<Obfuscated>{category.short || category.name}</Obfuscated>
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
