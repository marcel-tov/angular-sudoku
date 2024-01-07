import {IShareDialogData, ShareDialogComponent} from './share-dialog.component';
import {mount} from 'cypress/angular';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {getEmptyRow} from '../grid-helper/empty-row';

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
            imports: [
                NoopAnimationsModule,
            ],
            providers: [
                {provide: MatDialogRef, useValue: {}},
                {provide: MAT_DIALOG_DATA, useValue: data},
            ],
        });
    });

    it('Does contain h1 title', () => {
        cy.get('h1[mat-dialog-title]').should('have.text', 'Share Sudoku');
    });

    it('Does contain input value', () => {
        cy.get('div[mat-dialog-content] input[name="link"]')
            .should('have.value', `${window.location.origin}/123456789........................................................................`);
    });

    it('Does contain copy button', () => {
        cy.get('div[mat-dialog-content] button[type=button]').should('have.attr', 'mat-icon-button');
        cy.get('div[mat-dialog-content] button[type=button] mat-icon').should('have.text', 'content_copy');
    });
    //
    // it('Does contain copy button tooltip', () => {
    //     cy.get('div[mat-dialog-content] button[type=button]').trigger('mouseover');
    //     // cy.get('div[mat-dialog-content] button[type=button]').trigger('mouseover');
    //     cy.contains('Copy link').should('be.visible');
    //     // cy.get('div[mat-dialog-content] button[type=button] mat-icon').should('have.text', 'content_copy');
    // });

    it('Does contain close button', () => {
        cy.get('div[mat-dialog-actions] button[type=button]').should('have.attr', 'mat-raised-button');
        cy.get('div[mat-dialog-actions] button[type=button]').should('have.text', 'close');
    });

    // @TODO write copy to clipboard test
});

