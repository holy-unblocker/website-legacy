import NotificationsManager from './Notifications';
import type { NotificationsManagerRef } from './Notifications';
import { useSettings } from './Settings';
import type { RefObject } from 'react';
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useLocation } from 'react-router-dom';

export const THEMES: string[] = ['night', 'day'];

class Scroll {
	x: number;
	y: number;
	constructor(
		x = document.documentElement.scrollLeft,
		y = document.documentElement.scrollTop
	) {
		this.x = x;
		this.y = y;
	}
	scroll() {
		document.documentElement.scrollTo(this.x, this.y);
	}
}

function ScrollManager() {
	const location = useLocation();
	const _scrolls = useRef(new Map());
	const { current: scrolls } = _scrolls;

	// lastPage === undefined on refresh
	// is this basically just a useLocation hook??
	const [lastPage, setLastPage] = useState(location.pathname);

	if (lastPage !== location.pathname) {
		if (lastPage) {
			scrolls.set(lastPage, new Scroll());
		}

		if (scrolls.has(location.pathname)) {
			scrolls.get(location.pathname).scroll();
		}

		setLastPage(location.pathname);
	}

	return <></>;
}

function TabMode() {
	const [tab, setTab] = useState(false);

	useEffect(() => {
		function keydown(event: KeyboardEvent) {
			if (event.code === 'Tab') {
				setTab(true);
			}
		}

		const mousedown = () => setTab(false);

		document.documentElement.dataset.tab = Number(tab).toString();
		document.addEventListener('keydown', keydown);
		document.addEventListener('mousedown', mousedown);

		return () => {
			delete document.documentElement.dataset.tab;
			document.removeEventListener('keydown', keydown);
			document.removeEventListener('mousedown', mousedown);
		};
	}, [tab]);

	return <></>;
}

export interface CloakSettings {
	url: string;
	title: string;
	icon: string;
}

export interface GlobalSettings {
	theme: string;
	proxy: string;
	search: string;
	favorites: string[];
	seen_games: string[];
}

export interface LayoutRef {
	notifications: RefObject<NotificationsManagerRef>;
	settings: GlobalSettings;
	setSettings: (
		state: GlobalSettings | ((prevState: GlobalSettings) => GlobalSettings)
	) => void;
	cloak: CloakSettings;
	setCloak: (
		state: CloakSettings | ((prevState: CloakSettings) => CloakSettings)
	) => void;
}

const Layout = forwardRef<LayoutRef>(function Layout(props, ref) {
	const notifications = useRef<NotificationsManagerRef | null>(null);

	const theme = useMemo(
		() =>
			matchMedia('(prefers-color-scheme: light)').matches ? 'day' : 'night',
		[]
	);

	const [settings, setSettings] = useSettings<GlobalSettings>(
		'global settings',
		() => ({
			theme,
			proxy: 'automatic',
			search: 'https://www.google.com/search?q=%s',
			favorites: [],
			seen_games: [],
		})
	);

	const [cloak, setCloak] = useSettings<CloakSettings>(
		'cloak settings',
		() => ({
			url: '',
			title: '',
			icon: '',
		})
	);

	useImperativeHandle(
		ref,
		() => ({
			notifications,
			settings,
			setSettings,
			cloak,
			setCloak,
		}),
		[cloak, notifications, setCloak, setSettings, settings]
	);

	useEffect(() => {
		document.documentElement.dataset.theme = settings.theme;

		return () => {
			delete document.documentElement.dataset.theme;
		};
	}, [settings.theme]);

	useEffect(() => {
		const icon = document.querySelector('link[rel="icon"]') as
			| HTMLLinkElement
			| undefined;

		if (!icon) return;

		document.title = cloak.title === '' ? 'Holy Unblocker' : cloak.title;

		let href: string;

		switch (cloak.icon) {
			case '':
				href = '/favicon.ico';
				break;
			case 'none':
				href = 'data:,';
				break;
			default:
				href = cloak.icon;
				break;
		}

		icon.href = href;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cloak]);

	return (
		<>
			<TabMode />
			<NotificationsManager ref={notifications} />
			<ScrollManager />
		</>
	);
});

export default Layout;
