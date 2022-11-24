/* eslint-disable @typescript-eslint/consistent-type-imports */
import enCommonError from '../assets/locales/en/commonError.json?file';
import enCompat from '../assets/locales/en/compat.json?file';
import enCredits from '../assets/locales/en/credits.json?file';
import enFaq from '../assets/locales/en/faq.json?file';
import enGameCategory from '../assets/locales/en/gameCategory.json?file';
import enLanding from '../assets/locales/en/landing.json?file';
import enLink from '../assets/locales/en/link.json?file';
import enNotFound from '../assets/locales/en/notFound.json?file';
import enProxy from '../assets/locales/en/proxy.json?file';
import enSettings from '../assets/locales/en/settings.json?file';
import enTheatre from '../assets/locales/en/theatre.json?file';

const enLang = {
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

export type enResources = {
	notFound: typeof import('../assets/locales/en/notFound.json');
	commonError: typeof import('../assets/locales/en/commonError.json');
	compat: typeof import('../assets/locales/en/compat.json');
	credits: typeof import('../assets/locales/en/credits.json');
	faq: typeof import('../assets/locales/en/faq.json');
	gameCategory: typeof import('../assets/locales/en/gameCategory.json');
	landing: typeof import('../assets/locales/en/landing.json');
	link: typeof import('../assets/locales/en/link.json');
	proxy: typeof import('../assets/locales/en/proxy.json');
	settings: typeof import('../assets/locales/en/settings.json');
	theatre: typeof import('../assets/locales/en/theatre.json');
};

export default enLang;
