import i18n from './i18n';
import { isError } from './isAbortError';

export interface i18nError {
	i18nError: true;
	key: string;
	data: Record<string, string>;
}

interface JSONError<T = unknown> extends Error {
	statusCode: number;
	json: T;
}

export const readi18nError = (err: JSONError<i18nError>) =>
	i18n.t<string>(err.json.key, err.json.data);

export const isJSONError = (err: unknown): err is JSONError =>
	isError(err) && 'statusCode' in err && 'json' in err;

export const isi18nError = (err: unknown): err is JSONError<i18nError> =>
	isJSONError(err) &&
	typeof err.json === 'object' &&
	err !== null &&
	'i18nError' in (err.json as object);

export default class DatabaseAPI {
	private server: string;
	private signal?: AbortSignal;
	constructor(server: string, signal?: AbortSignal) {
		this.server = server;
		this.signal = signal;
	}
	protected sortParams(
		params: Record<string, unknown>
	): Record<string, string> {
		const result: Record<string, string> = {};

		for (const param in params) {
			const value = params[param];

			if (typeof value === 'string' || typeof value === 'number')
				result[param] = value.toString();
		}

		return result;
	}
	async fetch<JSONData>(url: string, init: RequestInit = {}) {
		const outgoing = await fetch(new URL(url, this.server), {
			...init,
			signal: this.signal,
		});

		const json = await outgoing.json();

		if (!outgoing.ok) {
			const error: Partial<JSONError<unknown>> = new Error(
				('message' in json && (json as { message: string }).message) ||
					outgoing.statusText
			);
			error.statusCode = outgoing.status;
			error.json = json;
			throw error;
		}

		return json as JSONData;
	}
}
