import js from '@eslint/js';
import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import tseslint from 'typescript-eslint';
import jest from 'eslint-plugin-jest';

const jsconfig = {
  languageOptions: {
    parser: babelParser,
    parserOptions: {
      requireConfigFile: false,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    globals: {
      ...globals.browser,
      ...globals.node,
      'Atomics': 'readonly',
      'SharedArrayBuffer': 'readonly',
      'actor': true,
      'Feature': true,
      'Before': true,
      'After': true,
      'Scenario': true,
      'xScenario': true,
      'codecept_helper': true,
    },
  },
  rules: {
    ...js.configs.recommended.rules,
    indent: ['error', 2, {'SwitchCase': 1}],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    'comma-dangle': ['error', 'always-multiline'],
    semi: ['error', 'always'],
    'no-unused-vars': 0,
  },
};

const tsconfig = {
  files: ['**/*.ts', '**/*.tsx'],
  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      project: './tsconfig.json',
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    globals: {
      ...globals.browser,
      ...globals.node,
      'Atomics': 'readonly',
      'SharedArrayBuffer': 'readonly',
      jest: 'readonly',
      describe: 'readonly',
      afterAll: 'readonly',
      afterEach: 'readonly',
      beforeAll: 'readonly',
      beforeEach: 'readonly',
      expect: 'readonly',
      it: 'readonly',
      test: 'readonly',
      inject: 'readonly',
      Given: 'readonly',
      Then: 'readonly',
    },
  },
  plugins: {
    '@typescript-eslint': typescriptEslint,
    jest: jest,
  },
  rules: {
    ...tseslint.configs.recommended[2].rules,
    indent: ['error', 2, {'SwitchCase': 1}],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', {avoidEscape: true}],
    'comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/ban-ts-comment': 0,
  },
};

export default [
  jsconfig,
  tsconfig,
  {
    ignores: [
      'dist/',
      'coverage/',
      '**/*.d.ts',
      'src/main/public/',
      'src/main/types/',
      'jest.*config.js',
      'src/test/reporter/',
      'functional-output/',
      '.yarn/',
      'jest.setup.js',
    ],
  },
];
