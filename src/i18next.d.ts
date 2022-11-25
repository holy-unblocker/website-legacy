import 'i18next';
import type * as enLang from './locales/en';
import type * as frLang from './locales/fr';

declare module 'i18next' {
	interface CustomTypeOptions {
		resources: typeof enLang | typeof frLang;
	}
}
