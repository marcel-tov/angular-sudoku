/** Used for all .ts files (node & browser). */
module.exports = {
    env: {
        browser: false,
        node: true,
    },
    plugins: ['@typescript-eslint'],
    rules: {
        'no-console': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'no-restricted-properties': ['error', {
            object: 'window',
            property: 'document',
        }],
        'no-restricted-globals': ['error', 'document'],
    },
};
