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
			'no-unused-vars': 'warn',
			'no-unused-expressions': 'error',
			'no-duplicate-imports': 'warn',
			'no-irregular-whitespace': 'warn',
			'no-useless-assignment': 'warn',
			'@typescript-eslint/no-explicit-any': 'warn',
			'no-console': 'off',
			...prettierConfig.rules,
			'prettier/prettier': 'error',
		},
		plugins: {
			prettier: pluginPrettier,
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
	},
);
