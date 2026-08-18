# Documentação — STF Gerenciador Web

Índice canônico da especificação do **painel administrativo web** do Sênior Teste Funcional.

Conteúdo em **português**; pastas e arquivos em **inglês**.

---

## Contexto

Este projeto **gerencia** o ecossistema descrito em [`senior-test-funcional`](../../senior-test-funcional):

| Camada | Repositório | Documentação |
|--------|-------------|--------------|
| App mobile + API + banco | `senior-test-funcional` | [docs/README.md](../../senior-test-funcional/docs/README.md) |
| Painel admin web | `stf-gerenciador-web` (este) | esta pasta |

**Princípio:** regras clínicas, instrumentos e scoring permanecem no STF; aqui documentamos **governança administrativa** sobre fisioterapeutas e pacientes.

---

## Estrutura

| Pasta | Conteúdo |
|-------|----------|
| [product/](product/) | PRD, visão, personas, funcionalidades |
| [domain/](domain/) | Glossário, regras de negócio |
| [engineering/](engineering/) | Arquitetura, integração, extensões de dados |
| [contracts/](contracts/) | **Especificação HTTP admin** (`/admin/*`) |
| [diagrams/](diagrams/) | Diagramas UML (Mermaid) |

---

## Leitura rápida

| Objetivo | Documento |
|----------|-----------|
| O que é o gerenciador | [product/overview.md](product/overview.md) |
| Requisitos de produto | [product/PRD.md](product/PRD.md) |
| Admin vs fisio comum | [product/personas-and-roles.md](product/personas-and-roles.md) |
| Lista de funcionalidades | [product/features.md](product/features.md) |
| **Endpoints admin (API)** | [contracts/admin-api.md](contracts/admin-api.md) |
| Regras de transferência/exclusão | [domain/business-rules.md](domain/business-rules.md) |
| **Stack oficial** | [engineering/stack.md](engineering/stack.md) |
| Tema / cores (mobile → web) | [engineering/theming.md](engineering/theming.md) |
| Vínculo entre repositórios | [engineering/repository-link.md](engineering/repository-link.md) |
| Deploy | [engineering/deployment.md](engineering/deployment.md) |
| **Lacunas vs STF (revisão)** | [engineering/gap-analysis-stf.md](engineering/gap-analysis-stf.md) |
| Arquitetura | [engineering/architecture.md](engineering/architecture.md) |
| Como se conecta ao STF | [engineering/integration-with-stf.md](engineering/integration-with-stf.md) |
| Extensões no modelo de dados | [engineering/data-model-extensions.md](engineering/data-model-extensions.md) |
| **Diagramas UML** | [diagrams/README.md](diagrams/README.md) |

---

## Referências externas (STF)

| Tema | Documento |
|------|-----------|
| PRD do produto base | [senior-test-funcional/docs/product/PRD.md](../../senior-test-funcional/docs/product/PRD.md) |
| RFs RF001–RF013 | [senior-test-funcional/docs/product/requirements.md](../../senior-test-funcional/docs/product/requirements.md) |
| Arquitetura STF | [senior-test-funcional/docs/engineering/architecture.md](../../senior-test-funcional/docs/engineering/architecture.md) |
| Modelo de dados STF | [senior-test-funcional/docs/engineering/data-model.md](../../senior-test-funcional/docs/engineering/data-model.md) |
| LGPD | [senior-test-funcional/docs/product/privacy-and-lgpd.md](../../senior-test-funcional/docs/product/privacy-and-lgpd.md) |

---

## Manutenção

1. Comportamento administrativo novo → **`product/`** e **`domain/business-rules.md`**
2. Impacto na API ou banco → **`engineering/`** + sincronizar com `senior-test-funcional`
3. Fluxos visuais → **`diagrams/`**
4. Stack tecnológica → [engineering/stack.md](engineering/stack.md) (decidida 2026-08)

**Última revisão documental:** 2026-08-18 — API admin verificada no STF (`AdminModule` implementado).
