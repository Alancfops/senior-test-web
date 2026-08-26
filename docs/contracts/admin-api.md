# API Admin — especificação de endpoints

**Status:** ✅ **implementado** em `senior-test-funcional/backend` (`AdminModule`)  
**Verificação:** 2026-08-18 — [../engineering/gap-analysis-stf.md](../engineering/gap-analysis-stf.md)  
**Tag OpenAPI:** `admin`  
**Prefixo:** `/admin`  
**Autenticação:** `Authorization: Bearer <JWT>` — `JwtAuthGuard` + `AdminGuard` (`role === ADMIN`)

---

## 1. Contexto

Implementação em:

```
senior-test-funcional/backend/src/admin/
├── admin.module.ts
├── admin.controller.ts
├── admin.service.ts
├── admin.guard.ts
├── admin-audit.service.ts
└── schemas/admin.schemas.ts
```

Testes e2e: `senior-test-funcional/backend/test/admin.e2e-spec.ts`  
Seed admin (dev): `npm run prisma db seed` — variáveis `ADMIN_SEED_*` em `backend/.env.example`

O gerenciador web (`stf-gerenciador-web`) **consome** estas rotas.

| Documento relacionado | Conteúdo |
|----------------------|----------|
| [../engineering/gap-analysis-stf.md](../engineering/gap-analysis-stf.md) | Lacunas vs código atual |
| [../engineering/data-model-extensions.md](../engineering/data-model-extensions.md) | Schema `role`, `AdminAuditLog` |
| [../product/features.md](../product/features.md) | GW001–GW010 |
| [../domain/business-rules.md](../domain/business-rules.md) | RB-01 a RB-09 |

---

## 2. Pré-requisitos (implementados no STF)

### 2.1 Schema Prisma

```prisma
enum TherapistRole {
  THERAPIST
  ADMIN
}

enum AdminAuditAction {
  DELETE_PATIENT
  TRANSFER_PATIENT
  DELETE_THERAPIST
  DOWNLOAD_REPORT
}
```

- `Therapist.role` — default `THERAPIST`
- Tabela `AdminAuditLog` — ver [data-model-extensions.md](../engineering/data-model-extensions.md)

### 2.2 JWT

Payload atual: `{ sub, email }`. **Estender** para:

```json
{
  "sub": "uuid-do-therapist",
  "email": "admin@exemplo.com",
  "role": "ADMIN"
}
```

### 2.3 Guard

```typescript
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/...')
```

| Código HTTP | Quando |
|-------------|--------|
| `401 Unauthorized` | Token ausente, inválido ou expirado |
| `403 Forbidden` | Token válido mas `role !== ADMIN` — mensagem: `"Acesso restrito a administradores."` |

---

## 3. Endpoints de autenticação (existentes — extensão)

O admin **não** tem rota de login separada. Usa as rotas `/auth/*` já implementadas.

### 3.1 POST `/auth/login`

**GW001** — Login do admin.

**Request**

```json
{
  "email": "admin@clinica.exemplo",
  "password": "Senha1234"
}
```

**Response `201`** — NestJS default para POST (e2e confirma):

```json
{
  "accessToken": "eyJhbG...",
  "user": {
    "fullName": "Coordenador Clínico",
    "email": "admin@clinica.exemplo",
    "role": "ADMIN"
  }
}
```

> O JWT inclui `role`, mas o `JwtStrategy` **revalida** `role` no banco a cada request — alteração de papel reflete sem novo login.

| Campo novo | Tipo | Descrição |
|------------|------|-----------|
| `user.role` | `"ADMIN" \| "THERAPIST"` | Papel do usuário |

**Comportamento no gerenciador web**

- Se `role !== "ADMIN"` após login → exibir erro de acesso; **não** armazenar token para rotas admin
- Se `role === "ADMIN"` → persistir `accessToken` em `sessionStorage`

**Erros**

| Status | Corpo (exemplo) |
|--------|-----------------|
| `401` | `{ "message": "E-mail ou senha inválidos.", "statusCode": 401 }` |

### 3.2 Recuperação de senha (RF003 — sem alteração)

| Método | Rota | Uso |
|--------|------|-----|
| POST | `/auth/forgot-password` | Solicitar código |
| POST | `/auth/verify-reset-code` | Validar código |
| POST | `/auth/reset-password` | Nova senha |

Admin usa o **mesmo fluxo** do app mobile.

---

## 4. Fisioterapeutas

### 4.1 GET `/admin/therapists`

**GW002** — Lista todos os fisioterapeutas.

**Query params (opcionais)**

