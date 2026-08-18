# Extensões do modelo de dados

**Status:** ✅ **implementado** no STF — migration `20260818180000_add_admin_role_and_audit_log`  
**Schema:** `senior-test-funcional/backend/prisma/schema.prisma`

Modelo base: [senior-test-funcional/docs/engineering/data-model.md](../../senior-test-funcional/docs/engineering/data-model.md)

---

## 1. Enum `TherapistRole`

```prisma
enum TherapistRole {
  THERAPIST
  ADMIN
}
```

| Valor | Default | Descrição |
|-------|---------|-----------|
| `THERAPIST` | ✅ sim | Fisioterapeuta comum — app mobile |
| `ADMIN` | — | Fisioterapeuta chefe — gerenciador web |

---

## 2. Alteração em `Therapist`

```prisma
model Therapist {
  id           String         @id @default(uuid()) @db.Uuid
  email        String         @unique
  fullName     String         @map("full_name")
  passwordHash String         @map("password_hash")
  role         TherapistRole  @default(THERAPIST)
  createdAt    DateTime       @default(now()) @map("created_at") @db.Timestamptz(6)

  passwordResetTokens PasswordResetToken[]
  patients            Patient[]
  assessments         Assessment[]
  adminAuditLogs      AdminAuditLog[]

  @@map("therapists")
}
```

---

## 3. Nova entidade `AdminAuditLog`

```prisma
enum AdminAuditAction {
  DELETE_PATIENT
  TRANSFER_PATIENT
  DELETE_THERAPIST
  DOWNLOAD_REPORT
}

model AdminAuditLog {
  id         String           @id @default(uuid()) @db.Uuid
  adminId    String           @map("admin_id") @db.Uuid
  action     AdminAuditAction
  targetType String           @map("target_type")   // Patient | Therapist | Assessment
  targetId   String           @map("target_id") @db.Uuid
  metadata   Json             @default("{}")
  createdAt  DateTime         @default(now()) @map("created_at") @db.Timestamptz(6)

  admin Therapist @relation(fields: [adminId], references: [id], onDelete: Restrict)

  @@index([adminId])
  @@index([targetType, targetId])
  @@index([createdAt(sort: Desc)])
  @@map("admin_audit_logs")
}
```

---

## 4. Entidades existentes — sem alteração estrutural

| Entidade | Nota |
|----------|------|
| `Patient` | `therapist_id` atualizado na transferência |
| `Assessment` | `therapist_id` atualizado na transferência |
| `AssessmentResult` | Sem mudança |
| `Instrument` | Sem mudança |
| `PasswordResetToken` | Sem mudança |

---

## 5. Diagrama ER estendido

```mermaid
erDiagram
    THERAPIST ||--o{ PATIENT : owns
    THERAPIST ||--o{ ASSESSMENT : performs
    THERAPIST ||--o{ ADMIN_AUDIT_LOG : performs_action
    PATIENT ||--o{ ASSESSMENT : subject
    INSTRUMENT ||--o{ ASSESSMENT : type
    ASSESSMENT ||--|| ASSESSMENT_RESULT : summarizes

    THERAPIST {
        uuid id PK
        string email UK
        string full_name
        string password_hash
        enum role "THERAPIST|ADMIN"
        timestamptz created_at
    }

    ADMIN_AUDIT_LOG {
        uuid id PK
        uuid admin_id FK
        enum action
        string target_type
        uuid target_id
        jsonb metadata
        timestamptz created_at
    }

    PATIENT {
        uuid id PK
        uuid therapist_id FK
        string full_name
        smallint age
        string gender
        string contact
        string schooling_band
        string avatar_url
        timestamptz created_at
    }

    ASSESSMENT {
        uuid id PK
        uuid therapist_id FK
        uuid patient_id FK
        string instrument_code FK
        enum status
        timestamptz started_at
        timestamptz finalized_at
        jsonb payload
    }

    ASSESSMENT_RESULT {
        uuid assessment_id PK_FK
        numeric raw_value
        string classification_label
        timestamptz computed_at
    }
```

---

## 6. Transferência — SQL conceitual

```sql
BEGIN;

UPDATE patients
SET therapist_id = :targetTherapistId
WHERE id = :patientId;

UPDATE assessments
SET therapist_id = :targetTherapistId
WHERE patient_id = :patientId;

INSERT INTO admin_audit_logs (admin_id, action, target_type, target_id, metadata)
VALUES (:adminId, 'TRANSFER_PATIENT', 'Patient', :patientId,
        jsonb_build_object(
          'fromTherapistId', :sourceTherapistId,
          'toTherapistId', :targetTherapistId
        ));

COMMIT;
```

Implementação real via `prisma.$transaction`.

---

## 7. Seed do admin inicial

```typescript
// prisma/seed.ts (conceitual)
await prisma.therapist.upsert({
  where: { email: 'admin@clinica.exemplo' },
  update: { role: 'ADMIN' },
  create: {
    email: 'admin@clinica.exemplo',
    fullName: 'Coordenador Clínico',
    passwordHash: await hashPassword('...'),
    role: 'ADMIN',
  },
});
```

> Credenciais de seed apenas em ambiente dev; produção via processo seguro.

---

## 8. Migração

| Passo | Status |
|-------|--------|
| 1 | Migration add `role` com default `THERAPIST` | ✅ |
| 2 | Migration create `admin_audit_logs` | ✅ |
| 3 | Seed admin (`prisma/seed.ts`) | ✅ |
| 4 | Deploy API antes do gerenciador web | ✅ recomendado |

---

## Invariantes

| # | Invariante |
|---|------------|
| I1 | Todo paciente tem exatamente um `therapist_id` |
| I2 | Após transferência, todas as avaliações do paciente compartilham o mesmo `therapist_id` |
| I3 | `Assessment.therapist_id` deve ser consistente com `Patient.therapist_id` |
| I4 | Pelo menos um `ADMIN` deve existir em produção |

Validação I3 pode ser enforced por trigger DB ou check na transferência (MVP: check na service).
