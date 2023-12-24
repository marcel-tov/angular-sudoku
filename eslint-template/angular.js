module.exports = {
    parserOptions: {
        ecmaVersion: 2020,
    },
    env: {
        es6: true,
    },
    overrides: [{
        // Typescript project files
        files: [
            'src/**/*.ts',
        ],
        parserOptions: {
            project: 'tsconfig.eslint.json',
        },
        extends: [
            '../eslint-config/typescript',
            '../eslint-config/angular',
        ],
        overrides: [{
            files: '**/*.spec.ts',
            extends: '../eslint-config/jest',
        }],
    }, {
        // Typescript project files
        files: [
            'src/**/*.ts',
        ],
        parserOptions: {
            project: 'tsconfig.cypress.json',
        },
        extends: [
            '../eslint-config/typescript',
            '../eslint-config/angular',
        ],
        overrides: [{
            files: '**/*.cy.ts',
            extends: '../eslint-config/cypress',
        }],
    }, {
        // Typescript root files
        files: '**/*.ts',
        excludedFiles: [
            'src/**/*.ts',
        ],
        parserOptions: {
            project: 'tsconfig.node.json',
        },
        extends: [
            'eslint:recommended',
            'plugin:@typescript-eslint/recommended-requiring-type-checking',
            '../eslint-config/typescript',
            '../eslint-config/node',
        ],
    }, {
        // Javascript root files
        files: '**/*.js',
        excludedFiles: [
            './src/**/*.js',
        ],
        env: {
            commonjs: true,
        },
        extends: [
            'eslint:recommended',
            '../eslint-config/javascript',
            '../eslint-config/node',
        ],
    }, {
        // Angular templates
        files: '**/*.html',
        extends: '../eslint-config/angular-template',
    }],
};
