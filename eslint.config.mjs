import js from '@eslint/js';
import ts from 'typescript-eslint';

export default [
	{
		ignores: ['dist', 'node_modules', 'coverage'],
	},
	{
		files: ['.prettierrc.js'],
		languageOptions: {
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
			},
			globals: {
				module: 'writable',
				require: 'writable',
			},
		},
	},
	js.configs.recommended,
	...ts.configs.recommended,
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: ts.parser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
			},
			globals: {
				node: 'readonly',
			},
		},
		rules: {
			indent: ['error', 'tab'],
			quotes: ['error', 'single'],
			semi: ['error', 'always'],
			'no-useless-catch': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
		},
	},
];
