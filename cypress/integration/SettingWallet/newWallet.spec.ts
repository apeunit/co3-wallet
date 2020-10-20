// <reference types="cypress" />

describe('New Wallet', () => {
  it('should initialize new wallet', () => {
    window.localStorage.setItem('co3-app-mnemonic', Cypress.env('MNEMONIC_PHRASE'));
    cy.visit(`${Cypress.env('CLIENT_SERVER')}`);
    cy.wait(500);
    cy.get('.settings').click();
    cy.wait(500);
    cy.get('.new-wallet').click();
    cy.wait(500);
    cy.get('.next-step-btn').click();
    cy.wait(500);
    cy.get('.next-step-btn').click();
    cy.wait(500);
    cy.get('.next-step-btn').click();
    cy.wait(500);
    cy.get('.next-step-btn').click();
    cy.wait(1000);
    cy.get('.next-step-btn').click();
    cy.wait(1000);
    cy.get('.next-step-btn').click();
    cy.wait(500);
    cy.get('.next-step-btn').click();
    cy.pause();
    cy.get('.next-step-btn').click();
    cy.wait(500);
  });
});
