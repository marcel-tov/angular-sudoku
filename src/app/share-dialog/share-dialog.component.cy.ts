import {IShareDialogData, ShareDialogComponent} from './share-dialog.component';
import {mount} from 'cypress/angular';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {getEmptyRow} from '../grid/grid.component';

describe('ShareDialogComponent', () => {
    const data: IShareDialogData = {
        grid: [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
        ],
    };
    beforeEach(() => {
        mount(ShareDialogComponent, {
            providers: [
                {provide: MatDialogRef, useValue: {}},
                {provide: MAT_DIALOG_DATA, useValue: data},
            ],
        });
    });

    it('Does contain h1 title', () => {
        cy.get('h1').should('have.attr', 'mat-dialog-title');
        cy.get('h1').should('have.text', 'Share Sudoku');
    });

    it('Does contain close button', () => {
        cy.get('div[mat-dialog-actions] button[type=button]').should('have.attr', 'mat-raised-button');
        cy.get('div[mat-dialog-actions] button[type=button]').should('have.text', 'close');
    });
});
