import {GridComponent} from './grid.component';
import {mount} from 'cypress/angular';
import {SudokuGrid} from '../grid-helper/types';
import {getEmptyRow} from '../grid-helper/empty-row';

const emptyGrid: SudokuGrid = Array.from({length: 9}, () => getEmptyRow());

describe('GridComponent', () => {
    it('should be created', () => {
        mount(GridComponent, {componentProperties: {originalGrid: emptyGrid}});
        cy.get('div').should('have.class', 'grid');
    });

    describe('top navigation', () => {
        it('Does contain grid top navigation', () => {
            mount(GridComponent, {componentProperties: {originalGrid: emptyGrid, showTopNavigation: true, showFooterNavigation: false}});
            cy.get('div.grid').should('have.descendants', 'grid-top-navigation');
        });

        it('Does not contain grid navigation', () => {
            mount(GridComponent, {componentProperties: {originalGrid: emptyGrid, showTopNavigation: false, showFooterNavigation: false}});
            cy.get('div.grid').should('not.have.descendants', 'grid-top-navigation');
            cy.get('div.grid').should('not.have.descendants', 'grid-footer-navigation');
        });

        it('Does contain share button', () => {
            mount(GridComponent, {componentProperties: {originalGrid: emptyGrid}});
            cy.get('grid-top-navigation button[aria-label="Share sudoku by url"]')
                .should('have.descendants', 'mat-icon')
                .and('have.text', 'share');
        });

        it('Does contain start new game button', () => {
            mount(GridComponent, {componentProperties: {originalGrid: emptyGrid}});
            cy.get('grid-top-navigation button[aria-label="Start a new game"]')
                .should('have.descendants', 'mat-icon')
                .and('have.text', 'autorenew');
        });

        it('Does contain clear all button', () => {
            mount(GridComponent, {componentProperties: {originalGrid: emptyGrid}});
            cy.get('grid-top-navigation button[aria-label="Make locked fields editable"]').click();
            cy.get('grid-top-navigation button[aria-label="Clear all values"]')
                .should('have.descendants', 'mat-icon')
                .and('have.text', 'clear_all');
        });

        it('Does contain lock button', () => {
            mount(GridComponent, {componentProperties: {originalGrid: emptyGrid}});
            cy.get('grid-top-navigation button[aria-label="Make locked fields editable"]')
                .should('have.descendants', 'mat-icon')
                .and('have.text', 'lock');
            cy.get('grid-top-navigation button[aria-label="Make locked fields editable"]').click();
            cy.get('grid-top-navigation button[aria-label="Make locked fields editable"]')
                .should('have.descendants', 'mat-icon')
                .and('have.text', 'lock_open');
        });
    });

    describe('grid', () => {
        it('Does contain grid', () => {
            mount(GridComponent, {componentProperties: {originalGrid: emptyGrid}});
            cy.get('div.grid').should('have.descendants', 'div.grid__grid-wrapper');
        });

        it('Does contain grid list', () => {
            mount(GridComponent, {componentProperties: {originalGrid: emptyGrid}});
            cy.get('div.grid__grid-wrapper').should('have.descendants', 'mat-grid-list');
            cy.get('div.grid__grid-wrapper').find('mat-grid-tile.grid__value-wrapper').should('have.length', 81);
        });

        it('Does contain grid value', () => {
            mount(GridComponent, {componentProperties: {originalGrid: emptyGrid}});
            cy.get('mat-grid-tile').should('have.descendants', 'grid-value');
        });
    });

    describe('bottom navigation', () => {
        it('Does contain delete button', () => {
            mount(GridComponent, {componentProperties: {originalGrid: emptyGrid}});
            cy.get('grid-footer-navigation button[aria-label="Delete a selected value"]')
                .should('have.text', 'Delete number');
        });

        it('Does contain nominees button', () => {
            mount(GridComponent, {componentProperties: {originalGrid: emptyGrid}});
            cy.get('grid-footer-navigation button[aria-label="Toggle field edit nominees"]')
                .should('have.text', 'Nominees');
        });

        it('Does contain help slide toggle', () => {
            mount(GridComponent, {componentProperties: {originalGrid: emptyGrid}});
            cy.get('grid-footer-navigation mat-slide-toggle')
                .should('have.text', 'Help');
        });

        it('Does contain nominee values', () => {
            mount(GridComponent, {componentProperties: {originalGrid: emptyGrid}});
            cy.get('grid-footer-navigation')
                .should('have.descendants', 'nominee-values');
        });
    });
});
