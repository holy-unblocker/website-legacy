import type { HolyPage } from '../App';
import { ObfuscatedThemeA } from '../ThemeElements';
import { Obfuscated } from '../obfuscate';
import { useTranslation } from 'react-i18next';

const Credits: HolyPage = () => {
	const { t } = useTranslation();

	return (
		<main>
			<h2>{t('credits.titles.credits')}</h2>
			<h4>{t('credits.titles.development')}</h4>
			<ul>
				<li>
					<Obfuscated>
						sexyduceduce - {t('credits.positions.frontendDev')}, Ultraviolet
					</Obfuscated>
				</li>
				<li>
					<Obfuscated>
						Device - {t('credits.positions.frontendDev')}, Stomp
					</Obfuscated>
				</li>
				<li>
					<Obfuscated>
						OlyB - {t('credits.positions.frontendDev')}, WebRetro
					</Obfuscated>
				</li>
				<li>
					<Obfuscated>
						luphoria - {t('credits.positions.backendDev')}
					</Obfuscated>
				</li>
				<li>
					<Obfuscated>Ender - {t('credits.positions.backendDev')}</Obfuscated>
				</li>
				<li>
					<Obfuscated>011011000110111101101100 - Rammerhead</Obfuscated>
				</li>
			</ul>

			<h2>
				<Obfuscated>{t('credits.titles.proxyScripts')}</Obfuscated>
			</h2>

			<ul>
				<li>
					<Obfuscated>Rammerhead:</Obfuscated>{' '}
					<ObfuscatedThemeA href="https://github.com/binary-person/rammerhead">
						<Obfuscated>https://github.com/binary-person/rammerhead</Obfuscated>
					</ObfuscatedThemeA>
				</li>
				<li>
					<Obfuscated>Ultraviolet:</Obfuscated>{' '}
					<ObfuscatedThemeA href="https://github.com/titaniumnetwork-development/Ultraviolet">
						<Obfuscated>
							https://github.com/titaniumnetwork-development/Ultraviolet
						</Obfuscated>
					</ObfuscatedThemeA>
				</li>
				<li>
					<Obfuscated>Stomp:</Obfuscated>{' '}
					<ObfuscatedThemeA href="https://github.com/sysce/stomp">
						<Obfuscated>https://github.com/sysce/stomp</Obfuscated>
					</ObfuscatedThemeA>
				</li>
			</ul>
		</main>
	);
};

export default Credits;
