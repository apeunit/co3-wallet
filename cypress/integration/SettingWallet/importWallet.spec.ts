// <reference types="cypress" />

const mnemonic = Cypress.env('MNEMONIC_PHRASE').split(' ');

describe('Import Wallet', () => {
  it('should initialize import wallet', () => {
    window.localStorage.setItem('co3-app-mnemonic', Cypress.env('MNEMONIC_PHRASE'));
    cy.visit(
      `${Cypress.env('CLIENT_SERVER')}?pilot=turin&access_token=${Cypress.env(
        'ACCESS_TOKEN',
      )}&role=user`,
    );
    cy.wait(500);
    cy.get('.settings').click();
    cy.wait(500);
    cy.get('.import-wallet').click();
    cy.wait(500);
    cy.get('.next-step-btn').click();
    cy.wait(500);
    mnemonic.map((val, index) => {
      if (index < 6) {
        cy.get(`.phrase-${index}`)
          .type(val)
          .should('have.value', val);
        cy.wait(500);
      }
    });
    cy.get('.next-step-btn').click();
    cy.wait(500);
    mnemonic.map((val, index) => {
      if (index >= 6) {
        cy.get(`.phrase-${index - 6}`)
          .type(val)
          .should('have.value', val);
        cy.wait(500);
      }
    });
    cy.get('.next-step-btn').click();
    cy.wait(500);
    cy.get('.next-step-btn').click();
    cy.wait(500);
  });
});
