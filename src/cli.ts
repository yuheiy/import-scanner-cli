#!/usr/bin/env node
import { parseArgs } from 'node:util';
import {
	scanImportDeclarations,
	type ScannedImportDeclaration,
} from '@yuheiy/import-scanner';
import { glob } from 'tinyglobby';
import { gray, white } from 'yoctocolors';

const args = parseArgs({
	options: {
		ignore: {
			type: 'string',
			multiple: true,
			default: [],
		},
		module: {
			type: 'string',
			multiple: true,
			default: [],
		},
		'module-regexp': {
			type: 'string',
			multiple: true,
			default: [],
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
	  $ import-scanner [path...]

	Options
	  --ignore          Ignore specific file paths
	  --module          The module name targeted by the imports to be retrieved
	  --module-regexp   The regular expression for the module name targeted by the imports to be retrieved
	  --json            Output scanned imports as a JSON

	Examples
	  $ import-scanner **/*.{js,ts,jsx,tsx}
	  $ import-scanner **/*.{js,ts,jsx,tsx} --ignore="**/dist/**" --ignore="**/node_modules/**"
	  $ import-scanner **/*.{js,ts,jsx,tsx} --module=my-module
	  $ import-scanner **/*.{js,ts,jsx,tsx} --module-regexp="^my-module(\/.+)?$"
	  $ import-scanner **/*.{js,ts,jsx,tsx} --json
`);
	process.exit(0);
}

const modulePatterns = args.values['module-regexp'].map(
	(value) => new RegExp(value),
);

function isMatches({ moduleSpecifierValue }: ScannedImportDeclaration) {
	return (
		(args.values.module.length === 0 && modulePatterns.length === 0) ||
		args.values.module.some((value) => value === moduleSpecifierValue) ||
		modulePatterns.some((pattern) => pattern.test(moduleSpecifierValue))
	);
}

const filePaths = await glob(args.positionals, {
	ignore: args.values.ignore,
});

const importDeclarations = filePaths.flatMap((filePath) =>
	scanImportDeclarations(filePath).filter((decl) => isMatches(decl)),
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
