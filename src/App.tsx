import './styles/root.scss';
import type { CompatLayoutRef } from './CompatLayout';
import CompatLayout from './CompatLayout';
import type { LayoutRef } from './Layout';
import Layout from './Layout';
import type { MainLayoutRef } from './MainLayout';
import MainLayout from './MainLayout';
import SettingsLayout from './SettingsLayout';
import { hotRoutes } from './routes';
import type { ComponentType, ReactElement, RefObject } from 'react';
import { Suspense, lazy, useRef } from 'react';
import { Route, Routes, matchPath } from 'react-router-dom';

export interface LayoutDump {
	layout: RefObject<LayoutRef | null>;
	mainLayout: RefObject<MainLayoutRef | null>;
	compatLayout: RefObject<CompatLayoutRef | null>;
}

export type HolyPage<T extends object = {}> = ComponentType<LayoutDump & T>;

export interface LayoutProps {
	Component: ReactElement<LayoutProps>;
	componentProps: LayoutProps;
}

declare const __webpack_require__: ((id: string | number) => unknown) & {
	e(id: string | number): PromiseLike<void>;
};

// https://reactrouter.com/docs/en/v6/getting-started/overview
export default function App() {
	const layout = useRef<LayoutRef | null>(null);
	const mainLayout = useRef<MainLayoutRef | null>(null);
	const compatLayout = useRef<CompatLayoutRef | null>(null);

	const allRoutes = [];

	const currentHot = hotRoutes.find((hot) =>
		matchPath(
			hot.path,
			global.location.pathname + global.location.search + global.location.hash
		)
	);

	if (!currentHot)
		throw new Error(`currentHot was neither a page (/) or 404 (*)`);

	const importSrc = currentHot.import.toString();

	// ()=>__webpack_require__.e(/*! import() */ "src_pages_404_tsx").then(__webpack_require__.bind(__webpack_require__, /*! ./pages/404 */ "./src/pages/404.tsx"))
	// ()=>n.e(697).then(n.bind(n,5697))

	// webpack uses JSON.stringify to produce IDs?
	const [, , id] =
		importSrc.match(/\.then\((\w+)\.bind\(\1,.*?(".*?"|\d+)\)\)/) || [];

	if (!id) throw new Error('Failure');

	const currentComponent = (
		__webpack_require__(JSON.parse(id)) as { default: HolyPage }
	).default;

	for (let i = 0; i < hotRoutes.length; i++) {
		const hot = hotRoutes[i];
		const Component = hot === currentHot ? currentComponent : lazy(hot.import);

		const create = (
			<Component
				layout={layout}
				mainLayout={mainLayout}
				compatLayout={compatLayout}
			/>
		);

		const suspended =
			hot === currentHot ? (
				create
			) : (
				<Suspense fallback={<></>}>{create}</Suspense>
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
			/>
		);
	}

	return (
		<>
			<Layout ref={layout} />
			<Routes>{allRoutes}</Routes>
		</>
	);
}