| Param | Tipo | Default | Descrição |
|-------|------|---------|-----------|
| `search` | string | — | Filtra por nome ou e-mail (case-insensitive) |
| `page` | int | `1` | Página |
| `limit` | int | `25` | Itens por página (máx. 100) |
| `sortBy` | enum | `fullName` | `fullName` \| `email` \| `createdAt` |
| `sortOrder` | enum | `asc` | `asc` \| `desc` |

**Response `200`**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "fullName": "Maria Silva",
      "email": "maria@clinica.exemplo",
      "role": "THERAPIST",
      "createdAt": "2026-03-15T10:00:00.000Z",
      "patientCount": 12,
      "assessmentCount": 48,
      "lastActivityAt": "2026-08-10T14:30:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 25,
    "total": 3,
    "totalPages": 1
  }
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `patientCount` | int | Pacientes com `therapist_id = id` |
| `assessmentCount` | int | Avaliações **somente `FINALIZED`** do fisio (exclui `DRAFT` / rascunhos) |
| `lastActivityAt` | string \| null | ISO 8601 — última avaliação finalizada |

---

### 4.2 GET `/admin/therapists/:id`

**GW003** — Detalhe do fisioterapeuta + pacientes vinculados.

**Path params**

| Param | Tipo |
|-------|------|
| `id` | UUID do fisioterapeuta |

**Response `200`**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "fullName": "Maria Silva",
  "email": "maria@clinica.exemplo",
  "role": "THERAPIST",
  "createdAt": "2026-03-15T10:00:00.000Z",
  "patients": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "fullName": "João Santos",
      "age": 72,
      "gender": "masculino",
      "assessmentCount": 5,
      "lastAssessmentAt": "2026-08-01T09:00:00.000Z"
    }
  ],
  "meta": {
    "patientCount": 1,
    "assessmentCount": 5
  }
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `patients[].assessmentCount` | int | Avaliações **somente `FINALIZED`** do paciente (exclui `DRAFT`) |
| `meta.assessmentCount` | int | Avaliações **somente `FINALIZED`** do fisio (exclui `DRAFT`) |
| `meta.patientCount` | int | Pacientes vinculados ao fisio |

**Erros**

| Status | Quando |
|--------|--------|
| `404` | Fisioterapeuta não encontrado |

---

### 4.3 DELETE `/admin/therapists/:id`

**GW006** — Exclui conta de fisioterapeuta.

**Regras (RB-05)**

- Bloquear se `patientCount > 0` → `409 Conflict`
- Bloquear se for o **único** admin tentando excluir a si mesmo → `409 Conflict`
- Sucesso → cascade em `PasswordResetToken`; pacientes **não** existem (pré-condição)

**Response `204`** — sem corpo.

**Erros**

| Status | Corpo (exemplo) |
|--------|-----------------|
| `404` | `{ "message": "Fisioterapeuta não encontrado.", "statusCode": 404 }` |
| `409` | `{ "message": "Este fisioterapeuta ainda possui 3 paciente(s). Transfira ou exclua os pacientes antes de remover a conta.", "statusCode": 409 }` |
| `409` | `{ "message": "Não é possível remover o único administrador do sistema.", "statusCode": 409 }` |

**Auditoria:** registrar `DELETE_THERAPIST` em `AdminAuditLog`.

---

## 5. Pacientes

### 5.1 GET `/admin/patients/:id`

**GW007** — Perfil completo do paciente (qualquer fisio).

**Response `200`**

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "fullName": "João Santos",
  "age": 72,
  "gender": "masculino",
  "contact": "(11) 9 8765-4321",
  "schoolingBand": "5_8_anos",
  "avatarUrl": "/uploads/patients/660e8400.../avatar.jpg",
  "createdAt": "2026-04-01T08:00:00.000Z",
  "therapist": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fullName": "Maria Silva",
    "email": "maria@clinica.exemplo"
  }
}
```

> Mesmos campos de `PatientResponse` do STF + objeto `therapist` aninhado.

**Erros**

| Status | Quando |
|--------|--------|
| `404` | Paciente não encontrado |

---

### 5.2 GET `/admin/patients/:id/assessments`

**GW008** — Histórico de avaliações do paciente.

**Governança admin:** a lista retorna **somente** avaliações `FINALIZED`. Rascunhos (`DRAFT`) nunca aparecem neste endpoint.

**Query params (opcionais)**

| Param | Tipo | Descrição |
|-------|------|-----------|
| `status` | `DRAFT` \| `FINALIZED` | Ignorado para listagem admin — filtro efetivo é sempre `FINALIZED` |
| `instrumentCode` | `TUG` \| `KATZ` \| … | Filtrar por instrumento |

**Response `200`**

```json
{
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "patientId": "660e8400-e29b-41d4-a716-446655440001",
      "instrumentCode": "BERG",
      "status": "FINALIZED",
      "startedAt": "2026-07-20T10:00:00.000Z",
      "finalizedAt": "2026-07-20T10:15:00.000Z",
      "therapistId": "550e8400-e29b-41d4-a716-446655440000",
      "therapistName": "Maria Silva",
      "result": {
        "rawValue": 48,
        "rawLabel": "48 pontos",
        "classificationLabel": "Baixo risco de queda",
        "classificationCode": "LOW_FALL_RISK",
        "classificationMeta": {},
        "computedAt": "2026-07-20T10:15:00.000Z"
      }
    }
  ]
}
```

> Estrutura alinhada a `AssessmentResponse` existente + `therapistId` / `therapistName` para contexto admin. Ordenação: `finalizedAt` desc (apenas `FINALIZED`).

---

### 5.3 GET `/admin/patients/:id/assessments/:assessmentId`

**GW007/GW008** — Detalhe de uma avaliação.

**Response `200`**

Mesmo shape de um item de `GET .../assessments`, incluindo `payload` completo quando `DRAFT` ou `FINALIZED`:

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "patientId": "660e8400-e29b-41d4-a716-446655440001",
  "instrumentCode": "BERG",
  "status": "FINALIZED",
  "startedAt": "2026-07-20T10:00:00.000Z",
  "finalizedAt": "2026-07-20T10:15:00.000Z",
  "payload": {},
  "schoolingBandUsed": null,
  "notesObservation": null,
  "therapistId": "550e8400-e29b-41d4-a716-446655440000",
  "therapistName": "Maria Silva",
  "result": { "...": "..." }
}
```

