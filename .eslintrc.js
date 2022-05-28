module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'script',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'max-len': ['error', { code: 150 }],
    'import/prefer-default-export': 'off',
  },
  globals: {
    pc: true, // pc是全局的playcanvas变量
  },
  ignorePatterns: ['*.js', '*.d.ts'],
};
