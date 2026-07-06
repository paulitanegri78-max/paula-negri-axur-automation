class SearchResultsPage {

    selectProduct(product) {

        // Tentar localizar por título comum (h2) ou por link de produto
        if (Cypress.env('USE_MOCK')) {
            // Injetar a página do produto diretamente quando estivermos executando contra o mock
            cy.readFile('cypress/fixtures/pages/product.html', 'utf8').then((html) => {
                cy.window().then((win) => {
                    win.document.open()
                    win.document.write(html)
                    win.document.close()
                    // garantir que o botão exista antes de prosseguir
                    cy.get('#add-to-cart-button', { timeout: 10000 }).should('exist')
                })
            })
            return
        }

        // Preferir os blocos de resultado de busca e localizar pelo título dentro deles
        cy.get('[data-component-type="s-search-result"]').then(($items) => {
            if ($items && $items.length) {
                const matched = $items.toArray().find((el) => {
                    const h2 = el.querySelector('h2')
                    return h2 && h2.innerText && h2.innerText.toLowerCase().includes(product.toLowerCase())
                })
                if (matched) {
                    cy.wrap(matched).find('a').first().click({ force: true })
                    return
                }
            }

            // fallback: tentar por h2 ou link global
            cy.get('body').then(($body) => {
                if ($body.find('h2').length) {
                    cy.contains('h2', product, { matchCase: false })
                        .should('be.visible')
                        .parents('div')
                        .find('a')
                        .first()
                        .click({ force: true })
                } else if ($body.find('a').length) {
                    cy.contains('a', product, { matchCase: false }).click({ force: true })
                } else {
                    cy.get('a').first().click({ force: true })
                }
            })
        })

    }

}

export default new SearchResultsPage()