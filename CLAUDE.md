# CLAUDE.md — STF Gerenciador Web

Painel administrativo web do **Sênior Teste Funcional (STF)** — SPA Vite + React para o fisioterapeuta **admin** supervisionar fisioterapeutas, pacientes e relatórios clínicos.

Este repositório é **apenas o cliente web**. A API NestJS, o banco PostgreSQL e o app mobile ficam em `../senior-test-funcional`.

---

## Fronteira entre repositórios

| Repositório | Caminho | Papel |
|-------------|---------|-------|
| **STF (mobile + API)** | `../senior-test-funcional` | App Expo, API NestJS, PostgreSQL, domínio clínico |
| **Gerenciador web** | este repo | UI admin, docs GW001–GW010, integração `/admin/*` |

### Regra de ouro

**Não editar, criar, mover ou apagar arquivos em `senior-test-funcional/`** salvo se o usuário **pedir explicitamente** alteração naquele repositório.

- Explorar o STF: **somente leitura** (Read, Grep, curl, Swagger)
- Lacuna na API: informar o usuário — **não** implementar no STF automaticamente
- Rotas admin: **`/admin/*`** e **`/auth/*`** — nunca simular admin com `/patients/*` do fisio comum
- Não duplicar scoring, interpretação clínica ou geração de PDF no browser

Detalhe: `docs/rules/stf-readonly-consumer.md`

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Build | Vite + React + TypeScript + React Router |
| Estado servidor | TanStack Query v5 |
| Formulários | React Hook Form + Zod |
| HTTP | fetch ou ky + Bearer JWT |
| Tipos API | openapi-typescript (Swagger STF) |
| Auth | JWT em **sessionStorage** (nunca localStorage) |
| Testes | Vitest + RTL; Playwright para fluxos críticos |
| Backend | NestJS no STF — `AdminModule` já implementado |

UI segue **template base** (Figma/MCP ou arquivo) adaptado ao admin STF — tokens `--stf-*` prevalecem. Ver `docs/engineering/theming.md`.

---

## Desenvolvimento local

### Pré-requisitos

API STF rodando com CORS liberado para o Vite:

```bash
# Terminal 1 — STF
cd ../senior-test-funcional
make setup          # primeira vez
make start-backend  # ou make start
```

No STF (`backend/.env`): `CORS_ORIGINS=http://localhost:5173`

### Gerenciador (frontend)

```bash
# Terminal 2 — este repo
cp .env.example .env
npm install
npm run dev         # http://localhost:5173
```

| Variável | Valor dev |
|----------|-----------|
| `VITE_STF_API_URL` | `http://localhost:3000` (sem barra final) |

| Check | URL / comando |
|-------|----------------|
| Health API | `curl http://localhost:3000/health` |
| Swagger (tag admin) | http://localhost:3000/api/docs |
| Seed admin (1ª vez) | `cd ../senior-test-funcional/backend && npx prisma db seed` |
| Login admin default | `admin@clinica.exemplo` / `Admin1234` |

### Comandos esperados

```bash
npm run dev          # dev server Vite
npm run build        # build produção
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run test         # Vitest
npx openapi-typescript http://localhost:3000/api/docs-json -o src/api/schema.d.ts
```

**Status atual:** frontend Vite em andamento (telas GW provisórias); UI aguarda template base para realinhamento visual.

Prefixar comandos com `rtk` quando disponível (ex.: `rtk npm run test`).

---

## Arquitetura frontend

```
pages/          → telas GW (composição fina)
features/       → hooks TanStack Query + casos de uso por domínio
components/     → UI reutilizável, sem fetch direto
lib/api/        → cliente HTTP tipado (OpenAPI)
lib/auth/       → sessionStorage, guard de role ADMIN
types/          → tipos gerados + helpers
```

Princípios:

- API STF é fonte da verdade — sem persistir domínio clínico localmente
- TanStack Query para todo dado de servidor
- Toda listagem/detalhe: estados **loading / empty / error**
- Ações destrutivas (excluir, transferir): **confirmação explícita** na UI
- PDF (GW009): download transitório via blob — não persistir em disco/localStorage/indexedDB

Detalhe: `docs/engineering/architecture.md`, skill `clean-architecture-engineering`.

---

## Mapa de funcionalidades (GW)

Contrato HTTP: **`docs/contracts/admin-api.md`** (fonte da verdade).  
Requisitos: **`docs/product/features.md`**.

| GW | Tela / ação | API principal |
|----|-------------|---------------|
| GW001 | `/login` | `POST /auth/login` — bloquear se `role !== ADMIN` |
| GW002 | `/dashboard` | `GET /admin/therapists` |
| GW003 | `/therapists/:id` | `GET /admin/therapists/:id` |
| GW004 | modal excluir paciente | `DELETE /admin/patients/:id` |
| GW005 | modal transferir | `POST /admin/patients/:id/transfer` |
| GW006 | modal excluir fisio | `DELETE /admin/therapists/:id` |
| GW007 | `/patients/:id` | `GET /admin/patients/:id`, assessment detail |
| GW008 | histórico + gráfico | assessments list + timeseries |
| GW009 | download PDF | `POST /admin/reports/assessments/:id` |
| GW010 | `/audit-logs` (opcional) | `GET /admin/audit-logs` |

Antes de implementar qualquer GW: ler a seção correspondente em `features.md` e `admin-api.md`.

---

## LGPD e segurança (obrigatório)

Painel trata **dados pessoais e sensíveis de saúde**. Regra completa: `docs/rules/lgpd-admin-panel.md`.

Resumo para agentes:

