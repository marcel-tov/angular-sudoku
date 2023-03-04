import {AppComponent} from './app.component';

describe('AppComponent', () => {
    beforeEach(() => {
        cy.mount(AppComponent);
    });

    it('should be created', () => {
        cy.get('div').should('have.class', 'app');
    });

    it('should contain router-outlet', () => {
        cy.get('div > router-outlet').should('exist');
    });
});
