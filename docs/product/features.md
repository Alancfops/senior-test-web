# Funcionalidades detalhadas

Referência cruzada com IDs do [PRD.md](PRD.md).  
Contrato HTTP: [../contracts/admin-api.md](../contracts/admin-api.md) — **API implementada no STF**.

---

## GW001 — Autenticação do admin

**Descrição:** Login seguro no painel web com credenciais STF (e-mail + senha) de conta com `role = ADMIN`.

| Aspecto | Detalhe |
|---------|---------|
| Entrada | E-mail, senha |
| Saída | Sessão/JWT com claim `role: ADMIN` |
| Persistência | Token em **`sessionStorage`** — sobrevive recarga (F5) |
| Esqueci senha | Mesmo fluxo **RF003** da API (`/auth/forgot-password` …) |
| Erro | Mensagem genérica em credenciais inválidas |
| Restrição | Conta `THERAPIST` recebe 403 ao tentar acessar rotas admin |

**Fluxo:** ver [sequences.md](../diagrams/sequences.md#gw001-login-admin).

---

## GW002 — Listar fisioterapeutas

**Descrição:** Tela principal com todos os fisioterapeutas cadastrados no sistema.

| Coluna / dado | Origem |
|---------------|--------|
| Nome | `Therapist.fullName` |
| E-mail | `Therapist.email` |
| Data de cadastro | `Therapist.createdAt` |
| Qtd. pacientes | `COUNT(Patient) WHERE therapist_id` |
| Qtd. avaliações finalizadas | agregação em `Assessment` |

**Ações disponíveis na linha:** ver detalhe (GW003), excluir fisio (GW006).

**Filtros (nice-to-have pós-MVP):** busca por nome/e-mail.

---

## GW003 — Detalhe do fisioterapeuta

**Descrição:** Página com dados do fisio selecionado e lista de pacientes vinculados.

| Seção | Conteúdo |
|-------|----------|
| Cabeçalho | Nome, e-mail, data cadastro |
| Pacientes | Tabela: nome, idade, sexo, qtd. avaliações, última avaliação |
| Ações por paciente | Ver perfil (GW007), transferir (GW005), excluir (GW004) |

---

## GW004 — Excluir paciente

**Descrição:** Remoção permanente de paciente e dados associados.

| Regra | Detalhe |
|-------|---------|
| Escopo | Admin pode excluir **qualquer** paciente |
| Efeito cascata | `Assessment` + `AssessmentResult` removidos (`onDelete: Cascade` no schema STF) |
| Confirmação | Modal: exibir nome do paciente + botão destrutivo + confirmação explícita |
| Auditoria | Registrar em `AdminAuditLog`: quem, quando, qual paciente, ação `DELETE_PATIENT` |

**Diagrama:** [activity-flows.md](../diagrams/activity-flows.md#excluir-paciente).

> API: `DELETE /admin/patients/:id` — ver [admin-api.md §5.5](../contracts/admin-api.md#55-delete-adminpatientsid)

---

## GW005 — Transferir paciente entre fisioterapeutas

**Descrição:** Mover paciente (e todo seu histórico clínico) de um fisio para outro.

### O que é transferido

| Entidade | Campo atualizado |
|----------|------------------|
| `Patient` | `therapist_id` → novo fisio |
| `Assessment` (todas do paciente) | `therapist_id` → novo fisio |

> Avaliações mantêm integridade: resultados, payloads e datas permanecem; apenas o vínculo profissional muda.

### Regras

- Origem e destino devem ser fisios distintos
- Destino deve existir e estar ativo (não excluído)
- Operação **atômica** (transação Prisma)
- Confirmação com exibição: paciente, fisio origem → fisio destino
- Audit log: `TRANSFER_PATIENT` com IDs origem/destino

**Diagrama:** [sequences.md](../diagrams/sequences.md#gw005-transferir-paciente).

> API: `POST /admin/patients/:id/transfer` — ver [admin-api.md §5.6](../contracts/admin-api.md#56-post-adminpatientsidtransfer)

---

## GW006 — Excluir fisioterapeuta

**Descrição:** Remoção de conta de fisioterapeuta.

### Políticas possíveis (decisão em [business-rules.md](../domain/business-rules.md))

| Política | Comportamento |
|----------|---------------|
| **A — Bloquear se houver pacientes** | Admin deve transferir ou excluir pacientes antes |
| **B — Cascade total** | Exclui fisio + todos os pacientes + avaliações |

**Recomendação MVP:** Política **A** (mais segura clinicamente).

| Regra | Detalhe |
|-------|---------|
| Admin não pode excluir a si mesmo se for o único admin | Validação no backend |
| Confirmação | Modal destrutivo |
| Auditoria | `DELETE_THERAPIST` |

---

## GW007 — Ver dados de qualquer paciente

**Descrição:** Perfil completo do paciente, independente do fisio dono.

| Dado | Fonte STF |
|------|-----------|
| Cadastro | `Patient` (nome, idade, sexo, contato, escolaridade, foto) |
| Fisioterapeuta responsável | `Therapist` via `therapist_id` |
| Histórico | `Assessment` finalizadas, ordenadas por data |

Equivalente ao RF006 do app, **sem** filtro de ownership para admin.

---

## GW008 — Histórico e evolução

**Descrição:** Lista de avaliações por instrumento; link para detalhe e gráfico quando aplicável (≥ 2 do mesmo instrumento — regra RF012).

| Endpoint admin (STF) | Equivalente fisio |
|--------------------|-------------------|
| `GET /admin/patients/:id/assessments` | `GET /patients/:id/assessments` |
| `GET /admin/patients/:id/assessments/:aid` | `GET /patients/:id/assessments/:aid` |
| `GET /admin/patients/:id/instruments/:code/timeseries` | `GET /patients/:id/instruments/:code/timeseries` |

Reutiliza lógica de serviço; remove filtro `therapist_id` do token.

---

## GW009 — Relatórios PDF (sem restrição)

**Descrição:** Admin gera/baixa PDF de qualquer avaliação **finalizada**.

| Aspecto | App mobile | Gerenciador admin |
|---------|------------|-------------------|
| Ownership | Só se `assessment.therapist_id = token.sub` | **Ignora** ownership |
| Rota | `POST /reports/assessments/:id` | `POST /admin/reports/assessments/:id` ✅ |
| Conteúdo PDF | RF013 | Idêntico — sem alteração de layout |

> A “restrição da plataforma” removida é exclusivamente a de **propriedade por fisio**; regras clínicas do PDF (instrumento, gráfico ≥ 2 pontos) permanecem.

---

## GW010 — Trilha de auditoria

**Descrição:** Registro de ações administrativas sensíveis.

| Campo | Tipo |
|-------|------|
| `id` | UUID |
| `admin_id` | FK → Therapist |
| `action` | enum: `DELETE_PATIENT`, `TRANSFER_PATIENT`, `DELETE_THERAPIST`, `DOWNLOAD_REPORT` |
| `target_type` | `Patient` \| `Therapist` \| `Assessment` |
| `target_id` | UUID |
| `metadata` | JSON (ex.: `{ fromTherapistId, toTherapistId }`) |
| `created_at` | timestamp |

Retenção e acesso ao log: conforme política LGPD do controlador.

**Consulta (API):** `GET /admin/audit-logs` — implementado (GW010). UI de consulta no gerenciador web: pendente.

---

## Mapa de telas (preliminar)

```
/login
/dashboard                    → GW002 lista de fisios
/therapists/:id               → GW003 detalhe + pacientes
/patients/:id                 → GW007 perfil + GW008 histórico
/patients/:id/assessment/:aid → detalhe avaliação + GW009 PDF
```

Modais: GW004 excluir paciente, GW005 transferir, GW006 excluir fisio.

**Opcional pós-MVP:** tela `/audit-logs` (GW010) — API já disponível.
