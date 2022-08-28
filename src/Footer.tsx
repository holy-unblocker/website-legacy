import { ThemeLink } from './ThemeElements';
import { ReactComponent as Waves } from './assets/waves.svg';
import { Obfuscated } from './obfuscate';
import resolveRoute from './resolveRoute';
import styles from './styles/Footer.module.scss';

const Footer = () => {
	return (
		<footer>
			<Waves />
			<div className={styles.background}>
				<div className={styles.content}>
					<div className={styles.shiftRight} />
					<ThemeLink to={resolveRoute('/', 'credits')}>Credits</ThemeLink>
					<ThemeLink to={resolveRoute('/', 'contact')}>Contact</ThemeLink>
					<ThemeLink to={resolveRoute('/', 'privacy')}>Privacy</ThemeLink>
					<ThemeLink to={resolveRoute('/', 'terms')}>Terms of use</ThemeLink>
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
