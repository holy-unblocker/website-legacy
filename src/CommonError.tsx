import { ThemeA, ThemeLink } from './ThemeElements';
import { getHot } from './routes';
import type { ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';

const TryAgainHere = ({ children }: { children?: ReactNode }) => (
	<ThemeA
		href="i:"
		onClick={(event) => {
			event.preventDefault();
			window.location.reload();
		}}
	>
		{children}
	</ThemeA>
);

const FAQLink = ({ children }: { children?: ReactNode }) => (
	<ThemeLink to={getHot('faq').path} target="_parent">
		{children}
	</ThemeLink>
);

const ContactLink = ({ children }: { children?: ReactNode }) => (
	<ThemeLink to={getHot('contact').path} target="_parent">
		{children}
	</ThemeLink>
);

const CommonError = ({
	cause,
	error,
	message,
}: {
	cause?: string | null;
	error: string;
	message: string;
}) => {
	const { t } = useTranslation('commonError');

	return (
		<main className="error">
			<p>{message}:</p>
			{cause ? (
				<>
					<pre>{cause}</pre>
					<pre>{error}</pre>
				</>
			) : (
				<pre>{error}</pre>
			)}
			<p>
				<Trans t={t} i18nKey="tryAgain" components={[<TryAgainHere />]} />
				<br />
				<Trans
					t={t}
					i18nKey="stillOccurs"
					components={[<FAQLink />, <ContactLink />]}
				/>
			</p>
		</main>
	);
};

export default CommonError;
