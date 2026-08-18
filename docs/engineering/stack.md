# Stack oficial — STF Gerenciador Web

**Status:** decidido (2026-08)  
**Revisão:** UI kit permanece em aberto; demais camadas fechadas.

---

## Decisões registradas

| Tema | Decisão |
|------|---------|
| Repositório | **Separado** (`stf-gerenciador-web`), com vínculo documentado ao STF |
| Frontend | **Vite + React + TypeScript + React Router** |
| Estado servidor | **TanStack Query v5** |
| Formulários | **React Hook Form + Zod** |
| UI kit | **A definir durante o projeto** — ver [theming.md](theming.md) |
| HTTP | **fetch** ou **ky** + Bearer JWT |
| Tipos da API | **openapi-typescript** (gerado a partir do Swagger STF) |
| Backend | **NestJS existente** em `senior-test-funcional` — `AdminModule` ✅ |
| Banco | **PostgreSQL compartilhado** (mesma instância do STF) |
| Auth — persistência | **sessionStorage** para JWT (sobrevive a F5); ver §3 |
| Deploy | **Mesmo padrão operacional do STF** — ver [deployment.md](deployment.md) |
| Testes | Vitest + React Testing Library; Playwright para fluxos críticos |

---

## Por que Vite e não Next.js

Painel admin autenticado, sem SEO, dados 100% via API REST. SPA com Vite entrega menos complexidade que App Router para ~6 telas. React continua alinhado ao mobile (Expo/RN).

---

## Paridade com o STF mobile

| Peça | Mobile (`senior-test-funcional/frontend`) | Gerenciador web |
|------|-------------------------------------------|-----------------|
| Linguagem | TypeScript | TypeScript |
| UI | React Native | React (DOM) |
| Estado remoto | TanStack Query | TanStack Query |
| Forms | RHF + Zod | RHF + Zod |
| Auth | JWT em secure-store | JWT em sessionStorage |
| Tema | `src/theme/tokens.ts` | Espelhado em CSS/Tailwind — [theming.md](theming.md) |

---

## 3. Sessão e recarga de página

Requisito: **não perder autenticação ao recarregar (F5)**.

| Aspecto | Abordagem |
|---------|-----------|
| Token JWT | Persistir em **`sessionStorage`** após login |
| Sobrevive F5 | Sim (mesma aba) |
| Sobrevive fechar browser | Não — exige novo login (aceitável para admin clínico) |
| Expiração | Alinhada ao `JWT_ACCESS_EXPIRES_IN` da API (atualmente **7d** no `.env.example` STF) |
| Cache de listas | TanStack Query refetch após reload — dados clínicos sempre frescos |
| Logout | Remover token do `sessionStorage` + limpar cache Query |

**Evolução futura (STF):** quando existir refresh token, migrar para cookie `httpOnly` no login web.

**Segurança:** não usar `localStorage` no MVP (menor janela XSS persistente). Se no futuro for necessário sessão entre fechamentos do browser, avaliar refresh + cookie httpOnly — não armazenar JWT de longa duração em `localStorage` com dados clínicos.

---

## 4. Variáveis de ambiente (frontend)

Ver `.env.example` na raiz deste repositório.

| Variável | Descrição |
|----------|-----------|
| `VITE_STF_API_URL` | URL da API STF sem barra final (ex.: `http://localhost:3000`) |
| `VITE_STF_REPO_PATH` | Opcional — não usado no MVP |

---

## 5. O que fica em aberto

| Item | Quando decidir |
|------|----------------|
| UI kit (shadcn, MUI, etc.) | Primeira sprint de UI — após scaffold |
| Biblioteca de gráficos web | Ao implementar GW008 (espelhar RF012) |
| Persistência Query (opcional) | Só se UX exigir; não é requisito |

---

## Referências

- [architecture.md](architecture.md)
- [theming.md](theming.md)
- [repository-link.md](repository-link.md)
- [deployment.md](deployment.md)
- [gap-analysis-stf.md](gap-analysis-stf.md)
