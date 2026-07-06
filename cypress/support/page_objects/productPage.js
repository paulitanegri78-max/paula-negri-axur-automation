import CurrencyHelper from "../../helpers/currencyHelper";

class ProductPage {

    elements = {

        wholePrice: '.a-price-whole',

        fractionPrice: '.a-price-fraction',

        addButton: '#add-to-cart-button'

        

    }

    captureProductPrice() {

        // Priorizar preço atual (não riscado) em áreas comuns do PDP.
        const selectorGroups = [
            '#corePriceDisplay_desktop_feature_div .a-price:not(.a-text-price) .a-offscreen',
            '#apex_desktop .a-price:not(.a-text-price) .a-offscreen',
            '#desktop_buybox .a-price:not(.a-text-price) .a-offscreen',
            '#corePrice_feature_div .a-price:not(.a-text-price) .a-offscreen',
            '#priceblock_ourprice, #priceblock_dealprice, #price_inside_buybox',
            '.a-price:not(.a-text-price) .a-offscreen'
        ]

        cy.get('body').then(($body) => {
            let candidates = []

            for (const sel of selectorGroups) {
                if ($body.find(sel).length) {
                    const parsed = [...$body.find(sel)]
                        .map((el) => CurrencyHelper.toNumber((el.innerText || '').trim()))
                        .filter((value) => Number.isFinite(value) && value >= 5)

                    if (parsed.length) {
                        candidates = [...new Set(parsed)]
                        break
                    }
                }
            }

            if (!candidates.length) {
                // fallback: combinar partes whole + fraction
                const whole = $body.find('.a-price-whole').first().text() || ''
                const frac = $body.find('.a-price-fraction').first().text() || ''
                const combinedText = (whole + ',' + frac).trim()
                const fallbackPrice = CurrencyHelper.toNumber(combinedText)

                if (!Number.isFinite(fallbackPrice) || fallbackPrice < 5) {
                    throw new Error('Nao foi possivel capturar um preco valido no PDP')
                }

                candidates = [fallbackPrice]
            }

            // Mantem candidatos para comparacao no carrinho e define preco principal.
            cy.wrap(candidates).as('productPriceCandidates')
            cy.wrap(candidates[0]).as('productPrice')
        })
    }

    addToCart() {

        if (Cypress.env('USE_MOCK')) {
            // Simula comportamento do botão no mock: gravar no localStorage apenas
            cy.window().then((win) => {
                const targetName = Cypress.env('TARGET_PRODUCT_NAME') || 'Produto Mock'
                const product = { name: targetName, price: 49.9, quantity: 1 }
                win.localStorage.setItem('mock_cart', JSON.stringify([product]))
            })
            return
        }

        // Tentar vários seletores alternativos para o botão de adicionar ao carrinho
        const selectors = [
            '#add-to-cart-button',
            'input#add-to-cart-button',
            'input[name="submit.add-to-cart"]',
            'button[name="submit.addToCart"]',
            'button#buy-now',
            'button[aria-labelledby*="add-to-cart"]',
        ]

        cy.get('body').then(($body) => {
            for (const sel of selectors) {
                if ($body.find(sel).length) {
                    cy.get(sel, { timeout: 10000 }).first().should('be.visible').click({ force: true })
                    return
                }
            }
            // se nenhum seletor foi encontrado, lançar erro descritivo
            throw new Error('Nenhum botão de adicionar ao carrinho foi encontrado na página do produto')
        })

    }

}
export default new ProductPage()
