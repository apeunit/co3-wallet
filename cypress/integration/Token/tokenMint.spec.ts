// <reference types="cypress" />

const randNo = (Math.floor(Math.random() * 100) + 1).toString();

describe('Token Minting', () => {
  it('should initialize token minting', () => {
    window.localStorage.setItem('co3-app-mnemonic', Cypress.env('MNEMONIC_PHRASE'));
    cy.visit(
      `${Cypress.env('CLIENT_SERVER')}?pilot=turin&access_token=${Cypress.env(
        'ACCESS_TOKEN',
      )}&role=user`,
    );
    cy.pause();
    cy.get('.token-mint-btn').click();
    cy.get('.token-mint-input')
      .type(randNo)
      .should('have.value', randNo);
    cy.wait(500);
    cy.get('.token-mint-next-btn').click();
    cy.wait(500);
  });
});
