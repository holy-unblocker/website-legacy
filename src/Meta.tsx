import { useGlobalCloakSettings } from './Layout';
import { OBFUSCATE } from './consts';
import { getHot } from './routes';
import { Helmet } from 'react-helmet-async';

// FAQ will be in english, at least in this repository.
// Google is capable of translating the FAQ automatically

// We provide metadata for public pages, although they aren't used in default open-source builds of Holy Unblocker.
// This will allow us to have metadata on our official branch without bloating our branch and enable people to have same levels of SEO.

// https://developers.google.com/search/docs/appearance/structured-data/qapage

export interface Answer {
	text: string;
}

export interface Question {
	acceptedAnswer: Answer;
	name: string;
}

export interface FAQPage {
	mainEntity: Question[];
}

// https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox#structured-data-type-definitions

export interface Target {
	urlTemplate: string;
}

export interface SearchAction {
	target: Target;
	'query-input': string;
}

export interface WebSite {
	potentialAction: SearchAction[];
	url: string;
}

export interface MetaProps {
	title: string;
	description?: string;
	faq?: Question[];
	actions?: SearchAction[];
}

const formatFAQ = (faq: FAQPage) =>
	JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faq.mainEntity.map((question) => ({
			'@type': 'Question',
			name: question.name,
			acceptedAnswer: {
				'@type': 'Answer',
				text: question.acceptedAnswer.text,
			},
		})),
	});

const formatWebSite = (ws: WebSite) =>
	JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		url: ws.url,
		potentialAction: ws.potentialAction.map((action) => ({
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: action.target.urlTemplate,
			},
			'query-input': action['query-input'],
		})),
	});

/**
 * Page metadata.
 */
const Meta = ({ title, description, faq, actions }: MetaProps) => {
	const [cloak] = useGlobalCloakSettings();

	return (
		<Helmet>
			<title>{cloak.title === '' ? title : cloak.title}</title>
			{!OBFUSCATE && description && (
				<meta name="description" content={description} />
			)}
			{!OBFUSCATE && faq && (
				<script type="application/ld+json">
					{formatFAQ({
						mainEntity: faq,
					})}
				</script>
			)}
			{!OBFUSCATE && actions && (
				<script type="application/ld+json">
					{formatWebSite({
						url: new URL(
							getHot('home').path,
							globalThis.location.toString(),
						).toString(),
						potentialAction: actions,
					})}
				</script>
			)}
		</Helmet>
	);
};

export default Meta;
