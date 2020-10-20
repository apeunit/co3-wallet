// <reference types="cypress" />
import 'cypress-wait-until';

describe('Co3 Wallet', () => {
  it('should initialize the wallet', () => {
    cy.visit(`${Cypress.env('CLIENT_SERVER')}`);
    cy.get('.footer-icon-active');
    cy.get('.footer-icon');
  });

  it('should create new token, coupon and crowdsale', () => {
    cy.visit(`${Cypress.env('CLIENT_SERVER')}`);
    cy.get('.add-round-btn').click();
    cy.wait(500);
    cy.visit(`${Cypress.env('CLIENT_SERVER')}?pilot=turin&access_token=qHYoF6ZUC7e9cusB&role=user`);
  });
});
