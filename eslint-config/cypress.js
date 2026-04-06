/** Used for all .spec.ts files. */
module.exports = {
    plugins: ['cypress'],
    env: {
        'cypress/globals': true,
    },
    rules: {
        'cypress/no-assigning-return-values': 'error',
        'cypress/no-unnecessary-waiting': 'error',
        'cypress/no-async-tests': 'error',
        'cypress/no-async-before': 'error',
        'cypress/no-pause': 'error',
        'cypress/assertion-before-screenshot': 'warn',
        'cypress/no-force': 'warn',
    },
};
