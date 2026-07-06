import { Given, When, Then, Before } from "@badeball/cypress-cucumber-preprocessor";
import HomePage from "../page_objects/homePage";
import SearchResultsPage from "../page_objects/searchPage";
import ProductPage from "../page_objects/productPage";
import CartPage from "../page_objects/CartPage";

Before({ tags: "@business-flow" }, () => {
    Cypress.env('USE_MOCK', false)
})

Before({ tags: "@real-smoke" }, () => {
    Cypress.env('USE_MOCK', false)
})

Given("que acesso a página inicial da Amazon", () => {
    HomePage.acessar()
})

When("pesquiso pelo produto {string}",(produto)=>{

    Cypress.env('TARGET_PRODUCT_NAME', produto)

    HomePage.pesquisar(produto)

   
})

When("seleciono o produto {string}", (produto) => {

    Cypress.env('TARGET_PRODUCT_NAME', produto)

     SearchResultsPage.selectProduct(produto)

})

When("localizo o produto {string}", (produto) => {

    Cypress.env('TARGET_PRODUCT_NAME', produto)

    SearchResultsPage.selectProduct(produto)

})

    When("capturo o preço do produto", () => {

    ProductPage.captureProductPrice()

})

When("adiciono o produto ao carrinho", () => {

    ProductPage.addToCart()

})

When("acesso o carrinho",()=>{

    CartPage.openCarrinho()

})

Then("o preço deve ser igual ao preço capturado",()=>{

    CartPage.validarPreco()

})

Then("o carrinho deve conter pelo menos 1 item",()=>{

    CartPage.validateHasItems()

})

Then("valido o preço exibido em todos os locais visíveis",()=>{

    CartPage.validateVisiblePrices()

})

When("aumento a quantidade para {int} unidades",(quantidade)=>{

    CartPage.changeQuantity(quantidade)

})

Then("valido a quantidade {int} no carrinho",(quantidade)=>{

    CartPage.validateQuantity(quantidade)

})

Then("valido o subtotal para {int} unidades",(quantidade)=>{

    CartPage.validateSubtotal(quantidade)

})

Then("o carrinho deve estar consistente", () => {

    CartPage.validateCart(2)

})
When("removo o produto", () => {

    CartPage.removeProduct()

})

Then("o carrinho deve estar vazio", () => {

    CartPage.validateEmptyCart()

})
