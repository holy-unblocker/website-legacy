/* eslint-disable @typescript-eslint/consistent-type-imports */
import commonError from '../assets/locales/en/commonError.json?file';
import compat from '../assets/locales/en/compat.json?file';
import credits from '../assets/locales/en/credits.json?file';
import faq from '../assets/locales/en/faq.json?file';
import gameCategory from '../assets/locales/en/gameCategory.json?file';
import landing from '../assets/locales/en/landing.json?file';
import link from '../assets/locales/en/link.json?file';
import notFound from '../assets/locales/en/notFound.json?file';
import proxy from '../assets/locales/en/proxy.json?file';
import settings from '../assets/locales/en/settings.json?file';
import theatre from '../assets/locales/en/theatre.json?file';

const enLang = {
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
