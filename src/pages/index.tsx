import type { HolyPage } from '../App';
import { ThemeButton } from '../ThemeElements';
import { Obfuscated } from '../obfuscate';
import styles from '../styles/Home.module.scss';

const Home: HolyPage = ({ mainLayout }) => {
	return (
		<main className={styles.main}>
			<h1>
				<Obfuscated>End Internet Censorship.</Obfuscated>
			</h1>
			<h2>
				<Obfuscated>Privacy right at your fingertips.</Obfuscated>
			</h2>
			<ThemeButton
				className={styles.button}
				onClick={() => mainLayout.current!.setExpanded(true)}
			>
				<Obfuscated>Get Started</Obfuscated>
			</ThemeButton>
		</main>
	);
};

export default Home;
