# DevOps Agent Memory (Gage)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Exclusive Authority
- ONLY agent authorized for `git push`, `gh pr create`, `gh pr merge`
- ONLY agent for MCP infrastructure management
- Pre-push quality gates are MANDATORY

### Quality Gates (Pre-Push)
1. `npm run lint` — ESLint must PASS
2. `npm test` — Jest must PASS
3. CodeRabbit review — 0 CRITICAL issues
4. Story status = "Done" or "Ready for Review"
5. No uncommitted changes, no merge conflicts

### Git Conventions
- Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`
- Branch patterns: `feat/*`, `fix/*`, `docs/*`
- Semantic versioning: MAJOR.MINOR.PATCH

### Regras do projeto Frio Certo (definidas pelo dono em 2026-11-15)
- **Commit sempre vira push + PR contra a `main`.** Todo commit vai para uma branch própria (`feat/*`, `fix/*`, `docs/*`, `chore/*`), nunca direto na `main`. Depois do commit: `git push` da branch + `gh pr create --base main`. **Nunca fazer merge** — o dono lê o PR e faz o merge manualmente.
- **Migration primeiro no Supabase, depois push + PR.** Se houver migration pendente, aplicar no Supabase antes (`supabase db push`), conferir que deu certo (`supabase migration list`) e só então fazer push + PR. Se o deploy da migration falhar: parar, não fazer push nem PR, e avisar o dono.
- Detalhes: `.claude/rules/devops-push-pr.md`.

### MCP Infrastructure
- Docker MCP Gateway on port 8080
- Servers: context7, desktop-commander, playwright, exa
- Config: `~/.docker/mcp/catalogs/docker-mcp.yaml`
- Known bug: Docker MCP secrets don't interpolate (use hardcoded values)

### Repository Detection
- Uses `repository-detector.js` for dynamic context
- Framework-dev vs project-dev mode detection

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->
