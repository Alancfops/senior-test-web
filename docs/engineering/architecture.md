# Arquitetura — STF Gerenciador Web

**Status:** stack **decidida** — ver [stack.md](stack.md)  
**Alinhamento:** [senior-test-funcional/docs/engineering/architecture.md](../../senior-test-funcional/docs/engineering/architecture.md)  
**Lacunas API:** [gap-analysis-stf.md](gap-analysis-stf.md)

---

## 1. Princípios

| Princípio | Aplicação |
|-----------|-----------|
| **API STF é fonte da verdade** | Gerenciador não persiste domínio clínico localmente |
| **Extensão, não fork** | Novos módulos/endpoints na API existente |
| **Isolamento preservado no mobile** | Guards `THERAPIST` inalterados para app |
| **Admin explícito** | Role no token; rotas `/admin/*` separadas |
| **Transações para mutações** | Transferência e exclusões atômicas no PostgreSQL |

---

## 2. Visão de alto nível (C4 — Contexto)

```mermaid
flowchart TB
    subgraph usuarios["Usuários"]
        ADMIN["Fisioterapeuta Admin\n(chefe)"]
        FISIO["Fisioterapeutas comuns"]
    end

    subgraph gerenciador["STF Gerenciador Web"]
        WEB["Vite + React SPA"]
    end

    subgraph stf["Sênior Teste Funcional"]
        APP["App Mobile Expo"]
        API["API NestJS"]
        DB[("PostgreSQL")]
    end

    ADMIN -->|"HTTPS"| WEB
    FISIO --> APP
    WEB -->|"REST + JWT ADMIN"| API
    APP -->|"REST + JWT THERAPIST"| API
    API --> DB
```

---

## 3. Visão de containers

```mermaid
flowchart TB
    subgraph client_web["Cliente Web"]
        UI["Interface Admin\n(listas, modais, PDF download)"]
        HTTP["Cliente HTTP\n(Bearer JWT)"]
    end

    subgraph api_nest["API NestJS (STF)"]
        AUTH["AuthModule\n(login, JWT)"]
        ADMIN_MOD["AdminModule\n(novo)"]
        EXISTING["Módulos existentes\npatients, assessments, reports"]
        GUARD_T["TherapistGuard"]
        GUARD_A["AdminGuard"]
    end

    subgraph persist["Persistência"]
        PRISMA["Prisma ORM"]
        PG[("PostgreSQL")]
    end

    UI --> HTTP
    HTTP --> AUTH
    HTTP --> ADMIN_MOD
    HTTP --> EXISTING
    ADMIN_MOD --> GUARD_A
    EXISTING --> GUARD_T
    ADMIN_MOD --> PRISMA
    EXISTING --> PRISMA
    PRISMA --> PG
```

---

## 4. Módulo Admin (STF — ✅ implementado)

Código em `senior-test-funcional/backend/src/admin/`:

| Arquivo | Responsabilidade |
|---------|------------------|
| `admin.controller.ts` | Rotas `/admin/*` (GW002–GW010) |
| `admin.service.ts` | Listagens, transferência, exclusões, audit query |
| `admin.guard.ts` | Bloqueia `role !== ADMIN` |
| `admin-audit.service.ts` | Persiste `AdminAuditLog` |
| `schemas/admin.schemas.ts` | Zod — query/body |

PDF admin: `ReportsService.generateAssessmentReportForAdmin` em `reports/reports.service.ts`.

---

## 5. Autenticação e autorização

```mermaid
sequenceDiagram
    participant W as Gerenciador Web
    participant A as AuthModule
    participant G as AdminGuard
    participant C as AdminController

    W->>A: POST /auth/login { email, password }
    A->>A: Validar credenciais + role
    alt role = ADMIN
        A-->>W: JWT { sub, role: ADMIN }
        W->>G: GET /admin/therapists + Bearer
        G->>G: Verificar role ADMIN
        G->>C: Request autorizado
        C-->>W: 200 lista fisios
    else role = THERAPIST
        A-->>W: JWT { sub, role: THERAPIST }
        W->>G: GET /admin/therapists + Bearer
        G-->>W: 403 Forbidden
    end
```

