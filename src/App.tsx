import '@fontsource/lato';
import '@fontsource/lato/700.css';
import '@fontsource/montserrat-alternates';
import './styles/root.scss';
import './styles/theme.scss';
import './styles/TheatrePlayer.scss';
import './styles/Service.scss';
import type { CompatLayoutRef } from './CompatLayout';
import CompatLayout from './CompatLayout';
import type { LayoutRef } from './Layout';
import Layout from './Layout';
import type { MainLayoutRef } from './MainLayout';
import MainLayout from './MainLayout';
import SettingsLayout from './SettingsLayout';
import { ObfuscateLayout } from './obfuscate';
import { hotRoutes } from './routes';
import type { ComponentType, ReactElement, RefObject } from 'react';
import { Suspense, lazy, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';

export interface LayoutDump {
	layout: RefObject<LayoutRef | null>;
	mainLayout: RefObject<MainLayoutRef | null>;
	compatLayout: RefObject<CompatLayoutRef | null>;
}

export type HolyPage = ComponentType<LayoutDump>;

export interface LayoutProps {
	Component: ReactElement<LayoutProps>;
	componentProps: LayoutProps;
}

const pages = import.meta.glob('./pages/**/*.tsx') as Record<
	string,
	() => Promise<{ default: HolyPage }>
>;

// https://reactrouter.com/docs/en/v6/getting-started/overview
export default function App() {
	const layout = useRef<LayoutRef | null>(null);
	const mainLayout = useRef<MainLayoutRef | null>(null);
	const compatLayout = useRef<CompatLayoutRef | null>(null);

	const allRoutes = [];

	for (let i = 0; i < hotRoutes.length; i++) {
		const hot = hotRoutes[i];
		const Component = lazy(pages[hot.src]);

		const suspended = (
			<Suspense fallback={<></>}>
				<Component
					layout={layout}
					mainLayout={mainLayout}
					compatLayout={compatLayout}
				/>
			</Suspense>
		);

		allRoutes.push(
			<Route
				key={i}
				path={hot.path}
				element={
					hot.layout === 'compat' ? (
						<CompatLayout ref={compatLayout}>{suspended}</CompatLayout>
					) : hot.layout === 'settings' ? (
						<MainLayout ref={mainLayout}>
							<SettingsLayout>{suspended}</SettingsLayout>
						</MainLayout>
					) : (
						<MainLayout ref={mainLayout}>{suspended}</MainLayout>
					)
				}
			/>,
		);
	}

	return (
		<>
			<ObfuscateLayout />
			<Layout ref={layout} />
			<Routes>{allRoutes}</Routes>
		</>
	);
}
