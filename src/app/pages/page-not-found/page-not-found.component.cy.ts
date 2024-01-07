import {PageNotFoundComponent} from './page-not-found.component';
import {mount} from 'cypress/angular';

describe('PageNotFoundComponent', () => {
    beforeEach(() => mount(PageNotFoundComponent));

    it('Does contain page not found class', () => {
        cy.get('div').should('have.class', 'page-not-found');
    });

    it('Does contain grid tag', () => {
        cy.get('div.page-not-found').should('exist', 'grid.page-not-found__grid');
    });

    it('Does contain page not found link div', () => {
        cy.get('div.page-not-found').should('exist', 'div.page-not-found-link');
    });

    it('Does contain page not found link', () => {
        cy.get('div.page-not-found-link').should('have.text', 'Let\'s go home and try from there');
        cy.get('div.page-not-found-link').should('exist', 'a.page-not-found-link__home-link');
        cy.get('a.page-not-found-link__home-link')
            .should('have.attr', 'href')
            .and('include', '/');
    });
});

