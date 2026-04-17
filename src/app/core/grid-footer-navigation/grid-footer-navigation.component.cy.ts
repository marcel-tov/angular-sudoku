import {GridFooterNavigationComponent} from './grid-footer-navigation.component';
import {mount} from 'cypress/angular';

describe('GridFooterNavigationComponent', () => {
    it('should be created', () => {
        mount(GridFooterNavigationComponent, {componentProperties: {hasSelectedValue: false, showNominees: false, isHelpEnabled: false}});
        cy.get('div').should('have.class', 'grid-footer-navigation');
    });

    it('should contain delete button', () => {
        mount(GridFooterNavigationComponent, {componentProperties: {hasSelectedValue: false, showNominees: false, isHelpEnabled: false}});
        cy.get('button[aria-label="Delete a selected value"]')
            .should('have.text', 'Delete number');
    });

    it('should disable delete button when no value is selected', () => {
        mount(GridFooterNavigationComponent, {componentProperties: {hasSelectedValue: false, showNominees: false, isHelpEnabled: false}});
        cy.get('button[aria-label="Delete a selected value"]')
            .should('be.disabled');
    });

    it('should enable delete button when value is selected', () => {
        mount(GridFooterNavigationComponent, {componentProperties: {hasSelectedValue: true, showNominees: false, isHelpEnabled: false}});
        cy.get('button[aria-label="Delete a selected value"]')
            .should('not.be.disabled');
    });

    it('should contain nominees button', () => {
        mount(GridFooterNavigationComponent, {componentProperties: {hasSelectedValue: false, showNominees: false, isHelpEnabled: false}});
        cy.get('button[aria-label="Toggle field edit nominees"]')
            .should('have.text', 'Nominees');
    });

    it('should contain help slide toggle', () => {
        mount(GridFooterNavigationComponent, {componentProperties: {hasSelectedValue: false, showNominees: false, isHelpEnabled: false}});
        cy.get('mat-slide-toggle')
            .should('have.text', 'Help');
    });

    it('should contain nominee values', () => {
        mount(GridFooterNavigationComponent, {componentProperties: {hasSelectedValue: false, showNominees: false, isHelpEnabled: false}});
        cy.get('div.grid-footer-navigation')
            .should('have.descendants', 'nominee-values');
    });
});
