# Diagrama de contexto do sistema

Posicionamento do gerenciador web no ecossistema Sênior Teste Funcional.

---

## Contexto (C4 — Level 1)

```mermaid
flowchart TB
    ADMIN(("Fisioterapeuta Admin\n(chefe)"))
    FISIO(("Fisioterapeutas\n(equipe)"))
    PACIENTE(("Pacientes idosos\n(titulares LGPD)"))

    subgraph boundary_stf["Ecossistema STF"]
        GW["STF Gerenciador Web"]
        APP["STF App Mobile"]
        API["STF API NestJS"]
        DB[("PostgreSQL")]
    end

    ADMIN -->|"Gerencia equipe e pacientes"| GW
    FISIO -->|"Aplica testes, cadastra pacientes"| APP
    GW -->|"REST HTTPS"| API
    APP -->|"REST HTTPS"| API
    API --> DB
    FISIO -.->|"Insere dados clínicos"| PACIENTE
    ADMIN -.->|"Supervisiona dados"| PACIENTE
```

---

## Fronteiras de responsabilidade

```mermaid
flowchart LR
    subgraph gerenciador["Gerenciador Web — este projeto"]
        G1["Governança de fisios"]
        G2["Transferência / exclusão"]
        G3["Relatórios sem restrição"]
        G4["Audit log admin"]
    end

    subgraph stf_core["STF Core — senior-test-funcional"]
        S1["Auth + JWT"]
        S2["CRUD pacientes (escopo fisio)"]
        S3["Avaliações + scoring"]
        S4["PDF RF013"]
        S5["5 instrumentos clínicos"]
        S6["AdminModule /admin/* ✅"]
    end

    gerenciador -->|"consome /admin/*"| stf_core
```

---

## Comparativo de escopo por canal

```mermaid
flowchart TB
    subgraph mobile_scope["App Mobile — THERAPIST"]
        M1["Meus pacientes"]
        M2["Aplicar testes"]
        M3["Meus PDFs"]
    end

    subgraph web_scope["Gerenciador — ADMIN"]
        W1["Todos os fisios"]
        W2["Todos os pacientes"]
        W3["Transferir / excluir"]
        W4["Qualquer PDF"]
    end

    API["API NestJS\n+ Guards por role"]

    mobile_scope --> API
    web_scope --> API
```

---

## Referências

- [../product/overview.md](../product/overview.md)
- [../contracts/admin-api.md](../contracts/admin-api.md)
