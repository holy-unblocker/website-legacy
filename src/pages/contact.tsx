import type { HolyPage } from '../App';
import { ObfuscatedThemeA } from '../ThemeElements';
import { HU_DISCORD_URL } from '../consts';
import { Obfuscated } from '../obfuscate';

const Contact: HolyPage = () => {
	return (
		<main>
			<h1>Contact:</h1>
			<ul>
				<li>
					GitHub:{' '}
					<ObfuscatedThemeA href="https://git.holy.how/holy">
						<Obfuscated>https://git.holy.how/holy</Obfuscated>
					</ObfuscatedThemeA>
				</li>
				<li>
					Email:{' '}
					<ObfuscatedThemeA href="mailto:support@holy.how">
						<Obfuscated>support@holy.how</Obfuscated>
					</ObfuscatedThemeA>
				</li>
				<li>
					<Obfuscated>Discord</Obfuscated>:{' '}
					<ObfuscatedThemeA href={HU_DISCORD_URL}>
						<Obfuscated>{HU_DISCORD_URL}</Obfuscated>
					</ObfuscatedThemeA>
				</li>
			</ul>
		</main>
	);
};

export default Contact;
