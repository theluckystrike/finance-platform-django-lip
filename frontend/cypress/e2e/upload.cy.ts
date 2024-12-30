// @ts-nocheck
describe('testing script uploading page...', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/account/upload');
  });

  it('visit "/account/upload" page', () => {
    // just execute 'beforeEach' block
  })

  it('should make a GET request to /categories', () => {
    cy.intercept('GET', `${Cypress.env().API_URL}/categories`).as('getCategories');
    cy.reload()
    cy.wait('@getCategories').its('response.statusCode').should('eq', 200);
  });

  it('try to input the name of the first result if count > 0', function () {
    cy.intercept('GET', `${Cypress.env().API_URL}/categories`).as('getCategories');

    cy.wait('@getCategories').then(({ response }) => {
      const { count, results } = response.body;

      if (count > 0) {
        cy.get('input[placeholder="Select a category"]')
          .type(results[0].name);
        cy.get('div.dropdown-content')
          .should('be.visible')
        cy.contains('span', results[0].name)
      } else {
        cy.log('No categories found, skipping test');
        return cy.then(() => {
          this.skip();
        });
      }
    });
  });

  it('check if data type dropdown is working and provide valid values (chart, graph, chart and graph)', () => {
    cy.get('input[placeholder="Select a view data type"]')
        .click()

    cy.get('div.dropdown-content')
        .should('be.visible')

    cy.get('div.dropdown-content')
        .find('span')
        .should('have.length', 3)
        .each(($el, index) => {
          const values = ['Chart', 'Table', 'Chart and Table'];
          expect($el.text()).to.equal(values[index]);
        })
  });

  it('check if the input field for the script name is working', () => {
    cy.get('input[id="name"]')
        .type('Test script name')
        .should('have.value', 'Test script name')
  });

  it('check input for scripts uploading. conditions: should be present, should accept .py files only, should actually be able to upload files', () => {
    cy.get('input[type="file"][accept=".py"]')
        .selectFile('cypress/fixtures/test_script.py')
  });

  it('testing "Reset" button', () => {
    cy.get('input[placeholder="Select a category"]')
        .type('Test Category');
    cy.get('input[placeholder="Select a view data type"]')
        .type('Chart');
    cy.contains('span', 'Chart')
        .click();
    cy.get('input[id="name"]')
        .type('Test Script Name');
    cy.get('input[type="file"]')
        .selectFile('cypress/fixtures/test_script.py');

    cy.get('button[type="reset"]')
        .click();

    cy.get('input[placeholder="Select a category"]')
        .should('have.value', '');
    cy.get('input[placeholder="Select a view data type"]')
        .should('have.value', '');
    cy.get('input[id="name"]')
        .should('have.value', '');
    cy.get('input[type="file"]')
        .should('have.value', '');
  });

  it('testing that clicking on "Upload" button without filling the form, should show error messages', () => {
    cy.get('button[type="submit"]').click();

    cy.get('div.error-message')
        .should('have.length', 4)
  });
})

describe('testing category creation modal...', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/account/upload');
    cy.get('button[type="button"] svg[data-name="Material--Add"]')
        .click()
  });

  it('should open and close the modal window', () => {
      cy.get('body')
          .should('has.attr', 'data-rr-ui-modal-open')

      cy.get('body').click(0, 0);

      cy.get('body')
          .should('not.have.attr', 'data-rr-ui-modal-open')
  });

  it('testing "Category Name" input', () => {
    cy.contains('label', 'Category Name')
      .next('input')
      .type('Test Category Name');
  })

  it('testing "Parent Category" dropdown', () => {
    cy.intercept('GET', `${Cypress.env().API_URL}/categories`).as('getCategories');

    cy.reload()

    cy.wait('@getCategories').then(({ response }) => {
      const { count, results } = response.body;

      cy.get('button[type="button"] svg[data-name="Material--Add"]')
        .click()

      if (count > 0) {
        cy.contains('label', 'Parent Category')
          .parent()
          .find('input[placeholder="Select a category"]')
          .type(results[0].name);
        cy.get('div.dropdown-content')
          .should('be.visible')
        cy.contains('span', results[0].name)
      } else {
        cy.log('No categories found, skipping test');
        return cy.then(() => {
          this.skip();
        });
      }
    });
  });

  it('testing "Edit All Categories" button redirects to /account/category-manager page', () => {
    cy.contains('button', 'Edit All Categories')
      .click();

    cy.url()
      .should('contain', '/account/category-manager');
  });

  it('testing succesfull category creation', () => {
    cy.intercept('POST', `${Cypress.env().API_URL}/categories`, {
        statusCode: 201,
        body: { message: 'Test runned successfully!' },
    }).as('categoryCreation');

    cy.contains('label', 'Category Name')
      .next('input')
      .type('Test Category Name');

    cy.contains('button', 'Edit All Categories')
      .parent()
      .find('button[type="submit"]')
      .click();

    cy.wait('@categoryCreation').then((interception) => {
      expect(interception.response.statusCode).to.eq(201);
      expect(interception.response.body.message).to.contain('Test runned successfully!');
    });
  });
});

describe('Test successful form submission to upload script', () => {
  it('should submit the form and handle success response', () => {
    cy.login();
    cy.visit('/account/upload');

    cy.intercept('POST', `${Cypress.env().API_URL}/scripts`, {
      statusCode: 201,
      body: { message: 'Test runned successfully!' },
    }).as('formSubmit');

    cy.reload();

    cy.get('input[placeholder="Select a category"]').type('Test Category');
    cy.get('input[placeholder="Select a view data type"]').type('Chart');
    cy.contains('span', 'Chart').click();
    cy.get('input[id="name"]').type('Test Script Name');
    cy.get('input[type="file"]').selectFile('cypress/fixtures/test_script.py');

    cy.get('button[type="submit"]').click();

    cy.wait('@formSubmit').then((interception) => {
      expect(interception.response.statusCode).to.eq(201);
      expect(interception.response.body.message).to.contain('Test runned successfully!');
    });

    cy.contains('New Script added successfully').should('be.visible');
  });
});