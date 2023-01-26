// @ts-nocheck
const restrictedGlobals = require('confusing-browser-globals');

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      plugins: [
        '@babel/plugin-syntax-import-assertions',
      ],
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: [
    // Syntax and ~
    'eslint:recommended',
    'plugin:node/recommended',

    'plugin:ava/recommended',
    'plugin:promise/recommended',
    'standard-jsdoc',
    'plugin:json/recommended',

    'plugin:unicorn/recommended',
    'plugin:security/recommended',

    // Global config
    'airbnb-base',
  ],
  plugins: [
    'json',
    'no-loops',
    'unicorn',
    'async-await',
    'prefer-object-spread',
    'promise',
    'security',
    'simple-import-sort',
  ],
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  rules: {
    'prefer-object-spread/prefer-object-spread': 2,
    'no-restricted-globals': [2].concat(restrictedGlobals),

    'mocha/handle-done-callback': 0,
    'mocha/no-global-tests': 0,
    'mocha/valid-test-description': 0,
    'import/no-cycle': 0,
    'import/extensions': [2, 'always'],
    'import/prefer-default-export': 0,
    'unicorn/numeric-separators-style': 0,
  },
};
