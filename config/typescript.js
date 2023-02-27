/** Used for all .ts files (node & browser). */
module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        createDefaultProgram: true,
        sourceType: 'module',
    },
    plugins: ['rxjs'],
    extends: [
        // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
        // 'plugin:rxjs/recommended',
        './javascript',
    ],
    rules: {
        'rxjs/no-topromise': 'error',
        'rxjs/no-unsafe-takeuntil': 'error',
        '@typescript-eslint/explicit-member-accessibility': [
            'error',
            {
                accessibility: 'explicit',
                overrides: {
                    constructors: 'off',
                    accessors: 'off',
                },
            },
        ],
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'memberLike',
                format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
                leadingUnderscore:'allow',
                filter: {
                    // Ignore numeric keys from this rule.
                    regex: '^[0-9]+$',
                    // Ignore numeric and dash-case keys from this rule.
                    // regex: '^([0-9]+|[a-z]+(-[a-z]+)*|[A-Z][a-z]+(-[A-Z][a-z]+)*)$',
                    match: false,
                },
            },
            {
                selector: 'typeLike',
                format: ['PascalCase'],
            },
            {
                selector: 'interface',
                format: ['PascalCase'],
                custom: {
                    regex: '^I[A-Z]',
                    match: true,
                },
            }],
        '@typescript-eslint/no-floating-promises': 'warn',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/no-unsafe-return': 'warn',
        '@typescript-eslint/prefer-ts-expect-error': 'error',
        '@typescript-eslint/restrict-plus-operands': 'warn',
        '@typescript-eslint/restrict-template-expressions': 'warn',
        '@typescript-eslint/typedef': ['error', {
            arrayDestructuring: true,
            arrowParameter: true,
            memberVariableDeclaration: true,
            variableDeclaration: true,
            objectDestructuring: true,
            parameter: true,
            propertyDeclaration: true,
            variableDeclarationIgnoreFunction: true,
        }],
    },
};
