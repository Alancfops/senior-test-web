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

## Breakpoints sugeridos

```css
/* mobile */   @media (max-width: 767px)
/* tablet */   @media (min-width: 768px) and (max-width: 1279px)
/* desktop */  @media (min-width: 1280px)
```

Tailwind equivalente: `md:` (768px), `lg:` (1024px), `xl:` (1280px).

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

| Tela | GW | Desktop | Mobile |
|------|-----|---------|--------|
| Login | GW001 | card central ~400px | full-width card, padding 16px |
| Dashboard fisios | GW002 | tabela sortável | cards por fisio |
| Detalhe fisio | GW003 | tabela pacientes | lista stacked |
| Perfil paciente | GW007 | 2 colunas info + histórico | abas ou scroll vertical |
| Modais excluir/transferir | GW004–006 | modal ~480px | bottom sheet ou full-screen |

## Tabelas responsivas

1. Priorizar colunas: Nome, Pacientes, Ações
2. Colunas secundárias: `hidden md:table-cell`
3. Overflow: `overflow-x-auto` no wrapper, não no body inteiro
4. Empty: ícone + "Nenhum registro" (`textMuted`)

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
