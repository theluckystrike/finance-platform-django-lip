// @ts-nocheck
describe('testing login page...', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('visit the login page', () => {
    // just execute 'beforeEach' block
  });

  it('check username input', () => {
    cy.get('input[name="username"]')
        .type('Test username')
  });

  it('check password input', () => {
    cy.get('input[name="password"]')
        .type('Test password')
  });

  it('check for error messages: "Field is required"', () => {
    cy.get('button[type="submit"]')
        .click();

    cy.get('div.error-message')
        .should('have.length', 2)
        .and('contain', 'is required');
  });

  it('check for error messages: "Password must be at least 8 characters"', () => {
    cy.get('input[name="password"]')
        .type('1234567');

    cy.get('body')
        .click(0, 0);

    cy.get('div.error-message')
        .should('have.length', 1)
        .and('contain', 'Password must be at least 8 characters');
  });

  it('check remeber me checkbox', () => {
    cy.get('input[name="rememberMe"]')
        .check();
  });

  it.skip('check forgot password link [to be implemeted]', () => {
      // to be implemented
  });

  it('check for successfull login', () => {
      cy.intercept('POST', `${Cypress.env().API_URL}/auth/login`, {
          statusCode: 200,
          body: {message: "Test runned successfully"}
      }).as('login');

      cy.get('input[name="username"]')
          .type('Test username')

      cy.get('input[name="password"]')
          .type('Test password')

      cy.get('button[type="submit"]')
          .click();

      cy.wait('@login').then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
          expect(interception.response.body.message).to.contain('Test runned successfully');
      });

      cy.get('div.Toastify__toast')
        .should('be.visible')
        .and('contain', 'Logged in successfully');
  });
})