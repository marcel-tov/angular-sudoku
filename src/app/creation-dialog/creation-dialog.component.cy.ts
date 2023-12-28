import {CreationDialogComponent} from './creation-dialog.component';
import {mount} from 'cypress/angular';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('CreationDialogComponent', () => {
    beforeEach(() => {
        mount(CreationDialogComponent, {
            imports: [
                NoopAnimationsModule,
            ],
            providers: [
                {provide: MatDialogRef, useValue: {}},
                {provide: MAT_DIALOG_DATA, useValue: {}},
            ],
        });
    });

    it('Does contain h1 title', () => {
        cy.get('h1').should('have.attr', 'mat-dialog-title');
        cy.get('h1').should('have.text', 'Level of difficulty');
    });

    it('Does contain difficulty button', () => {
        const list: Array<string> = [];
        cy.get('div[mat-dialog-content] button[type=button]')
            .each((button: JQuery<HTMLElement>): void => {
                list.push(button.text());
            })
            .then(() => {
                // by the time ".each" is finished
                // the list is populated
                expect(list).to.deep.equal(['VeryEasy', 'Easy', 'Medium', 'Hard']);
            });
    });

    it('Does contain close button', () => {
        cy.get('div[mat-dialog-actions] button[type=button]').should('have.attr', 'mat-raised-button');
        cy.get('div[mat-dialog-actions] button[type=button]').should('have.text', 'cancel');
    });
});

