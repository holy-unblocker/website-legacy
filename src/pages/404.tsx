import type { HolyPage } from '../App';
import { ThemeLink } from '../ThemeElements';
import { getHot } from '../routes';
import { Trans, useTranslation } from 'react-i18next';

const NotFound: HolyPage = () => {
	const { t } = useTranslation('notFound');

	return (
		<main>
			<h1>{t('title')}</h1>
			<hr />
			<p>
				{t('suggestion')}
				<br />
				<Trans
					ns="notFound"
					i18nKey="contactUs"
					components={[<ThemeLink to={getHot('contact').path} />]}
				/>
			</p>
		</main>
	);
};

export default NotFound;
