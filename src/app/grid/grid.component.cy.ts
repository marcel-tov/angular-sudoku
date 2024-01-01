import {GridComponent} from './grid.component';
import {mount} from 'cypress/angular';

describe('GridComponent', () => {
    beforeEach(() => {
        mount(GridComponent);
    });

    it('should be created', () => {
        cy.get('div').should('have.class', 'grid');
    });
});

