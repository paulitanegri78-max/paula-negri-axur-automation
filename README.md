# Amazon Cart E2E Automation

[![Cypress](https://img.shields.io/badge/Cypress-15.17.0-17202C?logo=cypress)](https://www.cypress.io/)
[![Cucumber](https://img.shields.io/badge/Cucumber-BDD-23D96C?logo=cucumber)](https://cucumber.io/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=000)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Mochawesome](https://img.shields.io/badge/Reporter-Mochawesome-5A3E85)](https://github.com/adamgruber/mochawesome)
[![Node](https://img.shields.io/badge/Node.js-%3E%3D18-339933?logo=node.js)](https://nodejs.org/)

Projeto de automacao de testes E2E para o fluxo de carrinho de compras da Amazon, utilizando Cypress com Cucumber (Gherkin), arquitetura Page Object Model (POM) e relatorios HTML via Mochawesome.

Repositorio: [https://github.com/paulitanegri78-max/paula-negri-axur-automation](https://github.com/paulitanegri78-max/paula-negri-axur-automation)

## Indice

- [1. Nome do projeto](#1-nome-do-projeto)
- [2. Descricao e objetivo](#2-descricao-e-objetivo)
- [3. Tecnologias e bibliotecas utilizadas](#3-tecnologias-e-bibliotecas-utilizadas)
- [4. Arquitetura do framework de automacao](#4-arquitetura-do-framework-de-automacao)
- [5. Estrutura de diretorios](#5-estrutura-de-diretorios)
- [6. Pre-requisitos](#6-pre-requisitos)
- [7. Instalacao](#7-instalacao)
- [8. Configuracao do .env](#8-configuracao-do-env)
- [9. Execucao dos testes](#9-execucao-dos-testes)
- [10. Relatorios Mochawesome](#10-relatorios-mochawesome)
- [11. Organizacao dos testes com Cypress + Cucumber + POM](#11-organizacao-dos-testes-com-cypress--cucumber--pom)
- [12. Documentacao oficial das dependencias](#12-documentacao-oficial-das-dependencias)
- [13. Boas praticas](#13-boas-praticas)
- [14. Melhorias futuras](#14-melhorias-futuras)
- [15. Autora](#15-autora)
- [16. Licenca](#16-licenca)

## 1. Nome do projeto

Amazon Cart E2E Automation

## 2. Descricao e objetivo

Este projeto automatiza cenarios de validacao do carrinho da Amazon, cobrindo fluxos criticos de negocio como:

- busca de produto
- localizacao de item na listagem
- adicao ao carrinho
- validacao de preco em pontos visiveis
- alteracao de quantidade
- validacao de subtotal
- remocao do item (teste negativo)

O objetivo e garantir confiabilidade regressiva dos fluxos de compra com testes legiveis, manuteniveis e reutilizaveis.

## 3. Tecnologias e bibliotecas utilizadas

| Categoria | Ferramenta | Finalidade |
|---|---|---|
| Linguagem | JavaScript (ES6+) | Implementacao dos testes e page objects |
| Framework E2E | Cypress | Execucao e automacao dos cenarios web |
| BDD | Cucumber / Gherkin | Escrita dos cenarios em linguagem de negocio |
| Preprocessamento | @badeball/cypress-cucumber-preprocessor | Integracao Cucumber + Cypress |
| Bundler | @bahmutov/cypress-esbuild-preprocessor + esbuild | Compilacao rapida dos testes |
| Relatorio | Mochawesome | Geracao de relatorio HTML/JSON |

## 4. Arquitetura do framework de automacao

O framework segue o padrao Page Object Model (POM), separando responsabilidades em camadas:

- Features (Gherkin): descricao funcional dos cenarios
- Step Definitions: ligacao entre passos Gherkin e a automacao
- Page Objects: acoes e validacoes centralizadas por pagina
- Helpers: utilitarios de apoio (ex.: moeda, calculos)
- Fixtures: dados estaticos e paginas mock para suporte de testes

Beneficios:

- maior reutilizacao de codigo
- baixa duplicacao de seletores
- manutencao mais simples
- melhor legibilidade e escalabilidade da suite

## 5. Estrutura de diretorios

Estrutura principal do projeto:

```text
.
|-- cypress/
|   |-- e2e/
|   |   |-- features/
|   |   |   |-- carrinho.feature
|   |   |   `-- fixture/project.json
|   |-- fixtures/
|   |   |-- products.json
|   |   `-- pages/
|   |       |-- index.html
|   |       |-- search.html
|   |       |-- product.html
|   |       `-- cart.html
|   |-- helpers/
|   |   |-- CalculationHelper.js
|   |   `-- currencyHelper.js
|   |-- support/
|   |   |-- commands.js
|   |   |-- e2e.js
|   |   |-- page_objects/
|   |   |   |-- homePage.js
|   |   |   |-- searchPage.js
|   |   |   |-- productPage.js
|   |   |   `-- CartPage.js
|   |   `-- step_definitions/
|   |       `-- cart.step.js
|   |-- reports/
|   |-- screenshots/
|   `-- videos/
|-- cypress.config.js
|-- cypress-cucumber-preprocessor.config.json
|-- package.json
|-- .env
`-- README.md
```

Descricao dos principais artefatos:

| Caminho | Finalidade |
|---|---|
| cypress/e2e/features/carrinho.feature | Cenarios BDD do fluxo de carrinho |
| cypress/support/step_definitions/cart.step.js | Implementacao dos passos Given/When/Then |
| cypress/support/page_objects | Modelagem das paginas e operacoes do fluxo |
| cypress/helpers | Funcoes utilitarias compartilhadas |
| cypress/fixtures/products.json | Massa de dados de produtos |
| cypress/fixtures/pages | HTML mock para cenarios controlados |
| cypress/reports | Relatorios JSON/HTML do Mochawesome |
| cypress/screenshots | Evidencias de erro durante execucao |
| cypress/videos | Gravacoes das execucoes |
| cypress.config.js | Configuracao global do Cypress |

## 6. Pre-requisitos

- Node.js 18+ (recomendado Node 20+)
- npm 9+
- Microsoft Edge instalado (execucoes do projeto utilizam `--browser edge`)
- Git

## 7. Instalacao

1. Clone o repositorio:

```bash
git clone https://github.com/paulitanegri78-max/paula-negri-axur-automation.git
cd paula-negri-axur-automation
```

2. Instale as dependencias:

```bash
npm install
```

3. Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

## 8. Configuracao do .env

Use o arquivo `.env.example` como base e mantenha um `.env` local na raiz do projeto com o seguinte formato:

```env
BASE_URL=https://www.amazon.com.br
```

Descricao da variavel:

| Variavel | Exemplo | Descricao |
|---|---|---|
| BASE_URL | https://www.amazon.com.br | URL base da aplicacao alvo para execucao dos testes |

Observacoes:

- mantenha o `.env` fora de versionamento
- utilize URLs validas e acessiveis no ambiente onde os testes serao executados

## 9. Execucao dos testes

### 9.1 Modo interativo (debug)

Abrir o Cypress Test Runner:

```bash
npx cypress open
```

### 9.2 Modo headless e scripts npm

| Objetivo | Comando |
|---|---|
| Suite completa (headed) | `npm run test:e2e:edge` |
| Smoke headless | `npm run test:e2e:smoke` |
| Smoke headed | `npm run test:e2e:smoke:headed` |
| Regression headed | `npm run test:e2e:regression` |
| Smoke headless (timeout ajustado) | `npm run test:e2e:smoke:headless` |
| Regression headless | `npm run test:e2e:regression:headless` |
| Pipeline CI (smoke + regression) | `npm run test:e2e:ci` |
| Todos os cenarios em uma unica execucao | `npx cypress run --browser edge --headless --spec "cypress/e2e/features/**/*.feature"` |

## 10. Relatorios Mochawesome

Os relatorios sao gerados automaticamente ao final das execucoes e salvos em `cypress/reports`.

Arquivos principais:

- `mochawesome.html`
- `mochawesome.json`
- `mochawesome_001.html` (quando `overwrite=false`)

Como visualizar:

Windows (PowerShell):

```powershell
start .\cypress\reports\mochawesome.html
```

## 11. Organizacao dos testes com Cypress + Cucumber + POM

Padrao adotado no projeto:

- Cucumber/Gherkin para descrever comportamento de negocio
- Step Definitions para orquestrar regras de execucao
- Page Objects para encapsular seletores e acoes de UI
- Helpers para calculos/formatacoes compartilhadas
- Tags (`@smoke`, `@regression`) para segmentacao de suite

Essa composicao permite testes mais legiveis, desacoplados e prontos para evolucao continua.

## 12. Documentacao oficial das dependencias

- Cypress: [https://docs.cypress.io/](https://docs.cypress.io/)
- Cucumber: [https://cucumber.io/docs](https://cucumber.io/docs)
- @badeball/cypress-cucumber-preprocessor: [https://github.com/badeball/cypress-cucumber-preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor)
- cypress-cucumber-preprocessor (legado): [https://github.com/TheBrainFamily/cypress-cucumber-preprocessor](https://github.com/TheBrainFamily/cypress-cucumber-preprocessor)
- @bahmutov/cypress-esbuild-preprocessor: [https://github.com/bahmutov/cypress-esbuild-preprocessor](https://github.com/bahmutov/cypress-esbuild-preprocessor)
- esbuild: [https://esbuild.github.io/](https://esbuild.github.io/)
- Mochawesome: [https://github.com/adamgruber/mochawesome](https://github.com/adamgruber/mochawesome)
- mochawesome-merge: [https://github.com/Antontelesh/mochawesome-merge](https://github.com/Antontelesh/mochawesome-merge)
- mochawesome-report-generator: [https://github.com/adamgruber/mochawesome-report-generator](https://github.com/adamgruber/mochawesome-report-generator)
- Node.js: [https://nodejs.org/en/docs](https://nodejs.org/en/docs)

## 13. Boas praticas

- manter seletores no Page Object, nunca espalhados em steps
- evitar dependencia de `cy.wait` fixo quando possivel
- manter cenarios curtos, objetivos e orientados a comportamento
- usar tags para separar suites (smoke, regression, etc.)
- revisar estabilidade dos testes em execucoes headless
- limpar e versionar somente artefatos necessarios
- documentar alteracoes de fluxo no README e nas features

## 14. Melhorias futuras

- incluir validacoes adicionais de acessibilidade
- adicionar integracao com pipeline CI/CD (GitHub Actions)
- incluir execucao multi-browser (Chrome/Firefox)
- criar massa de dados dinamica por ambiente
- adicionar relatorio consolidado por historico de execucoes
- incluir analise de flakiness e retries inteligentes

## 15. Autora

**Paula Negri**

- GitHub: [https://github.com/paulitanegri78-max](https://github.com/paulitanegri78-max)
- Projeto: [https://github.com/paulitanegri78-max/paula-negri-axur-automation](https://github.com/paulitanegri78-max/paula-negri-axur-automation)

## 16. Licenca

Este projeto esta licenciado sob a licenca MIT.

Consulte o arquivo [LICENSE](LICENSE).
