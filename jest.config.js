module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  globalSetup: 'jest-preset-angular/global-setup',
  modulePathIgnorePatterns: ['<rootDir>/eslint-config/'],
};
