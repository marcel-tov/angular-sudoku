'use strict';

const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const angularPlugin = require('@angular-eslint/eslint-plugin');
const angularTemplatePlugin = require('@angular-eslint/eslint-plugin-template');
const angularTemplateParser = require('@angular-eslint/template-parser');
const importPlugin = require('eslint-plugin-import');
const jestPlugin = require('eslint-plugin-jest');
const cypress = require('eslint-plugin-cypress');
const globals = require('globals');

// ── Shared rules (apply to all JS and TS files) ───────────────────────────

const jsRules = {
    'arrow-parens': ['error', 'as-needed'],
    'comma-dangle': ['error', 'always-multiline'],
    'complexity': ['error', {max: 20}],
    'constructor-super': 'error',
    'default-case': 'error',
    'dot-notation': 'error',
    'eol-last': 'error',
    'eqeqeq': ['error', 'smart'],
    'guard-for-in': 'error',
    'id-denylist': ['error', 'any', 'number', 'string', 'Boolean', 'boolean'],
    'id-match': 'error',
    'import/exports-last': 'error',
    'import/group-exports': 'error',
    'indent': ['error', 4, {
        FunctionDeclaration: {parameters: 'first'},
        FunctionExpression: {parameters: 'first'},
        SwitchCase: 1,
    }],
    'keyword-spacing': 'error',
    'max-classes-per-file': ['error', 1],
    'max-len': ['error', {ignorePattern: '^import\\s.+\\sfrom\\s.+;$', ignoreUrls: true, code: 140}],
    'new-parens': 'error',
    'no-bitwise': 'error',
    'no-caller': 'error',
    'no-cond-assign': 'error',
    'no-console': ['error', {
        allow: ['dirxml', 'warn', 'error', 'dir', 'timeLog', 'assert', 'clear', 'count',
            'countReset', 'group', 'groupCollapsed', 'groupEnd', 'table', 'Console',
            'profile', 'profileEnd', 'timeStamp', 'context'],
    }],
    'no-debugger': 'error',
    'no-duplicate-imports': 'error',
    'no-empty': 'error',
    'no-eval': 'error',
    'no-fallthrough': 'error',
    'no-irregular-whitespace': 'error',
    'no-multiple-empty-lines': ['error', {max: 1}],
    'no-new-wrappers': 'error',
    'no-redeclare': 'error',
    'no-sparse-arrays': 'error',
    'no-template-curly-in-string': 'error',
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'error',
    'no-undef-init': 'error',
    'no-unsafe-finally': 'error',
    'no-unsafe-optional-chaining': 'error',
    'no-unused-expressions': ['error', {allowShortCircuit: true}],
    'no-unused-labels': 'error',
    'no-var': 'error',
    'object-curly-newline': ['error', {
        ObjectExpression: {multiline: true, consistent: true},
        ObjectPattern: {multiline: true, consistent: true},
        ImportDeclaration: {multiline: true, minProperties: 6},
        ExportDeclaration: {multiline: true, minProperties: 6},
    }],
    'object-curly-spacing': ['error', 'never', {arraysInObjects: false, objectsInObjects: false}],
    'object-shorthand': 'error',
    'one-var': ['error', 'never'],
    'padding-line-between-statements': ['error', {blankLine: 'always', prev: '*', next: 'return'}],
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-object-spread': 'error',
    'prefer-spread': 'warn',
    'prefer-template': 'error',
    'quote-props': ['error', 'consistent-as-needed'],
    'quotes': ['error', 'single', {avoidEscape: true}],
    'radix': 'error',
    'semi': ['error', 'always'],
    'space-in-parens': ['error', 'never'],
    'space-before-function-paren': ['error', {anonymous: 'never', named: 'never', asyncArrow: 'always'}],
    'spaced-comment': 'error',
    'use-isnan': 'error',
    'valid-typeof': 'off',
    'yoda': 'error',
};

// ── TypeScript-specific rules (applied on top of jsRules for .ts files) ──

