---
name: admin-ui-ux
description: Constrói UI/UX responsiva e acessível (WCAG 2.1 AA) do gerenciador admin STF (Vite + React) com tokens mobile, layouts admin e estados de tela completos. Use ao criar ou revisar componentes, páginas, layout, CSS, responsividade, a11y, modais, tabelas ou quando o usuário mencionar UI, UX, design, WCAG ou telas. Sempre considerar mobile, tablet e desktop.
---

# Admin UI/UX — STF Gerenciador Web

Painel admin web (não mobile). Stack: Vite, React, TS, TanStack Query, RHF + Zod.

## Obrigatório — pensar responsivo em toda tarefa UI

**Em qualquer criação ou alteração de tela/componente**, considerar os **três viewports** antes de concluir — não só desktop e não só “mobile no fim”.

| Viewport | Largura típica | O que validar |
|----------|----------------|---------------|
| **Mobile** | <768px | Nav drawer; meta sob o nome (`TableMobileMeta`); botões full-width; modais bottom sheet |
| **Tablet** | 768–1279px | Sem buraco vazio à direita em tabelas; colunas secundárias ok; sidebar colapsável; nomes longos com clamp |
| **Desktop** | ≥1280px | Sidebar + tabela completa (incl. colunas tertiary/data) |

### Regras práticas (aprendidas no projeto)

1. **Colgroup alinhado às colunas visíveis** — se uma coluna está `hidden` no breakpoint, **não reserve `%` morto** no `<colgroup>` (causa faixa vazia no tablet).
2. **Hierarquia de colunas** — `stf-table-col-secondary` (`md+`), `stf-table-col-tertiary` (`xl+`); no mobile, resumo via `TableMobileMeta`.
3. **Nomes longos** — `TablePrimaryText` / `EllipsisText` com `maxLines` no tablet/desktop; `title` com nome completo.
4. **Layout fluido** — evitar larguras fixas tipo `1200px`; preferir `%`, `min-w-0`, `max-w-*`, flex/grid.
5. **Ações e CTAs** — empilhar no mobile (`flex-col` → `sm:flex-row`); alvos ≥44px no toque.
6. **Modais** — full-width / bottom no mobile; centrado e compacto no desktop.
7. **Teste mental mínimo** antes do “pronto”: “como fica em ~375px, ~768–1024px e ≥1280px?”

