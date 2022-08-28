const messages = [
	'The operation was aborted.',
	'The operation was aborted. ', // error contains space at end on firefox
	'The user aborted a request.',
];

export default function isAbortError(error: Error) {
	return messages.includes(error.message);
}
