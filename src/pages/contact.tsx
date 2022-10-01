import type { HolyPage } from '../App';
import { ObfuscatedThemeA } from '../ThemeElements';
import { HU_DISCORD_URL, SUPPORT_EMAIL } from '../consts';
import { Obfuscated } from '../obfuscate';
import { useTranslation } from 'react-i18next';

const Contact: HolyPage = () => {
	const { t } = useTranslation();

	return (
		<main>
			<h1>{t('contact.title')}</h1>
			<table>
				<tbody>
					<tr>
						<td>GitHub:</td>
						<td>
							<ObfuscatedThemeA href="https://git.holy.how/holy">
								<Obfuscated>https://git.holy.how/holy</Obfuscated>
							</ObfuscatedThemeA>
						</td>
					</tr>
					<tr>
						<td>Email:</td>
						<td>
							<ObfuscatedThemeA href={'mailto:' + SUPPORT_EMAIL}>
								<Obfuscated>{SUPPORT_EMAIL}</Obfuscated>
							</ObfuscatedThemeA>
						</td>
					</tr>
					<tr>
						<td>Discord:</td>
						<td>
							<ObfuscatedThemeA href={HU_DISCORD_URL}>
								<Obfuscated>{HU_DISCORD_URL}</Obfuscated>
							</ObfuscatedThemeA>
						</td>
					</tr>
				</tbody>
			</table>
		</main>
	);
};

export default Contact;
