/** Used for all .js and .ts files (node & browser). */
module.exports = {
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        // 'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
    ],
    rules: {
        'arrow-body-style': 'off',
        'arrow-parens': [
            'error',
            'as-needed',
        ],
        'comma-dangle': [
            'error',
            'always-multiline',
        ],
        'complexity': [
            'error',
            {
                max: 20,
            },
        ],
        'constructor-super': 'error',
        'curly': 'off',
        'default-case': 'error',
        'dot-notation': 'error',
        'eol-last': 'error',
        'eqeqeq': [
            'error',
            'smart',
        ],
        'guard-for-in': 'error',
        'id-blacklist': [
            'error',
            'any',
            'number',
            'string',
            'Boolean',
            'boolean',
        ],
        'id-match': 'error',

        'import/exports-last': 'error',
        'import/group-exports': 'error',
        'import/namespace': 'off', // Is very slow, and I don't think this rule is very important.
        'import/no-deprecated': 'off', // Is very slow and doesn't work and the IDE shows already a warning.
        'import/no-duplicates': 'off', // Is very slow and already covered by no-duplicate-imports.
        'import/no-unresolved': 'off',
        'import/order': 'off',
        'import/named': 'off',
        'keyword-spacing': 'off', // already covered by typescript-eslint/keyword-spacing
        'max-classes-per-file': [
            'error',
            1,
        ],
        'max-len': [
            'error',
            {
                ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
                ignoreUrls: true,
                code: 140,
            },
        ],
        'max-lines': 'off',
        'new-parens': 'error',
        'no-bitwise': 'error',
        'no-caller': 'error',
        'no-cond-assign': 'error',
        'no-console': [
            'error',
            {
                allow: [
                    'dirxml',
                    'warn',
                    'error',
                    'dir',
                    'timeLog',
                    'assert',
                    'clear',
                    'count',
                    'countReset',
                    'group',
                    'groupCollapsed',
                    'groupEnd',
                    'table',
                    'Console',
                    'profile',
                    'profileEnd',
                    'timeStamp',
                    'context',
                ],
            },
        ],
        'no-debugger': 'error',
        'no-duplicate-imports': 'error',
        'no-empty': 'error',
        'no-eval': 'error',
        'no-fallthrough': 'error',
        'no-irregular-whitespace': 'error',
        'no-invalid-this': 'off',
        'no-multiple-empty-lines': [
            'error',
            {
                max: 1,
            },
        ],
        'no-new-wrappers': 'error',
        'no-null/no-null': 'off',
        'no-redeclare': 'error',
        'no-sparse-arrays': 'error',
        'no-template-curly-in-string': 'error',
        'no-throw-literal': 'error',
        'no-trailing-spaces': 'error',
        'no-undef-init': 'error',
        'no-underscore-dangle': 'off',
        'no-unsafe-finally': 'error',
        'no-unsafe-optional-chaining': 'error',
        'no-unused-expressions': [
            'error',
            {
                allowShortCircuit: true,
            },
        ],
        'no-unused-labels': 'error',
        'no-var': 'error',
        'object-curly-newline': ['error', {
            ObjectExpression: {
                multiline: true,
                consistent: true,
            },
            ObjectPattern: {
                multiline: true,
                consistent: true,
            },
            ImportDeclaration: {
                multiline: true,
                minProperties: 6,
            },
            ExportDeclaration: {
                multiline: true,
                minProperties: 6,
            },
        }],
        'object-shorthand': 'error',
        'one-var': [
            'error',
            'never',
        ],
        'padding-line-between-statements': [
            'error',
            {
                blankLine: 'always',
                prev: '*',
                next: 'return',
            },
        ],
        'prefer-arrow-callback': 'error',
        'prefer-const': 'error',
        'prefer-object-spread': 'error',
        'prefer-spread': 'warn',
        'prefer-template': 'error',
        'quote-props': [
            'error',
            'consistent-as-needed',
        ],
        'radix': 'error',
        'space-in-parens': ['error', 'never'],
        'space-before-function-paren': [
            'error',
            {
                anonymous: 'never',
                named: 'never',
                asyncArrow: 'always',
            },
        ],
        'spaced-comment': 'error',
        'use-isnan': 'error',
        'valid-typeof': 'off',
        'yoda': 'error',

        '@typescript-eslint/adjacent-overload-signatures': 'error',
        '@typescript-eslint/array-type': ['error', {default: 'generic'}],
        '@typescript-eslint/consistent-type-assertions': 'error',
        '@typescript-eslint/consistent-type-definitions': 'error',
        '@typescript-eslint/keyword-spacing': 'error',
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/prefer-regexp-exec': 'off',
        '@typescript-eslint/no-unnecessary-type-assertion': 'off',
        'object-curly-spacing': ['error', 'never', {
            arraysInObjects: false,
            objectsInObjects: false,
        }],
        '@typescript-eslint/indent': [
            'error',
            4,
            {
                FunctionDeclaration: {
                    parameters: 'first',
                },
                FunctionExpression: {
                    parameters: 'first',
                },
                SwitchCase: 1,
            },
        ],
        '@typescript-eslint/member-delimiter-style': [
            'error',
            {
                multiline: {
                    delimiter: 'semi',
                    requireLast: true,
                },
                singleline: {
                    delimiter: 'semi',
                    requireLast: false,
                },
            },
        ],
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/member-ordering': [
            'error',
            {
                default: [
                    // Index signature
                    // No accessibility for index signature. See above.

                    // Fields
                    'public-field', // = ['public-static-field', 'public-instance-field'])
                    'protected-field', // = ['protected-static-field', 'protected-instance-field'])
                    'private-field', // = ['private-static-field', 'private-instance-field'])

                    // Constructors
                    'public-constructor',
                    'protected-constructor',
                    'private-constructor',

                    // Methods
                    'public-method', // = ['public-static-method', 'public-instance-method'])
                    'protected-method', // = ['protected-static-method', 'protected-instance-method'])
                    'private-method', // = ['private-static-method', 'private-instance-method'])
                ],
            },
        ],
        '@typescript-eslint/no-empty-function': ['error',
            {
                allow: [
                    'arrowFunctions',
                    'functions',
                ],
            },
        ],
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-namespace': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/prefer-for-of': 'off',
        '@typescript-eslint/prefer-function-type': 'off',
        '@typescript-eslint/prefer-namespace-keyword': 'error',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/ban-ts-comment': ['error', {
            'ts-expect-error': 'allow-with-description',
            'ts-ignore': false, // Already covered by prefer-ts-expect-error.
            'ts-nocheck': true,
            'ts-check': false,
            'minimumDescriptionLength': 10,
        }],
        '@typescript-eslint/explicit-module-boundary-types': ['warn', {
            allowedNames: ['constructor'],
        }],
        '@typescript-eslint/ban-types': 'warn',
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/no-unused-vars': ['error', {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
        }],
        '@typescript-eslint/quotes': [
            'error',
            'single',
            {
                avoidEscape: true,
            },
        ],
        '@typescript-eslint/semi': [
            'error',
            'always',
        ],
        '@typescript-eslint/triple-slash-reference': 'error',
        '@typescript-eslint/type-annotation-spacing': 'error',
        '@typescript-eslint/unified-signatures': 'error',
    },
};
