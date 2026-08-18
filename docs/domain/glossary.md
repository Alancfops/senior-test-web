# Glossário

Termos do gerenciador web e do ecossistema STF.

| Termo | Definição |
|-------|-----------|
| **STF** | Sênior Teste Funcional — plataforma mobile + API para avaliação funcional geriátrica |
| **Gerenciador Web** | Este projeto — painel admin web |
| **Fisioterapeuta (Fisio)** | Profissional cadastrado em `Therapist`; usuário do app mobile |
| **Admin / Chefe** | Fisioterapeuta com `role = ADMIN`; usuário do gerenciador web |
| **Paciente** | Idoso cadastrado em `Patient`, vinculado a um fisio via `therapist_id` |
| **Instrumento** | Teste funcional padronizado: TUG, Katz, Berg, Tinetti, MEEM |
| **Avaliação (Assessment)** | Sessão de aplicação de um instrumento a um paciente |
| **Resultado (AssessmentResult)** | Pontuação e classificação geradas no `finalize` |
| **Transferência** | Mudança de `therapist_id` em paciente e suas avaliações |
| **Isolamento por fisio** | Regra STF: fisio comum só acessa recursos com seu `therapist_id` |
| **Bypass admin** | Admin ignora isolamento para leitura e operações administrativas |
| **RF** | Requisito funcional do produto base (RF001–RF013) |
| **GW** | Requisito funcional do gerenciador (GW001–GW010) |
| **AdminModule** | Módulo NestJS no STF — rotas `/admin/*` (✅ implementado) |
| **Audit log** | Registro de ações administrativas para rastreabilidade |

---

## Instrumentos (referência STF)

| Código | Nome | Resultado principal |
|--------|------|---------------------|
| `TUG` | Timed Up and Go | Média (s) de 3 ensaios |
| `KATZ` | Índice de Katz | Estrato 0–6 |
| `BERG` | Escala de Berg | Soma 0–56 |
| `TINETTI` | Escala de Tinetti | Soma 0–28 |
| `MEEM` | Mini-Exame do Estado Mental | Soma 0–30 + cortes por escolaridade |

Detalhe clínico: [senior-test-funcional/docs/clinical-protocols/](../../senior-test-funcional/docs/clinical-protocols/)

---

## Entidades principais

| Entidade | Tabela | Descrição |
|----------|--------|-----------|
| Fisioterapeuta | `therapists` | Conta profissional |
| Paciente | `patients` | Titular assistido; FK `therapist_id` |
| Avaliação | `assessments` | Sessão clínica; FK `therapist_id`, `patient_id` |
| Resultado | `assessment_results` | 1:1 com avaliação finalizada |
| Instrumento | `instruments` | Catálogo fixo (5 itens) |
| AdminAuditLog | `admin_audit_logs` | Trilha de ações admin |

Modelo completo: [senior-test-funcional/docs/engineering/data-model.md](../../senior-test-funcional/docs/engineering/data-model.md)
