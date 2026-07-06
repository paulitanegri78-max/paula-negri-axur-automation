# E2E Tests - Cypress + Cucumber

Este projeto executa cenarios E2E com Cypress e tags Cucumber.

Observacao: os artefatos (`cypress/screenshots`, `cypress/videos`, `cypress/reports`) sao limpos automaticamente antes de cada `npm run test:e2e:*`.

## Execucao local

- Full suite (Edge com UI):

```bash
npm run test:e2e:edge
```

- Smoke (somente `@smoke`, Edge headless - mais estável):

```bash
npm run test:e2e:smoke
```

- Smoke com UI (debug local):

```bash
npm run test:e2e:smoke:headed
```

- Regression (somente `@regression`, Edge com UI):

```bash
npm run test:e2e:regression
```

## Execucao para CI (headless)

- Pipeline completo (smoke + regression):

```bash
npm run test:e2e:ci
```

- Smoke headless:

```bash
npm run test:e2e:smoke:headless
```

- Regression headless:

```bash
npm run test:e2e:regression:headless
```

## Matriz de execucao

| Contexto | Comando | Browser | Modo |
|---|---|---|---|
| Local (full) | `npm run test:e2e:edge` | Edge | Headed |
| Local (smoke) | `npm run test:e2e:smoke` | Edge | Headless |
| Local (smoke debug) | `npm run test:e2e:smoke:headed` | Edge | Headed |
| Local (regression) | `npm run test:e2e:regression` | Edge | Headed |
| CI (pipeline) | `npm run test:e2e:ci` | Edge | Headless |
| CI (smoke) | `npm run test:e2e:smoke:headless` | Edge | Headless |
| CI (regression) | `npm run test:e2e:regression:headless` | Edge | Headless |
