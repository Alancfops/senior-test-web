# Session

Registra um resumo estruturado da sessão atual do projeto **STF Gerenciador Web**.

## Instruções

Delegue ao subagent **`stf-backend-senior`** (`.cursor/agents/stf-backend-senior.md`) e execute o workflow da skill **`session-log`**.

1. Leia `.cursor/skills/session-log/SKILL.md` e o template em `.cursor/skills/session-log/reference.md`
2. Revise a conversa completa desta sessão (mensagens, arquivos tocados, entregas)
3. Monte o resumo em **português** com data, o que foi feito, entregas e pendências
4. Salve em `.cursor/sessions/YYYY-MM-DD-HHmm-<slug-curto>.md`
5. Confirme ao usuário o caminho do arquivo criado

## Regras

- **Não** incluir secrets, tokens JWT, senhas ou dados clínicos no log
- Um arquivo por execução — não sobrescrever sessões anteriores
- Não criar `.md` fora de `.cursor/sessions/`
