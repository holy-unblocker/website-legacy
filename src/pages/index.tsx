import type { HolyPage } from '../App';
import Meta from '../Meta';
import ProxyOmnibox from '../ProxyOmnibox';
import { ThemeButton } from '../ThemeElements';
import { ReactComponent as Underline } from '../assets/underline.svg';
import { Obfuscated } from '../obfuscate';
import styles from '../styles/Home.module.scss';
import type { ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';

const HomeMeta = () => (
	<Meta
		title="Holy Unblocker"
		description="Holy Unblocker is a web proxy service with support for many sites. Unblock websites on Chromebooks at school and work."
		faq={[
			{
				name: 'How do I unblock websites?',
				acceptedAnswer: {
					text: 'Go to the proxy page and enter the address of a blocked website.',
				},
			},
			{
				name: 'Is Holy Unblocker open source?',
				acceptedAnswer: {
					text: 'We are FOSS and actively maintain our open source projects on GitHub.',
				},
			},
			{
				name: 'What games are on Holy Unblocker?',
				acceptedAnswer: {
					text: 'We host games with a variety of genres. Genres: action, platformer, shooters, rpg, sandbox, survival, sports, and puzzle. We host emulated games from consoles such as the NES, N64, GBA, and the Sega Genesis.',
				},
			},
		]}
	/>
);

const Pretty = ({ children }: { children?: ReactNode }) => (
	<span className={styles.pretty}>
		{children}
		<Underline className={styles.prettyUnderline} />
	</span>
);

const Home: HolyPage = ({ layout, mainLayout }) => {
	const { t } = useTranslation('landing');

	return (
		<>
			<HomeMeta />
			<main className={styles.main}>
				<div className={styles.title}>
					<h1>
						<Trans t={t} components={[<Pretty />]} i18nKey="title" />
					</h1>
					<h3>
						<Obfuscated>{t('caption')}</Obfuscated>
					</h3>
				</div>
				<div className={styles.focus}>
					<ThemeButton
						className={styles.button}
						onClick={() => mainLayout.current!.setExpanded(true)}
					>
						<Obfuscated>{t('getStarted')}</Obfuscated>
					</ThemeButton>
					<ProxyOmnibox className={styles.omnibox} layout={layout} />
				</div>
			</main>
		</>
	);
};

export default Home;
