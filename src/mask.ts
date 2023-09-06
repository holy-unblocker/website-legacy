import { BARE_API } from './consts';
import i18n from './i18n';
import { BareClient } from '@tomphttp/bare-client';

const bare = new BareClient(BARE_API);

export interface ExtractedData {
	title: string;
	icon: string;
	url: string;
}

export async function extractData(address: string): Promise<ExtractedData> {
	const url = resolveURL(address);

	if (url === 'about:blank')
		return {
			title: 'about:blank',
			icon: 'none',
			url: 'about:blank',
		};

	const response = await bare.fetch(url, { redirect: 'follow' });

	if (!response.ok)
		throw new Error(`Response was not OK. Got ${response.status}`);

	const parser = new DOMParser();

	const dom = parser.parseFromString(`${await response.text()}`, 'text/html');

	const base = document.createElement('base');
	base.href = response.finalURL;

	dom.head.append(base);

	let icon: string;

	const iconSelector = dom.querySelector(
		'link[rel*="icon"]',
	) as HTMLLinkElement | null;

	if (iconSelector && iconSelector.href !== '') icon = iconSelector.href;
	else icon = new URL('/favicon.ico', url).toString();

	const outgoing = await bare.fetch(icon);

	icon = await blobToDataURL(
		new Blob([await outgoing.arrayBuffer()], {
			type: outgoing.headers.get('content-type')!,
		}),
	);

	let title = dom.title;

	if (!title) {
		const url = new URL(response.finalURL);
		title = `${url.host}${url.pathname}${url.search}`;
	}

	return { icon, title, url: response.finalURL };
}

const whitespace = /\s+/;
const protocol = /^\w+:/;

function resolveURL(input: string) {
	if (input.match(protocol)) {
		return input;
	} else if (input.includes('.') && !input.match(whitespace)) {
		return `http://${input}`;
	} else {
		throw new Error(i18n.t('settings:tabMask.validateError'));
	}
}

async function blobToDataURL(blob: Blob) {
	const reader = new FileReader();

	return new Promise<string>((resolve, reject) => {
		reader.addEventListener('load', () => resolve(reader.result as string));
		reader.addEventListener('error', reject);
		reader.readAsDataURL(blob);
	});
}
