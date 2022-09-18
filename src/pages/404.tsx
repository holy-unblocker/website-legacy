import type { HolyPage } from '../App';
import { ThemeLink } from '../ThemeElements';
import { getHot } from '../routes';
import { Trans, useTranslation } from 'react-i18next';

const NotFound: HolyPage = () => {
	const { t } = useTranslation();

	return (
		<main>
			<h1>{t('404.title')}</h1>
			<hr />
			<p>
				{t('404.suggestion')}
				<br />
				<Trans
					i18nKey="404.contactUs"
					components={[<ThemeLink to={getHot('contact').path} />]}
				/>
			</p>
		</main>
	);
};

export default NotFound;
