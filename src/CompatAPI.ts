import DatabaseAPI from './DatabaseAPI';

export default class CompatAPI extends DatabaseAPI {
	async compat(host: string) {
		return await this.fetch<{ proxy: string }>(`./compat/${host}/`);
	}
}
