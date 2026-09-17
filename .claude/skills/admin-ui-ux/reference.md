# Referência UI/UX — admin web

**Template base:** prints em `docs/design/template-screens/` (cada imagem com nome da tela no topo). Tokens STF abaixo **prevalecem** sobre estilos genéricos do template. Detalhe: `docs/engineering/theming.md`.

## Tokens CSS (copiar uma vez no projeto)

```css
:root {
  --stf-primary: #3666E0;
  --stf-primary-dark: #2D57C7;
  --stf-primary-pressed: #294FB8;
  --stf-secondary: #7CC5B4;
  --stf-page-bg: #F6F7FC;
  --stf-surface: #FFFFFF;
  --stf-text: #1F2937;
  --stf-text-muted: #6B7280;
  --stf-border: #D1D5DB;
  --stf-error: #DC2626;
  --stf-radius-md: 12px;
  --stf-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
}
```

## Responsividade obrigatória

**Sempre** validar mobile + tablet + desktop ao tocar UI. Desktop-first não significa “só desktop”.

### Breakpoints

```css
/* mobile */   @media (max-width: 767px)
/* tablet */   @media (min-width: 768px) and (max-width: 1279px)
/* desktop */  @media (min-width: 1280px)
```

Tailwind: `md:` (768), `lg:` (1024), `xl:` (1280).

### Checklist rápido por viewport

| | Mobile | Tablet | Desktop |
|--|--------|--------|---------|
| Nav | drawer | colapsável / ícones | sidebar fixa |
| Tabela | nome + meta + ações | secondary visíveis; **sem faixa vazia** | + tertiary (datas) |
| Colgroup | omitir ou auto | larguras só das cols **visíveis** | % completos |
| Nomes | quebra livre | `maxLines={2}` + `title` | idem |
| CTAs | full-width empilhados | row quando couber | row |
| Modal | bottom / full | centrado | centrado ~480px |

### Anti-padrões (já vistos no gerenciador)

- `<col>` com `width: 16%` para coluna que está `hidden` no tablet → **espaço morto à direita**
- Tabela `table-layout: fixed` + soma de % que não cobre as cols visíveis
- Layout com `width: 1200px` ou cards sem `min-w-0`
- Esquecer tablet e só testar 375px + 1440px

### Tabelas — implementação

1. Priorizar: Nome, Ações (+ contagens no `md`)
2. Secondary: `stf-table-col-secondary` → `hidden md:table-cell`
3. Tertiary (datas): `stf-table-col-tertiary` → `hidden xl:table-cell`
4. `TableColGroup` deve mudar com breakpoint (`useMediaQuery`) — ver `src/components/ui/TableColGroup.tsx`
5. Mobile: `TableMobileMeta` sob o nome; wrapper `overflow-x-hidden` (não scroll de body)
6. Empty: ícone + "Nenhum registro" (`textMuted`)

## Layout shell

```
┌─────────────────────────────────────────┐
│ Top bar (opcional) ou Sidebar │ Content │
│  logo + user                   │ page    │
│  nav links                     │         │
└─────────────────────────────────────────┘
```

- **Desktop:** sidebar ~240px, conteúdo flex
- **Tablet:** sidebar ícones ou hamburger
- **Mobile:** drawer overlay; conteúdo 100% width

## Padrão por tipo de tela

| Tela | GW | Desktop | Tablet | Mobile |
|------|-----|---------|--------|--------|
| Login | GW001 | card central ~400px | card central | full-width, padding 16px |
| Dashboard fisios | GW002 | tabela completa | tabela sem tertiary | cards / leading+meta |
| Detalhe fisio | GW003 | tabela pacientes | sem col data se tertiary | lista stacked |
| Perfil paciente | GW007 | 2–4 colunas info | 2 colunas | 1 coluna |
| Modais excluir/transferir | GW004–006 | ~480px | ~480px | bottom sheet / full |
| Resumo (ex. PDF) | — | modal + “Ver mais” | idem | idem |

## Modais destrutivos

- Título: ação + entidade ("Excluir paciente João Silva?")
- Texto: consequência irreversível
- Primário destrutivo: `--stf-error`
- Secundário: outline com `--stf-border`
- Foco preso no modal; Esc fecha (se não houver submit pendente)

## Gráficos (GW008 / RF012)

- Cores série: `--stf-primary`, `--stf-secondary`
- Mensagem se `canShowChart === false` (API timeseries)
- Altura fixa ~240px; responsivo `width: 100%`
- Pontos focáveis: anel visível no Tab (não só após Enter)

## WCAG 2.1 checklist

Use ao revisar cada tela ou PR de UI.

### Contraste (1.4.3)

| Par | Ratio mínimo |
|-----|--------------|
| `--stf-text` em `--stf-surface` | 4.5:1 |
| `--stf-text-muted` em `--stf-surface` | 4.5:1 |
| `--stf-primary` botão + texto branco | 4.5:1 |
| `--stf-error` ação destrutiva | 4.5:1 |

Ferramentas: DevTools Accessibility, [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).

### Teclado e foco

- [ ] Tab percorre todos os interativos visíveis
- [ ] Ordem de tab segue ordem visual
- [ ] Focus ring visível (não `outline: none` sem substituto)
- [ ] Modal: foco vai ao abrir; trap dentro; retorna ao trigger ao fechar
- [ ] Enter submete form; Esc fecha modal (se não houver submit pendente)

### Formulários (GW001 login, GW005 transfer)

```tsx
<label htmlFor="email">E-mail</label>
<input
  id="email"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && (
  <span id="email-error" role="alert">{errors.email.message}</span>
)}
```

### Tabelas (GW002, GW003)

- `<table>` com `<caption>` ou heading precedente que identifica a lista
- `<th scope="col">` em cabeçalhos
- Ações por linha: botão com texto ou `aria-label` descritivo

### Modais destrutivos (GW004–GW006)

```tsx
<div role="dialog" aria-modal="true" aria-labelledby="delete-title">
  <h2 id="delete-title">Excluir paciente João Silva?</h2>
  <p id="delete-desc">Esta ação é irreversível.</p>
  ...
</div>
```

- Foco inicial no título ou botão Cancelar
- Destructive button não é o default focus

### Gráficos (GW008)

- Título visível ou `aria-label` no container
- Não transmitir resultado **só** por cor da série — legenda textual
- Se `canShowChart === false`, mensagem textual para leitor de tela

### Estados loading / empty / error

- Skeleton: `aria-busy="true"` no container ou `role="status"` + texto "Carregando..."
- Empty: heading + texto — não página em branco
- Error: `role="alert"` na mensagem; botão "Tentar novamente" focável

### Mobile (375px)

- [ ] Alvos ≥ 44×44px
- [ ] Sem scroll horizontal no body
- [ ] Texto legível sem zoom

## Acessibilidade mínima (legado — ver WCAG acima)

- Contraste texto/fundo WCAG AA
- `label` + `htmlFor` em inputs
- Botões com texto ou `aria-label`
- Focus visible nos interativos

## Classificação clínica

Usar cores de `result.classificationMeta` da API — não hardcodar semáforo.

## Checklist responsivo final

- [ ] 1280px: layout admin confortável, sem scroll horizontal desnecessário
- [ ] 768px: nav adaptada; tabelas usáveis
- [ ] 375px: login e modais legíveis; botões tocáveis (min ~44px altura OK em mobile)
- [ ] Estados loading não quebram layout (skeleton mesma grid)
