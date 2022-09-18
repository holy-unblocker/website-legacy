import { ThemeA, ThemeLink } from './ThemeElements';
import { getHot } from './routes';
import type { ReactNode } from 'react';
import { Trans } from 'react-i18next';

const TryAgainHere = ({ children }: { children?: ReactNode }) => (
	<ThemeA
		href="i:"
		onClick={(event) => {
			event.preventDefault();
			global.location.reload();
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
	error,
	message,
}: {
	error: string;
	message: string;
}) => {
	return (
		<main className="error">
			<p>{message}:</p>
			<pre>{error}</pre>
			<p>
				<Trans i18nKey="commonError.tryAgain" components={[<TryAgainHere />]} />
				<br />
				<Trans
					i18nKey="commonError.stillOccurs"
					components={[<FAQLink />, <ContactLink />]}
				/>
			</p>
		</main>
	);
};

export default CommonError;
