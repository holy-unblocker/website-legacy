import type { HolyPage } from '../App';
import Meta from '../Meta';
import { ThemeLink } from '../ThemeElements';
import { getHot } from '../routes';

const PrivacyMeta = () => (
	<Meta title="Privacy Policy" description="Holy Unblocker's privacy policy." />
);

const Privacy: HolyPage = () => {
	return (
		<>
			<PrivacyMeta />
			<main>
				<h1>Privacy Policy</h1>
				<h2>Contact Us</h2>
				<p>
					If you have any questions about our Privacy Policy, please{' '}
					<ThemeLink to={getHot('contact').path}>Contact Us</ThemeLink>.
				</p>
			</main>
		</>
	);
};

export default Privacy;
