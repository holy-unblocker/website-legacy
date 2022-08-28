const buffer = /*#__PURE__*/ document.createElement('div');

/**
 * Sanitizes raw HTML using native APIs
 * @param html
 * @returns
 */
export default function textContent(html: string) {
	buffer.innerHTML = html;
	const { textContent } = buffer;
	buffer.innerHTML = '';
	return textContent!;
}
