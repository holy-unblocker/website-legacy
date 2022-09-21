export const isError = (err: unknown): err is Error =>
	typeof err === 'object' && err !== null && err instanceof Error;

export const isFailedToFetch = (err: unknown): err is Error =>
	isError(err) && err.message === 'Failed to fetch';

const isAbortError = (err: unknown): err is Error =>
	isError(err) && err.name === 'AbortError';

export default isAbortError;