- JWT só em `sessionStorage`; logout limpa token + cache TanStack Query
- Bloquear UI se `user.role !== ADMIN` após login
- **Nunca** logar: tokens, senhas, payloads clínicos, PDF em base64, `Assessment.payload`
- Erros HTTP genéricos ao usuário — sem stack trace ou vazamento clínico
- HTTPS em produção; `VITE_STF_API_URL` só com TLS
- Não cachear dados sensíveis além do necessário (evitar persistência Query no MVP)
- `.env` e secrets fora do Git

---

## Design

Tokens STF obrigatórios — **nunca** hex soltos espalhados:

| Token | Hex | Uso |
|-------|-----|-----|
| primary | `#3666E0` | CTAs, links, nav ativa |
| pageBackground | `#F6F7FC` | fundo app |
| surface | `#FFFFFF` | cards, modais, tabelas |
| error | `#DC2626` | ações destrutivas |

Adaptação admin: densidade para tabelas, sidebar/top nav — não copiar UX mobile (bottom tabs, cards enormes).

Detalhe: `docs/rules/stf-design-tokens.md`, skill `admin-ui-ux` (WCAG 2.1 AA).

---

## Regras do projeto (`docs/rules/`)

Regras sempre válidas — importadas abaixo para carregarem em toda sessão:

@docs/rules/stf-readonly-consumer.md
@docs/rules/lgpd-admin-panel.md
@docs/rules/code-review-clean-code.md
@docs/rules/stf-design-tokens.md
@docs/rules/confirm-db-deletes.md

| Arquivo | Conteúdo |
|---------|----------|
| `stf-readonly-consumer.md` | Fronteira STF — não editar sem pedido explícito |
| `lgpd-admin-panel.md` | Dados sensíveis, auth, audit, confirmações |
| `code-review-clean-code.md` | Qualidade, tipos, estados de tela, review antes de commit |
| `stf-design-tokens.md` | Paleta STF, proibições visuais |
| `confirm-db-deletes.md` | Confirmar exclusões no banco antes de executar |

---

## Skills (`.claude/skills/`)

Ler o `SKILL.md` relevante **antes** de implementar:

| Skill | Quando usar |
|-------|-------------|
| `admin-ui-ux` | Componentes, layout, modais, tabelas, responsividade, a11y |
| `stf-api-integration` | Cliente HTTP, auth, hooks Query, GW↔endpoint, PDF blob |
| `clean-architecture-engineering` | Camadas, testes, LGPD, code review |
| `git-workflow` | Branch, commit, PR — **só se o usuário pedir** |
| `session-log` | Comando `/session` — registrar resumo em `.claude/sessions/` |

Cada skill tem `reference.md` com detalhes adicionais.

---

## Subagentes (`.claude/agents/`)

| Agente | Escopo |
|--------|--------|
| `stf-frontend-senior` | Scaffold, páginas, hooks, UI, testes — **este repo** |
| `stf-backend-senior` | AdminModule, Prisma, guards — **só com pedido explícito** no STF |
| `session-log` | Comando `/session` — resumo em `.claude/sessions/` |

Delegar frontend ao `stf-frontend-senior`, backend ao `stf-backend-senior` e registro de sessão ao `session-log`.

---

## Git

**Só commitar, fazer merge ou abrir PR quando o usuário pedir explicitamente.**

| Branch | Uso |
|--------|-----|
| `develop` | Integração — destino de features |
| `feature/*` | Uma branch por funcionalidade |
| `main` | Produção — **nunca merge sem permissão explícita** |

Conventional Commits **em inglês**. PRs para `develop`, não para `main`. Sem boilerplate de IA na descrição.

Detalhe: skill `git-workflow`.

---

## Documentação essencial

| Objetivo | Documento |
|----------|-----------|
| Índice geral | `docs/README.md` |
| PRD gerenciador | `docs/product/PRD.md` |
| Funcionalidades GW | `docs/product/features.md` |
| Regras de negócio | `docs/domain/business-rules.md` |
| Contrato API admin | `docs/contracts/admin-api.md` |
| Integração local | `docs/engineering/integration-with-stf.md` |
| Lacunas vs STF | `docs/engineering/gap-analysis-stf.md` |
| STF (somente leitura) | `../senior-test-funcional/docs/README.md` |

**Não criar arquivos `.md` novos** (incluindo docs) salvo se o usuário pedir.

---

## Workflow recomendado

1. Identificar GW ou escopo da tarefa
2. Ler skill(s) + seção em `admin-api.md` e `features.md`
3. Conferir convenções nos arquivos que serão tocados
4. Implementar diff mínimo e focado — sem refatoração oportunista
5. Aplicar tokens STF, estados de tela e confirmações destrutivas
6. Rodar lint/typecheck nos arquivos alterados
7. Self-review: checklists LGPD + clean code
8. Commit/PR apenas se o usuário solicitar

---

## Checklist antes de concluir / PR

- [ ] Escopo limitado a `stf-gerenciador-web/` (STF intacto salvo pedido explícito)
- [ ] Integração usa `/admin/*` conforme `admin-api.md`
- [ ] Sem `console.log` de debug, secrets ou dados clínicos no diff
- [ ] JWT em sessionStorage; logout limpa cache
- [ ] Telas de exclusão/transferência com confirmação clara
- [ ] Loading / empty / error em listas e detalhes
- [ ] Cores via tokens STF — sem paleta inventada
- [ ] Lint e typecheck ok nos arquivos alterados
- [ ] Comunicação com o usuário em **português** quando ele escrever em português

---

## O que nunca fazer

- Editar `senior-test-funcional/` sem pedido explícito do usuário
- Duplicar scoring, interpretação ou PDF institucional no browser
- Usar `localStorage` para JWT
- Logar tokens, senhas ou payloads clínicos
- Commit, push ou merge em `main` sem autorização
- Inventar endpoints ou campos não documentados no contrato
- Criar documentação `.md` não solicitada
