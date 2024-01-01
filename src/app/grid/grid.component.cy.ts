import {GridComponent} from './grid.component';
import {mount} from 'cypress/angular';

describe('GridComponent', () => {
    it('should be created', () => {
        mount(GridComponent);
        cy.get('div').should('have.class', 'grid');
    });

    it('Does contain grid top navigation', () => {
        mount(GridComponent, {componentProperties: {showTopNavigation: true, showFooterNavigation: false}});
        cy.get('div.grid').should('have.descendants', 'div.grid__navigation');
    });

    it('Does not contain grid navigation', () => {
        mount(GridComponent, {componentProperties: {showTopNavigation: false, showFooterNavigation: false}});
        cy.get('div.grid').should('not.have.descendants', 'div.grid__navigation');
    });

    it('Does contain share button', () => {
        mount(GridComponent);
        cy.get('.grid__navigation button[aria-label="Share sudoku by url"]')
            .should('have.descendants', 'mat-icon')
            .and('have.text', 'share');
    });

    it('Does contain start new game button', () => {
        mount(GridComponent);
        cy.get('.grid__navigation button[aria-label="Start a new game"]')
            .should('have.descendants', 'mat-icon')
            .and('have.text', 'autorenew');
    });

    it('Does contain clear all button', () => {
        mount(GridComponent);
        cy.get('.grid__navigation button[aria-label="Make locked fields editable"]').click();
        cy.get('.grid__navigation button[aria-label="Clear all values"]')
            .should('have.descendants', 'mat-icon')
            .and('have.text', 'clear_all');
    });

    it('Does contain lock button', () => {
        mount(GridComponent);
        cy.get('.grid__navigation button[aria-label="Make locked fields editable"]')
            .should('have.descendants', 'mat-icon')
            .and('have.text', 'lock');
        cy.get('.grid__navigation button[aria-label="Make locked fields editable"]').click();
        cy.get('.grid__navigation button[aria-label="Make locked fields editable"]')
            .should('have.descendants', 'mat-icon')
            .and('have.text', 'lock_open');
    });
});

