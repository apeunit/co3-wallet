// <reference types="cypress" />

describe('Settings', () => {
  it('should initialize the wallet', () => {
    window.localStorage.setItem('co3-app-mnemonic', Cypress.env('MNEMONIC_PHRASE'));
    cy.visit(Cypress.env('CLIENT_SERVER'));
    cy.wait(500);
    cy.get('.settings').click();
    cy.wait(500);
    cy.visit(
      `${Cypress.env('CLIENT_SERVER')}/settings?pilot=turin&access_token=${Cypress.env(
        'ACCESS_TOKEN',
      )}&role=user`,
      { failOnStatusCode: false },
    );
  });
});
