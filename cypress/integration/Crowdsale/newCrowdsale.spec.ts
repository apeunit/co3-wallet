// <reference types="cypress" />
import 'cypress-file-upload';
import 'cypress-wait-until';
import { getRandomCustomNumber } from '../../../src/utils/helper';

const randNo = getRandomCustomNumber(3);
const fixtureFile = '../../src/images/U009.png';
const formData = new FormData();
formData.append('files', fixtureFile);

const headers = {
  'Content-Type': 'multipart/form-data',
  Authorization: `Bearer ${Cypress.env('ACCESS_TOKEN')}`,
  authentication_server: Cypress.env('API_SERVER'),
  status: 'Public',
};

describe('Create Crowdsale Mintable', () => {
  it('should create new simple coupon', () => {
    window.localStorage.setItem('co3-app-mnemonic', Cypress.env('MNEMONIC_PHRASE'));
    cy.visit(
      `${Cypress.env('CLIENT_SERVER')}?pilot=turin&access_token=${Cypress.env(
        'ACCESS_TOKEN',
      )}&role=user`,
    );
    cy.wait(1000);
    cy.get('.add-round-btn').click();
    cy.wait(500);
    cy.get('.add-crowdsale-btn').click();
    cy.get('.crowdsale-name-input')
      .type(`Crowdsale Unit ${randNo}`)
      .should('have.value', `Crowdsale Unit ${randNo}`);
    cy.wait(500);
    cy.get('.next-step-btn').click({ force: true });
    cy.wait(500);
    cy.get('.crowdsale-input').attachFile(fixtureFile);
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
    cy.get('.next-step-btn').click({ force: true });
    cy.wait(500);
    cy.get('.crowdsale-description-input')
      .type('Testing Desciption')
      .should('have.value', 'Testing Desciption');
    cy.wait(500);
    cy.get('.next-step-btn').click({ force: true });
    cy.wait(500);
    cy.get('.next-step-btn').click({ force: true });
    cy.wait(500);
    cy.get('.crowdsale-maxSupply-input')
      .type('5')
      .should('have.value', '5');
    cy.wait(500);
    cy.get('.next-step-btn').click({ force: true });
    cy.wait(500);
    cy.get('.crowdsale-giveRatio')
      .type('3')
      .should('have.value', '3');
    cy.wait(500);
    cy.get('.next-step-btn').click({ force: true });
    cy.wait(500);
    cy.get('.next-step-btn').click({ force: true });
    cy.wait(500);
    cy.get('.next-step-btn').click({ force: true });
  });
});
