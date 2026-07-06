Feature: Carrinho de Compras Amazon

  Background:
    Given que acesso a página inicial da Amazon

  @smoke @real-smoke
  Scenario: Fluxo real smoke de carrinho
    When pesquiso pelo produto "Papel Sulfite A4 Chamex"
    And localizo o produto "Papel Sulfite A4 Chamex"
    And capturo o preço do produto
    And adiciono o produto ao carrinho
    And acesso o carrinho
    Then o carrinho deve conter pelo menos 1 item
    When removo o produto
    Then o carrinho deve estar vazio

  @regression @business-flow
  Scenario: Fluxo completo real com validacao de preco, subtotal e carrinho vazio
    When pesquiso pelo produto "Huggies Fralda Premium Natural Care M 32 Un"
    And localizo o produto "Huggies Fralda Premium Natural Care M 32 Un"
    And capturo o preço do produto
    And adiciono o produto ao carrinho
    And acesso o carrinho
    Then o carrinho deve conter pelo menos 1 item
    And valido o preço exibido em todos os locais visíveis
    When aumento a quantidade para 2 unidades
    Then valido a quantidade 2 no carrinho
    And valido o subtotal para 2 unidades
    When removo o produto
    Then o carrinho deve estar vazio