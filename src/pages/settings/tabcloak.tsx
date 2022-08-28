import type { HolyPage } from '../../App';
import { Notification } from '../../Notifications';
import { ThemeButton, ThemeInputBar, themeStyles } from '../../ThemeElements';
import { BARE_API } from '../../consts';
import { Obfuscated } from '../../obfuscate';
import styles from '../../styles/Settings.module.scss';
import { Check } from '@mui/icons-material';
import BareClient from '@tomphttp/bare-client';
import clsx from 'clsx';
import { useRef } from 'react';

const bare = new BareClient(BARE_API);

interface ExtractedData {
	title: string;
	icon: string;
	url: string;
}

async function extractData(url: string): Promise<ExtractedData> {
	const response = await bare.fetch(url, { redirect: 'follow' });

	if (!response.ok) {
		throw new Error(`Response was not OK. Got ${response.status}`);
	}

	const parser = new DOMParser();

	const dom = parser.parseFromString(`${await response.text()}`, 'text/html');

	const base = document.createElement('base');
	base.href = url;

	dom.head.append(base);

	let icon: string;

	const iconSelector = dom.querySelector(
		'link[rel*="icon"]'
	) as HTMLLinkElement | null;

	if (iconSelector && iconSelector.href !== '') icon = iconSelector.href;
	else icon = new URL('/favicon.ico', url).toString();

	const outgoing = await bare.fetch(icon);

	icon = await blobToDataURL(
		new Blob([await outgoing.arrayBuffer()], {
			type: outgoing.headers.get('content-type')!,
		})
	);

	const titleSelector = dom.querySelector('title');

	let title: string;

	if (titleSelector && titleSelector.textContent !== '')
		title = titleSelector.textContent!;
	else {
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
		throw new Error('Bad URL');
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

const TabCloak: HolyPage = ({ layout }) => {
	const input = useRef<HTMLInputElement | null>(null);

	async function onSubmit() {
		try {
			const resolved = resolveURL(input.current!.value);

			let title, icon, url;

			switch (resolved) {
				case 'about:blank':
					title = 'about:blank';
					icon = 'none';
					url = 'about:blank';
					break;
				default:
					layout.current!.notifications.current!.add(
						<Notification description="Fetching..." type="info" />
					);

					({ title, icon, url } = await extractData(resolved));

					break;
			}

			input.current!.value = url;

			layout.current!.setCloak({
				title: title!,
				icon: icon!,
				url: url!,
			});

			layout.current!.notifications.current!.add(
				<Notification description="Cloak set" type="success" />
			);
		} catch (err) {
			console.error(err);

			layout.current!.notifications.current!.add(
				<Notification
					title="Unable to fetch cloak"
					description={err instanceof Error ? err.message : 'Unknown error'}
					type="error"
				/>
			);
		}
	}

	return (
		<section>
			<div>
				<Obfuscated>
					Tab Cloaking allows you to disguise Holy Unblocker as any website such
					as your school's home page, new tab, etc.
				</Obfuscated>
			</div>
			<div>
				<span>
					<Obfuscated>URL</Obfuscated>:
				</span>
				<form
					onSubmit={(event) => {
						event.preventDefault();
						onSubmit();
					}}
				>
					<ThemeInputBar className={styles.ThemeInputBar}>
						<input
							className={themeStyles.themePadRight}
							defaultValue={layout.current!.cloak.url}
							placeholder="https://example.org/"
							ref={input}
						/>
						<Check
							onClick={onSubmit}
							className={clsx(themeStyles.button, themeStyles.right)}
						/>
					</ThemeInputBar>
				</form>
			</div>
			<div>
				<ThemeButton
					onClick={() => {
						layout.current!.setCloak({
							title: '',
							icon: '',
							url: '',
						});

						input.current!.value = '';

						layout.current!.notifications.current!.add(
							<Notification description="Cloak reset" type="info" />
						);
					}}
				>
					<Obfuscated>Reset Cloak</Obfuscated>
				</ThemeButton>
			</div>
		</section>
	);
};

export default TabCloak;
