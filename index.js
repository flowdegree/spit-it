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

const DEFAULT_IGNORED_FILES = [
	'.git',
	'.gitignore',
	'.gitattributes',
	'package-lock.json',
	'*.md',
	'source_code_dump.txt',
	'.changeset/',
	'node_modules/',
	'build/',
	'coverage/',
	'*.log',
	'*.lock',
	'node_modules',
	'*.jpg',
	'*.gif',
	'*.svg',
	'*.png',
	'*.ico',
	'*.eot',
	'*.ttf',
	'*.woff',
	'*.woff2',
	'*.mp4',
	'.vscode/',
	'.idea/',
	'.DS_Store',
	'.env',
	'.spitignore',
	'.prettierrc.json',
	'.prettierrc',
	'.spitignore.example',
];

const { input, flags } = cli;
const { clear, debug } = flags;

const traverseDirectory = (dir, ig) => {
	const files = fs.readdirSync(dir);
	const sourceCodeFiles = [];

	files.forEach(file => {
		const filePath = path.join(dir, file);
		const stats = fs.statSync(filePath);

		if (stats.isDirectory()) {
			sourceCodeFiles.push(...traverseDirectory(filePath, ig)); // Recursively explore directories
		} else {
			const relativePath = path.relative(process.cwd(), filePath);
			if (!ig.ignores(relativePath)) {
				sourceCodeFiles.push(filePath);
			}
		}
	});

	return sourceCodeFiles;
};

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

	console.log(chalk.greenBright(`Source code dump generated successfully at ${dumpFilePath} \n\n`));
};

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
