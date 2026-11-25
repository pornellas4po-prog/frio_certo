# Frio Certo — Arquitetura Full-Stack

> **Autor:** @architect (Aria) · **Versão:** 1.0 · **Data:** 2026-11-21 · **Story:** 1.1
> **Base:** `docs/prd.md` v0.3, `backend/README.md`, `worker/README.md`, `frontend/` (PR #3), `docs/Uazapi/`, protótipo `climatizacao-prototipo02.html`.
> **Regra:** toda decisão aponta para um FR, NFR ou premissa do PRD. O que depende do dono está em **"Pendências do dono"** e não foi inventado.

---

## 1. Resumo das decisões

| # | Tema | Decisão | Rastreio |
|---|---|---|---|
| D1 | Autenticação | **Supabase Auth** (e-mail e senha). O backend valida o JWT do Supabase. O usuário Developer é marcado em `usuarios.is_developer` | FR1, FR2, premissa "provedor a definir" |
| D2 | Acesso a dados | O frontend **só fala com o backend** (FastAPI). O backend repassa o JWT do usuário ao Supabase, então o **RLS vale em toda leitura e escrita** feita em nome do usuário. A `service_role` é usada só pelo worker e por jobs | NFR3, FR5 |
| D3 | Zero conflito de agenda | Garantido **no banco** por uma *exclusion constraint* (`EXCLUDE USING gist`) por técnico sobre o intervalo `[inicio, fim_bloqueio)` das OS ativas. O cálculo de horários livres é a camada de conveniência; o banco é a trava final | Meta 1, FR14, 8.4 AC2 |
| D4 | Fila do webhook | Tabela Postgres `fila_processamento` consumida pelo worker com `SELECT ... FOR UPDATE SKIP LOCKED`. **Sem Redis**: menos infraestrutura no plano atual | NFR11 |
| D5 | Tarefas agendadas | **APScheduler** dentro do worker: lembrete de 24 h, cron que mantém o Supabase ativo, reindexação do RAG e alertas | NFR6, FR37 |
| D6 | RAG híbrido | pgvector (embeddings `text-embedding-3-small`, 1536 dimensões) + busca textual do Postgres (`tsvector` em português), combinadas por **Reciprocal Rank Fusion** | FR30, FR41, 7.2 |
| D7 | Agentes | SDK oficial da OpenAI com **function calling**. As ferramentas dos agentes chamam os serviços do backend (catálogo, horários livres, OS); o agente nunca calcula preço nem horário sozinho | NFR7, FR35 |
| D8 | Modelo por agente (padrão) | Orquestrador, técnico e financeiro: **GPT-4o mini**. Novos clientes e clientes antigos: **GPT-4o**. Pode ser alterado na Área Developer | Premissa "divisão GPT-4o/mini" |
| D9 | Arquivos | Cloudflare R2 (API S3, `boto3`). Bucket **privado**; upload e download por **URL pré-assinada** gerada pelo backend | NFR5 |
| D10 | PDF | **ReportLab** (Python puro, roda igual no Windows e no Docker) | FR18, FR23 |
| D11 | Chaves de integração | Infraestrutura (Supabase, token admin da uazapi, R2) **só em variável de ambiente**. Chaves que o dono troca pela Área Developer (OpenAI, Asaas) ficam no **Supabase Vault** (criptografadas), nunca no repositório nem no navegador | NFR4, NFR10, FR42 (1) |
| D12 | Asaas | API v3: o backend cria a cobrança (Pix, boleto ou cartão) e recebe a confirmação pelo **webhook do Asaas** (`PAYMENT_RECEIVED` / `PAYMENT_CONFIRMED`), que marca o recebimento automaticamente | 10.3, premissa "detalhes Asaas" |
| D13 | Testes | Backend e worker: **pytest** (+ pytest-asyncio, httpx). Banco: testes contra o **Supabase local** (`supabase start`). Frontend: **Vitest** + Testing Library. Fluxos críticos: **Playwright** (a partir do Épico 6) | "Requisitos de Teste [A DEFINIR]" |
| D14 | Qualidade | Python: **ruff** (lint e formatação) e **mypy**. Frontend: **ESLint** + `tsc`. CI no **GitHub Actions** em todo PR | Constituição Art. V |
| D15 | Fuso horário | Tudo gravado em `timestamptz` (UTC); regras de agenda calculadas em **America/Sao_Paulo** | FR14 |
| D16 | Falhas externas | OpenAI fora do ar ou limite de gasto atingido → mensagem padrão ao cliente + **transbordo** (motivo `falha_ia`). uazapi fora do ar → 3 novas tentativas com espera crescente; depois, mensagem marcada com erro e alerta no painel | Recomendação do @po |
| D17 | Multi-tenant futuro | Toda tabela com `empresa_id` e toda política de RLS filtrando por `empresa_id` desde já | Premissa "multi-tenant futuro" |

---

## 2. Visão geral

```
                ┌────────────────────────── VPS Hostinger · Easypanel ──────────────────────────┐
 Navegador ───► │ frontend (Next.js 16)  ──HTTPS + JWT──►  backend (FastAPI)                     │
 (dono,         │   app.<domínio>                            api.<domínio>                        │
  técnico)      │                                              │  JWT do usuário → RLS            │
                │                                              ▼                                  │
                │                                       Supabase (Postgres + Auth + pgvector)     │
                │                                              ▲  service_role                    │
 uazapi ──────► │ worker (Python)  ◄────────────────────────────┘                                 │
 (WhatsApp)     │   wh.<domínio>/webhook/{token}  → fila → agentes OpenAI → envio uazapi          │
                │   APScheduler: lembretes 24 h, keep-alive, reindexação RAG, alertas             │
                └────────────────────────────────────────────────────────────────────────────────┘
 Cloudflare R2: fotos e PDFs (URL pré-assinada)      Asaas: cobranças + webhook de pagamento
```

**Regras de comunicação**
1. O navegador **nunca** chama Supabase (exceto login), uazapi, OpenAI, R2 (exceto pela URL pré-assinada) nem Asaas diretamente (NFR10).
2. `backend` e `worker` **não se chamam** por HTTP: conversam pelo Supabase (tabelas de conversas, mensagens, fila e OS), como já definido no `worker/README.md`.
3. O worker reaproveita `backend/app/core` e `backend/app/integrations` instalando o backend como dependência local (`uv`).

---

## 3. Stack e versões

| Camada | Tecnologia | Versão |
|---|---|---|
| Frontend | Next.js (App Router) + React | 16.4.6 / 19.3.1 (já em uso) |
| Linguagem frontend | TypeScript | 5.x |
| Node | Node.js | ≥ 20 (`engines` já definido) |
| Sessão no frontend | `@supabase/ssr` + `@supabase/supabase-js` | fixar na Story 1.4 |
| Dados no frontend | TanStack Query | fixar na Story 1.4 |
| Formulários | React Hook Form + Zod | fixar na Story 5.1 |
| Backend e worker | Python | **3.13** (`requires-python = ">=3.13,<3.14"`) |
| Gerenciador Python | uv | ≥ 0.13 |
| API | FastAPI + Pydantic v2 + Uvicorn | fixadas no `uv.lock` (Story 1.2) |
| Cliente Supabase | `supabase` (supabase-py) | `uv.lock` |
| HTTP externo | `httpx` (async) | `uv.lock` |
| IA | `openai` (SDK oficial) | `uv.lock` |
| Agendador | `apscheduler` | `uv.lock` |
| PDF | `reportlab` | `uv.lock` |
| R2 | `boto3` | `uv.lock` |
| Banco | Supabase (Postgres 15+, pgvector, pg_trgm, btree_gist) | plano free |
| CLI do banco | Supabase CLI | instalar na Story 1.3 (**não está instalado hoje**) |
| Contêineres | Docker (Easypanel e Supabase local) | — |

> Versões exatas das bibliotecas Python ficam no `uv.lock` e as do frontend no `package-lock.json`. Nada de versão "latest" em Dockerfile.

---

## 4. Estrutura do repositório

```
Frio_certo/
├── frontend/                      # já existe (PR #3)
│   ├── apps/web/
│   │   ├── app/(auth)/login/      # 1.4
│   │   ├── app/(app)/...          # telas por funcionalidade
│   │   ├── lib/api.ts             # cliente do backend (fetch + JWT)        1.4
│   │   ├── lib/supabase.ts        # sessão (@supabase/ssr)                  1.4
│   │   └── middleware.ts          # protege rotas e redireciona ao login    1.4
│   └── packages/{theme,icons,ui,modules}
├── backend/
│   ├── app/
│   │   ├── main.py                # registra só os routers dos módulos liberados
│   │   ├── core/                  # config, supabase, auth, rbac, licensing, errors, logging
│   │   ├── api/                   # dependências comuns (usuário atual, paginação)
│   │   ├── modules/
│   │   │   ├── sistema/           # empresa, usuários, perfis, developer, ia_config, transbordo, kb
│   │   │   ├── atendimento/       # whatsapp, conversas, contatos, clientes, servicos, tecnicos, agenda, os (criação/aprovação)
│   │   │   ├── os/                # equipamentos, execução, relatório PDF
│   │   │   └── financeiro/        # orçamentos, recebimentos, asaas
│   │   ├── services/              # regras de negócio puras (horarios_livres.py, precos.py ...)
│   │   └── integrations/          # uazapi.py, openai_client.py, r2.py, asaas.py, viacep.py, pdf.py
│   ├── tests/
│   ├── pyproject.toml · uv.lock · Dockerfile
├── worker/
│   ├── worker/
│   │   ├── __main__.py            # sobe o webhook (FastAPI) + consumidor da fila + APScheduler
│   │   ├── webhook.py · normalizer.py · queue.py · sender.py · jobs.py
│   │   └── agents/                # orquestrador, tecnico, novos_clientes, clientes_antigos, financeiro, transbordo, tools.py
│   ├── tests/
│   ├── pyproject.toml · uv.lock · Dockerfile
├── supabase/                      # Supabase CLI: config.toml, migrations/, seed.sql   (1.3)
├── .github/workflows/ci.yml       # 1.2
├── package.json                   # só o script "dev" que sobe os 3 serviços (1.2)
├── .env.example                   # 1.2
└── docs/
```

**Ajuste em relação ao `backend/README.md`:** o módulo `sistema/` foi acrescentado para o que é sempre liberado (empresa, usuários, perfis, Área Developer, IA, transbordo e base de conhecimento), e a **OS de criação e aprovação** foi para `atendimento/`, conforme a decisão do dono de 2026-11-21 (OS no Módulo 1).

---

## 5. Autenticação, permissões e módulos

### 5.1 Fluxo de login (D1)
1. O frontend faz login no Supabase Auth (`signInWithPassword`); a sessão fica em cookie (`@supabase/ssr`).
2. Cada chamada ao backend leva `Authorization: Bearer <access_token>`.
3. `core/auth.py` valida o JWT (chave JWT do projeto Supabase) e carrega `usuarios` (empresa, perfil, `is_developer`, ativo).
4. O backend cria o cliente Supabase **com o token do usuário**, então o RLS se aplica.

**Usuário Developer (FR2):** criado no seed da Story 1.4 a partir de `FRIOCERTO_DEVELOPER_EMAIL` (o dono define a senha no primeiro acesso, por "esqueci minha senha"). `is_developer = true` dispensa perfil.

### 5.2 RBAC (FR4, FR5, Épico 4)
- `perfis` + `perfil_permissoes (feature, pode_criar, pode_ver, pode_editar, pode_excluir)`.
- A lista de `feature` é **a mesma** do `FEATURES` em `frontend/packages/modules/src/catalog.ts`, espelhada em `backend/app/core/licensing.py`.
- Backend: dependência `requer(feature, operacao)` em cada rota.
- Banco: função `tem_permissao(feature text, op text) returns boolean` (`security definer`), usada nas políticas.
- Frontend: hook `usePermissao(feature, op)` esconde telas e botões (2.2 AC2). **O frontend esconde, o backend garante, o banco reforça.**

### 5.3 Funções SQL de apoio (criadas na 1.3)
```sql
auth_empresa_id()  -- empresa do usuário logado (usuarios.empresa_id)
is_developer()     -- usuarios.is_developer do usuário logado
tem_permissao(feature, op)  -- criada vazia (retorna is_developer()) na 1.3; completada na 4.3
```

**Política padrão até o Épico 4:** `empresa_id = auth_empresa_id() and is_developer()`. Assim, os Épicos 1 a 3 funcionam só para o Developer, e a Story 4.3 troca as políticas para `tem_permissao(...)` em todas as tabelas já criadas (4.3 AC3).

### 5.4 Liberação por módulo
- Variável `FRIOCERTO_MODULES` (backend e worker) e `NEXT_PUBLIC_FRIOCERTO_MODULES` (frontend), com o mesmo valor.
- `main.py` registra só os routers liberados; uma rota de módulo não contratado devolve 404.
- **Mudança no catálogo do frontend (Story 6.2):** `FEATURES.os` passa de `'os'` para `'atendimento'` (lista e aprovação de OS no Módulo 1). `meudia` e `equipamentos` continuam em `'os'`.
- **Novas features no catálogo:** `base-conhecimento: 'atendimento'` (3.4), `usuarios: null` (4.2), `aprovacoes: 'atendimento'` (6.2).

---

## 6. Modelo de dados

Convenções: `id uuid primary key default gen_random_uuid()`, `empresa_id uuid not null references empresas`, `criado_em` e `atualizado_em timestamptz`, nomes em português sem acento, `snake_case`. **RLS ligado em todas as tabelas.** Valores monetários em `numeric(12,2)`. Telefones só com dígitos e DDI (ex.: `5511999998888`).

| Tabela | Colunas principais | Story |
|---|---|---|
| `empresas` | nome, responsavel, chave_pix, tipo_chave_pix | 1.3 (seed) · 5.1 |
| `usuarios` | id (= auth.users.id), empresa_id, nome, email, perfil_id null, is_developer, ativo | 1.4 · 4.2 |
| `audit_log` | ator_id, ator_tipo (usuario/agente/sistema), acao, entidade, entidade_id, dados jsonb | 1.3 |
| `whatsapp_instancias` | nome, numero, uazapi_instance_id, token (**só backend/worker**), status, qr_code, webhook_configurado, perfil_nome, ia_ativa | 2.1 |
| `contatos` | telefone (único por empresa), nome_whatsapp, cliente_id null, primeiro_contato_em | 2.4 |
| `conversas` | contato_id, instancia_id, status (`aberta`, `aguardando_cliente`, `aguardando_atendente`, `resolvida`), agente_atual, ia_pausada, ultima_mensagem_em | 2.4 |
| `mensagens` | conversa_id, direcao (in/out), autor (contato/ia/atendente/sistema), tipo (texto/imagem/audio/documento/...), texto, midia_r2_key, uazapi_message_id (**único**, idempotência), status_envio, erro | 2.4 · 2.5 |
| `conversa_notas` | conversa_id, usuario_id, texto | 2.6 |
| `fila_processamento` | mensagem_id, status (pendente/processando/feito/erro), tentativas, proximo_em, erro | 2.4 |
| `ia_agentes` | chave (orquestrador/tecnico/novos_clientes/clientes_antigos/financeiro), ativo, modelo, prompt, persona jsonb | 3.1 |
| `ia_palavras_chave` | agente_chave, termo | 3.1 |
| `ia_config` | limite_gasto_dia, limite_gasto_mes, limiar_incerteza (0–1) | 3.1 |
| `ia_decisoes` | conversa_id, mensagem_id, agente, decisao, confianca, modelo, tokens_entrada, tokens_saida, custo_usd | 3.1 · 3.2 |
| `transbordo_atendente` | nome, telefone, ativo · **único por empresa** | 3.3 |
| `transbordo_horarios` | dia_semana (0–6), inicio, fim | 3.4 |
| `transbordos` | conversa_id, motivo (`pedido_humano`, `fora_da_base`, `servico_inexistente`, `financeiro`, `falha_ia`), agente_origem, fora_do_horario, avisado_em, devolvido_em | 3.3 |
| `perfis` / `perfil_permissoes` | nome / perfil_id, feature, pode_criar, pode_ver, pode_editar, pode_excluir | 4.1 |
| `empresa_horarios` | dia_semana, inicio, fim (horário de funcionamento) | 5.1 |
| `catalogo_itens` | tipo (servico/peca), categoria, nome, descricao, preco, duracao_min (serviço), liberacao_min (serviço), ativo | 5.2 |
| `tecnicos` | nome, telefone, cor, ativo | 5.3 |
| `tecnico_jornadas` | tecnico_id, dia_semana, inicio, fim | 5.3 |
| `agenda_bloqueios` | tecnico_id, inicio, fim, motivo (folga, ausência) | 5.3 |
| `clientes` | tipo (pf/pj), nome, documento, telefone, email, cep, logradouro, numero, complemento, bairro, cidade, uf | 5.4 |
| `ordens_servico` | numero (sequencial por empresa), cliente_id, tipo, status, tecnico_id, inicio, fim, fim_bloqueio, problema, origem (manual/agente), conversa_id, aprovado_por, aprovado_em, total | 6.2 |
| `os_itens` | os_id, catalogo_item_id, descricao, quantidade, preco_unitario | 6.2 |
| `os_historico` | os_id, evento, de, para, ator_id, ator_tipo, dados jsonb | 6.2 |
| `notificacoes_agendadas` | tipo (`lembrete_24h`), os_id, enviar_em, enviado_em, status | 8.4 |
| `kb_documentos` | origem (catalogo/manual), ref_id, titulo, conteudo, atualizado_em | 7.1 |
| `kb_chunks` | documento_id, conteudo, embedding vector(1536), tsv tsvector (português, gerado) | 7.1 |
| `equipamentos` | cliente_id, tipo, marca, btus, numero_serie, local, periodicidade_meses, ultima_preventiva, proxima_preventiva | 9.1 |
| `os_equipamentos` | os_id, equipamento_id | 9.1 |
| `os_execucao` | os_id, checklist jsonb, filtro_estado, iniciado_em, finalizado_em, assinatura_r2_key, assinado_por | 9.2 |
| `os_fotos` | os_id, momento (antes/depois), r2_key | 9.2 |
| `os_relatorios` | os_id, pdf_r2_key, enviado_em | 9.3 |
| `orcamentos` / `orcamento_itens` | numero, cliente_id, status (rascunho/enviado/aprovado/recusado), observacoes, total, os_id / itens | 10.1 |
| `contas_receber` | os_id null, orcamento_id null, cliente_id, valor, vencimento, status (aberto/recebido), forma, recebido_em | 10.2 |
| `asaas_cobrancas` | conta_receber_id, asaas_id, link, status | 10.3 |

**Trava de conflito (D3), criada na 6.2:**
```sql
create extension if not exists btree_gist;
alter table ordens_servico add constraint os_sem_conflito
  exclude using gist (tecnico_id with =, tstzrange(inicio, fim_bloqueio, '[)') with &&)
  where (status in ('pendente','agendada','em_andamento'));
```
Uma OS **Pendente** também reserva o horário: assim, dois clientes não ficam com o mesmo horário enquanto esperam aprovação.

**Situação da preventiva (FR12):** view `vw_equipamentos_situacao` → `vencida` (proxima < hoje), `vence_15_dias` (proxima ≤ hoje + 15), `em_dia`.

---

## 7. Regras de negócio centrais

### 7.1 Horários livres (FR14, Story 6.1) — `backend/app/services/horarios_livres.py`
Função pura (sem banco), fácil de testar:
```
entrada: período, serviços escolhidos, [técnico opcional]
duração_total   = soma(duracao_min dos serviços)
liberação       = maior(liberacao_min dos serviços)
para cada técnico ativo e cada dia:
  janela = horário_da_empresa(dia) ∩ jornada_do_técnico(dia)
  ocupado = OS ativas (inicio → fim_bloqueio) ∪ agenda_bloqueios
  livres = janela − ocupado
  candidatos = inícios a cada 30 min onde [início, início + duração_total + liberação) cabe em "livres"
saída: lista de (técnico, início, fim, fim_bloqueio)
```
**Escolha automática do técnico (FR35):** entre os técnicos livres no horário, o que tem **menos atendimentos no dia**; empate → ordem alfabética. A escolha fica isolada em `escolher_tecnico()` para poder mudar depois.

### 7.2 Gravação da OS (8.4 AC2)
O agente e a tela chamam `POST /api/v1/os`. O backend recalcula o horário e grava numa transação; se a *exclusion constraint* recusar (alguém pegou o horário segundos antes), devolve **409** e o agente oferece outras opções.

### 7.3 Transbordo (FR39, FR40, FR44, FR45)
```
qualquer agente decide transbordo (motivo)
  → conversa.status = aguardando_atendente; conversa.ia_pausada = true
  → grava em transbordos (fora_do_horario = agora fora de transbordo_horarios?)
  → se fora do horário: IA envia ao cliente o horário de atendimento humano
  → SEMPRE: aviso imediato ao atendente único, no número dele, pelo WhatsApp institucional
     (texto: nome do contato, motivo, link para a conversa na caixa)
  → atendente responde pela caixa; "Devolver à IA" → ia_pausada = false, devolvido_em = agora
```
O horário de atendimento humano **não** afeta os agentes, que funcionam 24/7 (NFR13).

### 7.4 Orquestrador (FR29, Story 3.2)
1. Contato com `ia_pausada` ou instância com `ia_ativa = false` → não responde.
2. **Palavras-chave** (`ia_palavras_chave`) → agente direto, confiança 1.0.
3. Sem palavra-chave → GPT-4o mini classifica em {técnico, novos_clientes, clientes_antigos, financeiro, transbordo} com confiança.
4. Confiança < `ia_config.limiar_incerteza` → transbordo.
5. Novo × antigo: `contatos.cliente_id` nulo → novos clientes; preenchido → clientes antigos (FR31).
6. Toda decisão é gravada em `ia_decisoes` (FR42 item 8).

### 7.5 Limite de gasto (FR42 item 7)
Antes de cada chamada à OpenAI, o worker soma `ia_decisoes.custo_usd` do dia e do mês. Se passou do limite → não chama a IA e faz transbordo com motivo `falha_ia`. O custo é calculado pela tabela de preços por modelo em `openai_client.py`.

### 7.6 Envio pelo WhatsApp (NFR12, Story 2.5)
`sender.py`: status "digitando" + espera proporcional ao tamanho do texto (mínimo 1,5 s, máximo 6 s) + intervalo mínimo de 2 s entre mensagens do mesmo número.

### 7.7 Lembrete de 24 h (FR37)
Ao aprovar uma OS (Pendente → Agendada), o backend grava `notificacoes_agendadas(enviar_em = inicio − 24 h)`. O job do worker roda a cada 5 minutos e envia os vencidos. Se a OS foi aprovada com menos de 24 h de antecedência, o lembrete não é criado (a confirmação da aprovação já cumpre o papel).

### 7.8 Orçamento dos agentes no Módulo 1 (item M2 da validação do @po)
**Suposição de arquitetura, aguardando o dono:** no Módulo 1, o "orçamento" dos agentes (FR34) é o **valor informado na conversa**, calculado pelo backend a partir do catálogo (`POST /api/v1/catalogo/cotar`) e registrado na mensagem e em `ia_decisoes`. O orçamento formal (PDF, status, conversão em OS) é a Story 10.1, no Módulo 3. Se o dono decidir diferente, só a Story 8.2/8.3 muda.

### 7.9 Equipamentos na OS (item M1 da validação do @po)
A OS do Módulo 1 (Story 6.2) **não** tem o campo equipamentos. A tabela `os_equipamentos` e o campo na tela entram na Story 9.1, com o Módulo 2.

---

## 8. API do backend

Prefixo `/api/v1`. JSON. Erros no formato `{"erro": {"codigo": "...", "mensagem": "..."}}` em português. Paginação `?pagina=&por_pagina=`. Toda rota exige JWT, exceto `/health` e webhooks externos.

| Grupo | Rotas principais | Story |
|---|---|---|
| Saúde | `GET /health` | 1.2 |
| Sessão | `GET /me` (usuário, empresa, permissões, módulos) | 1.4 |
| Developer | `GET/PUT /developer/config`, `POST /developer/integracoes/{nome}/testar` | 1.5 · 3.1 |
| WhatsApp | `POST /whatsapp/instancias`, `POST /{id}/conectar`, `GET /{id}/status`, `POST /{id}/desconectar`, `DELETE /{id}`, `PATCH /{id}` (ia_ativa) | 2.1–2.3 |
| Conversas | `GET /conversas?status=`, `GET /conversas/{id}`, `POST /conversas/{id}/mensagens`, `POST /conversas/{id}/notas`, `POST /conversas/{id}/pausar-ia`, `POST /conversas/{id}/devolver-ia`, `POST /conversas/{id}/resolver` | 2.6 · 3.3 |
| IA | `GET/PUT /ia/agentes/{chave}`, `GET/PUT /ia/palavras-chave`, `GET/PUT /ia/config`, `GET /ia/decisoes` | 3.1 |
| Transbordo | `GET/PUT /transbordo/atendente`, `GET/PUT /transbordo/horarios` | 3.3 · 3.4 |
| Perfis/usuários | CRUD `/perfis`, `/usuarios` | 4.1 · 4.2 |
| Empresa | `GET/PUT /empresa`, `GET/PUT /empresa/horarios` | 5.1 |
| Catálogo | CRUD `/catalogo`, `POST /catalogo/cotar` | 5.2 · 8.2 |
| Técnicos | CRUD `/tecnicos`, `PUT /tecnicos/{id}/jornada`, CRUD `/agenda/bloqueios` | 5.3 |
| Clientes | CRUD `/clientes`, `GET /cep/{cep}` (ViaCEP via backend) | 5.4 |
| Agenda | `GET /agenda/horarios-livres?inicio=&fim=&servicos=`, `GET /agenda/eventos?inicio=&fim=` | 6.1 · 6.3 |
| OS | CRUD `/os`, `POST /os/{id}/aprovar`, `POST /os/{id}/status`, `PATCH /os/{id}/reagendar` | 6.2 · 6.3 |
| Base de conhecimento | CRUD `/kb/documentos`, `POST /kb/buscar` (uso interno e testes) | 7.1 · 7.2 |
| Equipamentos | CRUD `/equipamentos?situacao=` | 9.1 |
| Execução | `POST /os/{id}/iniciar`, `PUT /os/{id}/execucao`, `POST /os/{id}/fotos/upload-url`, `POST /os/{id}/assinatura`, `POST /os/{id}/finalizar` | 9.2 |
| Relatório | `GET /os/{id}/pdf`, `POST /os/{id}/enviar-pdf` | 9.3 |
| Orçamentos | CRUD `/orcamentos`, `POST /{id}/enviar`, `POST /{id}/aprovar`, `POST /{id}/recusar`, `POST /{id}/converter-os` | 10.1 |
| Financeiro | `GET /financeiro/contas?status=&forma=`, `POST /financeiro/contas/{id}/receber`, `GET /financeiro/indicadores` | 10.2 |
| Asaas | `POST /asaas/cobrancas`, `POST /asaas/webhook` (header `asaas-access-token`) | 10.3 |
| Painel | `GET /painel/resumo`, `GET /alertas` | 11.1 · 11.2 |

**Worker (público):** `POST /webhook/{token}` e `GET /health` — sem JWT; o token da instância identifica a origem (`docs/Uazapi/contrato-uazapi.md`).

---

## 9. Worker

```
POST /webhook/{token}
  ├─ instância pelo token? não → 404 (sem processar)
  ├─ grava payload bruto em mensagens (status recebido) + fila_processamento   [~50 ms]
  └─ responde 200 OK imediatamente (NFR11)

consumidor (loop, 2 tarefas concorrentes)
  └─ pega item da fila (SKIP LOCKED) → normaliza (v1/v2) → contato/conversa
       → evento de conexão? atualiza whatsapp_instancias.status
       → mensagem minha (fromMe)? só registra
       → senão: orquestrador → agente → resposta → sender (uazapi)
       → erro: tentativas+1, proximo_em = agora + 2^tentativas min (máx. 5) → depois "erro"

APScheduler
  ├─ a cada 5 min   → lembretes 24 h (notificacoes_agendadas)
  ├─ a cada 6 h     → keep-alive do Supabase (consulta leve) — NFR6
  ├─ a cada 2 min   → reindexação RAG pendente (kb_documentos alterados)
  └─ diariamente 7h → recalcula alertas (preventivas, recebimentos, OS sem data)
```
**Idempotência:** `mensagens.uazapi_message_id` é único; reenvio da uazapi não gera resposta duplicada.

---

## 10. Variáveis de ambiente (`.env.example`, Story 1.2)

| Variável | Serviço | Observação |
|---|---|---|
| `SUPABASE_URL`, `SUPABASE_ANON_KEY` | backend, worker, frontend (`NEXT_PUBLIC_*`) | a anon key é pública por natureza |
| `SUPABASE_SERVICE_ROLE_KEY` | worker, backend (jobs) | **nunca no frontend** |
| `SUPABASE_JWT_SECRET` | backend | validação do JWT |
| `FRIOCERTO_MODULES` / `NEXT_PUBLIC_FRIOCERTO_MODULES` | todos | `atendimento,os,financeiro` |
| `FRIOCERTO_EMPRESA_ID` | backend, worker | valor fixo na fase 1 |
| `FRIOCERTO_DEVELOPER_EMAIL` | seed | usuário Developer |
| `NEXT_PUBLIC_API_URL` | frontend | `https://api.<domínio>` |
| `UAZAPI_BASE_URL`, `UAZAPI_ADMIN_TOKEN` | backend, worker | header `admintoken` |
| `WORKER_PUBLIC_URL` | backend | monta a URL do webhook da instância |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` | backend | |
| `OPENAI_API_KEY` | worker | fallback; a chave principal fica no Vault (D11) |
| `ASAAS_API_URL`, `ASAAS_WEBHOOK_TOKEN` | backend | a chave da API fica no Vault (D11) |
| `TZ=America/Sao_Paulo` | todos | |

---

## 11. Deploy (Easypanel)

| Serviço | Origem | Comando | Domínio (sugestão) |
|---|---|---|---|
| `frontend` | `frontend/Dockerfile` (Next.js `output: 'standalone'`) | `node server.js` | `app.<domínio>` |
| `backend` | `backend/Dockerfile` | `uvicorn app.main:app --host 0.0.0.0 --port 8000` | `api.<domínio>` |
| `worker` | `worker/Dockerfile` | `python -m worker` | `wh.<domínio>` |

- HTTPS automático pelo Easypanel (Let's Encrypt). **O dono precisa de um domínio** (item M3).
- Deploy pelo Easypanel a partir da branch `main` do GitHub. Migrations: `supabase db push` **antes** do PR, conforme `.claude/rules/devops-push-pr.md`.
- Health checks: `GET /health` nos três serviços (o do frontend em `/api/health`).

## 12. CI (GitHub Actions, Story 1.2)
Em todo PR contra a `main`:
- **frontend:** `npm ci` → `npm run lint` → `npm run typecheck` → `npm test` → `npm run build`
- **backend / worker:** `uv sync --frozen` → `ruff check` → `ruff format --check` → `mypy` → `pytest`
- Testes de banco (Supabase local no CI) entram a partir da Story 1.3.

## 13. Padrões de código
- **Python:** módulos com `router.py` (rotas finas), `schemas.py` (Pydantic), `service.py` (regras), `repo.py` (acesso ao Supabase). Regras de negócio nunca no router. Exceções de domínio em `core/errors.py`, convertidas em JSON pelo handler global. Logs em JSON (`core/logging.py`), **sem dados pessoais em texto aberto** (telefone mascarado).
- **Frontend:** telas em `apps/web/app/(app)/<feature>/page.tsx`; componentes novos e reutilizáveis vão para `@friocerto/ui`; chamadas ao backend só por `lib/api.ts`; textos da interface em PT-BR (NFR1).
- **Banco:** uma migration por story (`supabase/migrations/<timestamp>_<story>_<descricao>.sql`), sempre com as políticas de RLS na mesma migration.
- **Testes:** `backend/tests/<modulo>/test_*.py`, `worker/tests/test_*.py`, `frontend/**/*.test.tsx`. Cobertura mínima: **80% em `services/`** (regras de negócio); demais camadas por cenários.

## 14. Segurança e privacidade
- Tokens da uazapi, service role e chaves nunca chegam ao navegador (NFR10); conferido na revisão de cada story.
- RLS em 100% das tabelas (NFR3), testado por story com usuário sem permissão.
- Uploads só por URL pré-assinada com validade de 10 minutos e tipo de arquivo restrito (imagens e PDF).
- `audit_log` para operações de instância (2.1 AC4), aprovação de OS, mudanças de permissão e de configuração da IA.
- **LGPD (NFR8) — recomendação, aguardando decisão do dono:** coletar só o necessário (já previsto no FR32); base legal de execução de contrato; permitir exportar e excluir os dados de um cliente a pedido; logs sem dados pessoais em texto aberto; política de privacidade publicada. Nível de exigência formal: **a definir pelo dono**.

## 15. Desempenho (NFR9) — recomendação, aguardando o dono
| Indicador | Meta sugerida |
|---|---|
| Resposta da API (p95) | < 500 ms |
| Resposta do webhook à uazapi | < 200 ms |
| Resposta da IA ao cliente (p95, sem contar o "digitando") | < 15 s |
| Cálculo de horários livres (7 dias, 5 técnicos) | < 300 ms |

---

## 15A. Operação

| Tema | Decisão |
|---|---|
| Ambientes | **Local** (Supabase local + `npm run dev`) e **produção** (Easypanel + Supabase remoto). Sem ambiente de homologação na fase 1 (cliente único, plano free); cada PR é validado pelo CI e pelos testes contra o Supabase local |
| Backup | O plano free não tem restauração por ponto no tempo: job diário do worker (3h) faz `pg_dump` do schema `public` e grava no R2 (`backups/AAAA-MM-DD.sql.gz`), mantendo os últimos 14 |
| Rollback de código | Easypanel: reimplantar o commit anterior da `main`. Cada PR é pequeno (uma story) para facilitar |
| Rollback de banco | Migrations só para frente; cada migration de risco traz no PR o SQL de reversão. Em último caso, restauração do backup diário |
| Dimensionamento | Um contêiner por serviço. Recomendação para a VPS: 2 vCPU e 4 GB de RAM (os três serviços + folga para builds). O consumidor da fila roda 2 tarefas em paralelo; se precisar, sobe-se uma segunda réplica do worker, que o `SKIP LOCKED` já suporta |
| Cache | Catálogo e configuração da IA em memória no worker por 60 s; sem cache distribuído |
| Monitoramento | Health checks do Easypanel; logs em JSON (stdout) visíveis no Easypanel; indicadores no Painel (Developer): itens pendentes na fila, mensagens com erro de envio, custo de IA do dia, status da instância |
| Alertas operacionais | Fila com mais de 20 itens pendentes ou instância desconectada → alerta na central (11.2) e aviso ao Developer pelo WhatsApp institucional |
| Testes de acessibilidade | `eslint-plugin-jsx-a11y` no lint (1.2) e verificação automática com `@axe-core/playwright` nos testes de ponta a ponta (a partir do Épico 6); revisão manual por teclado em cada tela nova |

## 16. Pendências do dono

| # | Pendência | Onde impacta | Padrão adotado até decidir |
|---|---|---|---|
| P1 | Confirmar o item **M2** (orçamento dos agentes no Módulo 1) | 8.2, 8.3 | Seção 7.8 |
| P2 | Nível de exigência de **LGPD** (NFR8) | Seção 14 | Recomendação da seção 14 |
| P3 | Metas de **desempenho** (NFR9) | Seção 15 | Metas sugeridas |
| P4 | **Contas e credenciais** (M3): Supabase, OpenAI, R2, token admin da uazapi, Easypanel, Asaas (se contratar) e **domínio** | 1.3, 1.6, 1.7, 3.1, 10.3 | — (bloqueia) |
| P5 | Avaliar a ação "transferir conversa" (FR28) com atendente único | 2.6 | Mantida (transferir = encaminhar ao atendente) |
| P6 | Persona de cada agente | 3.2 | Campo `persona` editável na Área Developer |

## 17. Ajustes que o @pm deve levar ao PRD
1. Remover os **[A DEFINIR com o @architect]** resolvidos: autenticação (D1), testes (D13), divisão de modelos (D8), Asaas (D12).
2. Registrar a interpretação de FR42 (1) × NFR4 (D11): chaves de infraestrutura em variável de ambiente; OpenAI e Asaas no Supabase Vault.
3. Item M1: História 6.2 sem equipamentos; campo entra na 9.1 (seção 7.9).

---

## 18. Guia de implementação por story (ordem de execução)

> Para cada story: **executor**, o que construir, testes obrigatórios e pontos de atenção. O @sm usa este guia para escrever os Dev Notes de cada story; o @dev executa **na ordem abaixo**.
> Legenda de executor: @dev (código), @data-engineer (migrations e RLS), @devops (infra e deploy), @ux-design-expert (componentes de UI).

### Ordem e paralelismo

| Onda | Stories | Observação |
|---|---|---|
| 1 | 1.1 ✅ · 1.7 (paralela, depende de P4) | |
| 2 | 1.2 | base de tudo |
| 3 | 1.3 · 1.6 (paralelas) | 1.6 depende de P4 (domínio) |
| 4 | 1.4 → 1.5 | |
| 5 | 2.1 → 2.2 → 2.3 · 2.4 → 2.5 → 2.6 | 2.4 e 2.5 podem começar junto com 2.2 |
| 6 | 3.1 → 3.2 → 3.3 → 3.4 → 3.5 | |
| 7 | 4.1 → 4.2 → 4.3 | |
| 8 | 5.1 · 5.2 · 5.3 · 5.4 (paralelas entre si) | |
| 9 | 6.1 → 6.2 → 6.3 | |
| 10 | 7.1 → 7.2 | |
| 11 | 8.1 · 8.2 · 8.3 (paralelas) → 8.4 | **libera o Módulo 1** |
| 12 | 9.1 → 9.2 → 9.3 | **libera o Módulo 2** |
| 13 | 10.1 · 10.2 → 10.3 → 10.4 | **libera o Módulo 3** |
| 14 | 11.1 → 11.2 | |

---

### Épico 1 — Fundação e Arquitetura

**1.1 Arquitetura e especificação de frontend** — @architect + @ux · este documento e `docs/front-end-spec.md`.

**1.2 Estrutura do projeto** — @dev (+ @devops para o CI)
- Criar `backend/` e `worker/` com `pyproject.toml` (Python 3.13, uv), `app/main.py` com `GET /health`, `core/config.py` (pydantic-settings), `core/logging.py`, `core/errors.py`.
- Worker: `worker/__main__.py` sobe FastAPI (`/health`) + loop vazio do consumidor + APScheduler sem jobs.
- O worker depende do backend: `[tool.uv.sources] friocerto-backend = { path = "../backend", editable = true }`.
- Dockerfiles dos três serviços; `output: 'standalone'` no `next.config.mjs`.
- `package.json` na raiz: `npm run dev` sobe os três serviços com `concurrently`.
- `.env.example` (seção 10), `.gitignore` com `.env*`.
- Frontend: adicionar ESLint (`npm run lint`) e Vitest (`npm test`) com um teste de exemplo do `@friocerto/modules` (`resolveModules`).
- `.github/workflows/ci.yml` (seção 12).
- **Testes:** `GET /health` (backend e worker); `resolveModules` (frontend).
- **Atenção:** README da raiz com o comando único e os pré-requisitos (Node ≥ 20, Python 3.13, uv, Docker, Supabase CLI).

**1.3 Banco de dados e manutenção do plano free** — @data-engineer (+ @dev para o job)
- Instalar a Supabase CLI; `supabase init`; `supabase/config.toml`.
- Migration: extensões (`pgcrypto`, `vector`, `pg_trgm`, `btree_gist`), `empresas`, `usuarios`, `audit_log`, funções da seção 5.3, trigger `atualizado_em`.
- `supabase/seed.sql`: a empresa fixa (`FRIOCERTO_EMPRESA_ID`).
- `backend/app/core/supabase.py`: `cliente_do_usuario(jwt)` e `cliente_servico()`.
- Job keep-alive no worker (a cada 6 h).
- **Testes:** RLS — usuário anônimo não lê `empresas`; o job executa sem erro.
- **Atenção:** projeto Supabase remoto depende de P4. Desenvolvimento local com `supabase start` (Docker).

**1.4 Login e usuário Developer** — @dev
- Frontend: `app/(auth)/login/page.tsx`, `lib/supabase.ts`, `middleware.ts` (sem sessão → `/login`), "Esqueci minha senha".
- Backend: `core/auth.py` (valida JWT, carrega `usuarios`), `GET /me`.
- Seed do Developer (`FRIOCERTO_DEVELOPER_EMAIL`, `is_developer = true`, sem perfil).
- Substituir `currentUser` de `lib/config.ts` pelos dados do `/me`.
- **Testes:** JWT inválido → 401; Developer → `/me` com todas as permissões; rota protegida sem sessão redireciona.

**1.5 Área Developer** — @dev
- Rota `app/(app)/developer/` com abas vazias: Integrações, Agentes de IA, Palavras-chave, Transbordo e limites, Registros.
- Backend: dependência `requer_developer()`; `GET /developer/config` (estrutura).
- Item de menu visível só se `is_developer`.
- **Testes:** usuário não Developer → 403 no backend e item de menu ausente.

**1.6 Publicação no servidor** — @devops
- Três serviços no Easypanel (seção 11), variáveis de ambiente, domínios com HTTPS, health checks.
- **Testes:** `GET /health` público nos três domínios.
- Job de backup diário no worker (seção 15A), com `integrations/r2.py` mínimo (upload).
- **Atenção:** depende de P4 (VPS, Easypanel, domínio, bucket R2). A URL do worker vira `WORKER_PUBLIC_URL`.

**1.7 Validar o contrato da uazapi** — @dev · story já criada; resultado em `docs/Uazapi/contrato-validado.md`, que vira a fonte da verdade para `integrations/uazapi.py`.

---

### Épico 2 — WhatsApp e Caixa de Atendimento

**2.1 Instâncias e acesso seguro** — @data-engineer (tabela) + @dev
- Migration `whatsapp_instancias` (RLS: Developer). A coluna `token` **não** é exposta: o backend devolve um schema sem ela.
- `integrations/uazapi.py` com os endpoints de `contrato-validado.md` (criar, conectar, status, desconectar, excluir, configurar webhook, enviar texto e mídia), `httpx` com timeout de 15 s.
- `modules/atendimento/whatsapp/` (router, service, repo) + `audit_log` em cada operação.
- **Testes:** uazapi simulada (`respx`): criar instância grava token; resposta da API nunca contém `token`; auditoria registrada.

**2.2 Modal "Conectar WhatsApp"** — @dev (+ @ux para o modal)
- Tela `/canais` + modal (front-end-spec, seção Canais). Sequência no backend: criar → configurar webhook (`WORKER_PUBLIC_URL/webhook/{token}`) → conectar (QR Code).
- Consulta de status a cada 5 s até `connected` → fecha o modal; QR expirado → "Gerar novo QR Code".
- **Testes:** ordem das chamadas (webhook **antes** do QR Code); erros mapeados para mensagens em PT-BR.

**2.3 Gerenciar a instância** — @dev
- Card da instância com status, número e perfil; Desconectar; Excluir (**logout antes**); chave "IA ligada".
- **Testes:** excluir chama logout e depois delete; `ia_ativa = false` faz o worker não responder.

**2.4 Receber mensagens (webhook)** — @data-engineer (tabelas) + @dev
- Migration: `contatos`, `conversas`, `mensagens`, `fila_processamento`.
- `worker/webhook.py` (200 imediato), `normalizer.py` (v1/v2: telefone só dígitos com DDI, nome, texto, tipo de mídia, `fromMe`), `queue.py` (SKIP LOCKED, tentativas).
- Eventos de conexão atualizam `whatsapp_instancias.status`.
- **Testes:** payloads v1 e v2 de exemplo (tirados da 1.7) → mesmo resultado normalizado; mensagem repetida não duplica; token desconhecido → 404; tempo de resposta < 200 ms.

**2.5 Enviar mensagens** — @dev
- `worker/sender.py` (regras da seção 7.6) e `backend` reutilizando `integrations/uazapi.py` para respostas manuais.
- Mídia: PDF por URL pré-assinada do R2.
- **Testes:** atraso e "digitando" aplicados; falha da uazapi → 3 tentativas → `status_envio = erro`.

**2.6 Caixa de atendimento** — @dev (+ @ux)
- Tela `/atendimento` em 3 colunas (front-end-spec); filtros incluindo "Aguardando atendente".
- Atualização da lista: consulta a cada 5 s (simples e suficiente para um prestador autônomo; tempo real fica para depois).
- Responder, nota interna, transferir (= encaminhar ao atendente, P5), pausar/retomar IA, resolver.
- **Testes:** filtros; nota interna nunca é enviada ao cliente; pausar IA reflete no worker.

---

### Épico 3 — Base dos Agentes e Transbordo

**3.1 Controle da IA** — @data-engineer (tabelas) + @dev
- Migration: `ia_agentes` (seed dos 5 agentes, desligados), `ia_palavras_chave`, `ia_config`, `ia_decisoes`.
- Supabase Vault para `openai_api_key` e `asaas_api_key` (D11); backend lê o Vault com service role; a tela mostra só "configurada / não configurada" e o botão "Testar conexão".
- Abas da Área Developer preenchidas (8 controles do FR42).
- **Testes:** chave nunca retorna na API; alterar modelo/prompt reflete no próximo atendimento; limite de gasto bloqueia a chamada (seção 7.5).

**3.2 Agente orquestrador** — @dev
- `worker/agents/orquestrador.py` (seção 7.4), `openai_client.py` com registro de custo.
- Campo `persona` por agente (P6).
- **Testes:** palavra-chave → agente certo sem chamar a OpenAI; confiança baixa → transbordo; OpenAI fora → transbordo `falha_ia`.

**3.3 Atendente único de transbordo** — @data-engineer + @dev
- Migration `transbordo_atendente` (único por empresa) e `transbordos`; tela `/transbordo`.
- `worker/agents/transbordo.py` (seção 7.3): aviso imediato ao número do atendente pelo WhatsApp institucional.
- **Testes:** os 5 motivos geram transbordo; IA pausada até "Devolver à IA"; aviso enviado ao atendente.

**3.4 Horário de atendimento humano** — @data-engineer + @dev
- Migration `transbordo_horarios`; página `/base-conhecimento` com a aba "Horário de atendimento" e o modal (front-end-spec).
- Feature `base-conhecimento` no catálogo de módulos.
- **Testes:** dentro e fora do horário (inclusive virada de dia e fuso); fora do horário → mensagem com o horário + aviso imediato ao atendente (FR45); agentes não são afetados.

**3.5 Esqueleto dos agentes especialistas** — @dev
- `worker/agents/{tecnico,novos_clientes,clientes_antigos,financeiro}.py` com a interface comum `responder(contexto) -> Resposta`; nesta fase todos devolvem `Transbordo(motivo)`.
- **Testes:** cada especialista recebe a conversa do orquestrador e transfere; nenhuma resposta contém preço ou horário (NFR7).

---

### Épico 4 — Perfis e Usuários

**4.1 Perfis com permissões** — @data-engineer + @dev
- Migration `perfis`, `perfil_permissoes`; tela `/perfis` com a matriz (features × 4 operações) gerada a partir do catálogo.
- **Testes:** a matriz cobre todas as features do catálogo; CRUD.

**4.2 Usuários** — @dev
- Tela `/usuarios`; criação pelo backend com `auth.admin.create_user` (service role) + convite por e-mail; perfil obrigatório.
- Hook `usePermissao` e `requer(feature, op)` aplicados em todas as telas e rotas já existentes.
- **Testes:** usuário sem permissão não vê a tela nem o botão; rota devolve 403.

**4.3 Permissões no banco** — @data-engineer
- `tem_permissao()` completa; **reescrever as políticas de todas as tabelas dos Épicos 1 a 3** para `tem_permissao(feature, op)`, mantendo o Developer com acesso total.
- **Testes:** para cada tabela, um usuário sem permissão não lê nem grava (teste parametrizado).

---

### Épico 5 — Cadastros do Atendimento

**5.1 Dados da empresa** — @dev
- Tela `/configuracoes` (aba Empresa); migration `empresa_horarios`; a marca do `AppShell` vem de `empresas.nome`.
- **Testes:** horário de funcionamento salvo é usado pela função da 6.1 (teste de integração lá).

**5.2 Serviços e peças** — @data-engineer + @dev
- Migration `catalogo_itens` (checagem: serviço exige `duracao_min > 0` e `liberacao_min >= 0`); modal (front-end-spec).
- Exclusão bloqueada se houver `os_itens` (FK `restrict`); oferecer "Desativar".
- Trigger que marca o documento correspondente de `kb_documentos` para reindexar (a tabela nasce na 7.1; a 7.1 cria o trigger).
- **Testes:** validações; exclusão de item usado → 409 com mensagem clara.

**5.3 Técnicos e jornada** — @data-engineer + @dev
- Migration `tecnicos`, `tecnico_jornadas`, `agenda_bloqueios`; tela `/tecnicos` com a jornada semanal.
- **Testes:** jornada sem sobreposição no mesmo dia; cor obrigatória.

**5.4 Clientes** — @data-engineer + @dev
- Migration `clientes`; `GET /cep/{cep}` (ViaCEP pelo backend, com timeout e preenchimento manual se falhar).
- Conversão contato → cliente: ao criar cliente com telefone de um contato existente, preencher `contatos.cliente_id`.
- Atalhos: `https://wa.me/<telefone>` e link do mapa com o endereço.
- **Testes:** CEP válido, inválido e ViaCEP fora do ar; conversão do contato.

---

### Épico 6 — Agenda e OS

**6.1 Horários livres** — @dev
- `services/horarios_livres.py` (seção 7.1) + `GET /agenda/horarios-livres`.
- **Testes (cobertura ≥ 90%):** jornada parcial, horário de almoço, OS existente, bloqueio, liberação, virada de dia, técnico inativo, empate na escolha do técnico.

**6.2 Criar e gerenciar OS** — @data-engineer + @dev
- Migration `ordens_servico`, `os_itens`, `os_historico`, numeração sequencial por empresa e a **exclusion constraint** (seção 6).
- Tela `/os` (lista e formulário) e `/os/aprovacoes`; `POST /os/{id}/aprovar` grava o lembrete (seção 7.7).
- Catálogo do frontend: `FEATURES.os = 'atendimento'`, `aprovacoes: 'atendimento'`.
- **Sem campo equipamentos** (seção 7.9).
- **Testes:** duas OS no mesmo horário → a segunda recebe 409; transições de status válidas; histórico gravado em cada mudança.

**6.3 Agenda estilo Google Agenda** — @dev (+ @ux)
- Evoluir o `WeekCalendar` do `@friocerto/ui` para visões dia, semana e mês; eventos de jornada (fundo) e de OS (cor do técnico).
- Arrastar → `PATCH /os/{id}/reagendar` (valida com a 6.1 e com a constraint).
- **Testes:** soltar em horário ocupado volta o evento e mostra o aviso; troca de visões.

---

### Épico 7 — Base de Conhecimento

**7.1 Alimentar a base** — @data-engineer + @dev
- Migration `kb_documentos`, `kb_chunks` (índice HNSW no embedding, GIN no `tsv`); trigger do catálogo (5.2).
- Job de reindexação no worker (chunk de ~800 caracteres, sobreposição de 100).
- Abas de conteúdo na página `/base-conhecimento`.
- **Testes:** alterar preço de um serviço atualiza o conteúdo indexado; documento manual indexado.

**7.2 Busca híbrida** — @dev
- Função SQL `kb_buscar(consulta, embedding, limite)` com RRF (k = 60); limiar de confiança configurável.
- **Testes:** conjunto de 10 perguntas de referência (o @qa revisa); sem resultado confiável → `fora_da_base`.

---

### Épico 8 — Agentes Especialistas (libera o Módulo 1)

**8.1 Agente técnico** — @dev · ferramenta `buscar_base_conhecimento`; sem confiança → transbordo `fora_da_base`.
- **Testes:** responde com base na KB; não inventa (pergunta fora da base → transbordo).

**8.2 Agente de novos clientes** — @dev
- Ferramentas: `cotar_servicos` (`/catalogo/cotar`), `buscar_horarios` (6.1), `criar_cliente`, `criar_os`.
- Regra de proteção: pedir nome e endereço **antes** de chamar `cotar_servicos` (validado no código da ferramenta, não só no prompt).
- **Testes:** a ferramenta de preço recusa sem nome e endereço; documento só pedido ao fechar; serviço inexistente → transbordo.

**8.3 Agente de clientes antigos** — @dev
- Mesmas ferramentas; cumprimenta pelo nome; critério 2 (equipamentos) só se o módulo `os` estiver liberado.
- **Testes:** reconhecimento pelo telefone; com e sem Módulo 2.

**8.4 Fluxo de criação de OS** — @dev
- Orquestra 8.2/8.3 com o fluxo do PRD; 2 ou 3 opções de horário; resumo e confirmação; `criar_os` trata 409 oferecendo novas opções; aprovação humana; aviso ao técnico e ao cliente; lembrete 24 h.
- **Testes de ponta a ponta (simulando a uazapi e a OpenAI):** fluxo feliz; horário tomado no meio da conversa; cliente desiste.

---

### Épico 9 — Execução da OS (libera o Módulo 2)

**9.1 Equipamentos e preventiva** — @data-engineer + @dev
- Migration `equipamentos`, `os_equipamentos`, view de situação; tela `/equipamentos` com filtro; campo equipamentos na OS (6.2).
- **Testes:** as três situações nos limites (hoje, +15, +16 dias).

**9.2 Meu dia e execução** — @dev (+ @ux)
- Tela `/meudia` (mobile first): iniciar, checklist (itens do protótipo), estado do filtro ("Bom", "Sujo — limpo no local", "Danificado — trocar"), fotos antes/depois (URL pré-assinada), assinatura em canvas com o nome de quem assinou, finalizar.
- Migration `os_execucao`, `os_fotos`.
- **Testes:** não finaliza sem assinatura; upload só de imagem; técnico só vê as próprias OS.

**9.3 PDF e próxima preventiva** — @dev
- `integrations/pdf.py` (ReportLab): itens, checklist, fotos, assinatura, Pix; grava no R2; `enviar-pdf` pela 2.5.
- Ao concluir uma preventiva: `ultima_preventiva = hoje`, `proxima = hoje + periodicidade`.
- **Testes:** PDF gerado com todas as seções; recálculo da preventiva.

---

### Épico 10 — Orçamentos e Financeiro (libera o Módulo 3)

**10.1 Orçamentos** — @data-engineer + @dev · migrations, tela `/orcamentos`, PDF (reaproveita 9.3), envio (2.5), converter em OS (escolha de horário pela 6.1), indicadores.
- **Testes:** transições de status; conversão cria OS com os mesmos itens.

**10.2 Contas a receber** — @data-engineer + @dev · `contas_receber` criada ao concluir a OS; tela `/financeiro`; registro de recebimento; indicadores.
- **Testes:** OS concluída gera conta; filtros e totais.

**10.3 Pix ou Asaas** — @dev · `integrations/asaas.py`; sem Asaas configurado, OS e orçamentos mostram a chave Pix; webhook do Asaas valida `asaas-access-token` e marca o recebimento.
- **Testes:** webhook com token errado → 401; pagamento confirmado → conta recebida.

**10.4 Agente financeiro** — @dev · ferramenta `consultar_contas_cliente`; só clientes antigos; sem Módulo 3 → transbordo `financeiro`.
- **Testes:** contato novo nunca recebe dados financeiros.

---

### Épico 11 — Painel e Alertas

**11.1 Painel** — @dev · `GET /painel/resumo` (uma consulta por bloco, respeitando módulos); evolui a tela `/painel` existente (hoje com dados de demonstração em `lib/demo.ts`).
- **Testes:** blocos de módulos não liberados não aparecem.

**11.2 Alertas** — @dev · tabela ou view de alertas recalculada pelo job diário (seção 9); central de alertas. **Recomendação:** incluir também "WhatsApp desconectado" (sugestão do @po, depende do dono aprovar).
- **Testes:** cada tipo de alerta aparece e some quando resolvido.
