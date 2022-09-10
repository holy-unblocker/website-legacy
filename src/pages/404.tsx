import type { HolyPage } from '../App';
import { ThemeLink } from '../ThemeElements';
import { getHot } from '../routes';

const NotFound: HolyPage = () => {
	return (
		<main>
			<h1>The page you are looking for is not available.</h1>
			<hr />
			<p>
				If you typed in the URL yourself, please double-check the spelling.
				<br />
				If you got here from a link within our site, please{' '}
				<ThemeLink to={getHot('contact').path}>Contact Us</ThemeLink>.
			</p>
		</main>
	);
};

export default NotFound;
