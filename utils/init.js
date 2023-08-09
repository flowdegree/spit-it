const welcome = require('cli-welcome');
const unhandled = require('cli-handle-unhandled');
const pkg = require('../package.json');

// Function to initialize the CLI with welcome message and unhandled rejection handling
module.exports = ({ clear = true }) => {
	unhandled();
	welcome({
		title: 'source-code-spitter',
		tagLine: 'by Mohannad F. Otaibi',
		version: pkg.version,
		bgColor: '#36BB09',
		color: '#000000',
		bold: true,
		clear
	});
};
