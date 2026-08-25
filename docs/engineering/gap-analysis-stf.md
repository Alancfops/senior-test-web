# Análise de lacunas — STF × Gerenciador

**Data:** 2026-08-18 (revisão)  
**Método:** inspeção read-only de `senior-test-funcional` (código + docs) cruzada com a spec deste repositório.  
**Nenhuma alteração** foi feita no repositório STF.

---

## Resumo executivo (revisão 2026-08-18)

| Categoria | Situação |
|-----------|----------|
| Docs gerenciador (GW, RB, diagramas) | ✅ Completa |
| **API admin no STF** | ✅ **Implementada** (`AdminModule`) |
| Campo `role` / audit log | ✅ Migration + seed |
| Endpoints `/admin/*` | ✅ 11 rotas + extensão auth |
| Testes e2e admin | ✅ `backend/test/admin.e2e-spec.ts` |
| CORS para web | ✅ `CORS_ORIGINS` em `main.ts` |
| Frontend gerenciador | 🟡 Em andamento (Vite + telas provisórias; UI aguarda template base) |

> A análise anterior (mesmo dia) registrava a API como pendente. O STF **já contém** o `AdminModule` completo.

---

## 1. Verificação endpoint a endpoint

Referência: [contracts/admin-api.md](../contracts/admin-api.md)

| # | Rota | GW | STF | Arquivo |
|---|------|-----|-----|---------|
| 1 | `POST /auth/login` (+ `user.role`) | GW001 | ✅ | `auth/auth.service.ts` |
| 2 | `GET /admin/therapists` | GW002 | ✅ | `admin/admin.controller.ts:42` |
| 3 | `GET /admin/therapists/:id` | GW003 | ✅ | `:51` |
| 4 | `DELETE /admin/therapists/:id` | GW006 | ✅ | `:57` |
| 5 | `GET /admin/patients/:id` | GW007 | ✅ | `:67` |
| 6 | `GET /admin/patients/:id/assessments` | GW008 | ✅ | `:73` |
| 7 | `GET /admin/patients/:id/assessments/:aid` | GW007 | ✅ | `:83` |
| 8 | `GET /admin/patients/:id/instruments/:code/timeseries` | GW008 | ✅ | `:92` |
| 9 | `DELETE /admin/patients/:id` | GW004 | ✅ | `:98` |
| 10 | `POST /admin/patients/:id/transfer` | GW005 | ✅ | `:108` |
| 11 | `POST /admin/reports/assessments/:id` | GW009 | ✅ | `:119` |
| 12 | `GET /admin/audit-logs` | GW010 | ✅ | `:139` |

**Cobertura:** 12/12 conforme spec.

---

## 2. Schema e infraestrutura

| Item | STF | Detalhe |
|------|-----|---------|
| `TherapistRole` enum | ✅ | `THERAPIST`, `ADMIN` |
| `Therapist.role` | ✅ | default `THERAPIST` |
| `AdminAuditLog` | ✅ | 4 actions |
| Migration | ✅ | `20260818180000_add_admin_role_and_audit_log` |
| Seed admin | ✅ | `prisma/seed.ts` — `ADMIN_SEED_EMAIL` etc. |
| `AdminGuard` | ✅ | 403 `"Acesso restrito a administradores."` |
| JWT `role` | ✅ | Payload + revalidação no `JwtStrategy` |
| `ReportsService.generateAssessmentReportForAdmin` | ✅ | Sem filtro `therapistId` |
| `AssessmentsService.getTimeseriesForPatient` | ✅ | Usado pelo admin (sem ownership) |
| CORS | ✅ | `CORS_ORIGINS` opcional, split por vírgula |

---

## 3. Regras de negócio — conformidade

| Regra | Implementado | Evidência |
|-------|--------------|-----------|
| RB-05.1 — bloquear delete fisio com pacientes | ✅ | `ConflictException` com contagem |
| RB-05.3 — bloquear único admin | ✅ | `adminCount <= 1` |
| RB-04 — transferência atômica patient + assessments | ✅ | `$transaction` + e2e |
| RB-07 — audit delete/transfer/delete fisio | ✅ | `AdminAuditService` |
| RB-06 — PDF só FINALIZED | ✅ | `generateAssessmentReportForAdmin` |
| RB-01.3 — fisio comum 403 em `/admin/*` | ✅ | e2e |
| Isolamento mobile pós-transferência | ✅ | e2e `GET /patients/:id` → 404 para fisio origem |

---

## 4. Diferenças spec × implementação (menores)

| Tema | Spec original | Implementação STF |
|------|---------------|-------------------|
| Status login | `200` | `201` (POST NestJS) |
| Status transfer | `200` | `201` (POST NestJS) |
| Erro transfer mesmo fisio | genérico `400` | `"O paciente já pertence a este fisioterapeuta."` |
| Erro fisio destino | `404` genérico | `"Fisioterapeuta de destino não encontrado."` |
| Audit PDF | opcional MVP | **Sempre** registra `DOWNLOAD_REPORT` |
| JWT role | confiar no token | **Revalida** `role` no banco (`JwtStrategy`) |
| Histórico assessments | — | Retorna `{ data: [] }` sem paginação |

Nenhuma diferença bloqueia o consumo pelo gerenciador web.

---

## 5. O que o STF **já tinha** (rotas fisio — inalteradas)

| Módulo | Escopo |
|--------|--------|
| `/patients/*` | Só pacientes do fisio logado |
| `/assessments/*` | Avaliações do fisio |
| `/reports/assessments/:id` | PDF com ownership |
| `/auth/*` | Login, registro, RF003 |

Admin **não substitui** estas rotas — convive em paralelo.

---

## 6. O que **falta** (gerenciador web)

| Item | Repo | Prioridade |
|------|------|------------|
| Template base UI (Figma/MCP) | referência externa | Alta — realinhar telas provisórias |
| Telas GW002–GW010 (polish + API real) | gerenciador | Alta |
| `openapi-typescript` codegen | gerenciador | Média |
| `CORS_ORIGINS` com URL do admin em prod | STF `.env` deploy | Antes do go-live |

---

## 7. Dev local — testar admin agora

```bash
# STF
cd ../senior-test-funcional
make migrate          # inclui migration admin
cd backend && npx prisma db seed   # cria admin@clinica.exemplo / Admin1234

# Login admin
curl -s -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@clinica.exemplo","password":"Admin1234"}'

# Listar fisios (usar accessToken)
curl -s http://localhost:3000/admin/therapists \
  -H "Authorization: Bearer <token>"
```

Swagger: http://localhost:3000/api/docs — tag **admin**

---

## 8. Conclusão

| Pergunta | Resposta |
|----------|----------|
| Endpoints admin existem no STF? | **Sim — todos** |
| Spec deste repo está correta? | **Sim**, com ajustes menores de HTTP status |
| Pode iniciar frontend? | **Sim** — API pronta |
| STF precisa de mais código admin? | **Não** para MVP — só CORS em deploy |

**Próximo passo:** conectar template base UI e realinhar telas do gerenciador consumindo `/admin/*`.
