import {defineConfig} from 'cypress';

export default defineConfig({
    component: {
        devServer: {
            framework: 'angular',
            bundler: 'webpack',
        },
        specPattern: '**/*.cy.ts',
    },

    e2e: {
        setupNodeEvents(_on: Cypress.PluginEvents, _config: Cypress.PluginConfigOptions) {
            // implement node event listeners here
        },
    },
});