**Erros**

| Status | Quando |
|--------|--------|
| `404` | Paciente ou avaliação inexistente, ou avaliação não pertence ao paciente |

---

### 5.4 GET `/admin/patients/:id/instruments/:code/timeseries`

**GW008** — Série temporal para gráfico (RF012).

**Path params**

| Param | Valores |
|-------|---------|
| `code` | `TUG`, `KATZ`, `BERG`, `TINETTI`, `MEEM` (case-insensitive; normalizar para MAIÚSCULAS) |

**Response `200`**

```json
{
  "instrumentCode": "BERG",
  "points": [
    {
      "assessmentId": "770e8400-e29b-41d4-a716-446655440002",
      "startedAt": "2026-06-01T10:00:00.000Z",
      "finalizedAt": "2026-06-01T10:15:00.000Z",
      "rawValue": 44,
      "rawLabel": "44 pontos",
      "classificationLabel": "Risco moderado de queda",
      "classificationCode": "MODERATE_FALL_RISK"
    }
  ],
  "canShowChart": true
}
```

> Idêntico a `TimeseriesResponse` do STF — **sem** filtro `therapist_id`.

---

### 5.5 DELETE `/admin/patients/:id`

**GW004** — Exclui paciente e avaliações (cascade Prisma).

**Response `204`** — sem corpo.

**Erros**

| Status | Quando |
|--------|--------|
| `404` | Paciente não encontrado |

**Auditoria:** `DELETE_PATIENT` com `targetId = patientId`.

**Efeito colateral:** remove `Assessment` + `AssessmentResult` em cascade.

---

### 5.6 POST `/admin/patients/:id/transfer`

**GW005** — Transfere paciente (e todas as avaliações) para outro fisioterapeuta.

**Request**

```json
{
  "targetTherapistId": "880e8400-e29b-41d4-a716-446655440003"
}
```

**Validação (Zod)**

| Campo | Regra |
|-------|-------|
| `targetTherapistId` | UUID válido, deve existir, ≠ `patient.therapistId` atual |

**Response `201`** (POST sem `@HttpCode` explícito)

```json
{
  "patientId": "660e8400-e29b-41d4-a716-446655440001",
  "fromTherapistId": "550e8400-e29b-41d4-a716-446655440000",
  "toTherapistId": "880e8400-e29b-41d4-a716-446655440003",
  "assessmentsUpdated": 5
}
```

**Transação (obrigatória)**

```sql
BEGIN;
  UPDATE patients SET therapist_id = :to WHERE id = :patientId;
  UPDATE assessments SET therapist_id = :to WHERE patient_id = :patientId;
  INSERT INTO admin_audit_logs (...);
COMMIT;
```

**Erros**

| Status | Quando |
|--------|--------|
| `400` | Origem = destino — `"O paciente já pertence a este fisioterapeuta."` |
| `404` | Paciente não encontrado |
| `404` | Fisio destino — `"Fisioterapeuta de destino não encontrado."` |

**Auditoria:** `TRANSFER_PATIENT` com metadata `{ fromTherapistId, toTherapistId }`.

---

## 6. Relatórios PDF

### 6.1 POST `/admin/reports/assessments/:assessmentId`

**GW009** — Gera PDF de qualquer avaliação finalizada.

**Comportamento**

