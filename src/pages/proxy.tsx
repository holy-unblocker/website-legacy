import type { HolyPage, LayoutDump } from '../App';
import { useGlobalSettings } from '../Layout';
import resolveProxy from '../ProxyResolver';
import SearchBuilder from '../SearchBuilder';
import ServiceFrame from '../ServiceFrame';
import type { ServiceFrameRef } from '../ServiceFrame';
import { ThemeInputBar, ThemeLink, themeStyles } from '../ThemeElements';
import presentAboutBlank from '../aboutBlank';
import { BARE_API } from '../consts';
import engines from '../engines';
import isAbortError, { isFailedToFetch } from '../isAbortError';
import { Obfuscated } from '../obfuscate';
import { getHot } from '../routes';
import styles from '../styles/Proxy.module.scss';
import textContent from '../textContent';
import NorthWest from '@mui/icons-material/NorthWest';
import Search from '@mui/icons-material/Search';
import BareClient from '@tomphttp/bare-client';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import { createRef, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

const SearchBar = ({ layout }: { layout: LayoutDump['layout'] }) => {
	const { t } = useTranslation();
	const input = useRef<HTMLInputElement | null>(null);
	const inputValue = useRef<string | null>(null);
	const lastInput = useRef<'select' | 'input' | null>(null);
	const [lastSelect, setLastSelect] = useState(-1);
	const [omniboxEntries, setOmniboxEntries] = useState<string[]>([]);
	const [inputFocused, setInputFocused] = useState(false);
	const serviceFrame = useRef<ServiceFrameRef | null>(null);
	const abort = useRef(new AbortController());
	const bare = useMemo(() => new BareClient(BARE_API), []);
	const [settings] = useGlobalSettings();
	const engine =
		engines.find((engine) => engine.format === settings.search) || engines[0];

	async function onInput() {
		if (inputValue.current !== input.current!.value) {
			inputValue.current = input.current!.value;

			const entries: string[] = [];

			try {
				abort.current.abort();
				abort.current = new AbortController();

				const outgoing = await bare.fetch(
					'https://www.bing.com/AS/Suggestions?' +
						new URLSearchParams({
							qry: input.current!.value,
							cvid: '\u0001',
							bareServer: '',
						}),
					{
						signal: abort.current.signal,
					}
				);

				if (!outgoing.ok) {
					throw await outgoing.text();
				}

				const text = await outgoing.text();

				for (const [, phrase] of text.matchAll(
					/<span class="sa_tm_text">(.*?)<\/span>/g
				))
					entries.push(phrase);
			} catch (err) {
				if (isAbortError(err) || isFailedToFetch(err)) {
					// likely abort error
					console.error('Error fetching Bare server.');
				} else {
					throw err;
				}
			}

			setOmniboxEntries(entries);
		}
	}

	async function searchSubmit() {
		const value =
			lastSelect === -1 || lastInput.current === 'input'
				? input.current!.value
				: textContent(omniboxEntries[lastSelect]);

		input.current!.value = value;

		const builder = new SearchBuilder(settings.search);
		const src = builder.query(input.current!.value);

		setInputFocused(false);

		switch (settings.proxyMode) {
			case 'embedded':
				serviceFrame.current!.proxy(src);
				break;
			case 'redirect':
				window.location.assign(await resolveProxy(src, settings.proxy));
				break;
			case 'about:blank':
				presentAboutBlank(await resolveProxy(src, settings.proxy));
				break;
		}

		onInput();
	}

	const renderSuggested = inputFocused && omniboxEntries.length !== 0;

	const form = useRef<HTMLFormElement | null>(null);
	const suggested = useRef<HTMLDivElement | null>(null);

	return (
		<>
			<ServiceFrame ref={serviceFrame} layout={layout} />
			<form
				className={styles.omnibox}
				data-suggested={Number(renderSuggested)}
				data-focused={Number(inputFocused)}
				onSubmit={(event) => {
					event.preventDefault();
					searchSubmit();
				}}
				onBlur={(event) => {
					if (!form.current!.contains(event.relatedTarget)) {
						setInputFocused(false);
					}
				}}
				ref={form}
			>
				<ThemeInputBar className={styles.ThemeInputBar}>
					<Search className={themeStyles.icon} />
					<input
						type="text"
						placeholder={t('proxy.search', {
							engine: engine.name,
						})}
						required={lastSelect === -1}
						autoComplete="off"
						className={themeStyles.thinPadLeft}
						ref={input}
						onInput={onInput}
						onFocus={() => {
							onInput();
							setInputFocused(true);
							setLastSelect(-1);
						}}
						onClick={() => {
							onInput();
							setInputFocused(true);
							setLastSelect(-1);
						}}
						onChange={() => {
							lastInput.current = 'input';
							setLastSelect(-1);
						}}
						onKeyDown={(event) => {
							let preventDefault = true;

							switch (event.code) {
								case 'Escape':
									setInputFocused(false);
									break;
								case 'ArrowDown':
								case 'ArrowUp':
									{
										const lastI = lastSelect;

										let next: number | undefined;

										switch (event.code) {
											case 'ArrowDown':
												if (lastI >= omniboxEntries.length - 1) {
													next = 0;
												} else {
													next = lastI + 1;
												}
												break;
											case 'ArrowUp':
												if (lastI <= 0) {
													next = omniboxEntries.length - 1;
												} else {
													next = lastI - 1;
												}
												break;
											// no default
										}

										lastInput.current = 'select';

										setLastSelect(next);
									}
									break;
								default:
									preventDefault = false;
									break;
								// no default
							}

							if (preventDefault) {
								event.preventDefault();
							}
						}}
					/>
				</ThemeInputBar>
				<div
					ref={suggested}
					className={styles.suggested}
					onMouseLeave={() => {
						setLastSelect(-1);
					}}
				>
					{renderSuggested &&
						omniboxEntries.map((entry, i) => {
							const text = createRef<HTMLSpanElement>();

							return (
								<div
									key={i}
									tabIndex={0}
									className={clsx(
										styles.option,
										i === lastSelect && styles.hover
									)}
									onClick={() => {
										lastInput.current = 'select';
										input.current!.value = text.current!.textContent!;
										searchSubmit();
									}}
									onMouseOver={() => {
										setLastSelect(i);
									}}
								>
									<Search className={styles.search} />
									<span
										className={styles.text}
										ref={text}
										dangerouslySetInnerHTML={{
											__html: entry,
										}}
									/>
									<NorthWest className={styles.open} />
								</div>
							);
						})}
				</div>
			</form>
		</>
	);
};

const FAQLink = ({ children }: { children?: ReactNode }) => (
	<ThemeLink to={getHot('faq').path}>
		<Obfuscated>{children}</Obfuscated>
	</ThemeLink>
);

const Proxies: HolyPage = ({ layout }) => {
	return (
		<main className={styles.main}>
			<SearchBar layout={layout} />
			<p>
				<Trans i18nKey="proxy.faq" components={[<FAQLink />]} />
			</p>
		</main>
	);
};

export default Proxies;
