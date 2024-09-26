import { execa } from 'execa';
import stripAnsi from 'strip-ansi';
import { beforeAll, expect, test } from 'vitest';

beforeAll(async () => {
	await execa('npm', ['run', 'build']);
});

test('basic usage', async () => {
	const { stdout } = await execa('node', [
		'./dist/src/cli.js',
		'test/__fixtures__/*.ts',
	]);
	expect(stripAnsi(stdout)).toMatchInlineSnapshot(`
		"Found import m1 from 'my-module'; in "test/__fixtures__/a.ts".
		Found import m2 from 'my-module/sub'; in "test/__fixtures__/a.ts".
		Found import m1 from 'my-module'; in "test/__fixtures__/b.ts".
		Found import m2 from 'my-module/sub'; in "test/__fixtures__/b.ts"."
	`);
});

test('set ignore', async () => {
	const { stdout } = await execa('node', [
		'./dist/src/cli.js',
		'test/__fixtures__/*.ts',
		'--ignore',
		'**/a.ts',
	]);
	expect(stripAnsi(stdout)).toMatchInlineSnapshot(`
		"Found import m1 from 'my-module'; in "test/__fixtures__/b.ts".
		Found import m2 from 'my-module/sub'; in "test/__fixtures__/b.ts"."
	`);
});

test('set module', async () => {
	const { stdout } = await execa('node', [
		'./dist/src/cli.js',
		'test/__fixtures__/a.ts',
		'--module',
		'my-module',
	]);
	expect(stripAnsi(stdout)).toMatchInlineSnapshot(
		`"Found import m1 from 'my-module'; in "test/__fixtures__/a.ts"."`,
	);
});

test('set module-regexp', async () => {
	const { stdout } = await execa('node', [
		'./dist/src/cli.js',
		'test/__fixtures__/a.ts',
		'--module-regexp',
		'^my-module(/.+)?$',
	]);
	expect(stripAnsi(stdout)).toMatchInlineSnapshot(`
		"Found import m1 from 'my-module'; in "test/__fixtures__/a.ts".
		Found import m2 from 'my-module/sub'; in "test/__fixtures__/a.ts"."
	`);
});

test('set json', async () => {
	const { stdout } = await execa('node', [
		'./dist/src/cli.js',
		'test/__fixtures__/a.ts',
		'--json',
	]);
	expect(() => JSON.parse(stdout)).not.toThrowError();
});
