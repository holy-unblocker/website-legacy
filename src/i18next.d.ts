import 'i18next';
import type enLang from './locales/en';
import type frLang from './locales/fr';

declare module 'i18next' {
	interface CustomTypeOptions {
		resources: typeof enLang | typeof frLang;
	}
}
