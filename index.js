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
const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
// const { Octokit } = require('@octokit/rest');
// const open = require('open');

const DEFAULT_IGNORED_FILES = require('./utils/ignore-config');

// const clientId = 'f7ec24587e812f6ce928';

const { input, flags } = cli;
const { clear, debug, include, exclude, json } = flags;

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
	try{
		const ignoreHandler  = parseIgnoreFiles();
		const sourceCodeFiles = traverseDirectory(directory, ignoreHandler );

		console.log(chalk.italic(`Found ${sourceCodeFiles.length} source code files.`));
		const dumpFilePath = path.join(process.cwd(), `dump${json ? '.json' : '.txt'}`);
		
		const dumpFileContent = [];
		
		sourceCodeFiles.forEach(file => {
			const relativePath = path.relative(process.cwd(), file).replace(/\\/g, '/');
			const fileContent = fs.readFileSync(file, 'utf8');
			dumpFileContent.push({path: relativePath, content: fileContent});
		});

		if (json) {  // Check if JSON flag is set
			dumpFileContent = dumpFileContent.map(item => ({
				path: item.path,
				content: item.content.replace(/\r\n/g, '\n').replace(/\t/g, '').replace(/ +/g, ' ').replace(/\n\n/g, '\n')
			}));

			
			fs.writeFileSync(dumpFilePath, JSON.stringify(dumpFileContent, null, 2));
		} else {
			const textOutput = dumpFileContent.map(item => `// ${item.path}\n${item.content}`).join('\n\n');
			fs.writeFileSync(dumpFilePath, textOutput);
		}
		console.log(chalk.greenBright(`Source code dump generated successfully at ${dumpFilePath} \n\n`));

		// fs.writeFileSync(dumpFilePath + dumpFileExt, dumpFileContent.join('\n\n'));
		
	}catch(error){
		console.error(`An error occurred: ${error}`);
	}

	
};

// Main async function to initialize and generate the source code dump
(async () => {
	init({ clear });

	// eslint-disable-next-line no-unused-expressions
	debug && log(flags);
	
	console.log(`Generating out file for directory: ${input[0]}`);
	

	if (!input[0]) {
		console.error('Please provide the directory path as an argument.');
		process.exit(1);
	}

	generateSourceCodeDump(input[0]);
})();
