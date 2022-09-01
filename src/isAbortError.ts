const messages = [
	'The operation was aborted.',
	'The operation was aborted. ', // error contains space at end on firefox
	'The user aborted a request.',
];

export const isError = (err: unknown): err is Error =>
	typeof err === 'object' && err !== null && err instanceof Error;

export const isFailedToFetch = (err: unknown): err is Error =>
	isError(err) && err.message === '';

const isAbortError = (err: unknown): err is Error =>
	isError(err) && messages.includes(err.message);

export default isAbortError;