### Auth admin (implementado)

1. `Therapist.role` — enum `THERAPIST | ADMIN`
2. JWT com `role`; `JwtStrategy` revalida no banco
3. `AdminGuard` em `@Controller('admin')`
4. Login: `POST /auth/login` — front rejeita se `user.role !== ADMIN`

---

## 6. Endpoints admin (STF — ✅)

| Método | Rota | GW | STF |
|--------|------|-----|-----|
| GET | `/admin/therapists` | GW002 | ✅ |
| GET | `/admin/therapists/:id` | GW003 | ✅ |
| DELETE | `/admin/therapists/:id` | GW006 | ✅ |
| GET | `/admin/patients/:id` | GW007 | ✅ |
| GET | `/admin/patients/:id/assessments` | GW008 | ✅ |
| GET | `/admin/patients/:id/assessments/:assessmentId` | GW007 | ✅ |
| GET | `/admin/patients/:id/instruments/:code/timeseries` | GW008 | ✅ |
| DELETE | `/admin/patients/:id` | GW004 | ✅ |
| POST | `/admin/patients/:id/transfer` | GW005 | ✅ |
| POST | `/admin/reports/assessments/:id` | GW009 | ✅ |
| GET | `/admin/audit-logs` | GW010 | ✅ |

OpenAPI: estender Swagger STF com tag `admin`.  
**Spec detalhada:** [../contracts/admin-api.md](../contracts/admin-api.md)

---

## 7. Frontend web

Stack oficial: [stack.md](stack.md) · Tema: [theming.md](theming.md)

| Decisão | Escolha |
|---------|---------|
| Framework | **Vite + React + TypeScript + React Router** |
| Estado servidor | **TanStack Query** |
| Formulários | **React Hook Form + Zod** |
| UI / layout | **Template base** adaptado — tokens STF fixos desde o início |
| Auth client | JWT em **sessionStorage** (persiste após F5) |
| Deploy | Build estático — [deployment.md](deployment.md) |
| Repositório | **Separado** — [repository-link.md](repository-link.md) |

### Telas mínimas

- Login (+ link recuperação senha RF003)
- Dashboard (lista fisios)
- Detalhe fisio
- Perfil paciente + histórico + gráfico (timeseries)
- Modais: excluir, transferir

---

## 8. Segurança

| Medida | Detalhe |
|--------|---------|
| HTTPS | Obrigatório produção |
| CORS | Origem restrita ao domínio do gerenciador |
| Rate limit | Login e endpoints destrutivos |
| CSRF | Se sessão cookie — token CSRF |
| Audit | RB-07 |
| LGPD | RB-08 |

---

## 9. Deploy (conceitual)

```mermaid
flowchart LR
    subgraph prod["Produção"]
        WEB_HOST["Gerenciador Web\n(ex.: admin.stf.exemplo.com)"]
        API_HOST["API STF\n(ex.: api.stf.exemplo.com)"]
        DB[("PostgreSQL")]
    end

    WEB_HOST --> API_HOST --> DB
```

- Gerenciador e API podem compartilhar domínio pai com subdomínios distintos
- Mesmo `DATABASE_URL` — sem réplica de dados

---

## 10. Fases de implementação sugeridas

| Fase | Entregável |
|------|------------|
| **0** | Documentação (este repo) ✅ |
| **1** | Decisão de stack ✅ — [stack.md](stack.md) |
| **2** | Schema: `role` + `AdminAuditLog`; seed admin (STF) ✅ |
| **3** | API: `AdminModule` + guards + transferência (STF) ✅ |
| **4** | Web: template base + polish GW002–GW003 |
| **5** | Web: GW004–GW006 (modais destrutivos) |
| **6** | Web: GW007–GW009 (perfil, histórico, PDF) |
| **7** | Audit log UI (opcional) + hardening |

---

## Referências

- [integration-with-stf.md](integration-with-stf.md)
- [data-model-extensions.md](data-model-extensions.md)
- [../diagrams/](../diagrams/)
