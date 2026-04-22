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
            cy.get('div.grid__grid-wrapper').should('have.descendants', 'div.grid__grid-list');
            cy.get('div.grid__grid-wrapper').find('div.grid__value-wrapper').should('have.length', 81);
        });

        it('Does contain grid value', () => {
            mount(GridComponent, {componentProperties: {originalGrid: emptyGrid}});
            cy.get('div.grid__value-wrapper').should('have.descendants', 'grid-value');
        });
    });

    describe('peer highlighting', () => {
        // Row-major 0-based index of the cell at (row, col).
        const idx = (row: number, col: number): number => row * 9 + col;

        it('Does not highlight any cell as peer when nothing is selected', () => {
            mount(GridComponent, {componentProperties: {originalGrid: emptyGrid}});
            cy.get('div.grid-value.grid-value--peer').should('not.exist');
            cy.get('div.grid-value.grid-value--selected').should('not.exist');
        });

        it('Highlights the row, column, and 3x3 block of the selected cell', () => {
            mount(GridComponent, {componentProperties: {originalGrid: emptyGrid}});

            // Click the center cell (row 4, col 4).
            cy.get('div.grid__value-wrapper').eq(idx(4, 4)).click();

            // The selected cell itself is marked selected and not a peer.
            cy.get('div.grid__value-wrapper').eq(idx(4, 4)).find('div.grid-value')
                .should('have.class', 'grid-value--selected')
                .and('not.have.class', 'grid-value--peer');

            // Every other cell in row 4 is a peer.
            [0, 1, 2, 3, 5, 6, 7, 8].forEach((c: number) => {
                cy.get('div.grid__value-wrapper').eq(idx(4, c)).find('div.grid-value')
                    .should('have.class', 'grid-value--peer')
                    .and('not.have.class', 'grid-value--selected');
            });

            // Every other cell in column 4 is a peer.
            [0, 1, 2, 3, 5, 6, 7, 8].forEach((r: number) => {
                cy.get('div.grid__value-wrapper').eq(idx(r, 4)).find('div.grid-value')
                    .should('have.class', 'grid-value--peer')
                    .and('not.have.class', 'grid-value--selected');
            });

            // Every other cell in the center 3x3 block is a peer.
            [
                [3, 3], [3, 4], [3, 5],
                [4, 3],         [4, 5],
                [5, 3], [5, 4], [5, 5],
            ].forEach(([r, c]: Array<number>) => {
                cy.get('div.grid__value-wrapper').eq(idx(r, c)).find('div.grid-value')
                    .should('have.class', 'grid-value--peer');
            });

            // Unrelated cells (corners of the outer blocks) are not peers.
            [[0, 0], [0, 8], [8, 0], [8, 8]].forEach(([r, c]: Array<number>) => {
                cy.get('div.grid__value-wrapper').eq(idx(r, c)).find('div.grid-value')
                    .should('not.have.class', 'grid-value--peer')
                    .and('not.have.class', 'grid-value--selected');
            });
        });

        it('Highlights the correct 3x3 block when selecting a cell outside the center', () => {
            mount(GridComponent, {componentProperties: {originalGrid: emptyGrid}});

            // Click top-left cell (row 0, col 0) — block is rows 0-2, cols 0-2.
            cy.get('div.grid__value-wrapper').eq(idx(0, 0)).click();

            // Cells in the top-left block (excluding the selected cell) are peers.
            [
                // eslint-disable-next-line indent
                         [0, 1], [0, 2],
                [1, 0], [1, 1], [1, 2],
                [2, 0], [2, 1], [2, 2],
            ].forEach(([r, c]: Array<number>) => {
                cy.get('div.grid__value-wrapper').eq(idx(r, c)).find('div.grid-value')
                    .should('have.class', 'grid-value--peer');
            });

            // A cell in a different block, row, and column is not a peer.
            cy.get('div.grid__value-wrapper').eq(idx(4, 4)).find('div.grid-value')
                .should('not.have.class', 'grid-value--peer')
                .and('not.have.class', 'grid-value--selected');
        });

        it('Moves the peer highlight when a different cell is selected', () => {
            mount(GridComponent, {componentProperties: {originalGrid: emptyGrid}});

            cy.get('div.grid__value-wrapper').eq(idx(0, 0)).click();
            cy.get('div.grid__value-wrapper').eq(idx(0, 5)).find('div.grid-value')
                .should('have.class', 'grid-value--peer');

            cy.get('div.grid__value-wrapper').eq(idx(8, 8)).click();

            // The old peer from row 0 is no longer highlighted.
            cy.get('div.grid__value-wrapper').eq(idx(0, 5)).find('div.grid-value')
                .should('not.have.class', 'grid-value--peer')
                .and('not.have.class', 'grid-value--selected');

            // A cell in the new selection's row is now highlighted.
            cy.get('div.grid__value-wrapper').eq(idx(8, 0)).find('div.grid-value')
                .should('have.class', 'grid-value--peer');

            // The newly selected cell is marked selected.
            cy.get('div.grid__value-wrapper').eq(idx(8, 8)).find('div.grid-value')
                .should('have.class', 'grid-value--selected')
                .and('not.have.class', 'grid-value--peer');
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
