/** Used for all .ts files (node & browser). */
module.exports = {
    env: {
        browser: true,
        node: false,
    },
    plugins: [
        '@angular-eslint',
    ],
    rules: {
        'max-len': ['error', {
            ignorePattern: '(^import\\s.+\\sfrom\\s.+;$|^.*)',
            ignoreUrls: true,
            code: 140,
        }],
    },
};
