import Vue from 'vue';
import vuetify from '../vuetify';
import VueAlert from './vue-alert';

// define the plugin default options
const defaultOpts = {
	// tiem in ms before the alert disapeare
	timeout: 5000,
	// does the alert has close button
	closeBtn: true,
	// where to display the alert
	placement: 'bottom-right',
};

const Plugin = {
	install(_Vue, opts) {
		// merge default and user options
		const options = { ...defaultOpts, ...opts };

		// create root wraper instance to separate the toast from the app using it,
		// also to pass options & events to the alert component
		const wraper = new Vue({
			data: {
				options,
			},
			vuetify,
			render: (h) => h(VueAlert),
		});

		// mount the wraper to the body element inside a div element
		wraper.$mount(document.body.appendChild(document.createElement('div')));

		function showAlert(msg, color) {
			// if no message use 'Awesom App'
			const msgParam = arguments.length === 0 ? 'Awesom App' : msg;

			wraper.$emit('alert-show', { msg: msgParam, color });
		}

		// add a global instance function to trigger the alert
		_Vue.prototype.$VAlert = {
			info: (msg) => showAlert(msg, 'info'),
			success: (msg) => showAlert(msg, 'success'),
			error: (msg) => showAlert(msg, 'error'),
			warn: (msg) => showAlert(msg, 'warning'),
		};
	},
};

export default Plugin;
