import { ThemeLink } from './ThemeElements';
import { ReactComponent as Waves } from './assets/waves.svg';
import { Obfuscated } from './obfuscate';
import { getHot } from './routes';
import styles from './styles/Footer.module.scss';

const Footer = () => {
	return (
		<footer>
			<Waves />
			<div className={styles.background}>
				<div className={styles.content}>
					<div className={styles.shiftRight} />
					<ThemeLink to={getHot('credits').path}>Credits</ThemeLink>
					<ThemeLink to={getHot('contact').path}>Contact</ThemeLink>
					<ThemeLink to={getHot('privacy').path}>Privacy</ThemeLink>
					<ThemeLink to={getHot('terms').path}>Terms of use</ThemeLink>
					<span>
						&copy; <Obfuscated>Holy Unblocker</Obfuscated>{' '}
						{new Date().getUTCFullYear()}
					</span>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
