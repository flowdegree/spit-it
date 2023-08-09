/* eslint-disable no-console */
const alert = require('cli-alerts');

// Function to log debug information with a warning alert
module.exports = info => {
	alert({
		type: 'warning',
		name: 'DEBUG LOG',
		msg: ''
	});

	console.log(info);
	console.log();
};
