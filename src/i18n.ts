import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)

const languages = ['en', 'fr'];
export type i18nLanguage = 'en' | 'fr';

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
	.use(initReactI18next) // passes i18n down to react-i18next
	.use(HttpApi)
	.use(LanguageDetector)
	.init({
		lng,
		interpolation: {
			escapeValue: false, // react already safes from xss
		},
	});

export default i18n;
