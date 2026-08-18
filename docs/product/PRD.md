# PRD — STF Gerenciador Web

**Versão:** 2026-08 (revisão documental — API admin verificada no STF)  
**Produto base:** [Sênior Teste Funcional](../../senior-test-funcional/docs/product/PRD.md)

---

## 1. Resumo executivo

O **STF Gerenciador Web** é um painel administrativo para o fisioterapeuta **chefe** gerenciar fisioterapeutas, pacientes e relatórios do ecossistema Sênior Teste Funcional, com visão transversal e operações que o app mobile não oferece por design (isolamento por profissional).

---

## 2. Problema

Clínicas e grupos com múltiplos fisioterapeutas usando o STF mobile carecem de:

- Visão consolidada de quem está na equipe e quantos pacientes cada um acompanha
- Capacidade de redistribuir pacientes entre profissionais (férias, desligamento, rebalanceamento)
- Exclusão centralizada de registros obsoletos ou incorretos
- Acesso a relatórios e dados de qualquer paciente para supervisão clínica

---

## 3. Objetivos

| # | Objetivo | Métrica de sucesso |
|---|----------|-------------------|
| O1 | Dar ao admin visão completa da equipe e pacientes | Lista de fisios + contagem de pacientes por fisio |
| O2 | Permitir transferência segura de pacientes entre fisios | Paciente + avaliações movidos atomicamente |
| O3 | Centralizar exclusões com confirmação | Zero exclusões acidentais (confirmação obrigatória) |
| O4 | Liberar relatórios PDF sem restrição de propriedade | Admin baixa PDF de qualquer avaliação finalizada |
| O5 | Manter isolamento do app mobile para fisios comuns | Fisio comum continua vendo só seus dados no app |

---

## 4. Personas

Ver [personas-and-roles.md](personas-and-roles.md).

| Persona | Canal | Prioridade |
|---------|-------|------------|
| Fisioterapeuta admin (chefe) | Gerenciador web | **Primária** |
| Fisioterapeuta comum | App mobile (STF) | Secundária (não usa o gerenciador) |

---

## 5. Escopo

### 5.1 Incluído (MVP do gerenciador)

| ID | Capacidade |
|----|------------|
| GW001 | Login do admin no painel web |
| GW002 | Listar fisioterapeutas (nome, e-mail, data cadastro, qtd. pacientes) |
| GW003 | Ver detalhe de fisioterapeuta e pacientes vinculados |
| GW004 | Excluir paciente (com confirmação; cascade de avaliações conforme modelo STF) |
| GW005 | Transferir paciente para outro fisioterapeuta (dados + avaliações) |
| GW006 | Excluir fisioterapeuta (com política de dados — ver regras de negócio) |
| GW007 | Ver perfil/dados de qualquer paciente |
| GW008 | Ver histórico de avaliações de qualquer paciente |
| GW009 | Gerar/baixar PDF de qualquer avaliação finalizada (sem restrição de `therapist_id`) |
| GW010 | Trilha de auditoria mínima para ações destrutivas (exclusão, transferência) |

### 5.2 Fora do escopo (MVP)

- Aplicação de testes clínicos pelo painel web
- Cadastro de novos fisioterapeutas pelo admin (continua via app ou endpoint existente RF001)
- Edição de resultados clínicos ou re-scoring
- Dashboard analítico / BI
- Notificações push ou e-mail ao paciente/fisio sobre transferências
- Multi-clínica / multi-tenant (uma instância = uma equipe/clínica)

---

## 6. Requisitos não funcionais (preliminares)

| RNF | Descrição |
|-----|-----------|
| RNF001 | HTTPS obrigatório em produção |
| RNF002 | Sessão admin com timeout configurável |
| RNF003 | Ações destrutivas exigem confirmação explícita (modal + digitar nome ou checkbox) |
| RNF004 | Conformidade LGPD — ver [senior-test-funcional/docs/product/privacy-and-lgpd.md](../../senior-test-funcional/docs/product/privacy-and-lgpd.md) e extensões em [domain/business-rules.md](../domain/business-rules.md) |
| RNF005 | Responsivo para desktop (primário); tablet aceitável |
| RNF006 | Latência de listagens < 2s para até 100 fisios / 1000 pacientes |

---

## 7. Restrições

- Reutilizar API e banco do STF — **não** duplicar domínio clínico
- Scoring e PDF permanecem no servidor NestJS existente
- Fisioterapeuta comum **não** acessa o gerenciador (somente role admin)

---

## 8. Dependências

| Dependência | Status |
|-------------|--------|
| API STF — `AdminModule`, guards, transferência | ✅ Implementado — [admin-api.md](../contracts/admin-api.md) |
| Schema Prisma — `role`, `AdminAuditLog` | ✅ Migration aplicada no STF |
| RF013 — PDF admin | ✅ `generateAssessmentReportForAdmin` |
| Frontend Vite (este repo) | Pendente |

---

## 9. Riscos

| Risco | Mitigação |
|-------|-----------|
| Exclusão acidental de dados clínicos | Confirmação dupla + audit log |
| Transferência parcial (paciente sem avaliações) | Transação atômica no banco |
| Violação LGPD por acesso amplo do admin | Base legal documentada; minimização; log de acesso |
| Divergência de stack web vs mobile | Stack web decidida — [stack.md](../engineering/stack.md) |

---

## 10. Critérios de aceite (MVP)

### 10.1 Backend (STF) — ✅ atendido

- [x] Admin autenticado acessa `/admin/*` (`AdminGuard`)
- [x] Lista todos os fisioterapeutas (`GET /admin/therapists`)
- [x] Exclui paciente com cascade (`DELETE /admin/patients/:id`)
- [x] Transfere paciente — `Patient` + `Assessment` (`POST .../transfer`)
- [x] Exclui fisio conforme RB-05 (`DELETE /admin/therapists/:id`)
- [x] PDF sem ownership (`POST /admin/reports/assessments/:id`)
- [x] Audit log (`AdminAuditLog` + `GET /admin/audit-logs`)
- [x] Fisio comum 403 em rotas admin; isolamento mobile preservado (e2e)

### 10.2 Frontend (gerenciador web) — pendente

- [ ] Login admin + `sessionStorage` + bloqueio se `role !== ADMIN`
- [ ] Dashboard lista fisios (GW002)
- [ ] Detalhe fisio, perfil paciente, histórico (GW003, GW007, GW008)
- [ ] Modais excluir / transferir (GW004–GW006)
- [ ] Download PDF (GW009)
- [ ] UI com tokens de cor do mobile ([theming.md](../engineering/theming.md))

---

## Referências

- [features.md](features.md) — detalhamento por funcionalidade
- [personas-and-roles.md](personas-and-roles.md)
- [../domain/business-rules.md](../domain/business-rules.md)
- [../engineering/architecture.md](../engineering/architecture.md)
