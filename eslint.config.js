const tseslint = require('typescript-eslint');

module.exports = tseslint.config({
  files: ['**/*.ts'],

  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: './tsconfig.json',
      sourceType: 'module',
    },
    globals: {
      process: 'readonly',
      __dirname: 'readonly',
      require: 'readonly',
      console: 'readonly',
      Buffer: 'readonly',
      module: 'readonly',
      exports: 'writable',
      setTimeout: 'readonly',
      setInterval: 'readonly',
      clearTimeout: 'readonly',
      clearInterval: 'readonly',
      fetch: 'readonly',
    },
  },

  plugins: {
    '@typescript-eslint': tseslint.plugin,
  },

  ignores: ['dist/**', 'node_modules/**'],

  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'off', // Use TypeScript version instead
    'no-undef': 'error',
    'no-unreachable': 'warn',
    'no-async-promise-executor': 'error',
    'no-empty-function': 'warn',

    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',

    semi: 'off',
    quotes: 'off',
  },
});
