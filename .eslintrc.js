module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
    'plugin:mocha/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'mocha/no-mocha-arrows': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'no-plusplus': ["error", { "allowForLoopAfterthoughts": true }],
  },
  overrides: [
    {
      files: [
        '**/*.test.js',
      ],
      env: {
        mocha: true, // now **/*.test.js files' env has both es6 *and* jest
      },
      // Can't extend in overrides: https://github.com/eslint/eslint/issues/8813
      // "extends": ["plugin:jest/recommended"]
      plugins: ['mocha'],
      rules: {
        'mocha/no-hooks-for-single-case': 'off',
      },
    },
    {
      files: [
        './e2e/support/**/*.js',
      ],
      env: {
        browser: false,
      },
      rules: {
        'no-console': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: [
        './src/extension/**/*.js',
      ],
      globals: {
        chrome: 'readonly',
      }
    }
  ],
};
