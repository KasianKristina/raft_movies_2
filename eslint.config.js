import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';
import prettierConfig from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';
import svelteParser from 'svelte-eslint-parser';
import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import { globalIgnores } from 'eslint/config';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	globalIgnores(['.svelte-kit/**', '**/.svelte-kit/**']),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettierConfig,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
		rules: {
			'no-undef': 'off',
			'no-unused-vars': 'error',
			'no-unused-expressions': 'error',
			'no-duplicate-imports': 'error',
			'no-irregular-whitespace': 'error',
			'no-useless-assignment': 'error',
			'use-isnan': 'error',
			'no-console': 'off',
			'no-empty': 'error',
			'no-else-return': 'error',
			'no-empty-function': 'error',
			'no-lonely-if': 'error',
			'no-nested-ternary': 'error',
			'no-restricted-exports': 'error',
			'no-restricted-imports': 'error',
			'no-undefined': 'error',
			'no-undef-init': 'error',
			'no-unneeded-ternary': 'error',
			'no-useless-catch': 'error',
			'no-useless-rename': 'error',
			'no-unused-labels': 'error',
			'no-useless-call': 'error',
			'no-useless-concat': 'error',
			'no-useless-escape': 'error',
			'no-useless-return': 'error',
			'no-var': 'error',
			'no-warning-comments': ['off', { terms: ['todo'], location: 'start' }],
			'prefer-const': 'warn',
			'prefer-destructuring': ['error', { object: true, array: false }],
			'array-bracket-newline': ['off', 'consistent'],
			'array-element-newline': ['off', { multiline: true, minItems: 3 }],
			'array-bracket-spacing': ['error', 'never'],
			'block-spacing': ['error', 'always'],
			'brace-style': ['error', '1tbs', { allowSingleLine: true }],
			'comma-dangle': [
				'error',
				{
					arrays: 'always-multiline',
					objects: 'always-multiline',
					imports: 'always-multiline',
					exports: 'always-multiline',
					functions: 'always-multiline',
				},
			],
			'comma-spacing': ['error', { before: false, after: true }],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unnecessary-condition': 'off',
			'@typescript-eslint/strict-boolean-expressions': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'warn',
			'@typescript-eslint/no-unsafe-return': 'error',
			'@typescript-eslint/prefer-function-type': 'warn',
			'@typescript-eslint/no-unnecessary-type-assertion': 'error',
			'@typescript-eslint/no-non-null-assertion': 'warn',
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
			'@typescript-eslint/ban-ts-comment': 'off',
			...prettierConfig.rules,
			'prettier/prettier': 'error',
		},
		plugins: {
			prettier: pluginPrettier,
		},
	},
	{
		files: ['**/*.ts', '**/*.js'],
		languageOptions: {
			parser: ts.parser,
			parserOptions: {
				projectService: true,
				sourceType: 'module',
				ecmaVersion: 'latest',
			},
		},
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig,
			},
		},
		rules: {
			'svelte/no-ignored-unsubscribe': 'error',
			'svelte/no-dom-manipulating': 'error',
			'svelte/valid-compile': 'error',
			'svelte/no-reactive-reassign': 'error',
		},
	},
);
