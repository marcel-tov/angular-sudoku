/** Used for all .spec.ts files. */
module.exports = {
    plugins: ['jasmine'],
    rules: {
        'jasmine/expect-matcher': 'error',
        'jasmine/expect-single-argument': 'error',
        'jasmine/missing-expect': [
            'error',
            'assert()',
            'expect()',
            'expectAsync()',
            'spectator.expectOne()',
            'spectator.expectConcurrent()',
        ],
        'jasmine/new-line-before-expect': 'off',
        'jasmine/new-line-between-declarations': 'error',
        'jasmine/no-disabled-tests': 'error',
        'jasmine/no-focused-tests': 'error',
        'jasmine/no-promise-without-done-fail': 'error',
        'jasmine/prefer-jasmine-matcher': 'error',
        'jasmine/prefer-promise-strategies': 'error',
    },
};
