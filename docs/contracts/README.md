# Contratos HTTP — gerenciador web

Especificações de API consumidas pelo painel admin.

| Contrato | Descrição |
|----------|-----------|
| [admin-api.md](admin-api.md) | **Endpoints `/admin/*`** — spec + status de implementação no STF |
| OpenAPI vivo (STF) | `{VITE_STF_API_URL}/api/docs` — fonte após implementação |

---

## Relação com o STF

| Escopo | Onde está documentado |
|--------|----------------------|
| RFs RF001–RF013 (app mobile) | [senior-test-funcional/docs/contracts/](../../senior-test-funcional/docs/contracts/README.md) |
| Endpoints admin (GW) | [admin-api.md](admin-api.md) neste repo |

O snapshot OpenAPI do STF **inclui** a tag `admin` após `AdminModule` — regenerar tipos no gerenciador quando o front existir.

---

## Manutenção

1. Alterar comportamento admin → atualizar [admin-api.md](admin-api.md) **antes** do PR no STF  
2. Após merge no STF → regenerar tipos no gerenciador web via OpenAPI  
3. Divergência spec × Swagger → spec deste repo prevalece até sincronizar
