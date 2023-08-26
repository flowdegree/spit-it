#!/usr/bin/env node

/**
 * source-code-spitter
 * A command-line tool to extract and organize source code snippets from projects, enabling easy sharing and collaboration.
 *
 * @author Mohannad F. Otaibi <https://www.mohannadotaibi.com>
 */
const fs = require('fs-extra');
const path = require('path');
const ignore = require('ignore');
const chalk = require('chalk');
// const { Octokit } = require('@octokit/rest');

// const open = require('open');
const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const DEFAULT_IGNORED_FILES = require('./utils/ignore-config');

// const clientId = 'f7ec24587e812f6ce928';

const { input, flags } = cli;
const { clear, debug, include, exclude } = flags;

const includeExtensions = include ? include.split(',') : null;
const excludeExtensions = exclude ? exclude.split(',') : null;


// Function to traverse a directory and return source code files
const traverseDirectory = (dir, ig) => {
	try {
		const files = fs.readdirSync(dir);
    const sourceCodeFiles = [];

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        const fileExtension = path.extname(filePath);

        if (stats.isDirectory()) {
            sourceCodeFiles.push(...traverseDirectory(filePath, ig));
        } else if ((!includeExtensions || includeExtensions.includes(fileExtension)) &&
                   (!excludeExtensions || !excludeExtensions.includes(fileExtension))) {
            const relativePath = path.relative(process.cwd(), filePath);
            if (!ig.ignores(relativePath)) {
                sourceCodeFiles.push(filePath);
            }
        }
    });

    return sourceCodeFiles;

	} catch (error) {
		console.error(`An error occurred while traversing the directory ${dir}:`, error);
		return [];
	}
};

// Function to parse ignore files like .gitignore and .spitignore
const parseIgnoreFiles = () => {
	const gitignorePath = path.join(process.cwd(), '.gitignore');
	const spitignorePath = path.join(process.cwd(), '.spitignore');
	const ig = ignore();

	if (fs.existsSync(gitignorePath)) {
		ig.add(fs.readFileSync(gitignorePath, 'utf8'));
	}

	if (fs.existsSync(spitignorePath)) {
		ig.add(fs.readFileSync(spitignorePath, 'utf8'));
	}

	ig.add(DEFAULT_IGNORED_FILES);

	return ig;
};

// Todo: Function to create a GitHub Gist
// const createGist = async (code) => {
// 	open(`https://github.com/login/oauth/authorize?client_id=${clientId}&scope=gist`);

//     const octokit = new Octokit({
//         auth: 'YOUR_PERSONAL_ACCESS_TOKEN', // You'll need to handle authentication
//     });

//     const response = await octokit.gists.create({
//         description: 'Extracted code snippet',
//         public: true,
//         files: {
//             'snippet.txt': {
//                 content: code
//             }
//         }
//     });

//     return response.data.html_url;
// };

// Function to generate a dump of source code from a directory
const generateSourceCodeDump = directory => {
	const ig = parseIgnoreFiles();
	const sourceCodeFiles = traverseDirectory(directory, ig);

	console.log(chalk.italic(`Found ${sourceCodeFiles.length} source code files.`));
	const dumpFilePath = path.join(process.cwd(), 'source_code_dump.txt');
	const dumpFileContent = [];

	sourceCodeFiles.forEach(file => {
		const relativePath = path.relative(process.cwd(), file).replace(/\\/g, '/');
		const fileContent = fs.readFileSync(file, 'utf8');
		dumpFileContent.push(`// ${relativePath}\n${fileContent}`);
	});

	fs.writeFileSync(dumpFilePath, dumpFileContent.join('\n\n'));

	if (flags.gist) {
		// this function still needs to be implement3ed
		console.log('Gist feature is not implemented yet.');
        // createGist(dumpFileContent.join('\n\n')).then(gistUrl => {
        //     console.log(`Gist created: ${gistUrl}`);
        // }).catch(error => {
        //     console.error('Failed to create gist:', error);
        // });
    }

	console.log(chalk.greenBright(`Source code dump generated successfully at ${dumpFilePath} \n\n`));
};

// Main async function to initialize and generate the source code dump
(async () => {
	init({ clear });

	// eslint-disable-next-line no-unused-expressions
	debug && log(flags);

	const directory = input[0];

	console.log(`Generating out file for directory: ${directory}`);

	if (!directory) {
		console.error('Please provide the directory path as an argument.');
		process.exit(1);
	}

	generateSourceCodeDump(directory);
})();
