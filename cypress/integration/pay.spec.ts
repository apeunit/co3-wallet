// <reference types="cypress" />

describe('Check Transaction History', () => {
  it('should display transaction history', () => {
    window.localStorage.setItem('co3-app-mnemonic', Cypress.env('MNEMONIC_PHRASE'));
    cy.visit(
      `${Cypress.env('CLIENT_SERVER')}?pilot=turin&access_token=${Cypress.env(
        'ACCESS_TOKEN',
      )}&role=user`,
    );
    cy.wait(500);
    cy.get('.pay-btn').click();
    cy.wait(500);
    cy.visit(
      `${Cypress.env('CLIENT_SERVER')}/tx?to=${Cypress.env(
        'TO_ADDRESS',
      )}&pilot=turin&access_token=${Cypress.env('ACCESS_TOKEN')}&role=user`,
      { failOnStatusCode: false },
    );
    cy.pause();
    cy.get('.next-step-btn').click({ force: true });
  });
});
