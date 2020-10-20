// <reference types="cypress" />

const callbackUrl = Cypress.env('CALLBACK_URL') ? `&callback=${Cypress.env('CALLBACK_URL')}` : '';

describe('Add Transaction Payment', () => {
  it('should display transaction history', () => {
    window.localStorage.setItem('co3-app-mnemonic', Cypress.env('MNEMONIC_PHRASE'));
    cy.visit(
      `${Cypress.env('CLIENT_SERVER')}/tx?pilot=turin&access_token=${Cypress.env(
        'ACCESS_TOKEN',
      )}&to=0xBf745324d432A1f1d58f5436d0D3a921Bfcb1f5d${callbackUrl}`,
      { failOnStatusCode: false },
    );
    cy.wait(500);
  });
});
