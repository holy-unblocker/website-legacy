import './i18n';
import App from './App';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.querySelector('#root');

if (!rootElement) throw new Error('Missing root');

const root = createRoot(rootElement);

root.render(
	<StrictMode>
		<HelmetProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</HelmetProvider>
	</StrictMode>,
);
