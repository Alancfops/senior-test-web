# Tema e identidade visual

**UI kit:** a definir durante o projeto.  
**Cores e tokens:** alinhados ao app mobile STF (Figma `mtMbhRez2Xy2k414cfzcFm`).

Fonte canônica no STF: [`senior-test-funcional/frontend/src/theme/tokens.ts`](../../senior-test-funcional/frontend/src/theme/tokens.ts)

---

## Princípio

O gerenciador é **administrativo**, não clínico-operacional. Mantém a **mesma paleta** do mobile, adaptada para:

- Mais densidade de informação (tabelas, listas)
- Menos gradientes decorativos; mais superfícies planas
- Hierarquia clara para ações destrutivas (exclusão, transferência)

---

## Paleta (espelho do mobile)

| Token mobile | Hex | Uso no gerenciador |
|--------------|-----|-------------------|
| `primary` | `#3666E0` | Botões primários, links, labels ativos, sidebar accent |
| `primaryDark` | `#2D57C7` | Hover de botão primário |
| `primaryPressed` | `#294FB8` | Active/pressed |
| `secondary` / `accentTeal` | `#7CC5B4` | Badges secundários, indicadores positivos, gráficos |
| `pageBackground` | `#F6F7FC` | Fundo geral da aplicação |
| `background` / `surface` | `#FFFFFF` | Cards, modais, tabelas |
| `text` | `#1F2937` | Texto principal |
| `textMuted` | `#6B7280` | Subtítulos, metadados |
| `placeholder` | `#9CA3AF` | Placeholders |
| `border` | `#D1D5DB` | Bordas de inputs e divisores |
| `error` | `#DC2626` | Erros, botões destrutivos |
| `onPrimary` | `#FFFFFF` | Texto sobre botão primário |
| `cardShadow` | `rgba(15, 23, 42, 0.08)` | Elevação de cards |

### Gradientes (uso restrito no web)

No mobile, gradientes aparecem em headers e splash. No gerenciador:

| Token | Cores | Uso sugerido |
|-------|-------|--------------|
| `headerGradient` | `#3666E0` → `#5C9FC3` → `#7CC5B4` | Opcional: barra superior fina ou login |
| `homeGradient` | `#3260D7` → `#F6F7FC` | Evitar em telas internas — preferir `pageBackground` |

---

## Adaptação web vs mobile

| Aspecto | Mobile | Gerenciador web |
|---------|--------|-----------------|
| Botões | Pill (`radius.pill = 100`) | `radius.md` (12px) ou pill só em CTAs principais |
| Densidade | Touch 48px | Linhas de tabela ~40–44px; modais compactos |
| Navegação | Tab bar + stack | Sidebar ou top nav fixa |
| Tipografia | Escala RN | Equivalente web (ex.: Inter/system — **fonte TBD**) |
| Gráficos RF012 | Victory / gifted-charts | Lib web TBD; cores `primary` + `secondary` |

---

## CSS / Tailwind (quando scaffold existir)

Espelhar tokens em variáveis CSS:

```css
:root {
  --stf-primary: #3666E0;
  --stf-primary-dark: #2D57C7;
  --stf-secondary: #7CC5B4;
  --stf-page-bg: #F6F7FC;
  --stf-surface: #FFFFFF;
  --stf-text: #1F2937;
  --stf-text-muted: #6B7280;
  --stf-border: #D1D5DB;
  --stf-error: #DC2626;
}
```

Qualquer UI kit escolhido deve **mapear** para estas variáveis — não introduzir paleta paralela.

---

## Classificações clínicas (cores)

Resultados de avaliação trazem `classificationMeta` (JSON) da API — cores de semáforo quando existirem. O gerenciador **reutiliza** os metadados da API; não inventa cores de interpretação clínica no front.

---

## Processo de decisão do UI kit

1. Scaffold Vite + tokens CSS acima  
2. Prototipar **dashboard (lista fisios)** com 2 candidatos se necessário  
3. Critérios: tabelas, modais de confirmação, acessibilidade, velocidade de entrega  
4. Registrar escolha neste arquivo quando fechada  

---

## Referências

- [senior-test-funcional/docs/frontend/figma-map.md](../../senior-test-funcional/docs/frontend/figma-map.md)
- [senior-test-funcional/docs/frontend/README.md](../../senior-test-funcional/docs/frontend/README.md)
