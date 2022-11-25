import { useGlobalCloakSettings } from './Layout';
import { OBFUSCATE } from './consts';
import { Helmet } from 'react-helmet-async';

// FAQ will be in english, at least in this repository.
// Google is capable of translating the FAQ automatically

// We provide metadata for public pages, although they aren't used in default open-source builds of Holy Unblocker.
// This will allow us to have metadata on our official branch without bloating our branch and enable people to have same levels of SEO.

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

export interface MetaProps {
	title?: string;
	description?: string;
	faq?: Question[];
}

/**
 * Page metadata.
 */
const Meta = ({ title, description, faq }: MetaProps) => {
	const [cloak] = useGlobalCloakSettings();

	return (
		<Helmet>
			<title>
				{cloak.title === '' ? title || 'Holy Unblocker' : cloak.title}
			</title>
			{!OBFUSCATE && description && (
				<meta name="description" content={description} />
			)}
			{!OBFUSCATE && faq && (
				<script type="application/ld+json">
					{JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'FAQPage',
						mainEntity: faq.map((question) => ({
							'@type': 'Question',
							name: question.name,
							acceptedAnswer: {
								'@type': 'Answer',
								text: question.acceptedAnswer.text,
							},
						})),
					})}
				</script>
			)}
		</Helmet>
	);
};

export default Meta;
