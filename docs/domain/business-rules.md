# Regras de negócio

Regras administrativas do gerenciador web. Complementam (não substituem) os RFs do STF mobile.

---

## RB-01 — Papéis e acesso

| ID | Regra |
|----|-------|
| RB-01.1 | Apenas usuários com `role = ADMIN` acessam o gerenciador web |
| RB-01.2 | JWT de admin contém claim `role`; guards da API validam em toda rota `/admin/*` |
| RB-01.3 | Fisioterapeuta comum (`THERAPIST`) mantém isolamento total no app mobile |
| RB-01.4 | Conta `ADMIN` é **exclusiva do gerenciador web** — não vinculada a conta `THERAPIST` do app mobile (mesmo que a mesma pessoa use ambos) |
| RB-01.5 | Listagens de fisioterapeutas (GW002) exibem apenas `role = THERAPIST`; admin não aparece como membro da equipe clínica |
| RB-01.6 | Um fisio pode ser promovido a admin apenas por operação privilegiada (seed, migration ou endpoint futuro) |

---

## RB-02 — Visualização

| ID | Regra |
|----|-------|
| RB-02.1 | Admin vê **todos** os fisioterapeutas cadastrados |
| RB-02.2 | Admin vê **todos** os pacientes, independente de `therapist_id` |
| RB-02.3 | Admin vê histórico completo de avaliações de qualquer paciente |
| RB-02.4 | Listagens devem indicar claramente qual fisio é responsável pelo paciente |

---

## RB-03 — Exclusão de paciente

| ID | Regra |
|----|-------|
| RB-03.1 | Admin pode excluir qualquer paciente |
| RB-03.2 | Exclusão remove paciente e avaliações em cascade (schema STF) |
| RB-03.3 | Exclusão exige confirmação explícita na UI |
| RB-03.4 | Exclusão gera registro em audit log |
| RB-03.5 | Exclusão é **irreversível** — não há lixeira no MVP |

---

## RB-04 — Transferência de paciente

| ID | Regra |
|----|-------|
| RB-04.1 | Admin transfere paciente de fisio A para fisio B |
| RB-04.2 | Atualizar `Patient.therapist_id` **e** `Assessment.therapist_id` de **todas** as avaliações do paciente |
| RB-04.3 | Origem ≠ destino; ambos devem existir |
| RB-04.4 | Operação em **uma transação** — falha parcial = rollback total |
| RB-04.5 | Rascunhos (`DRAFT`) também transferem |
| RB-04.6 | Após transferência, fisio destino vê paciente no app mobile; fisio origem deixa de ver |
| RB-04.7 | Transferência gera audit log com IDs origem/destino |
| RB-04.8 | Admin confirma visualmente: nome paciente, fisio origem → fisio destino |

### Invariantes pós-transferência

```
Patient.therapist_id = B
∀ Assessment WHERE patient_id = P : Assessment.therapist_id = B
```

---

## RB-05 — Exclusão de fisioterapeuta

| ID | Regra |
|----|-------|
| RB-05.1 | **Política MVP (recomendada):** bloquear exclusão se fisio tiver ≥ 1 paciente |
| RB-05.2 | Admin deve transferir ou excluir pacientes antes de excluir o fisio |
| RB-05.3 | Admin não pode excluir a própria conta se for o único admin da instância |
| RB-05.4 | Exclusão de fisio sem pacientes remove conta e tokens de reset (cascade) |
| RB-05.5 | Exclusão gera audit log |

### Mensagem ao bloquear (RB-05.1)

> "Este fisioterapeuta ainda possui {n} paciente(s). Transfira ou exclua os pacientes antes de remover a conta."

---

## RB-06 — Relatórios PDF

| ID | Regra |
|----|-------|
| RB-06.1 | Admin baixa PDF de qualquer avaliação com `status = FINALIZED` |
| RB-06.2 | Avaliações `DRAFT` não geram PDF |
| RB-06.3 | Conteúdo e layout do PDF seguem RF013 — sem alteração |
| RB-06.4 | Regra de gráfico no PDF (≥ 2 avaliações do mesmo instrumento) permanece |
| RB-06.5 | Download de PDF por admin pode ser registrado em audit log (opcional MVP) |

---

## RB-07 — Auditoria

| ID | Regra |
|----|-------|
| RB-07.1 | Ações `DELETE_PATIENT`, `TRANSFER_PATIENT`, `DELETE_THERAPIST` sempre auditadas |
| RB-07.2 | Log imutável (append-only) |
| RB-07.3 | Log contém: admin_id, action, target, timestamp, metadata JSON |
| RB-07.4 | Retenção definida pelo controlador (LGPD) |

---

## RB-08 — LGPD

| ID | Regra |
|----|-------|
| RB-08.1 | Admin acessa dados sensíveis de saúde por **necessidade de supervisão clínica** — base legal a formalizar com controlador |
| RB-08.2 | Princípio da minimização: admin vê o necessário para governança, não exportações em massa no MVP |
| RB-08.3 | Audit log não deve conter payloads clínicos completos — apenas IDs e metadados |
| RB-08.4 | Transferência não altera titularidade LGPD do paciente (continua sendo o paciente); muda responsável operacional |

Referência: [senior-test-funcional/docs/product/privacy-and-lgpd.md](../../senior-test-funcional/docs/product/privacy-and-lgpd.md)

---

## RB-09 — Concorrência

| ID | Regra |
|----|-------|
| RB-09.1 | Se fisio origem excluir paciente no app enquanto admin transfere, API retorna conflito (409) |
| RB-09.2 | Transferência e exclusão do mesmo paciente são mutuamente exclusivas por lock otimista ou transação |

---

## Decisões pendentes

| # | Tema | Opções |
|---|------|--------|
| D1 | Admin também usa app mobile? | ✅ **Não** — conta ADMIN separada; não associada à conta mobile |
| D2 | Notificar fisio destino na transferência? | E-mail / In-app / Nenhum (MVP) |
| D3 | Política RB-05 alternativa (cascade)? | Manter bloqueio vs cascade total |
| D4 | Cadastro de admin | ✅ Seed via `prisma db seed` (`ADMIN_SEED_*`); fluxo UI fora do MVP |
