module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'unused-imports'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': 'off',
    'no-empty-pattern': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'prefer-const': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-extra-semi': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
  },
}
