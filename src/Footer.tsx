import { ThemeLink } from './ThemeElements';
import { ReactComponent as Waves } from './assets/waves.svg';
import { Obfuscated } from './obfuscate';
import { getHot } from './routes';
import styles from './styles/Footer.module.scss';
import { useTranslation } from 'react-i18next';

const Footer = () => {
	const { t } = useTranslation();

	return (
		<footer className={styles.footer}>
			<Waves />
			<div className={styles.background}>
				<div className={styles.content}>
					<ThemeLink to={getHot('contact').path}>{t('link.contact')}</ThemeLink>
					<ThemeLink to={getHot('credits').path}>{t('link.credits')}</ThemeLink>
					<ThemeLink to={getHot('privacy').path}>{t('link.privacy')}</ThemeLink>
					<ThemeLink to={getHot('terms').path}>
						<span className={styles.long}>{t('link.tou')}</span>
						<span className={styles.short}>{t('link.touShort')}</span>
					</ThemeLink>
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
