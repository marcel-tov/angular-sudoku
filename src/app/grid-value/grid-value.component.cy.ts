import {GridValueComponent} from './grid-value.component';
import {mount} from 'cypress/angular';

describe('GridValueComponent', () => {
    it('should be created', () => {
        mount(GridValueComponent);

        cy.get('div').should('have.class', 'grid-value');
    });

    it('should have readonly class', () => {
        mount(GridValueComponent, {componentProperties: {isReadOnly: true}});
        cy.get('div.grid-value').should('have.class', 'grid-value--readonly');
    });

    it('should have clickable class', () => {
        mount(GridValueComponent, {componentProperties: {isReadOnly: false}});
        cy.get('div.grid-value').should('have.class', 'grid-value--clickable');
    });

    it('should have selected class', () => {
        mount(GridValueComponent, {componentProperties: {isSelected: true}});
        cy.get('div.grid-value').should('have.class', 'grid-value--selected');
    });

    it('should have error class', () => {
        mount(GridValueComponent, {
            componentProperties: {
                isReadOnly: false,
                hasError: true,
                value: 111,
            },
        });
        cy.get('div.grid-value').should('have.class', 'grid-value--error');
    });

    it('should have success class', () => {
        mount(GridValueComponent, {
            componentProperties: {
                isReadOnly: false,
                hasSuccess: true,
                value: 111,
            },
        });
        cy.get('div.grid-value').should('have.class', 'grid-value--success');
    });

    it('should have nominees class', () => {
        mount(GridValueComponent, {
            componentProperties: {
                isSelected: true,
                showNominees: true,
            },
        });
        cy.get('div.grid-value').should('have.class', 'grid-value--nominees');
    });
});

