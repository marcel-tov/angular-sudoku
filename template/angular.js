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
            '../config/typescript',
            '../config/angular',
        ],
        overrides: [{
            files: '**/*.spec.ts',
            extends: '../config/jasmine',
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
            '../config/typescript',
            '../config/node',
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
            '../config/javascript',
            '../config/node',
        ],
    }, {
        // Angular templates
        files: '**/*.html',
        extends: '../config/angular-template',
    }],
};
