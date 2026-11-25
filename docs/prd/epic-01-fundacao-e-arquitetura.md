# EP01: Fundação e Arquitetura

**Status:** 🔄 Em andamento
**Responsável (owner):** @pm (Morgan)
**Módulo de lançamento:** Módulo 1 — fundação (não é vendido sozinho)
**Sequência:** 1 de 11
**Criado em:** 2026-11-25
**Fonte oficial:** `docs/prd.md` v0.3 — Épico 1 · `docs/architecture.md` §18 (ondas 1 a 4)

---

## Objetivo

Deixar o projeto rodando de ponta a ponta — arquitetura definida, repositório, banco com RLS, login, Área Developer, publicação no servidor e contrato da uazapi validado — para que todos os épicos seguintes tenham onde ser construídos.

## Valor para o negócio

Sem a fundação nenhum módulo pode ser lançado. Este épico elimina retrabalho (decisões técnicas tomadas antes do código) e garante segurança desde o primeiro dia (RLS, segredos fora do repositório).

---

## Escopo

### Dentro
- Arquitetura e especificação de frontend (`docs/architecture.md`, `docs/front-end-spec.md`).
- Estrutura do monorepo (`frontend/`, `backend/`, `worker/`) subindo com um comando.
- Supabase com RLS, `empresa_id` em toda tabela e cron contra a pausa do plano free.
- Login (Supabase Auth) e usuário Developer com acesso total.
- Área Developer (estrutura; controles da IA vêm na story 3.1).
- Publicação no Easypanel (VPS Hostinger) e URL pública do webhook.
- Validação do contrato da uazapi (spike).

### Fora
- Perfis e permissões granulares (EP04).
- Qualquer funcionalidade de WhatsApp em produção (EP02).

---

## Stories

| Código | Story | Arquivo | Executor | Status |
|---|---|---|---|---|
| EP01.S01 | 1.1 Arquitetura e especificação de frontend | [1.1](../stories/1.1.arquitetura-e-especificacao-frontend.md) | @architect + @ux-design-expert | Done |
| EP01.S02 | 1.2 Estrutura do projeto | [1.2](../stories/1.2.estrutura-do-projeto.md) | @dev | Ready |
| EP01.S03 | 1.3 Banco de dados e manutenção do plano free | [1.3](../stories/1.3.banco-de-dados-e-plano-free.md) | @data-engineer | Ready |
| EP01.S04 | 1.4 Login e usuário Developer | [1.4](../stories/1.4.login-e-usuario-developer.md) | @dev | Ready |
| EP01.S05 | 1.5 Área Developer | [1.5](../stories/1.5.area-developer.md) | @dev | Ready |
| EP01.S06 | 1.6 Publicação no servidor | [1.6](../stories/1.6.publicacao-no-servidor.md) | @devops | Ready |
| EP01.S07 | 1.7 Validar o contrato da uazapi (spike) | [1.7](../stories/1.7.validar-contrato-uazapi.md) | @dev | Ready |

## Ordem de execução

```
Onda 1: 1.1 · 1.7 (paralela)
Onda 2: 1.2
Onda 3: 1.3 · 1.6 (paralelas)
Onda 4: 1.4 → 1.5
```

---

## Dependências

- **Depende de:** nenhum épico.
- **Bloqueia:** todos os épicos seguintes.
- **Pendências do dono:** P4 — credenciais (Supabase, uazapi, R2) e domínio para o webhook (afeta 1.3, 1.6 e 1.7).

## Riscos

| Risco | Mitigação |
|---|---|
| Credenciais e domínio não disponíveis (P4) | Desenvolvimento local da 1.2 começa mesmo assim; 1.3, 1.6 e 1.7 aguardam |
| Documentação da uazapi divergente | Spike 1.7 valida antes do EP02 |
| Pausa do Supabase free | Cron da 1.3 |

## Critérios de sucesso

- [ ] Frontend, backend e worker sobem localmente com um comando.
- [ ] Banco com RLS ativo e `empresa_id` em toda tabela.
- [ ] Developer faz login e acessa a Área Developer.
- [ ] Serviços publicados no Easypanel com verificação de saúde respondendo.
- [ ] `docs/Uazapi/contrato-validado.md` criado, sem token real no repositório.

## Change Log

| Data | Versão | Descrição | Autor |
|---|---|---|---|
| 2026-11-25 | 1.0 | Épico criado a partir do PRD v0.3 | @pm (Morgan) |
