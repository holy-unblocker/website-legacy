import type { HolyPage } from '../App';
import { ThemeButton } from '../ThemeElements';
import { Obfuscated } from '../obfuscate';
import styles from '../styles/Home.module.scss';
import { useTranslation } from 'react-i18next';

const Home: HolyPage = ({ mainLayout }) => {
	const { t } = useTranslation();

	return (
		<main className={styles.main}>
			<h1>
				<Obfuscated>{t('landing.title')}</Obfuscated>
			</h1>
			<h2>
				<Obfuscated>{t('landing.caption')}</Obfuscated>
			</h2>
			<ThemeButton
				className={styles.button}
				onClick={() => mainLayout.current!.setExpanded(true)}
			>
				<Obfuscated>{t('landing.getStarted')}</Obfuscated>
			</ThemeButton>
		</main>
	);
};

export default Home;
