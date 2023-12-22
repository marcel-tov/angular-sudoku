import {HomeComponent} from './home.component';
import {RouterTestingModule} from '@angular/router/testing';
import {MatDialogModule} from '@angular/material/dialog';

describe('HomeComponent', () => {
    beforeEach(() => {
        cy.mount(HomeComponent, {
            imports: [
                RouterTestingModule,
                MatDialogModule,
            ],
        });
    });

    it('should be created', () => {
        cy.get('div').should('have.class', 'home');
    });

    it('should contain app-sudoku-grid', () => {
        cy.get('div.home > app-sudoku-grid').should('have.class', 'home__grid');
    });
});
