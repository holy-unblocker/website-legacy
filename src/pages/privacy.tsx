import type { HolyPage } from '../App';
import { ThemeLink } from '../ThemeElements';
import { Obfuscated } from '../obfuscate';
import { getHot } from '../routes';

const Privacy: HolyPage = () => {
	return (
		<main>
			<p>
				If you choose to use our Service, then you agree to the collection and
				use of information in relation to this policy. The Personal Information
				that we collect is used for providing and improving the Service. We will
				not use or share your information with anyone except as described in
				this Privacy Policy.
			</p>

			<h2>Information Collection and Use</h2>

			<p>
				For a better experience, while using our Service, we collect information
				your device sends such as your internet protocol (IP) address. This
				information explicitly excludes your usage of our{' '}
				<Obfuscated>web-proxies</Obfuscated>. The IP address does not identify
				you personally, but it allows us to maintain communications with you as
				you move about the Website. Generally, these types of data elements do
				not reveal your identity or do not relate directly to you or any other
				individual.
			</p>

			<p>The following are some examples of Other Information:</p>

			<ul>
				<li>IP address;</li>
				<li>Browser and device information, including operating system;</li>
			</ul>

			<p>
				Any information collected is not analyzed under normal circumstances,
				the only time the information collected is analyzed is when there is a
				technical issue with accessing our service.
			</p>

			<h2>Removal of Collected Information</h2>

			<p>
				Any (applicable) collected Personal Information is routinely wiped from
				applicable systems on (30) day intervals, as it is no longer relevant to
				maintaining or auditing our systems.
			</p>

			<h2>Contact Information</h2>

			<p>
				For any additional information or clarification regarding the privacy
				policy, please{' '}
				<ThemeLink to={getHot('contact').path}>Contact Us</ThemeLink>.
			</p>
		</main>
	);
};

export default Privacy;
