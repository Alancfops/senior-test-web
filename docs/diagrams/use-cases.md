# Diagrama de casos de uso

Atores e casos de uso do gerenciador web.

---

## Atores

| Ator | Descrição |
|------|-----------|
| **Admin (Fisioterapeuta Chefe)** | Usuário primário do gerenciador |
| **Sistema STF (API)** | Ator secundário — executa persistência e PDF |
| **Fisioterapeuta Comum** | Ator externo — interage via app, afetado por transferências |

---

## Diagrama principal

```mermaid
flowchart TB
    ADMIN((Admin))

    subgraph gerenciador["STF Gerenciador Web"]
        UC01["UC01 — Autenticar"]
        UC02["UC02 — Listar fisioterapeutas"]
        UC03["UC03 — Ver detalhe fisioterapeuta"]
        UC04["UC04 — Excluir fisioterapeuta"]
        UC05["UC05 — Ver paciente"]
        UC06["UC06 — Excluir paciente"]
        UC07["UC07 — Transferir paciente"]
        UC08["UC08 — Ver histórico avaliações"]
        UC09["UC09 — Baixar relatório PDF"]
        UC10["UC10 — Consultar audit log"]
    end

    API((API STF))

    ADMIN --> UC01
    ADMIN --> UC02
    ADMIN --> UC03
    ADMIN --> UC04
    ADMIN --> UC05
    ADMIN --> UC06
    ADMIN --> UC07
    ADMIN --> UC08
    ADMIN --> UC09
    ADMIN --> UC10

    UC01 -.-> API
    UC02 -.-> API
    UC03 -.-> API
    UC04 -.-> API
    UC05 -.-> API
    UC06 -.-> API
    UC07 -.-> API
    UC08 -.-> API
    UC09 -.-> API
    UC10 -.-> API
```

---

## Mapa UC → GW (requisitos)

| UC | GW | Nome |
|----|-----|------|
| UC01 | GW001 | Autenticar admin |
| UC02 | GW002 | Listar fisioterapeutas |
| UC03 | GW003 | Ver detalhe fisioterapeuta |
| UC04 | GW006 | Excluir fisioterapeuta |
| UC05 | GW007 | Ver paciente |
| UC06 | GW004 | Excluir paciente |
| UC07 | GW005 | Transferir paciente |
| UC08 | GW008 | Ver histórico |
| UC09 | GW009 | Baixar PDF |
| UC10 | GW010 | Audit log |

---

## UC07 — Transferir paciente (detalhe)

```mermaid
flowchart LR
    ADMIN((Admin))
    UC07["UC07 Transferir paciente"]
    PRE["Pré-condição:\nfisios origem e destino existem"]
    POS["Pós-condição:\npatient.therapist_id = destino\nassessments atualizadas"]

    ADMIN --> UC07
    UC07 --> PRE
    UC07 --> POS
```

**Fluxo principal:**
1. Admin seleciona paciente na lista do fisio origem
2. Escolhe fisio destino
3. Confirma transferência
4. Sistema atualiza banco em transação
5. Sistema registra audit log

**Fluxo alternativo — mesma origem/destino:** sistema exibe erro, cancela operação.

---

## UC04 — Excluir fisioterapeuta (detalhe)

```mermaid
flowchart TB
    START([Admin solicita exclusão])
    CHECK{Tem pacientes\nvinculados?}
    BLOCK[Exibir erro RB-05.1\nOperação bloqueada]
    CONFIRM{Admin confirma?}
    DELETE[Excluir conta + audit log]
    END([Fim])

    START --> CHECK
    CHECK -->|Sim| BLOCK --> END
    CHECK -->|Não| CONFIRM
    CONFIRM -->|Não| END
    CONFIRM -->|Sim| DELETE --> END
```

---

## O que o admin **não** faz (fora dos casos de uso)

| Ação | Canal correto |
|------|---------------|
| Aplicar teste clínico | App mobile |
| Cadastrar paciente (MVP) | App mobile |
| Editar resultado de avaliação | Fora do escopo |
| Recuperar senha de outro fisio | Fluxo RF003 individual |

---

## Referências

- [../product/features.md](../product/features.md)
- [../domain/business-rules.md](../domain/business-rules.md)
