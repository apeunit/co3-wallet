// <reference types="cypress" />

describe('Delete Wallet', () => {
  it('should initialize delete wallet', () => {
    window.localStorage.setItem('co3-app-mnemonic', Cypress.env('MNEMONIC_PHRASE'));
    cy.visit(
      `${Cypress.env('CLIENT_SERVER')}?pilot=turin&access_token=${Cypress.env(
        'ACCESS_TOKEN',
      )}&role=user`,
    );
    cy.wait(500);
    cy.get('.settings').click();
    cy.wait(500);
    cy.get('.delete-wallet').click();
    cy.wait(500);
    cy.get('.next-step-btn').click({ force: true });
  });
});
