# Diagramas de atividade

Fluxos de processo do gerenciador web.

---

## Fluxo geral do admin

```mermaid
flowchart TD
    START([Admin acessa gerenciador])
    LOGIN{Autenticado?}
    FORM[Preencher login]
    AUTH{role = ADMIN?}
    DASH[Dashboard — lista fisios]
    ACTION{Ação?}

    DET[Ver detalhe fisio]
    PAT[Ver paciente]
    TRANS[Transferir paciente]
    DEL_P[Excluir paciente]
    DEL_T[Excluir fisio]
    PDF[Baixar PDF]

    START --> LOGIN
    LOGIN -->|Não| FORM --> AUTH
    LOGIN -->|Sim| DASH
    AUTH -->|Não| FORM
    AUTH -->|Sim| DASH
    DASH --> ACTION
    ACTION --> DET
    ACTION --> PAT
    DET --> PAT
    PAT --> TRANS
    PAT --> DEL_P
    PAT --> PDF
    DET --> DEL_T
    TRANS --> DASH
    DEL_P --> DASH
    DEL_T --> DASH
    PDF --> PAT
```

---

## Excluir paciente

```mermaid
flowchart TD
    START([Admin clica Excluir paciente])
    MODAL[Modal: exibir nome do paciente]
    CONFIRM{Confirma exclusão?}
    API[DELETE /admin/patients/:id]
    TX[Transação DB]
    CASCADE[Remove assessments cascade]
    AUDIT[Registra audit log]
    OK[Toast sucesso]
    CANCEL([Operação cancelada])
    END([Lista atualizada])

    START --> MODAL --> CONFIRM
    CONFIRM -->|Não| CANCEL
    CONFIRM -->|Sim| API --> TX --> CASCADE --> AUDIT --> OK --> END
```

---

## Transferir paciente

```mermaid
flowchart TD
    START([Admin clica Transferir])
    SELECT[Selecionar fisio destino]
    PREVIEW[Preview: origem → destino]
    VALID{Origem ≠ destino?}
    ERR1[Erro: mesmo fisio]
    CONFIRM{Confirma?}
    TX[Transação atômica]
    UP_P[UPDATE patient.therapist_id]
    UP_A[UPDATE assessments.therapist_id]
    LOG[INSERT audit log]
    OK[Sucesso]
    CANCEL([Cancelado])

    START --> SELECT --> PREVIEW --> VALID
    VALID -->|Não| ERR1 --> SELECT
    VALID -->|Sim| CONFIRM
    CONFIRM -->|Não| CANCEL
    CONFIRM -->|Sim| TX --> UP_P --> UP_A --> LOG --> OK
```

---

## Excluir fisioterapeuta

```mermaid
flowchart TD
    START([Admin clica Excluir fisio])
    COUNT{Pacientes\nvinculados > 0?}
    BLOCK["Erro RB-05.1:\nTransfira ou exclua pacientes"]
    MODAL[Modal confirmação destrutiva]
    SELF{Único admin\nexcluindo a si?}
    BLOCK2[Erro: último admin]
    CONFIRM{Confirma?}
    DELETE[DELETE therapist]
    AUDIT[Audit log]
    OK([Fisio removido])
    END1([Fim — bloqueado])
    CANCEL([Cancelado])

    START --> COUNT
    COUNT -->|Sim| BLOCK --> END1
    COUNT -->|Não| MODAL --> SELF
    SELF -->|Sim| BLOCK2 --> END1
    SELF -->|Não| CONFIRM
    CONFIRM -->|Não| CANCEL
    CONFIRM -->|Sim| DELETE --> AUDIT --> OK
```

---

## Baixar relatório PDF

```mermaid
flowchart TD
    START([Admin na avaliação finalizada])
    CLICK[Clica Baixar PDF]
    API[GET /admin/reports/assessments/:id]
    CHECK{status = FINALIZED?}
    ERR[Erro: rascunho não gera PDF]
    GEN[ReportsService.generatePdf]
    CHART{≥ 2 avaliações\nmesmo instrumento?}
    PDF_COM[PDF com gráfico]
    PDF_SEM[PDF sem gráfico + mensagem]
    DL[Download no browser]
    END([Arquivo salvo])

    START --> CLICK --> API --> CHECK
    CHECK -->|Não| ERR
    CHECK -->|Sim| GEN --> CHART
    CHART -->|Sim| PDF_COM --> DL --> END
    CHART -->|Não| PDF_SEM --> DL --> END
```

---

## Decisão de acesso (guard)

```mermaid
flowchart TD
    REQ[Request HTTP]
    JWT{JWT válido?}
    ROLE{role = ADMIN?}
    ROUTE{Rota /admin/*?}
    ALLOW[Prosseguir]
    DENY401[401 Unauthorized]
    DENY403[403 Forbidden]

    REQ --> JWT
    JWT -->|Não| DENY401
    JWT -->|Sim| ROUTE
    ROUTE -->|Sim| ROLE
    ROUTE -->|Não — rota fisio| ALLOW
    ROLE -->|Sim| ALLOW
    ROLE -->|Não| DENY403
```

---

## Referências

- [../domain/business-rules.md](../domain/business-rules.md)
- [sequences.md](sequences.md)
