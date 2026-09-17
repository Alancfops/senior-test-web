# Git — examples

## Branch workflow

### Start feature (GW001 login)

```bash
rtk git checkout develop
rtk git pull origin develop
rtk git checkout -b feature/auth-login
# ... work, commits ...
rtk git push -u origin feature/auth-login
```

### Finish feature

```bash
# After PR merged into develop on GitHub
rtk git checkout develop
rtk git pull origin develop
rtk git branch -d feature/auth-login
rtk git push origin --delete feature/auth-login
```

### Forbidden without user permission

```bash
# ❌ Never do this unless the user explicitly asks
rtk git checkout main
rtk git merge develop
rtk gh pr create --base main ...
```

### Sync feature branch with develop (long-running work)

```bash
rtk git checkout feature/auth-login
rtk git fetch origin
rtk git merge origin/develop
# resolve conflicts, then push
rtk git push
```

## Commit messages

### Good

```
feat(auth): add admin login page
fix(patients): handle empty therapist list on transfer
docs(api): align admin-api with GW008 timeseries
chore(deps): add tanstack query and zod
test(auth): reject non-admin role after login
refactor(api): extract bearer client to lib/api
ci: add vitest job on pull request
```

### Bad

```
Added login                    # no type, past tense
feat: stuff                    # vague
feat(Auth): Add Login Page.    # wrong case, period
fix: corrige bug no login      # Portuguese
feat(auth): add the new admin login page with form validation and error handling and redirect # too long
```

### When a body helps

```
fix(reports): prevent pdf download without assessment id

Guard route param before calling POST /admin/reports/assessments/:id
```

Keep body ≤ 3 lines.

## Pull requests

**Base:** `develop` · **Compare:** `feature/*`

### Good title

```
feat(dashboard): add therapists list (GW002)
```

### Good body

```markdown
## Summary
- List therapists from GET /admin/therapists with loading and empty states
- Link each row to therapist detail route

## Test plan
- [ ] Dashboard loads with seed data
- [ ] Empty API response shows empty state
- [ ] Vitest: TherapistsTable renders rows
```

### Bad body (watermarks)

```markdown
## Summary
This pull request implements the therapists dashboard feature as described in the requirements document. It includes various improvements to the codebase and ensures best practices are followed.

## Test plan
Please test thoroughly and let me know if you have any questions! 🚀
```

### Multi-commit PR title

Use the **main user-facing change**, not a laundry list:

```
feat(web): scaffold vite app and GW001 login
```

## Type decision guide

| Change | Type |
|--------|------|
| New screen or API integration | `feat` |
| Broken behavior fixed | `fix` |
| Only `docs/` or README | `docs` |
| Prettier/eslint only | `style` |
| Move files, rename, no behavior | `refactor` |
| New or updated tests | `test` |
| package.json, vite config, .env.example | `chore` |
| GitHub Actions | `ci` |

## Scopes (suggested)

`auth`, `therapists`, `patients`, `reports`, `audit`, `ui`, `api`, `deps`, `config`

Use the domain touched; omit scope if unclear.
