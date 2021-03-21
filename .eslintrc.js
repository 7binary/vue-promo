// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html',
    'import',
  ],
  // add your custom rules here
  rules: {
    'generator-star-spacing': 'off',
    'no-empty-pattern': 'off',
    'no-param-reassign': 'off',
    'no-console': 'off',
    'no-debugger': 'off',
    'no-new': 'off',
    'object-curly-newline': 'off',
    'no-unused-expressions': 'off',
    'no-trailing-spaces': ["error", { "skipBlankLines": true }],
  },
};
