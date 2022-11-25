import AsyncBackend from './AsyncBackend';
import type { AsyncBackendOptions } from './AsyncBackend';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

export type i18nLanguage = 'en' | 'fr';
const languages: i18nLanguage[] = ['en', 'fr'];

let lng = localStorage.getItem('lng')! as i18nLanguage;

if (!languages.includes(lng)) {
	lng = 'en';
	localStorage.setItem('lng', lng);
}

export const getLanguage = () => lng;

export const setLanguage = (newLng: i18nLanguage) => {
	lng = newLng;
	localStorage.setItem('lng', lng);
	i18n.changeLanguage(lng);
};

i18n
	.use(initReactI18next)
	.use(AsyncBackend)
	.use(LanguageDetector)
	.init({
		ns: [],
		backend: {
			resources: {
				dev: () => import('./locales/en'),
				en: () => import('./locales/en'),
				fr: () => import('./locales/fr'),
			},
		} as AsyncBackendOptions,
		lng,
		interpolation: {
			escapeValue: false, // react already safes from xss
		},
	});

export default i18n;
