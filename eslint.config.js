import globals from 'globals';
import pluginJs from '@eslint/js';
import prettierConfig from 'eslint-plugin-prettier/recommended';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  prettierConfig,
  {
    rules: {
      'no-undef': 0,
    },
  },
];
