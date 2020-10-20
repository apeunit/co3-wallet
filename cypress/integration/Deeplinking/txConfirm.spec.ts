// <reference types="cypress" />
const callbackUrl = Cypress.env('CALLBACK_URL') ? `&callback=${Cypress.env('CALLBACK_URL')}` : '';

describe('Check Transaction History', () => {
  it('should display transaction history', () => {
    window.localStorage.setItem('co3-app-mnemonic', Cypress.env('MNEMONIC_PHRASE'));
    cy.visit(
      `${Cypress.env('CLIENT_SERVER')}/tx?pilot=turin&access_token=${Cypress.env(
        'ACCESS_TOKEN',
      )}&to=0xBf745324d432A1f1d58f5436d0D3a921Bfcb1f5d&token=0x0D11435829D0f703FCaD85eaa97e62F739bF52Ed&amount=20${callbackUrl}`,
      { failOnStatusCode: false },
    );
    cy.wait(1000);
    cy.get('.next-step-btn').click({ force: true });
  });
});