- Reutilizar `ReportsService.generateAssessmentReport` **sem** checagem `assessment.therapistId === token.sub`
- Exigir `status === FINALIZED`
- Conteúdo idêntico ao RF013 (mesmo layout do endpoint fisio)

**Response `201`**

| Header | Valor |
|--------|-------|
| `Content-Type` | `application/pdf` |
| `Content-Disposition` | `attachment; filename="..."` |

Corpo: bytes do PDF.

**Erros**

| Status | Quando |
|--------|--------|
| `400` | Avaliação em rascunho |
| `404` | Avaliação não encontrada |

**Auditoria:** `DOWNLOAD_REPORT` em toda geração (admin e fisio). Metadata (sem payload clínico):

| Campo | Descrição |
|-------|-----------|
| `patientId` | UUID do paciente |
| `patientName` | Nome do paciente |
| `instrumentCode` | Instrumento (TUG, BERG, …) |
| `finalizedAt` | Data/hora da avaliação finalizada |

---

## 7. Auditoria

### 7.1 GET `/admin/audit-logs`

**GW010** — Consulta trilha administrativa. ✅ Implementado.

**Query params**

| Param | Tipo | Descrição |
|-------|------|-----------|
| `action` | enum | Filtrar por ação |
| `adminId` | UUID | Filtrar por admin |
| `from` | ISO date | Início do período |
| `to` | ISO date | Fim do período |
| `page` | int | Paginação |
| `limit` | int | Default 25, máx. 100 |

**Response `200`**

```json
{
  "data": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440004",
      "adminId": "aa0e8400-e29b-41d4-a716-446655440005",
      "adminName": "Coordenador Clínico",
      "action": "TRANSFER_PATIENT",
      "targetType": "Patient",
      "targetId": "660e8400-e29b-41d4-a716-446655440001",
      "metadata": {
        "fromTherapistId": "550e8400-e29b-41d4-a716-446655440000",
        "toTherapistId": "880e8400-e29b-41d4-a716-446655440003"
      },
      "createdAt": "2026-08-18T18:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 25, "total": 1, "totalPages": 1 }
}
```

> **Não** incluir payloads clínicos em `metadata` (RB-08.3).

---

## 8. Resumo — tabela de rotas

| # | Método | Rota | GW | STF | Audit |
|---|--------|------|-----|-----|-------|
| 1 | POST | `/auth/login` | GW001 | ✅ `role` no user + JWT | — |
| 2 | GET | `/admin/therapists` | GW002 | ✅ | — |
| 3 | GET | `/admin/therapists/:id` | GW003 | ✅ | — |
| 4 | DELETE | `/admin/therapists/:id` | GW006 | ✅ | ✅ |
| 5 | GET | `/admin/patients/:id` | GW007 | ✅ | — |
| 6 | GET | `/admin/patients/:id/assessments` | GW008 | ✅ | — |
| 7 | GET | `/admin/patients/:id/assessments/:assessmentId` | GW007 | ✅ | — |
| 8 | GET | `/admin/patients/:id/instruments/:code/timeseries` | GW008 | ✅ | — |
| 9 | DELETE | `/admin/patients/:id` | GW004 | ✅ | ✅ |
| 10 | POST | `/admin/patients/:id/transfer` | GW005 | ✅ | ✅ |
| 11 | POST | `/admin/reports/assessments/:assessmentId` | GW009 | ✅ | ✅ |
| 12 | GET | `/admin/audit-logs` | GW010 | ✅ | — |

---

## 9. CORS e configuração

Variável no STF (`backend/.env`):

```env
CORS_ORIGINS=http://localhost:5173,https://admin.seudominio.exemplo
```

Implementado em `backend/src/main.ts` — split por vírgula.

---

## 10. Checklist de implementação (STF)

- [x] Migration: `TherapistRole`, `Therapist.role`, `AdminAuditLog`
- [x] Seed: admin via `prisma/seed.ts` + `ADMIN_SEED_*`
- [x] JWT: `role` no sign e em `AuthResponse.user`
- [x] `AdminGuard` + `@ApiTags('admin')`
- [x] Endpoints §4–§7
- [x] Testes e2e: `test/admin.e2e-spec.ts`
- [x] Regressão: fisio comum isolado após transferência (e2e)
- [x] Swagger: tag `admin`
- [x] CORS: `CORS_ORIGINS` em `main.ts`

---

## 11. Consumo no gerenciador web

Após implementação no STF:

```bash
# Gerar tipos TypeScript a partir do Swagger
npx openapi-typescript http://localhost:3000/api/docs-json -o src/api/schema.d.ts
```

Variável de ambiente: `VITE_STF_API_URL=http://localhost:3000`

Ver [../engineering/repository-link.md](../engineering/repository-link.md).
