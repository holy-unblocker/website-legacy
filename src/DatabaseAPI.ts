export interface DatabaseError extends Error {
	statusCode: number;
	type?: string;
}

export const isDatabaseError = (error: unknown): error is DatabaseError =>
	typeof error === 'object' &&
	error !== null &&
	error instanceof Error &&
	'statusCode' in error;

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
			const error: Partial<DatabaseError> = new Error(json.message);
			error.statusCode = json.statusCode;
			throw error;
		}

		return json as JSONData;
	}
}
