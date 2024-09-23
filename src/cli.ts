#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { scanImportDeclarations } from '@yuheiy/import-scanner';
import fg from 'fast-glob';
import { gray, white } from 'yoctocolors';

const args = parseArgs({
	options: {
		regexp: {
			type: 'boolean',
			default: false,
		},
		path: {
			type: 'string',
			multiple: true,
			default: ['**/*.{js,ts,jsx,tsx}'],
		},
		ignore: {
			type: 'string',
			multiple: true,
			default: ['**/node_modules'],
		},
		json: {
			type: 'boolean',
			default: false,
		},
		help: {
			type: 'boolean',
			short: 'h',
			default: false,
		},
	},
	allowPositionals: true,
});

if (args.values.help || args.positionals.length === 0) {
	console.log(`
	Usage
	  $ import-scanner [module-pattern...]

	Options
	  --regexp   Use RegExp for module-patten
	  --path     Specify target file paths (default: **/*.{js,ts,jsx,tsx})
	  --ignore   Ignore specific file paths from target (default: **/node_modules)
	  --json     Output analyzed results as a JSON

	Examples
	  Basic usage:
	  $ import-scanner my-module
	  $ import-scanner my-module another-my-module

	  Use regular expressions, including subpaths:
	  $ import-scanner "^my-module(\/.+)?$" --regexp

	  Specify the target file paths:
	  $ import-scanner my-module --path="subdir/**/*.{js,ts,jsx,tsx}"

	  Ignore specific file paths:
	  $ import-scanner my-module --ignore="dist/**" --ignore="node_modules/**"

	  Output as a JSON:
	  $ import-scanner my-module --json
`);
	process.exit(0);
}

const modulePatterns = args.values.regexp
	? args.positionals.map((pattern) => new RegExp(pattern))
	: args.positionals;

const filePaths = await fg(args.values.path, {
	ignore: args.values.ignore,
});

const importDeclarations = await scanImportDeclarations(
	modulePatterns,
	filePaths,
);

if (args.values.json) {
	console.log(JSON.stringify(importDeclarations, null, '  '));
} else {
	for (const { statement, filePath } of importDeclarations) {
		console.log(gray(`Found ${white(statement)} in "${white(filePath)}".`));
	}

	if (importDeclarations.length === 0) {
		console.log('No import declaration was found.');
	}
}
