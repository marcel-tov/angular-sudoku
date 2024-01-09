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
});
