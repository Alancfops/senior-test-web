# Visão geral — STF Gerenciador Web

## O que é

O **STF Gerenciador Web** é um painel administrativo web para o **Sênior Teste Funcional (STF)** — plataforma mobile que permite a fisioterapeutas aplicarem instrumentos funcionais geriátricos (TUG, Katz, Berg, Tinetti, MEEM), acompanharem a evolução de pacientes idosos e gerarem relatórios em PDF.

Enquanto o app mobile atende o **fisioterapeuta de linha** (cadastra seus pacientes, aplica testes, consulta histórico), o gerenciador web atende o **fisioterapeuta administrador** — o “chefe” da equipe — que precisa de visão transversal sobre todos os profissionais e pacientes da clínica ou grupo.

---

## Problema que resolve

No STF mobile, cada fisioterapeuta opera em **silos**: só vê e gerencia **seus** pacientes (`therapist_id`). Isso é correto para o dia a dia clínico, mas insuficiente para quem coordena a equipe:

| Necessidade do admin | Limitação do app mobile |
|----------------------|-------------------------|
| Ver todos os fisioterapeutas e suas cargas de pacientes | Só existe visão do usuário logado |
| Redistribuir paciente quando um fisio sai de férias ou da clínica | Não há transferência entre profissionais |
| Excluir paciente ou fisio obsoleto | Cada um só gerencia o próprio escopo |
| Auditar dados de qualquer paciente | Restrito ao dono do paciente |
| Baixar relatório PDF de qualquer avaliação | PDF só para pacientes do fisio logado |

O gerenciador web **quebra o isolamento apenas para o papel admin**, mantendo-o intacto para fisioterapeutas comuns no mobile.

---

## Escopo funcional (resumo)

```
┌─────────────────────────────────────────────────────────────┐
│                  STF Gerenciador Web                        │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │ Fisioterapeu│  │   Pacientes  │  │ Relatórios / PDF    │ │
│  │ tas (lista, │  │ (ver, excluir│  │ (qualquer paciente, │ │
│  │  excluir)   │  │  transferir) │  │  sem restrição)     │ │
│  └─────────────┘  └──────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│           API NestJS + PostgreSQL (senior-test-funcional)   │
│  Auth · Patients · Assessments · Reports · [Admin module]   │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
┌─────────────────────────────────────────────────────────────┐
│              App mobile Expo (fisioterapeutas comuns)       │
└─────────────────────────────────────────────────────────────┘
```

---

## O que **não** é

- **Não** substitui o app mobile para aplicação de testes clínicos
- **Não** recalcula scoring ou interpretação — delega à API STF existente
- **Não** altera protocolos clínicos ou instrumentos (documentados em `senior-test-funcional/docs/clinical-protocols/`)
- **Não** é BI/analytics corporativo (fora do escopo inicial)

---

## Usuários

| Papel | Canal | Escopo de dados |
|-------|-------|-----------------|
| Fisioterapeuta comum | App mobile | Apenas seus pacientes e avaliações |
| Fisioterapeuta admin (chefe) | **Gerenciador web** | Todos os fisioterapeutas, todos os pacientes, todos os relatórios |

---

## Dependências

Este projeto **depende** do monorepo [`senior-test-funcional`](../../senior-test-funcional):

- **API NestJS** — fonte da verdade; gerenciador consome e estende endpoints
- **PostgreSQL** — mesmo banco; extensões de schema para papel admin e auditoria
- **Documentação clínica** — instrumentos, scoring, LGPD

---

## Fase do produto

O STF mobile + API já está em **entrega de produto real** (pós-MVP). O gerenciador web é a **peça que faltava** para administrar os dados gerados no app — listado originalmente como “fora do MVP” no PRD do STF.

| Peça | Status |
|------|--------|
| App mobile + API clínica + AdminModule | ✅ Entregue / em uso |
| Documentação gerenciador | ✅ Completa |
| Frontend gerenciador (Vite) | Em andamento — UI aguarda template base |

---

## Stack e implementação

Decisões registradas em [../engineering/stack.md](../engineering/stack.md):

- Repo separado, API compartilhada no STF  
- Vite + React + TanStack Query  
- **Template base UI** adaptado ao admin; cores via tokens STF (`--stf-*`)  
- Sessão persiste em `sessionStorage` (recarga F5)  
- Deploy alinhado ao padrão STF (PaaS + estático para o web)

Próximo passo: **conectar template base** e realinhar telas — a API admin já está implementada no STF.
