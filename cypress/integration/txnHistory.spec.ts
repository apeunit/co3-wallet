// <reference types="cypress" />

describe('Check Transaction History', () => {
  it('should display transaction history', () => {
    window.localStorage.setItem('co3-app-mnemonic', Cypress.env('MNEMONIC_PHRASE'));
    cy.visit(
      `${Cypress.env('CLIENT_SERVER')}?pilot=turin&access_token=${Cypress.env(
        'ACCESS_TOKEN',
      )}&role=user`,
    );
    cy.wait(1000);
    cy.get('.txnhistory-btn').click();
  });
});
