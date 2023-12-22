/** Used for all .spec.ts files. */
module.exports = {
  plugins: ['jest'],
  rules: {
    'jest/no-identical-title': 'error',
    'jest/require-top-level-describe': 'error',
    'jest/no-duplicate-hooks': 'warn',
    'jest/no-test-return-statement': 'error',
  },
};
