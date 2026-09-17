---
description: Paleta e estilo STF mobile adaptados ao gerenciador web — tokens, densidade admin
---

# Design — paleta mobile, contexto admin web

Identidade visual alinhada ao app STF (Figma `mtMbhRez2Xy2k414cfzcFm`). Fonte: `senior-test-funcional/frontend/src/theme/tokens.ts` (somente leitura). Detalhe: `docs/engineering/theming.md`.

## Template base UI

Layout e componentes seguem um **template de referência** (prints em `docs/design/template-screens/` — nome da tela no topo de cada imagem; Figma/MCP quando conectado). Regras de adaptação:

- **Tokens STF prevalecem** sobre cores/tipografia genéricas do template
- **Contexto admin:** sidebar/top nav, tabelas densas, modais compactos — não UX mobile
- **Telas provisórias** (ex.: login atual) serão realinhadas quando o template estiver disponível
- **LGPD:** confirmações destrutivas, mínimo de dados na UI — independente do template

## Tokens obrigatórios (CSS variables)

Centralizar em `:root` ou tema do template — **nunca** hex soltos espalhados:

| Token | Hex | Uso web |
|-------|-----|---------|
| primary | `#3666E0` | CTAs, links, nav ativa |
| primaryDark | `#2D57C7` | hover primário |
| secondary | `#7CC5B4` | badges, gráficos, positivo |
| pageBackground | `#F6F7FC` | fundo app |
| surface | `#FFFFFF` | cards, modais, tabelas |
| text | `#1F2937` | corpo |
| textMuted | `#6B7280` | metadados |
| border | `#D1D5DB` | divisores, inputs |
| error | `#DC2626` | erro, excluir/destrutivo |

## Adaptação mobile → gerenciador

| Mobile | Web admin |
|--------|-----------|
| Pill em tudo | `border-radius: 12px`; pill só em CTA principal |
| Gradientes em headers | Superfícies planas; gradiente **só** login ou top bar fina |
| Touch 48px | Linhas ~40–44px; modais compactos |
| Tab bar | Sidebar ou top nav fixa |

## Proibido

- Paleta nova (roxo genérico, cinza Material default, etc.) sem mapear aos tokens STF
- Inventar cores de classificação clínica — usar `classificationMeta` da API
- Visual “app mobile” (bottom tabs, cards enormes) no painel admin
- Gradientes decorativos em listas/tabelas internas

## Template base (quando disponível)

Configurar componentes do template para **apontar** às variáveis `--stf-*`, não substituir a paleta STF.

```tsx
// ❌ Evitar
<button style={{ background: '#6366f1' }}>

// ✅ Preferir
<button className="bg-[var(--stf-primary)] text-[var(--stf-on-primary,#fff)]">
```

## Checklist UI

- [ ] Cores vêm de tokens STF, não de defaults do kit
- [ ] Ações destrutivas usam `--stf-error` com confirmação visível
- [ ] Fundo `#F6F7FC` + superfícies brancas — consistente com mobile
- [ ] Densidade adequada a tabelas (admin), não telas touch-first
