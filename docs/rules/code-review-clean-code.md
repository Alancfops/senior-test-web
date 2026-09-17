---
description: Code review e clean code — revisar antes de commit (Vite + React + TS)
---

# Code review e clean code

Antes de sugerir commit ou dar tarefa por concluída, revisar o diff como code review.

## Stack deste repo

Vite, React, TypeScript, React Router, TanStack Query, RHF + Zod. API admin no STF (`/admin/*`) — ver `docs/contracts/admin-api.md`.

## Princípios

- **Escopo mínimo:** só o necessário para a tarefa; sem refatoração oportunista.
- **Convenções existentes:** nomings, pastas e padrões já usados no arquivo tocado.
- **Tipos:** preferir tipos da API (OpenAPI) em vez de `any`; validar forms com Zod.
- **Estado:** TanStack Query para servidor; evitar estado global desnecessário.
- **Erros:** tratar loading/empty/error nas telas; mensagens claras ao usuário.

## Segurança e LGPD (admin)

- JWT só em `sessionStorage`; nunca logar token, senha ou dados clínicos.
- Ações destrutivas (excluir/transferir) com confirmação explícita na UI.
- Regra completa: `docs/rules/lgpd-admin-panel.md`.

## Antes do commit

- [ ] Sem `console.log` de debug, TODO soltos ou código comentado morto
- [ ] Sem secrets ou `.env` no diff
- [ ] Lint/typecheck passando nos arquivos alterados
- [ ] Nomes e imports consistentes; componentes pequenos e legíveis
- [ ] Comportamento alinhado à spec em `docs/product/features.md`

## Exemplo

```typescript
// ❌ Evitar
const data: any = await fetch(url).then((r) => r.json());
console.log(data.patients);

// ✅ Preferir
const data = await apiClient.getTherapists(); // tipado via OpenAPI
// erros via interceptor Query ou try/catch com feedback na UI
```
