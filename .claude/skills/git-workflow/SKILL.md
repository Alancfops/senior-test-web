---
name: git-workflow
description: Defines Git workflow for the STF admin web repo — branch strategy (main, develop, feature/*), Conventional Commits in English, PRs without AI boilerplate, merge to develop only (never main without explicit permission). Use when creating branches, commits, pull requests, merging, or when the user mentions git, feature branch, develop, or conventional commits.
---

# Git Workflow — STF Gerenciador Web

**Only commit, merge, or open PR when the user explicitly asks.**

## Base de trabalho

### Rules — ler antes de commit/PR

| Rule | Escopo nesta skill |
|------|-------------------|
| `docs/rules/code-review-clean-code.md` | **Obrigatória** — review completo do diff antes de commit |
| `docs/rules/lgpd-admin-panel.md` | Sem secrets, `.env`, dados clínicos ou tokens no diff |
| `docs/rules/stf-readonly-consumer.md` | Commits só neste repo — não incluir alterações do STF |
| `docs/rules/stf-design-tokens.md` | Indireta — PRs de UI devem respeitar tokens |

### Documentação

| Doc | Uso |
|-----|-----|
| `docs/product/features.md` | Escopo do PR alinhado ao GW |
| `docs/engineering/repository-link.md` | Relação entre repos |

### Skills relacionadas

| Skill | Quando acionar |
|-------|----------------|
| `clean-architecture-engineering` | Garantir qualidade antes do commit |
| `admin-ui-ux` | PRs com mudança visual — WCAG/responsivo ok |
| `stf-api-integration` | PRs com hooks/API — contrato conferido |
| `session-log` | Após marco importante (comando do usuário) |

## Branch strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready. **Never merge here without explicit user permission.** |
| `develop` | Integration branch — all completed features land here |
| `feature/*` | One branch per new functionality |
| `fix/*`, `chore/*`, etc. | Optional for bugs or small tasks (same flow as feature) |

### Starting new work

Always branch from up-to-date `develop`:

```bash
rtk git checkout develop
rtk git pull origin develop
rtk git checkout -b feature/<short-name>
```

Examples: `feature/auth-login`, `feature/therapists-dashboard`

### Finishing a feature

1. Open PR: `feature/*` → **`develop`** (never → `main`)
2. After merge: delete branch **remote and local**

```bash
rtk git checkout develop
rtk git pull origin develop
rtk git branch -d feature/<short-name>
rtk git push origin --delete feature/<short-name>
```

If using GitHub UI: enable "Delete branch" after merge, then run local cleanup above.

### Rules

- **New functionality** → always a dedicated `feature/*` branch
- **Merge target** → `develop` only
- **`main`** → merge/release **only when the user explicitly authorizes**
- Do not commit directly on `main` or `develop` for feature work

Details and edge cases: [reference.md](reference.md)

## Conventional Commits

Format:

```
<type>(<scope>): <subject>
```

| Type | When |
|------|------|
| `feat` | New feature or user-facing behavior |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code change without feat/fix |
| `test` | Tests only |
| `chore` | Tooling, deps, config |
| `ci` | CI/CD changes |

**Rules:**
- **English only**
- **Short:** subject ≤ 72 chars; one line when possible
- **Imperative mood:** "add login page" not "added login page"
- **Lowercase subject** after the colon (no trailing period)
- **Scope optional** but preferred: `feat(auth)`, `fix(patients)`, `docs(api)`
- **Body** only if context is unclear — keep it brief

Examples: [reference.md](reference.md)

## Before committing

1. Run code review per `docs/rules/code-review-clean-code.md`
2. Check diff: no secrets, `.env`, or sensitive data
3. Stage only relevant files
4. Draft message from **why**, not a file list

```bash
rtk git status
rtk git diff
```

## Commit workflow

Only when the user asks to commit:

1. Analyze staged + unstaged changes
2. Pick type + scope
3. Write one-line English subject
4. Commit via HEREDOC:

```bash
rtk git add <files>
rtk git commit -m "$(cat <<'EOF'
feat(auth): add admin login with role guard

EOF
)"
rtk git status
```

**Do not** amend unless user rules allow it. **Do not** push unless asked.

## Pull requests

**Base branch:** `develop` (default). **Never target `main`** unless the user explicitly requests a release PR.

**Language:** English  
**Tone:** Direct, human, no AI watermark

### Do

- Short title mirroring the main commit or feature (`feat(auth): add admin login`)
- 2–4 bullet points on what changed and why
- Concrete test plan (what you ran or would run)
- Link related docs/issues when relevant

### Do NOT (watermarks)

- "This PR implements...", "In this pull request we..."
- "Certainly!", "I'd be happy to...", "As an AI..."
- Generic filler: "Various improvements", "Misc updates"
- Over-long templates with empty sections
- Emoji-heavy or marketing language
- "Please review at your earliest convenience"

### PR template

```markdown
## Summary
- Add login page with JWT in sessionStorage
- Reject non-ADMIN roles after POST /auth/login

## Test plan
- [ ] Login with admin seed credentials → dashboard
- [ ] Login with therapist account → access denied message
- [ ] `pnpm lint` and `pnpm typecheck` pass
```

## Branch naming

```
feature/auth-login
feature/therapists-dashboard
fix/transfer-modal-validation
chore/vite-scaffold
```

Prefix `feature/` for new functionality; name reflects the GW or domain when possible.

## Checklist

- [ ] Work on `feature/*` branched from `develop`
- [ ] PR targets `develop` — not `main`
- [ ] After merge: remote + local branch deleted
- [ ] Conventional type + optional scope
- [ ] English, imperative, ≤ 72 chars
- [ ] PR summary is concise and human — no watermark
- [ ] User explicitly requested commit/merge/PR
- [ ] No secrets in diff
