import {NomineeValuesComponent} from './nominee-values.component';
import {mount} from 'cypress/angular';

describe('NomineeValuesComponent', () => {
    it('should be created', () => {
        mount(NomineeValuesComponent);
        cy.get('button').should('have.class', 'nominee-value');
    });

    it('Does contain nominee values', () => {
        mount(NomineeValuesComponent);
        const list: Array<string> = [];
        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.get('button[type=button]')
            .should('have.class', 'nominee-value')
            .each((button: JQuery<HTMLElement>): void => {
                list.push(button.text());
            })
            .then(() => {
                // by the time ".each" is finished
                // the list is populated
                expect(list).to.deep.equal(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
            });
    });
});

