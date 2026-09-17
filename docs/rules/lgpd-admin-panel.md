---
description: LGPD no gerenciador web STF — dados sensíveis, acesso admin, logs e segurança
---

# LGPD — STF Gerenciador Web

Painel admin trata **dados pessoais e sensíveis de saúde** (pacientes idosos, avaliações clínicas). API e banco ficam no STF; este repo é o **cliente web**. Referências: `docs/domain/business-rules.md` (RB-07, RB-08), `senior-test-funcional/docs/product/privacy-and-lgpd.md`.

## Papéis e escopo

- **Titulares:** paciente (dados sensíveis) e fisioterapeuta (conta).
- **Admin web:** acesso ampliado só por **necessidade de supervisão** — não exportação em massa no MVP (RB-08.2).
- Bases legais finais, aviso ao titular e DPO são do **controlador** — não inventar consentimento genérico no código.

## O que fazer no frontend

- **HTTPS** em produção; `VITE_STF_API_URL` só com TLS.
- JWT em **`sessionStorage`** — nunca `localStorage`; logout limpa token + cache TanStack Query.
- Bloquear UI se `user.role !== ADMIN` após login; nunca confiar só no client — API usa `AdminGuard`.
- Exibir só dados necessários à governança (listas, perfil, histórico, PDF pontual).
- Ações destrutivas (excluir, transferir): **confirmação explícita** (PRD RNF003).
- PDF: download transitório via blob; não persistir PDF clínico em disco/localStorage/indexedDB.
- Recuperação de senha: reutilizar RF003 do STF — não logar códigos ou senhas.

## O que NÃO fazer

- Logar no console, Sentry ou analytics: payloads clínicos, `Assessment.payload`, resultados, PDF em base64, tokens JWT, senhas.
- Cachear dados sensíveis além do necessário (evitar persistência Query no MVP).
- Duplicar domínio clínico no browser (scoring, interpretação, PDF institucional — tudo na API STF).
- Expor IDs internos desnecessários na UI ou em URLs públicas/compartilháveis.

## Audit e API admin

- Mutações destrutivas passam pela API (`/admin/*`); audit log é **append-only** no servidor.
- Metadata de audit: IDs e contexto (ex.: `fromTherapistId`) — **sem** payload clínico (RB-08.3).
- Transferência muda responsável operacional (`therapist_id`), não a titularidade do paciente (RB-08.4).

## Checklist antes de PR

- [ ] Nenhum dado sensível em logs, comentários ou fixtures commitados
- [ ] `.env` / secrets fora do Git
- [ ] CORS em prod configurado no STF (`CORS_ORIGINS`) — não `*`
- [ ] Telas de exclusão com confirmação clara
- [ ] Erros HTTP genéricos ao usuário — sem stack trace ou detalhe clínico vazado
