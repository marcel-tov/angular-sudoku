import {GridComponent} from './grid.component';
import {mount} from 'cypress/angular';
import {SudokuGrid} from '../grid-helper/types';
import {getEmptyRow} from '../grid-helper/empty-row';

describe('GridComponent', () => {
    it('should be created', () => {
        mount(GridComponent);
        cy.get('div').should('have.class', 'grid');
    });

    describe('grid', () => {
        const grid: SudokuGrid = [
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
        ];

        it('Does contain grid', () => {
            mount(GridComponent, {componentProperties: {originalGrid: grid}});
            cy.get('div.grid').should('have.descendants', 'div.grid__grid-wrapper');
        });

        it('Does contain grid list', () => {
            mount(GridComponent, {componentProperties: {originalGrid: grid}});
            cy.get('div.grid__grid-wrapper').should('have.descendants', 'mat-grid-list');
            cy.get('div.grid__grid-wrapper').find('mat-grid-tile.grid__value-wrapper').should('have.length', 81);
        });

        it('Does contain grid value', () => {
            mount(GridComponent, {componentProperties: {originalGrid: grid}});
            cy.get('mat-grid-tile').should('have.descendants', 'grid-value');
        });
    });

    describe('bottom navigation', () => {
        it('Does contain delete button', () => {
            mount(GridComponent);
            cy.get('.grid__navigation button[aria-label="Delete a selected value"]')
                .should('have.text', 'Delete number');
        });

        it('Does contain nominees button', () => {
            mount(GridComponent);
            cy.get('.grid__navigation button[aria-label="Toggle field edit nominees"]')
                .should('have.text', 'Nominees');
        });

        it('Does contain help slide toggle', () => {
            mount(GridComponent);
            cy.get('.grid__navigation mat-slide-toggle')
                .should('have.text', 'Help');
        });

        it('Does contain nominee values', () => {
            mount(GridComponent);
            cy.get('div.grid__navigation')
                .should('have.descendants', 'nominee-values');
        });
    });
});
