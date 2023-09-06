const presentAboutBlank = (src: string) => {
	const newWindow = window.open('about:blank');

	if (!newWindow) throw new Error(`Could not create new window`);

	newWindow.addEventListener(
		'DOMContentLoaded',
		() => {
			const iframe = newWindow.document.createElement('iframe');
			iframe.src = src;
			// expand iframe to fit window
			iframe.style.border = 'none';
			iframe.style.position = 'absolute';
			iframe.style.top = '0px';
			iframe.style.left = '0px';
			iframe.style.width = '100%';
			iframe.style.height = '100%';
			newWindow.document.body.append(iframe);
		},
		// immediately attempt to dereference iframe
		{ once: true },
	);
};

export default presentAboutBlank;
