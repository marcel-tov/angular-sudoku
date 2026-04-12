module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    modulePathIgnorePatterns: ['<rootDir>/eslint-config/'],
    transform: {
        '^.+\\.(ts|js|mjs|html|svg)$': [
            'jest-preset-angular',
            {
                tsconfig: '<rootDir>/tsconfig.spec.json',
                stringifyContentPathRegex: '\\.(html|svg)$',
                isolatedModules: true,
            },
        ],
    },
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.spec.ts',
        '!src/main.ts',
        '!src/environments/**',
    ],
    coverageReporters: ['lcov', 'text-summary', 'html'],
    coverageDirectory: 'coverage',
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
};
