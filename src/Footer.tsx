import { ThemeLink } from './ThemeElements';
import { ReactComponent as Waves } from './assets/waves.svg';
import { Obfuscated } from './obfuscate';
import { getHot } from './routes';
import styles from './styles/Footer.module.scss';
import { useTranslation } from 'react-i18next';

const Footer = () => {
	const { t } = useTranslation();

	return (
		<footer>
			<Waves />
			<div className={styles.background}>
				<div className={styles.content}>
					<ThemeLink to={getHot('credits').path}>{t('link.credits')}</ThemeLink>
					<ThemeLink to={getHot('privacy').path}>{t('link.privacy')}</ThemeLink>
					<ThemeLink to={getHot('terms').path}>{t('link.tou')}</ThemeLink>
					<ThemeLink to={getHot('contact').path}>
						&copy; <Obfuscated>Holy Unblocker</Obfuscated>{' '}
						{new Date().getUTCFullYear()}
					</ThemeLink>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
