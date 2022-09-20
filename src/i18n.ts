import enTranslation from './assets/locales/en/translation.json?file';
import frTranslation from './assets/locales/fr/translation.json?file';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)

export type i18nLanguage = 'dev' | 'en' | 'fr';
const languages: i18nLanguage[] = ['dev', 'en', 'fr'];

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

const paths: Record<i18nLanguage, Record<string, string>> = {
	dev: {
		translation: enTranslation,
	},
	en: {
		translation: enTranslation,
	},
	fr: {
		translation: frTranslation,
	},
};

i18n
	.use(initReactI18next) // passes i18n down to react-i18next
	.use(HttpApi)
	.use(LanguageDetector)
	.init({
		backend: {
			loadPath(lng, namespace) {
				for (const x of lng) {
					if (!(x in paths)) continue;

					const root = paths[x as i18nLanguage];

					for (const y of namespace) if (y in root) return root[y];
				}

				console.warn('Bad lng', lng);

				return 'obj://';
			},
		},
		lng,
		interpolation: {
			escapeValue: false, // react already safes from xss
		},
	});

export default i18n;
