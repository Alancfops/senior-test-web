# Session log — template e exemplos

## Template (copiar ao salvar)

```markdown
# Sessão — <título curto>

**Data:** YYYY-MM-DD HH:mm (UTC-3)  
**Projeto:** stf-gerenciador-web

## Resumo

Parágrafo(s) objetivo(s): objetivo da sessão, o que foi discutido e decidido.

## O que foi feito

- Item 1
- Item 2

## Entregas

| Tipo | Path / referência |
|------|-------------------|
| Skill | `.cursor/skills/...` |
| Rule | `.cursor/rules/...` |
| Doc | `docs/...` |
| Código | `src/...` |
| Branch | `feature/...` |
| Commit | `abc1234` — mensagem |
| PR | #N ou URL |

## Estado final

- **Concluído:** ...
- **Pendente:** ...

## Notas (opcional)

Decisões, comandos trigger pendentes, follow-ups.
```

## Exemplo preenchido

```markdown
# Sessão — skills de engenharia e git

**Data:** 2026-08-18 17:01 (UTC-3)  
**Projeto:** stf-gerenciador-web

## Resumo

Criação e refinamento de skills Cursor para padronizar UI, arquitetura, git e registro de sessões. Documentação do projeto permanece como fonte de spec; frontend Vite ainda não iniciado.

## O que foi feito

- Skill `admin-ui-ux` (tokens STF, responsividade)
- Skill `clean-architecture-engineering` (camadas, testes, LGPD)
- Skill `git-workflow` (Conventional Commits, branches main/develop/feature)
- Atualização do fluxo de merge → develop, nunca main sem permissão

## Entregas

| Tipo | Path / referência |
|------|-------------------|
| Skill | `.cursor/skills/admin-ui-ux/SKILL.md` |
| Skill | `.cursor/skills/clean-architecture-engineering/SKILL.md` |
| Skill | `.cursor/skills/git-workflow/SKILL.md` |
| Rule | `.cursor/rules/stf-design-tokens.mdc` |

## Estado final

- **Concluído:** 3 skills + git-workflow com branch strategy
- **Pendente:** scaffold Vite, comando definitivo de session-log

## Notas

Trigger provisório: `/session` (`.cursor/commands/session.md`)
```

## Comando de disparo

Oficial: `/session` — definido em `.cursor/commands/session.md` e `SKILL.md`.

## Slug do filename

| Tema da sessão | Slug |
|----------------|------|
| Login GW001 | `auth-login-scaffold` |
| Várias skills | `cursor-skills-setup` |
| Fix transfer modal | `fix-transfer-modal` |
