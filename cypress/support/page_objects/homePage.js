beforeEach(() => {

    cy.loadProduct()

})


class HomePage {

    acessar() {
        if (Cypress.env('USE_MOCK')) {
            // Carrega o HTML mock diretamente do fixture para evitar dependência de terceiros
            cy.readFile('cypress/fixtures/pages/index.html', 'utf8').then((html) => {
                cy.window().then((win) => {
                    win.document.open()
                    win.document.write(html)
                    win.document.close()
                })
            })
        } else {
            cy.visit('/')
        }
    }

    visit() {
        return this.acessar()
    }

    pesquisar(produto) {
        if (Cypress.env('USE_MOCK')) {
            // Navegar para a página de resultados mock injetando o HTML
            cy.readFile('cypress/fixtures/pages/search.html', 'utf8').then((html) => {
                cy.window().then((win) => {
                    win.document.open()
                    win.document.write(html)
                    win.document.close()
                })
            })
            return
        }

        const selectors = ['#twotabsearchtextbox', 'input[name="field-keywords"]', 'input[type="search"]']

        // Fechar modal de cookies/consent se aparecer (textos comuns PT/EN)
        cy.get('body').then(($body) => {
            const acceptButtons = $body.find('button, input[type=button]')
            const texts = ['Aceitar', 'Aceitar cookies', 'Concordo', 'Accept', 'Agree', 'OK']
            for (const btn of acceptButtons) {
                const txt = btn.innerText || btn.value || ''
                if (texts.some(t => txt.includes(t))) {
                    cy.wrap(btn).click({ force: true })
                    break
                }
            }
        })

        // Buscar o campo de pesquisa com timeout maior e tentar aliases
        cy.get(selectors.join(', '), { timeout: 15000 })
            .first()
            .should('be.visible')
            .clear()
            .type(produto, { delay: 20 })

        cy.get('#nav-search-submit-button', { timeout: 10000 }).click()
    }

}

export default new HomePage()

