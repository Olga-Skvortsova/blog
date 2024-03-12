// eslint-disable-next-line no-undef
module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: false,
    ecmaFeatures: {
      globalReturn: false,
    },
    babelOptions: {
      configFile: 'path/to/config.js',
    },
  },
  rules: {
    'import/no-named-as-default': 'off',
  },
};
