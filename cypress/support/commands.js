Cypress.Commands.add('loadProduct', () => {

    cy.fixture('products').then((data) => {

        cy.wrap(data.products[0]).as('product')

    })

})

