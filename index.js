const fs = require('fs-extra');
const path = require('path');
const ignore = require('ignore');

function traverseDirectory(dir, ig) {
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
}

function parseIgnoreFiles() {
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    const spitignorePath = path.join(process.cwd(), '.spitignore');
    const ig = ignore();
  
    if (fs.existsSync(gitignorePath)) {
      ig.add(fs.readFileSync(gitignorePath, 'utf8'));
    }
  
    if (fs.existsSync(spitignorePath)) {
      ig.add(fs.readFileSync(spitignorePath, 'utf8'));
    }

    ig.add([".git",".gitignore",".gitattributes","package-lock.json","*.md","source_code_dump.txt"]);
  
    return ig;
  }
  
function generateSourceCodeDump(directory) {
  const ig = parseIgnoreFiles();
  const sourceCodeFiles = traverseDirectory(directory, ig);
  const dumpFilePath = path.join(process.cwd(), 'source_code_dump.txt');
  const dumpFileContent = [];

  sourceCodeFiles.forEach(file => {
    const relativePath = path.relative(process.cwd(), file).replace(/\\/g, '/');;
    const fileContent = fs.readFileSync(file, 'utf8');
    dumpFileContent.push(`// ${relativePath}\n${fileContent}`);
  });

  fs.writeFileSync(dumpFilePath, dumpFileContent.join('\n\n'));

  console.log('Source code dump generated successfully.');
}

const directory = process.argv[2];

if (!directory) {
  console.error('Please provide the directory path as an argument.');
  process.exit(1);
}

generateSourceCodeDump(directory);