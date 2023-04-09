import 'jest-preset-angular/setup-jest';

module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setupJest.ts'],
  globalSetup: 'jest-preset-angular/global-setup',
};
