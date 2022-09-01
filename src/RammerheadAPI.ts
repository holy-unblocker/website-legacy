export class RammerheadAPI {
	private server: string;
	private signal?: AbortSignal;
	private password?: string;
	constructor(server: string, signal?: AbortSignal, password?: string) {
		this.server = server;
		this.signal = signal;
		this.password = password;
	}
	async get(url: string) {
		if (this.password) {
			// really cheap way of adding a query parameter
			if (url.includes('?')) {
				url += '&pwd=' + this.password;
			} else {
				url += '?pwd=' + this.password;
			}
		}

		try {
			const request = await fetch(new URL(url, this.server), {
				signal: this.signal,
			});

			if (request.status === 200) {
				return await request.text();
			} else {
				throw new Error(
					`unexpected server response to not match "200". Server says "${await request.text()}"`
				);
			}
		} catch (err) {
			console.error(err);
			throw new Error('Cannot communicate with the server');
		}
	}
	async needPassword() {
		return (await this.get('needpassword')) === 'true';
	}
	async newSession() {
		return await this.get('newsession');
	}
	async editSession(
		id: string,
		httpProxy: string | false,
		enableShuffling: boolean
	) {
		const res = await this.get(
			'editsession?id=' +
				encodeURIComponent(id) +
				(httpProxy ? '&httpProxy=' + encodeURIComponent(httpProxy) : '') +
				'&enableShuffling=' +
				(enableShuffling ? '1' : '0')
		);

		if (res !== 'Success') {
			throw new Error(`unexpected response from server. received ${res}`);
		}
	}
	async sessionExists(id: string) {
		const res = await this.get('sessionexists?id=' + encodeURIComponent(id));

		switch (res) {
			case 'exists':
				return true;
			case 'not found':
				return false;
			default:
				throw new Error(`unexpected response from server. received ${res}`);
		}
	}
	async deleteSession(id: string) {
		if (await this.sessionExists(id)) {
			const res = await this.get('deletesession?id=' + id);

			if (res !== 'Success' && res !== 'not found') {
				throw new Error(`unexpected response from server. received ${res}`);
			}
		}
	}
	async shuffleDict(id: string) {
		const res = await this.get('api/shuffleDict?id=' + encodeURIComponent(id));
		return JSON.parse(res);
	}
}

export class StrShuffler {
	private dictionary: string;
	baseDictionary =
		'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~-';
	shuffledIndicator = '_rhs';
	constructor(dictionary?: string) {
		dictionary ||= this.generateDictionary();
		this.dictionary = dictionary;
	}
	mod(n: number, m: number) {
		return ((n % m) + m) % m;
	}
	generateDictionary() {
		let str = '';
		const split = this.baseDictionary.split('');
		while (split.length > 0)
			str += split.splice(Math.floor(Math.random() * split.length), 1)[0];

		return str;
	}
	shuffle(str: string) {
		if (str.startsWith(this.shuffledIndicator)) return str;
		let shuffledStr = '';
		for (let i = 0; i < str.length; i++) {
			const char = str.charAt(i);
			const idx = this.baseDictionary.indexOf(char);
			if (char === '%' && str.length - i >= 3) {
				shuffledStr += char;
				shuffledStr += str.charAt(++i);
				shuffledStr += str.charAt(++i);
			} else if (idx === -1) shuffledStr += char;
			else
				shuffledStr += this.dictionary.charAt(
					this.mod(idx + i, this.baseDictionary.length)
				);
		}
		return this.shuffledIndicator + shuffledStr;
	}
	unshuffle(str: string) {
		if (!str.startsWith(this.shuffledIndicator)) return str;

		str = str.slice(this.shuffledIndicator.length);

		let unshuffledStr = '';
		for (let i = 0; i < str.length; i++) {
			const char = str.charAt(i);
			const idx = this.dictionary.indexOf(char);
			if (char === '%' && str.length - i >= 3) {
				unshuffledStr += char;
				unshuffledStr += str.charAt(++i);
				unshuffledStr += str.charAt(++i);
			} else if (idx === -1) unshuffledStr += char;
			else
				unshuffledStr += this.baseDictionary.charAt(
					this.mod(idx - i, this.baseDictionary.length)
				);
		}
		return unshuffledStr;
	}
}
