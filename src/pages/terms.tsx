import type { HolyPage } from '../App';
import Meta from '../Meta';
import { ThemeLink } from '../ThemeElements';
import { getHot } from '../routes';

const TermsMeta = () => (
	<Meta title="Terms of Use" description="Holy Unblocker's terms of use." />
);

const Terms: HolyPage = () => {
	return (
		<>
			<TermsMeta />
			<main>
				<h1>Terms of Use</h1>
				<h2>Contact Information</h2>
				<p>
					If you have any questions about our Terms of Use, please{' '}
					<ThemeLink to={getHot('contact').path}>Contact Us</ThemeLink>.
				</p>
			</main>
		</>
	);
};

export default Terms;