Detalhes e breakpoints: [reference.md](reference.md#responsividade-obrigatória).

## Base de trabalho

### Rules — ler e aplicar

| Rule | Escopo nesta skill |
|------|-------------------|
| `docs/rules/stf-design-tokens.md` | **Obrigatória** — cores, CSS variables, paridade mobile |
| `docs/rules/code-review-clean-code.md` | Componentes legíveis, sem debug, estados de tela |
| `docs/rules/lgpd-admin-panel.md` | Modais destrutivos, mínimo de dados na UI, PDF transitório |
| `docs/rules/stf-readonly-consumer.md` | Tokens mobile só leitura em `senior-test-funcional/` |

### Documentação

| Doc | Uso |
|-----|-----|
| `docs/engineering/theming.md` | Mapeamento tokens web |
| `docs/product/features.md` | GW001–GW010, layout por tela |
| `docs/product/PRD.md` | RNF003 confirmações, RNF005 responsividade |
| `docs/contracts/admin-api.md` | Campos exibidos, estados empty/error |

### Skills relacionadas

| Skill | Quando acionar |
|-------|----------------|
| `stf-api-integration` | Dados, loading/error vindos da API |
| `clean-architecture-engineering` | Estrutura pages/components, testes de componente |
| `git-workflow` | Commit/PR de UI (só se o usuário pedir) |

Tokens STF em CSS variables (`--stf-primary`, etc.) — nunca paleta paralela do template.

## Template base UI

Layout e padrões visuais seguem um **template de referência**. Prints em `docs/design/template-screens/` (nome da tela no topo de cada imagem). Ao implementar:

1. Consultar template para estrutura (login, shell, tabelas, modais)
2. Substituir cores/tipografia do template pelos tokens STF
3. Adaptar densidade e navegação ao contexto **admin** (GW001–GW010)
4. Manter estados loading / empty / error e WCAG 2.1 AA mesmo que o template não cubra
5. **Adaptar o template aos 3 breakpoints** — prints costumam ser desktop; tablet/mobile são responsabilidade desta skill

## Princípios UX (admin)

- **Desktop-first** (PRD RNF005), mas **sempre entregar tablet + mobile utilizáveis**
- **Densidade:** linhas ~40–44px; modais compactos; não copiar touch 48px do app
- **Hierarquia:** ações destrutivas (`--stf-error`) sempre com confirmação explícita
- **Estados obrigatórios:** loading, empty, error, success — em toda lista/detalhe
- **Spec:** telas em `docs/product/features.md`; rotas em `docs/contracts/admin-api.md`

## WCAG 2.1 — nível AA (alvo)

Painel admin usado por profissionais — conformidade **WCAG 2.1 Level AA** em telas novas e revisões.

### Perceivable (1.x)

- Contraste **4.5:1** texto normal; **3:1** texto grande (≥18pt / 14pt bold) — tokens `--stf-text` / `--stf-page-bg`
- **Não depender só de cor** para classificação clínica — usar texto/ícone de `classificationMeta` (1.4.1)
- `alt` em avatares; gráficos com título ou `aria-label` (1.1.1)
- Zoom 200% sem perda de conteúdo — layout fluido, não largura fixa (1.4.10)

### Operable (2.x)

- **Teclado:** tab order lógico; modais com focus trap; Esc fecha modal se seguro (2.1.1, 2.1.2)
- **Focus visible** em links, botões, inputs — outline ≥ 2px, cor `--stf-primary` (2.4.7)
- Alvo tocável **≥ 44×44px** em mobile (2.5.5)
- Sem auto-play; timeouts de sessão com aviso se aplicável (2.2.x)

### Understandable (3.x)

- `<label htmlFor>` em todo input; erros RHF ligados via `aria-describedby` / `aria-invalid` (3.3.1, 3.3.2)
- Linguagem clara em confirmações destrutivas — consequência explícita (3.3.4)
- Navegação consistente entre telas admin (3.2.3)

### Robust (4.x)

- HTML semântico: `main`, `nav`, `table`/`thead`/`th`, `button` vs `div` clicável (4.1.1)
- Modais: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` no título
- Anúncios dinâmicos (toast/erro): `role="status"` ou `aria-live="polite"`

Checklist detalhado: [reference.md](reference.md#wcag-21-checklist)

## Workflow

```
- [ ] 1. Ler GW + rules/docs da base acima
- [ ] 2. Consultar template base (quando disponível) ou layout provisório documentado
- [ ] 3. Layout shell + tokens STF
- [ ] 4. Estados loading/empty/error
- [ ] 5. Responsivo desde o desenho: mobile + tablet + desktop (não deixar para o fim)
- [ ] 6. WCAG 2.1 AA (teclado, contraste, labels, modais)
- [ ] 7. Code review (code-review-clean-code)
```

## Responsividade (resumo)

| Breakpoint | Comportamento |
|------------|---------------|
| ≥1280px | Sidebar fixa + tabela completa |
| 768–1279px | Sidebar colapsável; tabela sem colunas tertiary **e** sem espaço morto no colgroup |
| <768px | Nav drawer; leading + meta + ações; modais full-width |

Detalhes: [reference.md](reference.md#responsividade-obrigatória)

## Padrões React

- Componentes funcionais pequenos; hooks para lógica (`useAuth`, `useMediaQuery`)
- Listas: TanStack Query — skeleton no loading, mensagem no empty
- Forms (login, transferir): RHF + Zod; erros inline + a11y
- Modais destrutivos: título claro + consequência + Cancelar / Confirmar + focus trap
- Resumos inline (ex.: relatório): preferir **modal de resumo** + “Ver mais” para a página completa, em vez de navegar só para voltar

```tsx
// ❌ Evitar — layout fixo, cor hardcoded, botão sem nome, só desktop
<div style={{ width: 1200, background: '#6366f1' }}>
  <button onClick={onDelete}><TrashIcon /></button>

// ✅ Preferir — tokens, fluido, a11y, breakpoints
<div className="min-h-screen bg-[var(--stf-page-bg)] max-w-[1400px] mx-auto px-4 md:px-6">
  <button type="button" aria-label="Excluir paciente" onClick={onDelete}>...</button>
```

## Antes de concluir

- [ ] Tokens STF (sem hex soltos)
- [ ] **Responsivo nos 3 breakpoints** (mobile, tablet, desktop) — checklist mental feito
- [ ] Tabelas: colgroup coerente com colunas visíveis (sem faixa vazia no tablet)
- [ ] Loading / empty / error
- [ ] Modais destrutivos com confirmação (LGPD)
- [ ] WCAG 2.1 AA: contraste, teclado, labels, focus, modais
- [ ] Sem `console.log`; code-review ok
- [ ] Não criou `.md` novo sem pedido do usuário
