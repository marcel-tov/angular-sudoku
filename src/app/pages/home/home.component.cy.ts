import {mount} from 'cypress/angular';
import {HomeComponent} from './home.component';
import {RouterTestingModule} from '@angular/router/testing';

describe('HomeComponent', () => {
    beforeEach(() => {
        mount(HomeComponent, {
            imports: [
                RouterTestingModule,
            ],
        });
    });

    it('should be created', () => {
        cy.get('div').should('have.class', 'home');
    });

    it('should contain app-sudoku-grid', () => {
        cy.get('div.home > grid').should('have.class', 'home__grid');
    });

    describe('top navigation', () => {
        it('Does contain grid top navigation', () => {
            cy.get('div.home').should('have.descendants', 'div.home__top-navigation');
        });

        it('Does contain share button', () => {
            cy.get('.home__top-navigation button[aria-label="Share sudoku by url"]')
                .should('have.descendants', 'mat-icon')
                .and('have.text', 'share');
        });

        it('Does contain start new game button', () => {
            cy.get('.home__top-navigation button[aria-label="Start a new game"]')
                .should('have.descendants', 'mat-icon')
                .and('have.text', 'autorenew');
        });

        it('Does contain clear all button', () => {
            cy.get('.home__top-navigation button[aria-label="Make locked fields editable"]').click();
            cy.get('.home__top-navigation button[aria-label="Clear all values"]')
                .should('have.descendants', 'mat-icon')
                .and('have.text', 'clear_all');
        });

        it('Does contain lock button', () => {
            cy.get('.home__top-navigation button[aria-label="Make locked fields editable"]')
                .should('have.descendants', 'mat-icon')
                .and('have.text', 'lock');
            cy.get('.home__top-navigation button[aria-label="Make locked fields editable"]').click();
            cy.get('.home__top-navigation button[aria-label="Make locked fields editable"]')
                .should('have.descendants', 'mat-icon')
                .and('have.text', 'lock_open');
        });
    });
});
