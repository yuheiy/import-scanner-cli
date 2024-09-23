import { execa } from 'execa';
import { beforeAll, expect, test } from 'vitest';
import stripAnsi from 'strip-ansi';

beforeAll(async () => {
	await execa('npm', ['run', 'build']);
});

test('basic usage', async () => {
	const { stdout } = await execa('node', [
		'./dist/src/cli.js',
		'my-module',
		'--ignore',
		'dist',
		'--ignore',
		'node_modules',
	]);
	expect(stripAnsi(stdout)).toMatchInlineSnapshot(`
		"Found import m1 from 'my-module'; in "test/__fixtures__/a.ts".
		Found import m1 from 'my-module'; in "test/__fixtures__/b.ts"."
	`);
});

test('use regexp', async () => {
	const { stdout } = await execa('node', [
		'./dist/src/cli.js',
		'^my-module(/.+)?$',
		'--regexp',
		'--ignore',
		'dist',
		'--ignore',
		'node_modules',
	]);
	expect(stripAnsi(stdout)).toMatchInlineSnapshot(`
		"Found import m1 from 'my-module'; in "test/__fixtures__/a.ts".
		Found import m2 from 'my-module/sub'; in "test/__fixtures__/a.ts".
		Found import m1 from 'my-module'; in "test/__fixtures__/b.ts".
		Found import m2 from 'my-module/sub'; in "test/__fixtures__/b.ts"."
	`);
});

test('use path', async () => {
	const { stdout } = await execa('node', [
		'./dist/src/cli.js',
		'my-module',
		'--path',
		'**/a.ts',
		'--ignore',
		'dist',
		'--ignore',
		'node_modules',
	]);
	expect(stripAnsi(stdout)).toMatchInlineSnapshot(
		`"Found import m1 from 'my-module'; in "test/__fixtures__/a.ts"."`,
	);
});

test('use ignore paths', async () => {
	const { stdout } = await execa('node', [
		'./dist/src/cli.js',
		'my-module',
		'--ignore',
		'**/a.ts',
		'--ignore',
		'dist',
		'--ignore',
		'node_modules',
	]);
	expect(stripAnsi(stdout)).toMatchInlineSnapshot(
		`"Found import m1 from 'my-module'; in "test/__fixtures__/b.ts"."`,
	);
});

test('output as a JSON', async () => {
	const { stdout } = await execa('node', [
		'./dist/src/cli.js',
		'my-module',
		'--json',
		'--ignore',
		'dist',
		'--ignore',
		'node_modules',
	]);
	expect(() => JSON.parse(stdout)).not.toThrowError();
});
