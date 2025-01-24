module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  ignorePatterns: ['node_modules', 'scripts/*.js'],
};
