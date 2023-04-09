/** Used for all .spec.ts files. */
module.exports = {
  env: {
    'jest': true,
    'jest/globals': true,
  },
  extends: [
    'plugin:jest/recommended',
    'plugin:jest/style',
    './spec',
  ],
};
