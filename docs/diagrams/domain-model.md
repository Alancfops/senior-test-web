# Diagrama de classes (modelo de domínio)

Modelo conceitual estendido para o gerenciador web.

---

## Diagrama de classes UML

```mermaid
classDiagram
    direction TB

    class TherapistRole {
        <<enumeration>>
        THERAPIST
        ADMIN
    }

    class AdminAuditAction {
        <<enumeration>>
        DELETE_PATIENT
        TRANSFER_PATIENT
        DELETE_THERAPIST
        DOWNLOAD_REPORT
    }

    class AssessmentStatus {
        <<enumeration>>
        DRAFT
        FINALIZED
    }

    class Therapist {
        +UUID id
        +String email
        +String fullName
        +String passwordHash
        +TherapistRole role
        +DateTime createdAt
    }

    class Patient {
        +UUID id
        +UUID therapistId
        +String fullName
        +Int age
        +String gender
        +String contact
        +String schoolingBand
        +String avatarUrl
        +DateTime createdAt
    }

    class Assessment {
        +UUID id
        +UUID therapistId
        +UUID patientId
        +String instrumentCode
        +AssessmentStatus status
        +DateTime startedAt
        +DateTime finalizedAt
        +JSON payload
        +String schoolingBandUsed
    }

    class AssessmentResult {
        +UUID assessmentId
        +Decimal rawValue
        +String rawLabel
        +String classificationLabel
        +String classificationCode
        +JSON classificationMeta
        +DateTime computedAt
    }

    class Instrument {
        +String code
        +String displayName
        +String authorsJson
        +Int sortHint
    }

    class AdminAuditLog {
        +UUID id
        +UUID adminId
        +AdminAuditAction action
        +String targetType
        +UUID targetId
        +JSON metadata
        +DateTime createdAt
    }

    class AdminService {
        +listTherapists()
        +getTherapist(id)
        +deleteTherapist(adminId, id)
        +getPatient(id)
        +listPatientAssessments(id, query)
        +deletePatient(adminId, id)
        +transferPatient(adminId, patientId, input)
        +listAuditLogs(query)
    }

    class AdminReportsDelegate {
        +generateAssessmentReportForAdmin(assessmentId)
    }

    Therapist --> TherapistRole : role
    Therapist "1" --> "*" Patient : owns
    Therapist "1" --> "*" Assessment : performs
    Therapist "1" --> "*" AdminAuditLog : auditActions
    Patient "1" --> "*" Assessment : subject
    Instrument "1" --> "*" Assessment : type
    Assessment "1" --> "0..1" AssessmentResult : result
    Assessment --> AssessmentStatus : status
    AdminAuditLog --> AdminAuditAction : action

    AdminService ..> Patient : manages
    AdminService ..> Assessment : updates therapistId
    AdminService ..> Therapist : manages
    AdminReportsDelegate ..> Assessment : reads
    AdminService ..> AdminAuditLog : creates
    AdminReportsDelegate ..> AdminAuditLog : creates
```

---

## DTOs de resposta (admin — conceitual)

```mermaid
classDiagram
    class TherapistListItemDto {
        +UUID id
        +String fullName
        +String email
        +DateTime createdAt
        +Int patientCount
        +Int assessmentCount
    }

    class TherapistDetailDto {
        +UUID id
        +String fullName
        +String email
        +DateTime createdAt
        +PatientSummaryDto[] patients
    }

    class PatientSummaryDto {
        +UUID id
        +String fullName
        +Int age
        +String gender
        +Int assessmentCount
        +DateTime lastAssessmentAt
    }

    class TransferPatientDto {
        +UUID targetTherapistId
    }

    class TransferResultDto {
        +UUID patientId
        +UUID fromTherapistId
        +UUID toTherapistId
        +Int assessmentsUpdated
    }

    TherapistDetailDto *-- PatientSummaryDto
```

---

## Invariantes de domínio

```mermaid
classDiagram
    class Patient {
        +UUID therapistId
    }
    class Assessment {
        +UUID therapistId
        +UUID patientId
    }

    note for Patient "RB-04: após transferência,\ntherapistId = fisio destino"
    note for Assessment "I3: therapistId deve\nmatch Patient.therapistId"
```

---

## Referências

- [../engineering/data-model-extensions.md](../engineering/data-model-extensions.md)
- [senior-test-funcional/docs/engineering/data-model.md](../../../senior-test-funcional/docs/engineering/data-model.md)