const tsRules = {
    // Disable base rules that have TS-aware equivalents in @typescript-eslint/recommended
    'no-unused-expressions': 'off',
    'no-unused-vars': 'off',

    // @typescript-eslint/recommended (entry[1] = eslint-recommended overrides, entry[2] = TS rules)
    ...tsPlugin.configs['flat/recommended'][1].rules,
    ...tsPlugin.configs['flat/recommended'][2].rules,

    // Custom overrides
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/array-type': ['error', {default: 'generic'}],
    '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': false,
        'ts-nocheck': true,
        'ts-check': false,
        minimumDescriptionLength: 10,
    }],
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/consistent-type-definitions': 'error',
    '@typescript-eslint/explicit-member-accessibility': ['error', {
        accessibility: 'explicit',
        overrides: {constructors: 'off', accessors: 'off'},
    }],
    '@typescript-eslint/member-ordering': ['error', {
        default: [
            'public-field', 'protected-field', 'private-field',
            'public-constructor', 'protected-constructor', 'private-constructor',
            'public-method', 'protected-method', 'private-method',
        ],
    }],
    '@typescript-eslint/naming-convention': ['error',
        {
            selector: 'memberLike',
            format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
            leadingUnderscore: 'allow',
            filter: {regex: '^[0-9]+$', match: false},
        },
        {selector: 'typeLike', format: ['PascalCase']},
        {selector: 'interface', format: ['PascalCase'], custom: {regex: '^I[A-Z]', match: true}},
    ],
    '@typescript-eslint/no-empty-function': ['error', {allow: ['arrowFunctions', 'functions']}],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    '@typescript-eslint/no-unused-expressions': ['error', {allowShortCircuit: true}],
    '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
    }],
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
    '@typescript-eslint/unified-signatures': 'error',
};

// ── Node-specific overrides ────────────────────────────────────────────────

const nodeRules = {
    'no-console': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'no-restricted-properties': ['error', {object: 'window', property: 'document'}],
    'no-restricted-globals': ['error', 'document'],
};

// ── Config array ──────────────────────────────────────────────────────────

module.exports = [

    // 1. Global ignores
    {
        ignores: ['.angular/**', '.idea/**', '.vscode/**', 'dist/**', 'node_modules/**'],
    },

    // 2. Angular TypeScript source files
    {
        files: ['src/**/*.ts'],
        plugins: {
            '@typescript-eslint': tsPlugin,
            '@angular-eslint': angularPlugin,
            'import': importPlugin,
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: {project: 'tsconfig.eslint.json', sourceType: 'module'},
            globals: {...globals.browser, ...globals.es2020},
        },
        rules: {
            ...jsRules,
            ...tsRules,
            // Angular files tend to have long decorator lines — ignore all for max-len
            'max-len': ['error', {ignorePattern: '^.*', ignoreUrls: true, code: 140}],
        },
    },

    // 3. Jest spec files
    {
        files: ['src/**/*.spec.ts'],
        plugins: {jest: jestPlugin},
        languageOptions: {
            globals: jestPlugin.configs['flat/recommended'].languageOptions.globals,
        },
        rules: {
            ...jestPlugin.configs['flat/recommended'].rules,
            ...jestPlugin.configs['flat/style'].rules,
            'jest/require-top-level-describe': 'error',
            'jest/no-duplicate-hooks': 'warn',
            'jest/no-test-return-statement': 'error',
        },
    },

    // 4. Cypress e2e files
    {
        ...cypress.configs.recommended,
        files: ['**/*.cy.ts'],
    },

    // 5. Root TypeScript config files (cypress.config.ts etc., outside src/)
    {
        files: ['**/*.ts'],
        ignores: ['src/**/*.ts'],
        plugins: {
            '@typescript-eslint': tsPlugin,
            'import': importPlugin,
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: {project: 'tsconfig.node.json', sourceType: 'module'},
            globals: {...globals.node},
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tsPlugin.configs['flat/recommended-type-checked'][1].rules,
            ...tsPlugin.configs['flat/recommended-type-checked'][2].rules,
            ...jsRules,
            ...tsRules,
            ...nodeRules,
        },
    },

    // 6. Root JavaScript config files (jest.config.js, commitlint.config.js etc.)
    {
        files: ['**/*.js'],
        ignores: ['src/**/*.js'],
        plugins: {'import': importPlugin},
        languageOptions: {
            ecmaVersion: 2020,
            globals: {...globals.node, ...globals.commonjs},
        },
        rules: {
            ...js.configs.recommended.rules,
            ...jsRules,
            ...nodeRules,
        },
    },

    // 7. Angular HTML templates
    {
        files: ['**/*.html'],
        plugins: {'@angular-eslint/template': angularTemplatePlugin},
        languageOptions: {parser: angularTemplateParser},
        rules: {
            ...angularTemplatePlugin.configs.recommended.rules,
            '@angular-eslint/template/banana-in-box': 'error',
            '@angular-eslint/template/conditional-complexity': 'error',
            '@angular-eslint/template/cyclomatic-complexity': 'warn',
            '@angular-eslint/template/eqeqeq': 'error',
            '@angular-eslint/template/no-any': 'error',
            '@angular-eslint/template/no-duplicate-attributes': 'error',
            '@angular-eslint/template/no-negated-async': 'error',
        },
    },

];
