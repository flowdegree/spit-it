const meow = require('meow');
const meowHelp = require('cli-meow-help');

// Function to define CLI flags and commands
const flags = {
	clear: {
		type: 'boolean',
		default: false,
		alias: 'c',
		desc: 'Clear the console'
	},
	noClear: {
		type: 'boolean',
		default: false,
		desc: 'Don\'t clear the console'
	},
	debug: {
		type: 'boolean',
		default: false,
		alias: 'd',
		desc: 'Print debug info'
	},
	version: {
		type: 'boolean',
		alias: 'v',
		desc: 'Print CLI version'
	},
	include: {
        type: 'string',
        alias: 'i',
        desc: 'Include only specific file types (comma-separated, e.g., .js,.css)'
    },
    exclude: {
        type: 'string',
        alias: 'e',
        desc: 'Exclude specific file types (comma-separated, e.g., .log,.txt)'
    },
	gist: {
        type: 'boolean',
        alias: 'g',
        desc: 'Share the extracted code as a GitHub Gist'
    },

};

const commands = {
	help: { desc: 'Print help info' }
};

// Function to generate help text for the CLI
const helpText = meowHelp({
	name: 'spitit',
	flags,
	commands
});

// Options for the CLI
const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

// Export the CLI configuration
module.exports = meow(helpText, options);
