/** Used for all .spec.ts files. */
module.exports = {
    env: {
        jasmine: true,
    },
    extends: [
        'plugin:jasmine/recommended',
        './spec',
    ],
};
