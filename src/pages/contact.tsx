import type { HolyPage } from '../App';
import Meta from '../Meta';
import { ObfuscatedThemeA } from '../ThemeElements';
import { SUPPORT_EMAIL } from '../consts';
import { Obfuscated } from '../obfuscate';
import { useTranslation } from 'react-i18next';

const ContactMeta = () => (
	<Meta
		title="Contact Us"
		description="If you need help or need to contact Holy Unblocker, you can contact us here."
		faq={[
			{
				name: "What is Holy Unblocker's GitHub?",
				acceptedAnswer: {
					text: 'https://github.com/holy-unblocker',
				},
			},
		]}
	/>
);

const Contact: HolyPage = () => {
	const { t } = useTranslation('link');

	return (
		<>
			<ContactMeta />
			<main>
				<h1>{t('contact')}</h1>
				<table>
					<tbody>
						<tr>
							<td>GitHub:</td>
							<td>
								<ObfuscatedThemeA
									href="https://github.com/holy-unblocker"
									title="Git repository"
								>
									<Obfuscated>https://github.com/holy-unblocker</Obfuscated>
								</ObfuscatedThemeA>
							</td>
						</tr>
						<tr>
							<td>Email:</td>
							<td>
								<ObfuscatedThemeA
									href={'mailto:' + SUPPORT_EMAIL}
									title="Email address"
								>
									<Obfuscated>{SUPPORT_EMAIL}</Obfuscated>
								</ObfuscatedThemeA>
							</td>
						</tr>
					</tbody>
				</table>
			</main>
		</>
	);
};

export default Contact;
