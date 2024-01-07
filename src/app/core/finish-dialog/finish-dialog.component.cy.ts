import {FinishDialogComponent, IFinishDialogData} from './finish-dialog.component';
import {mount} from 'cypress/angular';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('FinishDialogComponent', () => {
    beforeEach(() => {
        const data: IFinishDialogData = {
            title: 'test-title',
            icon: 'test-icon',
            description: 'test-description',
        };
        mount(FinishDialogComponent, {
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
        cy.get('h1[mat-dialog-title]').should('have.text', 'test-title');
    });

    it('Does contains description', () => {
        cy.get('div[mat-dialog-content] > div > p').should('have.text', 'test-description');
    });

    it('Does contains icon', () => {
        cy.get('div[mat-dialog-content] > div > mat-icon').should('have.text', 'test-icon');
    });

    it('Does contain ok button', () => {
        cy.get('div[mat-dialog-actions] button[type=button]').should('have.attr', 'mat-raised-button');
        cy.get('div[mat-dialog-actions] button[type=button]').should('have.text', 'OK');
    });
});

