import {defineConfig} from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'https://localhost:4200/',
        // Angular CLI dev-server uses a self-signed certificate; disable strict SSL
        // so Cypress does not reject it during local and CI runs.
        chromeWebSecurity: false,
        setupNodeEvents(on: Cypress.PluginEvents): void {
            on(
                'before:browser:launch',
                (
                    browser: Cypress.Browser,
                    launchOptions: Cypress.BrowserLaunchOptions,
                ): Cypress.BrowserLaunchOptions => {
                    if (browser.name === 'firefox') {
                        // Accept self-signed certs in Firefox.
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        launchOptions.preferences['network.stricttransportsecurity.preloadlist'] = false;
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        launchOptions.preferences['security.cert_pinning.enforcement_level'] = 0;
                    }

                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    return launchOptions;
                },
            );
        },
    },
    component: {
        devServer: {
            framework: 'angular',
            bundler: 'webpack',
        },
        specPattern: '**/*.cy.ts',
    },
});
