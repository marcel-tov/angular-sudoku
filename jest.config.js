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
        '!src/**/*.cy.ts',
        '!src/main.ts',
        '!src/environments/**',
        // Camera/OCR pipeline relies on browser APIs (getUserMedia, Canvas, Tesseract.js)
        // that cannot be meaningfully exercised in jsdom — covered by Cypress e2e instead.
        '!src/app/core/scan-dialog/**',
    ],
    coverageReporters: ['lcov', 'text-summary', 'html'],
    coverageDirectory: 'coverage',
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 100,
            lines: 93,
            statements: 93,
        },
    },
};
