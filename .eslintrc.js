module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:ante/recommended',
    'plugin:ante/style'
  ],
  parser: '@babel/eslint-parser',
  plugins: [
    'eslint-plugin-ante'
  ]
};
