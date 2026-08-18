# Diagrama de componentes

Componentes de software do ecossistema com foco no gerenciador.

---

## Componentes — visão completa

```mermaid
flowchart TB
    subgraph client_layer["Camada Cliente"]
        WEB_APP["Gerenciador Web\nVite + React"]
        MOBILE_APP["STF Mobile App\nExpo + React Native"]
    end

    subgraph api_layer["Camada API — NestJS"]
        AUTH_MOD["AuthModule"]
        ADMIN_MOD["AdminModule ✅"]
        PAT_MOD["PatientsModule"]
        ASS_MOD["AssessmentsModule"]
        REP_MOD["ReportsModule"]
        INST_MOD["InstrumentsModule"]

        GUARD_A["AdminGuard"]
        GUARD_T["TherapistOwnershipGuard"]
    end

    subgraph infra["Infraestrutura"]
        PRISMA["Prisma Client"]
        PG[("PostgreSQL")]
        MAIL["Mail Provider"]
        PDF_ENG["PDF Engine"]
    end

    WEB_APP --> AUTH_MOD
    WEB_APP --> ADMIN_MOD
    MOBILE_APP --> AUTH_MOD
    MOBILE_APP --> PAT_MOD
    MOBILE_APP --> ASS_MOD
    MOBILE_APP --> REP_MOD
    MOBILE_APP --> INST_MOD

    ADMIN_MOD --> GUARD_A
    PAT_MOD --> GUARD_T
    ASS_MOD --> GUARD_T
    REP_MOD --> GUARD_T

    ADMIN_MOD --> PRISMA
    PAT_MOD --> PRISMA
    ASS_MOD --> PRISMA
    REP_MOD --> PDF_ENG
    AUTH_MOD --> PRISMA
    AUTH_MOD --> MAIL

    PRISMA --> PG
    ADMIN_MOD --> REP_MOD
```

---

## AdminModule — detalhe interno (STF)

```mermaid
flowchart LR
    subgraph AdminModule
        AC["AdminController\n/admin/*"]
        AS["AdminService"]
        AAS["AdminAuditService"]
        AG["AdminGuard"]
    end

    REP["ReportsService.generateAssessmentReportForAdmin"]
    PRISMA["PrismaService"]

    AC --> AG --> AS --> PRISMA
    AS --> AAS
    AC --> REP
    REP --> AAS
```

---

## Gerenciador Web — componentes front (conceitual)

```mermaid
flowchart TB
    subgraph web_frontend["Gerenciador Web — Vite + React"]
        PAGES["Pages / Routes"]
        LAYOUT["Layout + Nav"]
        AUTH_CTX["Auth Context"]
        API_CLIENT["API Client\n(Bearer JWT)"]
        QUERY["Server State\n(ex.: TanStack Query)"]

        subgraph features
            THER_LIST["TherapistList"]
            THER_DETAIL["TherapistDetail"]
            PAT_PROFILE["PatientProfile"]
            MODAL_DEL["DeleteConfirmModal"]
            MODAL_TRANS["TransferModal"]
            PDF_DL["PdfDownloadButton"]
        end
    end

    PAGES --> LAYOUT
    PAGES --> features
    features --> QUERY --> API_CLIENT
    AUTH_CTX --> API_CLIENT
```

---

## Dependências entre repos

```mermaid
flowchart LR
    GW_REPO["stf-gerenciador-web\n(docs + frontend futuro)"]
    STF_REPO["senior-test-funcional\n(backend + mobile + DB)"]

    GW_REPO -->|"consome API REST"| STF_REPO
    GW_REPO -.->|"documenta extensões"| STF_REPO
    STF_REPO -->|"AdminModule ✅"| STF_REPO
```

---

## Referências

- [../engineering/architecture.md](../engineering/architecture.md)
- [../engineering/integration-with-stf.md](../engineering/integration-with-stf.md)
