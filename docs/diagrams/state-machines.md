# Máquinas de estado

Estados relevantes para operações administrativas.

---

## Paciente — vínculo com fisioterapeuta

Estado do ponto de vista administrativo (quem é o responsável).

```mermaid
stateDiagram-v2
    [*] --> VinculadoA: Cadastro (app mobile)

    VinculadoA --> VinculadoB: Admin transfere\n(GW005)
    VinculadoB --> VinculadoA: Admin transfere\n(de volta)

    VinculadoA --> Excluido: Admin exclui\n(GW004)
    VinculadoB --> Excluido: Admin exclui\n(GW004)

    Excluido --> [*]

    note right of VinculadoA
        patient.therapist_id = A
        assessments.therapist_id = A
    end note

    note right of VinculadoB
        patient.therapist_id = B
        assessments.therapist_id = B
    end note
```

---

## Fisioterapeuta — conta

```mermaid
stateDiagram-v2
    [*] --> Ativo: Registro RF001

    Ativo --> Admin: Promoção role=ADMIN\n(seed/script)
    Admin --> Ativo: Rebaixamento (raro)

    Ativo --> BloqueadoExclusao: Possui pacientes
    BloqueadoExclusao --> Ativo: Transfere/exclui pacientes

    Ativo --> Removido: Admin exclui\n(GW006, sem pacientes)
    Admin --> Removido: Admin exclui\n(GW006, sem pacientes)

    Removido --> [*]

    note right of BloqueadoExclusao
        RB-05.1 — exclusão bloqueada
    end note
```

---

## Sessão admin (web)

```mermaid
stateDiagram-v2
    [*] --> Anonimo

    Anonimo --> Autenticando: Submit login
    Autenticando --> Anonimo: Credenciais inválidas
    Autenticando --> Anonimo: role !== ADMIN
    Autenticando --> Autenticado: JWT ADMIN válido

    Autenticado --> Anonimo: Logout / token expirado
    Autenticado --> Autenticado: Navegação dashboard

    note right of Autenticado
        Acesso /admin/*
        Timeout RNF002
    end note
```

---

## Avaliação — geração de PDF (perspectiva admin)

```mermaid
stateDiagram-v2
    [*] --> DRAFT: Início avaliação (app)

    DRAFT --> FINALIZED: finalize (app)
    DRAFT --> [*]: Excluído com paciente

    FINALIZED --> PdfDisponivel: Admin ou fisio solicita PDF
    PdfDisponivel --> FINALIZED: Download concluído

    note right of DRAFT
        PDF não disponível
        RB-06.2
    end note

    note right of PdfDisponivel
        Admin: sem checagem ownership
        Fisio: só se therapist_id match
    end note
```

---

## Operação de transferência (transação)

```mermaid
stateDiagram-v2
    [*] --> Idle

    Idle --> Validando: POST transfer
    Validando --> Idle: Erro validação (400)
    Validando --> Executando: OK

    Executando --> Idle: Rollback (erro DB)
    Executando --> Concluida: Commit

    Concluida --> Idle: Resposta 200

    note right of Executando
        UPDATE patient
        UPDATE assessments
        INSERT audit_log
        — tudo ou nada
    end note
```

---

## Referências

- [../domain/business-rules.md](../domain/business-rules.md)
- [activity-flows.md](activity-flows.md)
