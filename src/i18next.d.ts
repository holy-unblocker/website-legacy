/* eslint-disable @typescript-eslint/consistent-type-imports */
// import the original type declarations
import 'i18next';
import type { enResources } from './locales/en';
import type { frResources } from './locales/fr';

declare module 'i18next' {
	// Extend CustomTypeOptions
	interface CustomTypeOptions {
		// custom resources type
		resources: enResources | frResources;
		// other
	}
}
