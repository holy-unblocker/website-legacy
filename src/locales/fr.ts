/* eslint-disable @typescript-eslint/consistent-type-imports */
import enCommonError from '../assets/locales/fr/commonError.json?file';
import enCompat from '../assets/locales/fr/compat.json?file';
import enCredits from '../assets/locales/fr/credits.json?file';
import enFaq from '../assets/locales/fr/faq.json?file';
import enGameCategory from '../assets/locales/fr/gameCategory.json?file';
import enLanding from '../assets/locales/fr/landing.json?file';
import enLink from '../assets/locales/fr/link.json?file';
import enNotFound from '../assets/locales/fr/notFound.json?file';
import enProxy from '../assets/locales/fr/proxy.json?file';
import enSettings from '../assets/locales/fr/settings.json?file';
import enTheatre from '../assets/locales/fr/theatre.json?file';

const frLang = {
	commonError: enCommonError,
	compat: enCompat,
	credits: enCredits,
	faq: enFaq,
	gameCategory: enGameCategory,
	landing: enLanding,
	link: enLink,
	notFound: enNotFound,
	proxy: enProxy,
	settings: enSettings,
	theatre: enTheatre,
};

export type frResources = {
	notFound: typeof import('../assets/locales/fr/notFound.json');
	commonError: typeof import('../assets/locales/fr/commonError.json');
	compat: typeof import('../assets/locales/fr/compat.json');
	credits: typeof import('../assets/locales/fr/credits.json');
	faq: typeof import('../assets/locales/fr/faq.json');
	gameCategory: typeof import('../assets/locales/fr/gameCategory.json');
	landing: typeof import('../assets/locales/fr/landing.json');
	link: typeof import('../assets/locales/fr/link.json');
	proxy: typeof import('../assets/locales/fr/proxy.json');
	settings: typeof import('../assets/locales/fr/settings.json');
	theatre: typeof import('../assets/locales/fr/theatre.json');
};

export default frLang;
