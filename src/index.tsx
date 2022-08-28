import App from './App';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.querySelector('#root');

if (!rootElement) throw new Error('Missing root');

const root = createRoot(rootElement);

// <StrictMode>
// https://stackoverflow.com/questions/61254372/my-react-component-is-rendering-twice-because-of-strict-mode

root.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>
);
