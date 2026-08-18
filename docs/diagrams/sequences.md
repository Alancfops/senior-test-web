# Diagramas de sequência

Fluxos temporais principais do gerenciador web.

---

## GW001 — Login admin

```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant Web as Gerenciador Web
    participant API as AuthController
    participant Svc as AuthService
    participant DB as PostgreSQL

    Admin->>Web: Informa e-mail e senha
    Web->>API: POST /auth/login
    API->>Svc: validateCredentials(email, password)
    Svc->>DB: SELECT therapist WHERE email
    DB-->>Svc: therapist row
    Svc->>Svc: verify password hash

    alt credenciais inválidas
        Svc-->>API: Unauthorized
        API-->>Web: 401
        Web-->>Admin: Mensagem genérica de erro
    else credenciais válidas, role = THERAPIST
        Svc-->>API: JWT { sub, role: THERAPIST }
        API-->>Web: 201 + token
        Web-->>Admin: 403 / "Acesso restrito a administradores"
    else credenciais válidas, role = ADMIN
        Svc-->>API: JWT { sub, role: ADMIN }
        API-->>Web: 201 + token
        Web->>Web: sessionStorage.setItem(token)
        Web-->>Admin: Redirecionar /dashboard
    end
```

---

## GW002 — Listar fisioterapeutas

```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant Web as Gerenciador Web
    participant Guard as AdminGuard
    participant Ctrl as AdminController
    participant Svc as AdminService
    participant DB as PostgreSQL

    Admin->>Web: Acessa /dashboard
    Web->>Ctrl: GET /admin/therapists + Bearer JWT
    Ctrl->>Guard: canActivate()
    Guard->>Guard: jwt.role === ADMIN?

    alt não admin
        Guard-->>Web: 403 Forbidden
    else admin
        Guard->>Ctrl: OK
        Ctrl->>Svc: listTherapists()
        Svc->>DB: SELECT therapists + COUNT(patients)
        DB-->>Svc: rows
        Svc-->>Ctrl: TherapistListItemDto[]
        Ctrl-->>Web: 200 JSON
        Web-->>Admin: Tabela de fisioterapeutas
    end
```

---

## GW005 — Transferir paciente

```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant Web as Gerenciador Web
    participant Ctrl as AdminController
    participant Svc as AdminService
    participant DB as PostgreSQL

    Admin->>Web: Seleciona paciente, fisio destino, confirma
    Web->>Ctrl: POST /admin/patients/:id/transfer<br/>{ targetTherapistId }
    Ctrl->>Svc: transferPatient(patientId, targetId, adminId)

    Svc->>DB: BEGIN TRANSACTION
    Svc->>DB: SELECT patient FOR UPDATE
    DB-->>Svc: patient (therapistId = origem)

    alt origem === destino
        Svc-->>Ctrl: 400 Bad Request
        Ctrl-->>Web: Erro validação
    else destino não existe
        Svc-->>Ctrl: 404 Not Found
    else OK
        Svc->>DB: UPDATE patients SET therapist_id = destino
        Svc->>DB: UPDATE assessments SET therapist_id = destino<br/>WHERE patient_id = :id
        Svc->>DB: INSERT admin_audit_log (TRANSFER_PATIENT)
        Svc->>DB: COMMIT
        Svc-->>Ctrl: TransferResultDto
        Ctrl-->>Web: 201 Created
        Web-->>Admin: Sucesso + atualiza listas
    end
```

---

## GW004 — Excluir paciente

```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant Web as Gerenciador Web
    participant Ctrl as AdminController
    participant Svc as AdminService
    participant DB as PostgreSQL

    Admin->>Web: Clica excluir + confirma modal
    Web->>Ctrl: DELETE /admin/patients/:id
    Ctrl->>Svc: deletePatient(patientId, adminId)
    Svc->>DB: BEGIN
    Svc->>DB: SELECT patient
    Svc->>DB: DELETE patient (cascade assessments)
    Svc->>DB: INSERT admin_audit_log (DELETE_PATIENT)
    Svc->>DB: COMMIT
    Svc-->>Ctrl: void
    Ctrl-->>Web: 204 No Content
    Web-->>Admin: Remove da lista + toast sucesso
```

---

## GW009 — Baixar PDF (sem restrição de ownership)

```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant Web as Gerenciador Web
    participant Ctrl as AdminReportsController
    participant Rpt as ReportsService
    participant DB as PostgreSQL

    Admin->>Web: Clica "Baixar PDF" na avaliação
    Web->>Ctrl: GET /admin/reports/assessments/:id
    Ctrl->>Rpt: generateForAdmin(assessmentId)

    Rpt->>DB: SELECT assessment + result + patient + therapist
    DB-->>Rpt: data

    alt status !== FINALIZED
        Rpt-->>Ctrl: 400 "Avaliação não finalizada"
    else OK
        Note over Rpt: Sem checagem assessment.therapistId === token.sub
        Rpt->>Rpt: generatePdf() — RF013
        Rpt-->>Ctrl: application/pdf buffer
        Ctrl-->>Web: 200 PDF
        Web-->>Admin: Download arquivo
    end
```

---

## GW006 — Excluir fisioterapeuta (bloqueio com pacientes)

```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant Web as Gerenciador Web
    participant Svc as AdminService
    participant DB as PostgreSQL

    Admin->>Web: Excluir fisio + confirmar
    Web->>Svc: deleteTherapist(id, adminId)
    Svc->>DB: COUNT patients WHERE therapist_id = id
    DB-->>Svc: count = 3

    alt count > 0
        Svc-->>Web: 409 Conflict<br/>"Possui 3 pacientes..."
        Web-->>Admin: Modal erro RB-05.1
    else count = 0
        Svc->>DB: DELETE therapist + audit log
        Svc-->>Web: 204
        Web-->>Admin: Fisio removido da lista
    end
```

---

## Interação pós-transferência — app mobile

```mermaid
sequenceDiagram
    participant Admin as Admin (Web)
    participant API as API
    participant App as App Mobile (Fisio B)
    participant DB as PostgreSQL

    Admin->>API: POST transfer (paciente P → Fisio B)
    API->>DB: UPDATE patient + assessments
    Note over DB: patient.therapist_id = B

    App->>API: GET /patients (Fisio B token)
    API->>DB: WHERE therapist_id = B
    DB-->>API: inclui paciente P
    API-->>App: Lista atualizada

    Note over App: Fisio B agora vê paciente P<br/>Fisio A não vê mais
```

---

## Referências

- [../product/features.md](../product/features.md)
- [activity-flows.md](activity-flows.md)
