import type { HolyPage } from '../App';
import Meta from '../Meta';
import ProxyOmnibox from '../ProxyOmnibox';
import { ThemeLink } from '../ThemeElements';
import { Obfuscated } from '../obfuscate';
import { getHot } from '../routes';
import styles from '../styles/Proxy.module.scss';
import type { ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';

const FAQLink = ({ children }: { children?: ReactNode }) => (
	<ThemeLink to={getHot('faq').path}>
		<Obfuscated>{children}</Obfuscated>
	</ThemeLink>
);

const ProxyMeta = () => (
	<Meta
		title="Proxy"
		description="Bypass blocks on your internet traffic with Holy Unblocker's web proxy."
		faq={[
			{
				name: 'What web proxies does Holy Unblocker have?',
				acceptedAnswer: {
					text: 'Ultraviolet and Rammerhead. You can change the default proxy in your settings.',
				},
			},
		]}
		actions={[
			{
				target: {
					urlTemplate:
						new URL(getHot('proxy').path, globalThis.location.toString()) +
						'?q={search_term_string}',
				},
				'query-input': 'required name=search_term_string',
			},
		]}
	/>
);

const Proxies: HolyPage = ({ layout }) => {
	const { t } = useTranslation('proxy');

	return (
		<>
			<ProxyMeta />
			<main className={styles.main}>
				<ProxyOmnibox layout={layout} />
				<p>
					<Trans t={t} i18nKey="faq" components={[<FAQLink />]} />
				</p>
			</main>
		</>
	);
};

export default Proxies;
