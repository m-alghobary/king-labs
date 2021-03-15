import printJS from 'print-js';

export function print(url) {
	printJS({
		printable: url,
		type: 'pdf',
		showModal: true,
		modalMessage: 'Loading...',
	});
}
