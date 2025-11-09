const tseslint = require('typescript-eslint');
const tsParser = require('@typescript-eslint/parser');

module.exports = tseslint.config({
  files: ['**/*.ts'],
  languageOptions: {
    parser: tsParser,
  },
  rules: {
    'no-console': 'warn',
  },
});