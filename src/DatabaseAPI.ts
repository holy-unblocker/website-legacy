export interface DatabaseError extends Error {
	statusCode: number;
}

export default class DatabaseAPI {
	private server: string;
	private signal?: AbortSignal;
	constructor(server: string, signal?: AbortSignal) {
		this.server = server;
		this.signal = signal;
	}
	protected sortParams(params: Record<string, any>): Record<string, string> {
		const result: Record<string, string> = {};

		for (const param in params) {
			switch (typeof params[param]) {
				case 'undefined':
				case 'object':
					break;
				default:
					result[param] = params[param].toString();
					break;
			}
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
