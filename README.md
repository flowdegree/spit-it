# SourceCodeSpitter

SourceCodeSpitter is a command-line tool that generates a single dump file containing all the source code files within a directory, excluding files specified in `.gitignore` and `.spitignore`. This tool is useful for quickly collecting source code snippets for sharing or documentation purposes.

## Features

- Recursively traverses the specified directory to collect all source code files.
- Ignores files and directories specified in `.gitignore` and `.spitignore`.
- Generates a single dump file with source code snippets in the order of traversal.
- Preserves the file structure by including file names and relative directory paths as comments before each snippet.

## Installation

```bash
npm install -g @6degrees/source-code-spitter
# or for local project only
npm install @6degrees/source-code-spitter
```

## Usage

```bash
source-code-spitter [directory]
```

Replace `[directory]` with the path to the directory you want to generate the source code dump for. If no directory is provided, it will default to the current working directory.

The tool will generate a `source_code_dump.txt` file in the same directory with all the source code snippets.

## Examples

Generate a source code dump for the current working directory:

```bash
source-code-spitter
```

Generate a source code dump for a specific directory:

```bash
source-code-spitter /path/to/directory
```

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request for any improvements or additional features you'd like to see.

## License

This project is licensed under the [MIT License](MIT).
