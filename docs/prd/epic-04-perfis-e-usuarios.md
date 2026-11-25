# EP04: Perfis e Usuários

**Status:** 📋 Planejamento
**Responsável (owner):** @pm (Morgan)
**Módulo de lançamento:** Módulo 1 — fundação
**Sequência:** 4 de 11
**Criado em:** 2026-11-25
**Fonte oficial:** `docs/prd.md` v0.3 — Épico 4 · `docs/architecture.md` §5 e §18 (onda 7)

---

## Objetivo

Controlar quem vê e faz o quê, com perfis de permissão granular para cada funcionalidade e operação.

## Valor para o negócio

Permite que o prestador dê acesso a técnicos e atendente sem expor dados que não são deles, com a segurança garantida também no banco.

---

## Escopo

### Dentro
- CRUD de perfis com matriz de permissões (criar, visualizar, editar, excluir) por funcionalidade.
- CRUD de usuários com vínculo obrigatório a um perfil; tela e botão ocultos sem permissão.
- Políticas de RLS por perfil, inclusive nas tabelas criadas no EP02 e no EP03; Developer com acesso total.

### Fora
- Multi-empresa (fase futura; `empresa_id` já existe desde o EP01).

---

## Stories

| Código | Story | Executor | Status |
|---|---|---|---|
| EP04.S01 | 4.1 Cadastro de perfis com permissões | @dev | Ready — [4.1](../stories/4.1.perfis-com-permissoes.md) |
| EP04.S02 | 4.2 Cadastro de usuários | @dev | Ready — [4.2](../stories/4.2.cadastro-de-usuarios.md) |
| EP04.S03 | 4.3 Permissões aplicadas no banco | @data-engineer | Ready — [4.3](../stories/4.3.permissoes-no-banco.md) |

## Ordem de execução

```
Onda 7: 4.1 → 4.2 → 4.3
```

> 4.1 e 4.2 dependem só do EP01 e podem ser adiantadas; a 4.3 precisa das tabelas do EP02 e do EP03 já criadas.

---

## Dependências

- **Depende de:** EP01 (login e Developer); EP02 e EP03 para a story 4.3.
- **Bloqueia:** EP05 em diante (as novas tabelas já nascem com RLS por perfil).
- **Pendências do dono:** P2 — nível de privacidade/LGPD (a arquitetura deixou recomendação).

## Riscos

| Risco | Mitigação |
|---|---|
| Permissão só na tela, contornável pela API | RLS no banco + JWT do usuário repassado pelo backend (D2) |
| Developer perder acesso por erro de política | Função `is_developer()` testada em todas as políticas |

## Critérios de sucesso

- [ ] Administrador cria perfis e usuários.
- [ ] Usuário sem permissão não vê a tela nem o botão.
- [ ] Teste de RLS comprova que a API respeita o perfil.

## Change Log

| Data | Versão | Descrição | Autor |
|---|---|---|---|
| 2026-11-25 | 1.0 | Épico criado a partir do PRD v0.3 | @pm (Morgan) |
