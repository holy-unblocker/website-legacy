import type { HolyPage } from '../App';
import { ObfuscatedThemeA, ThemeLink } from '../ThemeElements';
import { TN_DISCORD_URL } from '../consts';
import { Obfuscated } from '../obfuscate';
import { getHot } from '../routes';
import type { ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';

const WebsiteAIOLink = ({ children }: { children?: ReactNode }) => (
	<ObfuscatedThemeA href="https://github.com/holy-unblocker/website-aio#website-aio">
		{children}
	</ObfuscatedThemeA>
);

const TNInviteLink = ({ children }: { children?: ReactNode }) => (
	<ObfuscatedThemeA href={TN_DISCORD_URL}>
		<Obfuscated>{children}</Obfuscated>
	</ObfuscatedThemeA>
);

const GitLink = ({ children }: { children?: ReactNode }) => (
	<ObfuscatedThemeA href="https://git.holy.how/holy/website">
		{children}
	</ObfuscatedThemeA>
);

const ContactLink = ({ children }: { children?: ReactNode }) => (
	<ThemeLink to={getHot('contact').path}>{children}</ThemeLink>
);

const PrivacyLink = ({ children }: { children?: ReactNode }) => (
	<ThemeLink to={getHot('privacy').path}>{children}</ThemeLink>
);

const FAQ: HolyPage = () => {
	const { t } = useTranslation();

	// <0> = obfuscated always

	return (
		<main>
			<section>
				<h1>
					<Obfuscated>{t(`faq.list.selfhost.q`)}</Obfuscated>
				</h1>
				<p>
					<Trans
						i18nKey={`faq.list.selfhost.a`}
						components={[<Obfuscated />, <WebsiteAIOLink />]}
					/>
				</p>
			</section>
			<section>
				<h1>
					<Obfuscated>{t(`faq.list.morelinks.q`)}</Obfuscated>
				</h1>
				<p>
					<Trans
						i18nKey={`faq.list.morelinks.a`}
						components={[<Obfuscated />, <TNInviteLink />]}
					/>
				</p>
			</section>
			<section>
				<h1>
					<Obfuscated>{t(`faq.list.source.q`)}</Obfuscated>
				</h1>
				<p>
					<Trans
						i18nKey={`faq.list.source.a`}
						components={[<Obfuscated />, <GitLink />]}
					/>
				</p>
			</section>
			<section>
				<h1>
					<Obfuscated>{t(`faq.list.secure.q`)}</Obfuscated>
				</h1>
				<p>
					<Trans
						i18nKey={`faq.list.secure.a`}
						components={[<Obfuscated />, <PrivacyLink />]}
					/>
				</p>
			</section>
			<p style={{ marginTop: 30, opacity: 0.75 }}>
				<Trans i18nKey={`faq.contact`} components={[<ContactLink />]} />
			</p>
		</main>
	);
};

export default FAQ;
