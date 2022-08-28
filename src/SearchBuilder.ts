export const whitespace = /\s/;
export const http_s_protocol = /^https?:\/\//;

export default class SearchBuilder {
	private template: string;
	constructor(template: string) {
		this.template = template;
	}
	query(input: string) {
		input = String(input);

		if (input.match(http_s_protocol)) {
			return input;
		} else if (input.includes('.') && !input.match(whitespace)) {
			return `http://${input}`;
		} else {
			return this.template.replace('%s', encodeURIComponent(input));
		}
	}
}
