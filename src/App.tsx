import './styles/root.scss';
import type { CompatLayoutRef } from './CompatLayout';
import CompatLayout from './CompatLayout';
import type { LayoutRef } from './Layout';
import Layout from './Layout';
import type { MainLayoutRef } from './MainLayout';
import MainLayout from './MainLayout';
import resolveRoute from './resolveRoute';
import type { ComponentType, RefObject } from 'react';
import { Suspense, lazy, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';

const GamesPopular = lazy(
	() => import(/* webpackPrefetch: true */ './pages/theatre/games/index')
);
const GamesAll = lazy(
	() => import(/* webpackPrefetch: true */ './pages/theatre/games/all')
);
const TheatreFavorites = lazy(
	() => import(/* webpackPrefetch: true */ './pages/theatre/favorites')
);
const TheatreApps = lazy(
	() => import(/* webpackPrefetch: true */ './pages/theatre/apps')
);
const TheatreCategory = lazy(
	() => import(/* webpackPrefetch: true */ './pages/theatre/category')
);
const TheatrePlayer = lazy(
	() => import(/* webpackPrefetch: true */ './pages/theatre/player')
);
const Home = lazy(() => import(/* webpackPrefetch: true */ './pages/index'));
const SettingsLayout = lazy(
	() => import(/* webpackPrefetch: true */ './SettingsLayout')
);
const SearchSettings = lazy(
	() => import(/* webpackPrefetch: true */ './pages/settings/search')
);
const AppearanceSettings = lazy(
	() => import(/* webpackPrefetch: true */ './pages/settings/appearance')
);
const TabCloakSettings = lazy(
	() => import(/* webpackPrefetch: true */ './pages/settings/tabcloak')
);
const FAQ = lazy(() => import(/* webpackPrefetch: true */ './pages/faq'));
const Contact = lazy(
	() => import(/* webpackPrefetch: true */ './pages/contact')
);
const Privacy = lazy(
	() => import(/* webpackPrefetch: true */ './pages/privacy')
);
const NotFound = lazy(() => import(/* webpackPrefetch: true */ './pages/404'));
const Proxy = lazy(() => import(/* webpackPrefetch: true */ './pages/proxy'));
const Credits = lazy(
	() => import(/* webpackPrefetch: true */ './pages/credits')
);
const Terms = lazy(() => import(/* webpackPrefetch: true */ './pages/terms'));
const Ultraviolet = lazy(
	() => import(/* webpackPrefetch: true */ './pages/compat/ultraviolet')
);
const Rammerhead = lazy(
	() => import(/* webpackPrefetch: true */ './pages/compat/rammerhead')
);
const Stomp = lazy(
	() => import(/* webpackPrefetch: true */ './pages/compat/stomp')
);
const Flash = lazy(
	() => import(/* webpackPrefetch: true */ './pages/compat/flash')
);

export interface LayoutDump {
	layout: RefObject<LayoutRef | null>;
	mainLayout: RefObject<MainLayoutRef | null>;
	compatLayout: RefObject<CompatLayoutRef | null>;
}

export type HolyPage<T extends object = {}> = ComponentType<LayoutDump & T>;

// https://reactrouter.com/docs/en/v6/getting-started/overview
export default function App() {
	const layout = useRef<LayoutRef | null>(null);
	const mainLayout = useRef<MainLayoutRef | null>(null);
	const compatLayout = useRef<CompatLayoutRef | null>(null);

	const layouts: LayoutDump = {
		layout,
		mainLayout,
		compatLayout,
	};

	return (
		<>
			<Layout ref={layout} />
			<Routes>
				<Route
					path={resolveRoute('/', '')}
					element={<MainLayout ref={mainLayout} />}
				>
					<Route
						index
						element={
							<Suspense fallback={<></>}>
								<Home {...layouts} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/', 'proxy', false)}
						element={
							<Suspense fallback={<></>}>
								<Proxy {...layouts} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/', 'faq', false)}
						element={
							<Suspense fallback={<></>}>
								<FAQ {...layouts} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/', 'contact', false)}
						element={
							<Suspense fallback={<></>}>
								<Contact {...layouts} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/', 'privacy', false)}
						element={
							<Suspense fallback={<></>}>
								<Privacy {...layouts} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/', 'terms', false)}
						element={
							<Suspense fallback={<></>}>
								<Terms {...layouts} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/', 'credits', false)}
						element={
							<Suspense fallback={<></>}>
								<Credits {...layouts} />
							</Suspense>
						}
					/>
					<Route path={resolveRoute('/theatre/games/', '')}>
						<Route
							index
							element={
								<Suspense fallback={<></>}>
									<GamesPopular {...layouts} />
								</Suspense>
							}
						/>
						<Route
							path={resolveRoute('/theatre/games/', 'all', false)}
							element={
								<Suspense fallback={<></>}>
									<GamesAll {...layouts} />
								</Suspense>
							}
						/>
					</Route>
					<Route path={resolveRoute('/theatre/', '')}>
						<Route
							path={resolveRoute('/theatre/', 'player', false)}
							element={
								<Suspense fallback={<></>}>
									<TheatrePlayer {...layouts} />
								</Suspense>
							}
						/>
						<Route
							path={resolveRoute('/theatre/', 'category', false)}
							element={
								<Suspense fallback={<></>}>
									<TheatreCategory {...layouts} />
								</Suspense>
							}
						/>
						<Route
							path={resolveRoute('/theatre/', 'favorites', false)}
							element={
								<Suspense fallback={<></>}>
									<TheatreFavorites {...layouts} />
								</Suspense>
							}
						/>
						<Route path={resolveRoute('/theatre/', 'apps', false)}>
							<Route
								index
								element={
									<Suspense fallback={<></>}>
										<TheatreApps {...layouts} />
									</Suspense>
								}
							/>
						</Route>
					</Route>
					<Route
						path={resolveRoute('/settings/', '')}
						element={
							<Suspense fallback={<></>}>
								<SettingsLayout {...layouts} />
							</Suspense>
						}
					>
						<Route
							path={resolveRoute('/settings/', 'search', false)}
							element={
								<Suspense fallback={<></>}>
									<SearchSettings {...layouts} />
								</Suspense>
							}
						/>
						<Route
							path={resolveRoute('/settings/', 'appearance', false)}
							element={
								<Suspense fallback={<></>}>
									<AppearanceSettings {...layouts} />
								</Suspense>
							}
						/>
						<Route
							path={resolveRoute('/settings/', 'tabcloak', false)}
							element={
								<Suspense fallback={<></>}>
									<TabCloakSettings {...layouts} />
								</Suspense>
							}
						/>
					</Route>
					<Route
						path="*"
						element={
							<Suspense fallback={<></>}>
								<NotFound {...layouts} />
							</Suspense>
						}
					/>
				</Route>
				<Route
					path={resolveRoute('/compat/', '')}
					element={<CompatLayout ref={compatLayout} />}
				>
					<Route
						path={resolveRoute('/compat/', 'rammerhead', false)}
						element={
							<Suspense fallback={<></>}>
								<Rammerhead {...layouts} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/compat/', 'stomp', false)}
						element={
							<Suspense fallback={<></>}>
								<Stomp {...layouts} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/compat/', 'ultraviolet', false)}
						element={
							<Suspense fallback={<></>}>
								<Ultraviolet {...layouts} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/compat/', 'flash', false)}
						element={
							<Suspense fallback={<></>}>
								<Flash {...layouts} />
							</Suspense>
						}
					/>
				</Route>
			</Routes>
		</>
	);
}
