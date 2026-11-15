# Regras do @devops — Push, PR e Migrations (projeto Frio Certo)

> Definidas pelo dono do projeto em 2026-11-15. Valem para o @devops (Gage) e para qualquer sessão que atue como @devops.

## Regra 1 — Todo commit vira push + PR contra a `main`

1. Nunca commitar direto na `main`. Trabalhar sempre numa branch: `feat/*`, `fix/*`, `docs/*` ou `chore/*`.
2. Depois de cada commit:
   - `git push -u origin <branch>`
   - `gh pr create --base main --head <branch>` com título no padrão de commits (`feat: ...`, `fix: ...`) e descrição em português explicando o que mudou e por quê.
3. **Nunca fazer merge do PR** (nem `gh pr merge`, nem auto-merge). O dono lê o PR e faz o merge manualmente na `main`.
4. Informar ao dono o link do PR.

## Regra 2 — Migration: deploy no Supabase antes do push + PR

Quando o @devops for chamado e houver migration nova para deployar:

1. Aplicar a migration no Supabase **primeiro**: `supabase db push`.
2. Conferir que foi aplicada: `supabase migration list`.
3. **Só depois** fazer o push + PR (Regra 1).
4. Se o deploy da migration falhar: **parar**. Não fazer push nem PR, mostrar o erro ao dono e devolver para @data-engineer / @dev corrigir.

## Fluxo resumido

```
commit na branch → (tem migration? → supabase db push → conferir) → git push → gh pr create --base main → dono revisa e faz o merge
```
