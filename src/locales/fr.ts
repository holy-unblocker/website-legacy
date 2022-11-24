/* eslint-disable @typescript-eslint/consistent-type-imports */
import commonError from '../assets/locales/fr/commonError.json?file';
import compat from '../assets/locales/fr/compat.json?file';
import credits from '../assets/locales/fr/credits.json?file';
import faq from '../assets/locales/fr/faq.json?file';
import gameCategory from '../assets/locales/fr/gameCategory.json?file';
import landing from '../assets/locales/fr/landing.json?file';
import link from '../assets/locales/fr/link.json?file';
import notFound from '../assets/locales/fr/notFound.json?file';
import proxy from '../assets/locales/fr/proxy.json?file';
import settings from '../assets/locales/fr/settings.json?file';
import theatre from '../assets/locales/fr/theatre.json?file';

const frLang = {
	commonError,
	compat,
	credits,
	faq,
	gameCategory,
	landing,
	link,
	notFound,
	proxy,
	settings,
	theatre,
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
