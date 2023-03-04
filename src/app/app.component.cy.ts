import {AppComponent} from './app.component';

describe('AppComponent', () => {
    it('should be created', () => {
        cy.mount(AppComponent);
        cy.get('div').should('have.class', 'app');
        cy.get('router-outlet').should('exist');
    });

    it('should contain router-outlet', () => {
        cy.mount(AppComponent);
        cy.get('div > router-outlet').should('exist');
    });
});
