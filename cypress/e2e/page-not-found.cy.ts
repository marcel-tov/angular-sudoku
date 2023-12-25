describe('page-not-found', () => {
  it('Should contain page-not-found tag', () => {
    cy.visit(`${Cypress.config().baseUrl}/foo/bar`);
    cy.get('page-not-found').should('exist');
  })

  it('Should redirect to home page', () => {
    cy.visit('/foo/bar');
    cy.get('page-not-found').should('exist');
    cy.get('.page-not-found-link__home-link').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  })
})
