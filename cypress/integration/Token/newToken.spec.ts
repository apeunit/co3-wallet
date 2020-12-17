// <reference types="cypress" />
import 'cypress-drag-drop';
import 'cypress-file-upload';
import 'cypress-wait-until';
import { getRandomCustomNumber } from '../../../src/utils/helper';

const fixtureFile = '../../src/images/U009.png';
const formData = new FormData();
formData.append('files', fixtureFile);

const headers = {
  'Content-Type': 'multipart/form-data',
  Authorization: `Bearer ${Cypress.env('ACCESS_TOKEN')}`,
  authentication_server: Cypress.env('API_SERVER'),
  status: 'Public',
};

const randNo = getRandomCustomNumber(3);
const contractFile = '../../src/images/U009-contract.pdf';

describe('Create Token Mintable', () => {
  it('should create new simple token', () => {
    window.localStorage.setItem('co3-app-mnemonic', Cypress.env('MNEMONIC_PHRASE'));
    cy.visit(
      `${Cypress.env('CLIENT_SERVER')}?pilot=turin&access_token=${Cypress.env(
        'ACCESS_TOKEN',
      )}&role=user`,
    );
    cy.wait(1000);
    cy.get('.add-round-btn').click();
    cy.wait(500);
    cy.get('.add-token-btn').click();
    cy.get('.token-name-input')
      .type(`Unit ${randNo}`)
      .should('have.value', `Unit ${randNo}`);
    cy.wait(500);
    cy.get('.next-step-btn').click({ force: true });
    cy.wait(500);
    cy.get('.token-symbol-input')
      .type(`U${randNo}`)
      .should('have.value', `U${randNo}`);
    cy.wait(500);
    cy.get('.next-step-btn').click({ force: true });
    cy.wait(500);
    cy.get('.token-input').attachFile(fixtureFile);
    cy.server();
    cy.route({
      method: 'POST',
      url: `${Cypress.env('API_FIRSTLIFE_URL_STORAGE')}/files`,
      response: {
        rolesCount: 2,
      },
      delay: 500,
      headers: headers,
      onRequest: (xhr) => {
        console.log(xhr);
      },
      onResponse: (xhr) => {
        console.log(xhr);
        // expect(xhr).to.have.property('ops');
      },
    });
    cy.wait(500);
    cy.get('.next-step-btn').click({ force: true });
    cy.wait(500);
    cy.get('.token-description-input')
      .type('Testing Desciption')
      .should('have.value', 'Testing Desciption');
    cy.wait(500);
    cy.get('.next-step-btn').click({ force: true });
    cy.wait(500);
  });
  it('should add contract token', () => {
    cy.get('.token-input').attachFile(contractFile);
    cy.server();
    cy.route({
      method: 'POST',
      url: `${Cypress.env('API_FIRSTLIFE_URL_STORAGE')}/files`,
      response: {
        rolesCount: 2,
      },
      delay: 500,
      headers: headers,
      onRequest: (xhr) => {
        console.log(xhr);
      },
      onResponse: (xhr) => {
        console.log(xhr);
        // expect(xhr).to.have.property('ops');
      },
    });
    cy.wait(500);
    cy.get('.next-step-btn').click({ force: true });
    cy.get('.token-totalsupply-input')
      .type('10')
      .should('have.value', '10');
    cy.wait(500);
    cy.get('.next-step-btn').click({ force: true });
    cy.wait(500);
    cy.get('.next-step-btn').click({ force: true });
  });
});
