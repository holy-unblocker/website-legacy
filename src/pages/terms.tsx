import type { HolyPage } from '../App';
import { ThemeLink } from '../ThemeElements';
import { Obfuscated } from '../obfuscate';
import { getHot } from '../routes';

const Terms: HolyPage = () => {
	return (
		<main>
			<h2>Security</h2>
			<p>
				<Obfuscated>Holy Unblocker</Obfuscated> highly values the terms of
				security using the latest security practices while guaranteeing secure
				connections over SSL and respecting user privacy entirely.
				<br />
			</p>
			<h2>Cookie Usage</h2>
			<p>
				<Obfuscated>Holy Unblocker</Obfuscated> uses "Cookies" and similar
				technologies to maintain a user session (described more below) and store
				your preferences on your computer. All of this information is completely
				private being only local content with no analytical purposes.
			</p>
			<p>
				A cookie is a string of information that a website stores on a visitor's
				computer, and that the visitor's browser provides to the website each
				time the visitor returns. <Obfuscated>Holy Unblocker</Obfuscated> uses
				cookies to help <Obfuscated>Holy Unblocker</Obfuscated> with security on{' '}
				{global.location.hostname} and its proxy instances, and lastly for user
				preferences. Users who do not wish to have cookies placed on their
				computers should set their browsers to refuse cookies before using{' '}
				<Obfuscated>Holy Unblocker</Obfuscated>'s websites, with the drawback
				that certain features of <Obfuscated>Holy Unblocker</Obfuscated> may not
				function properly without the aid of cookies.
			</p>
			<p>
				By continuing to navigate our website without changing your cookie
				settings, you hereby acknowledge and agree to{' '}
				<Obfuscated>Holy Unblocker</Obfuscated>'s use of cookies.
			</p>
			<h2>Subject to changes</h2>
			<p>
				Although most changes are likely to be minor,{' '}
				<Obfuscated>Holy Unblocker</Obfuscated> may change its Privacy Policy
				from time to time, and in <Obfuscated>Holy Unblocker</Obfuscated>'s sole
				discretion. <Obfuscated>Holy Unblocker</Obfuscated> encourages visitors
				to frequently check this page for any changes to its Privacy Policy.
				Your continued use of this site after any change in this Privacy Policy
				will constitute your acceptance of such change.
			</p>
			<h2>Contact Information</h2>
			<p>
				If you have any questions about our Privacy Policy, please{' '}
				<ThemeLink to={getHot('contact').path}>Contact Us</ThemeLink>.
			</p>
		</main>
	);
};

export default Terms;
