import type { HolyPage } from '../App';
import { ObfuscatedThemeA, ThemeLink } from '../ThemeElements';
import { TN_DISCORD_URL } from '../consts';
import { Obfuscated } from '../obfuscate';
import { getHot } from '../routes';

const FAQ: HolyPage = () => {
	return (
		<main>
			<section>
				<h1>
					<Obfuscated>How can I self-host Holy Unblocker?</Obfuscated>
				</h1>
				<p>
					<Obfuscated>
						You can self-host/deploy Holy Unblocker by using our all-in-one
						script
					</Obfuscated>{' '}
					<ObfuscatedThemeA href="https://github.com/holy-unblocker/website-aio#website-aio">
						here
					</ObfuscatedThemeA>
					.
				</p>
			</section>
			<section>
				<h1>How do I get more links?</h1>
				<p>
					<Obfuscated>You can join the</Obfuscated>{' '}
					<ObfuscatedThemeA href={TN_DISCORD_URL}>
						<Obfuscated>TitaniumNetwork Discord Server</Obfuscated>
					</ObfuscatedThemeA>{' '}
					<Obfuscated>
						to receive more links. In any channel, enter /proxy and select Holy
						Unblocker.
					</Obfuscated>
				</p>
			</section>
			<section>
				<h1>Where is this website's source code?</h1>
				<p>
					The source code to this website can be found in our{' '}
					<ObfuscatedThemeA href="https://git.holy.how/holy/website">
						Git repository
					</ObfuscatedThemeA>
					.
				</p>
			</section>
			<section>
				<h1>
					Is my information on the <Obfuscated>proxy</Obfuscated> secure?
				</h1>
				<p>
					We do not collect any data, your information is only as secure as the
					sites you are accessing. For privacy concerns, you can review our{' '}
					<ThemeLink to={getHot('privacy').path}>Privacy Policy</ThemeLink>.
				</p>
			</section>
			<p style={{ marginTop: 30, opacity: 0.75 }}>
				Not what you're looking for?{' '}
				<ThemeLink to={getHot('contact').path}>Contact Us</ThemeLink>.
			</p>
		</main>
	);
};

export default FAQ;
