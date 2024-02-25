// describe('Share sudoku', () => {
//     it('Does share sudoku', () => {
//         cy.visit(`${Cypress.config().baseUrl}/`);
//         // cy.viewport(799, 919)
//         // cy.visit('http://localhost:4200/')
//
//         cy.get('.home__grid > .grid > .grid__navigation > .mat-mdc-tooltip-trigger > .mat-mdc-button-touch-target').click();
//         cy.get('.mat-mdc-dialog-component-host > .mat-mdc-dialog-content > div > .mat-mdc-tooltip-trigger > .mat-mdc-button-touch-target')
//             .click()
//             .then(()=>{
//                 cy.window().then(win => {
//                     win.navigator.clipboard.readText().then((text: string) => {
//                         console.log('text', text);
//
//                         expect(text).to.eq('your copied text');
//                     });
//                 });
//             });
//     });
// });
//
// // http://localhost:4200/.1.59..6..........5...43.9...51....696....4....43...8....71.3..18.....5.7.......4
