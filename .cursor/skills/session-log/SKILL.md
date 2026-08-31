---
name: session-log
description: Saves a structured summary of the Cursor session (date, what was done, deliverables) when the user runs /session. Use when the user invokes /session, session-log, or asks to register/log a session.
disable-model-invocation: true
---

# Session Log — STF Gerenciador Web

Persiste um resumo da sessão atual para consulta futura.

## Base de trabalho

### Rules — aplicar ao registrar

| Rule | Escopo nesta skill |
|------|-------------------|
| `.cursor/rules/lgpd-admin-panel.mdc` | **Obrigatória** — nunca registrar tokens, senhas ou dados clínicos |
| `.cursor/rules/stf-readonly-consumer.mdc` | Mencionar STF como read-only; não listar paths internos sensíveis |
| `.cursor/rules/code-review-clean-code.mdc` | Indireta — resumir entregas de código com qualidade |

### Documentação e artefatos

| Fonte | Uso |
|-------|-----|
| `.cursor/skills/*` | Listar skills criadas/alteradas na sessão |
| `.cursor/rules/*` | Listar rules tocadas |
| `docs/` | Referenciar docs alterados |
| `.cursor/sessions/` | Destino dos logs |

### Skills relacionadas

| Skill | Quando acionar |
|-------|----------------|
| `git-workflow` | Registrar commits, branches e PRs no log |
| Demais skills | Referenciar qual skill guiou o trabalho da sessão |

## Comando de disparo

```
TRIGGER_COMMAND: /session
```

Executar este workflow quando o usuário enviar **`/session`** (comando em `.cursor/commands/session.md`) ou variantes: "session-log", "@session-log registrar".

Delegar ao subagent **`session-log`** (`.cursor/agents/session-log.md`) conforme o comando `/session`.

## O que registrar

| Campo | Conteúdo |
|-------|----------|
| **Data** | ISO 8601 + fuso (ex.: `2026-08-18 17:09 UTC-3`) |
| **Resumo** | O que foi feito na sessão — objetivo, decisões, problemas resolvidos |
| **Entregas** | Arquivos criados/alterados, skills, rules, commits, PRs, branches |
| **Estado final** | O que ficou pronto vs pendente |
| **Contexto** | Links úteis (`docs/...`, skills, issues) |

## Workflow

1. Revisar a conversa inteira (mensagens, tool calls, arquivos tocados)
2. Montar resumo objetivo em **português**
3. Salvar em `.cursor/sessions/` com nome:

```
YYYY-MM-DD-HHmm-<slug-curto>.md
```

Exemplo: `2026-08-18-1709-git-workflow-skill.md`

4. Usar o template em [reference.md](reference.md)
5. Confirmar ao usuário o caminho do arquivo salvo

## Regras

- **Não** incluir secrets, tokens, senhas ou dados clínicos no log
- **Não** duplicar sessão: se já existir arquivo com mesmo slug no mesmo minuto, acrescentar sufixo `-2`
- Slug: kebab-case, 2–4 palavras do tema principal
- Um arquivo **por** disparo do comando (não sobrescrever sessões anteriores)
- Não criar outros `.md` fora de `.cursor/sessions/` neste workflow

## Estrutura de pastas

```
.cursor/sessions/
├── 2026-08-18-1709-exemplo.md
└── ...
```

## Checklist antes de salvar

- [ ] Data/hora corretas
- [ ] Resumo cobre início → fim da sessão
- [ ] Entregas listam paths concretos
- [ ] Pendências explícitas (se houver)
- [ ] Sem dados sensíveis

## Relacionado

- Git/commits: `.cursor/skills/git-workflow/SKILL.md`
- Transcripts Cursor: `agent-transcripts/` (somente leitura)
