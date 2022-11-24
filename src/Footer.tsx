import { ThemeLink } from './ThemeElements';
import { ReactComponent as Waves } from './assets/waves.svg';
import { Obfuscated } from './obfuscate';
import { getHot } from './routes';
import styles from './styles/Footer.module.scss';
import { useTranslation } from 'react-i18next';

const Footer = () => {
	const { t } = useTranslation('link');

	return (
		<footer className={styles.footer}>
			<Waves />
			<div className={styles.background}>
				<div className={styles.content}>
					<ThemeLink to={getHot('contact').path}>{t('contact')}</ThemeLink>
					<ThemeLink to={getHot('credits').path}>{t('credits')}</ThemeLink>
					<ThemeLink to={getHot('privacy').path}>{t('privacy')}</ThemeLink>
					<ThemeLink to={getHot('terms').path}>
						<span className={styles.long}>{t('tou')}</span>
						<span className={styles.short}>{t('touShort')}</span>
					</ThemeLink>
					<div>
						&copy; <Obfuscated>Holy Unblocker</Obfuscated>{' '}
						{new Date().getUTCFullYear()}
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
