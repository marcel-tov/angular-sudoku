import {GridTopNavigationComponent} from './grid-top-navigation.component';
import {mount} from 'cypress/angular';

describe('GridTopNavigationComponent', () => {
    it('should be created', () => {
        mount(GridTopNavigationComponent, {componentProperties: {lockValues: true, time: '00:00:00'}});
        cy.get('div').should('have.class', 'grid-top-navigation');
    });

    it('should display the time', () => {
        mount(GridTopNavigationComponent, {componentProperties: {lockValues: true, time: '01:23:45'}});
        cy.contains('01:23:45').should('exist');
    });

    it('should contain share button', () => {
        mount(GridTopNavigationComponent, {componentProperties: {lockValues: true, time: '00:00:00'}});
        cy.get('button[aria-label="Share sudoku by url"]')
            .should('have.descendants', 'mat-icon')
            .and('have.text', 'share');
    });

    it('should contain start new game button', () => {
        mount(GridTopNavigationComponent, {componentProperties: {lockValues: true, time: '00:00:00'}});
        cy.get('button[aria-label="Start a new game"]')
            .should('have.descendants', 'mat-icon')
            .and('have.text', 'autorenew');
    });

    it('should not show clear all button when lockValues is true', () => {
        mount(GridTopNavigationComponent, {componentProperties: {lockValues: true, time: '00:00:00'}});
        cy.get('button[aria-label="Clear all values"]').should('not.exist');
    });

    it('should show clear all button when lockValues is false', () => {
        mount(GridTopNavigationComponent, {componentProperties: {lockValues: false, time: '00:00:00'}});
        cy.get('button[aria-label="Clear all values"]')
            .should('have.descendants', 'mat-icon')
            .and('have.text', 'clear_all');
    });

    it('should show lock icon when lockValues is true', () => {
        mount(GridTopNavigationComponent, {componentProperties: {lockValues: true, time: '00:00:00'}});
        cy.get('button[aria-label="Make locked fields editable"]')
            .should('have.descendants', 'mat-icon')
            .and('have.text', 'lock');
    });

    it('should show lock_open icon when lockValues is false', () => {
        mount(GridTopNavigationComponent, {componentProperties: {lockValues: false, time: '00:00:00'}});
        cy.get('button[aria-label="Make locked fields editable"]')
            .should('have.descendants', 'mat-icon')
            .and('have.text', 'lock_open');
    });
});
