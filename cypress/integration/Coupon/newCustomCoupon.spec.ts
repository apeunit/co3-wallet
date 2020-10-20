// <reference types="cypress" />
import 'cypress-drag-drop';
import 'cypress-file-upload';
import 'cypress-wait-until';
import { getRandomCustomNumber } from '../../../src/api/co3uum';

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

describe('Create Coupon Mintable', () => {
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
    cy.get('.add-coupon-btn').click();
    cy.get('.coupon-name-input')
      .type(`Coupon Unit ${randNo}`)
      .should('have.value', `Coupon Unit ${randNo}`);
    cy.wait(500);
    cy.get('.next-step-btn').click({ force: true });
    cy.wait(500);
    cy.get('.coupon-headline-input')
      .type(`Coupon Unit ${randNo}`)
      .should('have.value', `Coupon Unit ${randNo}`);
    cy.wait(500);
    cy.get('.next-step-btn').click({ force: true });
    cy.wait(500);
    cy.get('.next-step-btn').click({ force: true });
    cy.wait(500);
    cy.get('.coupon-description-input')
      .type('Testing Desciption')
      .should('have.value', 'Testing Desciption');
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
    cy.get('.next-step-btn').click({ force: true });
    cy.wait(500);
    cy.get('input[type="radio"]')
      .check('Standard Coupon', { force: true })
      .should('be.checked');
    cy.wait(500);
    cy.get('.next-step-btn').click({ force: true });
    cy.wait(500);
    cy.get('.coupon-supply-input')
      .type('10')
      .should('have.value', '10');
    cy.wait(500);
    cy.get('.next-step-btn').click({ force: true });
    cy.wait(500);
    cy.get('.next-step-btn').click({ force: true });
  });
});
