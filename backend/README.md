# Backend do Frio Certo

> **Status:** estrutura **aprovada pelo dono em 2026-11-21**. O código ainda não foi escrito: ele nasce das stories do PRD (`docs/prd.md`).
> **Stack:** Python (FastAPI), Supabase, uazapi, OpenAI, Cloudflare R2, Asaas, VPS Hostinger + Easypanel.

## Decisão

O sistema roda em **três serviços**, cada um na sua pasta e com o mesmo nome no Easypanel:

| Pasta / serviço | O que faz |
|---|---|
| `frontend/` | App web em Next.js (telas do painel) |
| `backend/` | API em Python (FastAPI), organizada por módulos — **este diretório** |
| `worker/` | Processos em segundo plano: webhook do WhatsApp, agentes de IA e tarefas agendadas — ver `worker/README.md` |

O `backend` é um **monólito modular**: uma única API, com uma pasta por módulo, e os módulos são ligados ou desligados por configuração. Um serviço por módulo não compensa, porque os módulos são cumulativos e dependem uns dos outros (a OS precisa da agenda; o financeiro precisa da OS).

## Estrutura proposta

```
backend/
├── app/
│   ├── main.py                  # registra só os routers dos módulos liberados
│   ├── core/
│   │   ├── config.py            # variáveis de ambiente
│   │   ├── supabase.py          # cliente Supabase
│   │   ├── auth.py              # valida o usuário (Supabase Auth) + usuário Developer
│   │   ├── rbac.py              # permissões do módulo Perfil
│   │   └── licensing.py         # módulos liberados (mesmo catálogo de @friocerto/modules)
│   ├── modules/
│   │   ├── atendimento/         # MÓDULO 1 — Atendimento / Agendamento
│   │   │   ├── agenda.py        #   horários livres, marcar, remarcar, cancelar
│   │   │   ├── contatos.py      #   contato × cliente
│   │   │   ├── clientes.py
│   │   │   ├── servicos.py      #   serviços e valores (base do RAG)
│   │   │   ├── tecnicos.py      #   técnicos e jornada
│   │   │   ├── whatsapp.py      #   instâncias uazapi (modal)
│   │   │   └── conversas.py     #   caixa de atendimento, transbordo
│   │   ├── os/                  # MÓDULO 2 — Ordem de Serviço
│   │   │   ├── ordens.py        #   OS, status, aprovação da OS Pendente
│   │   │   ├── equipamentos.py  #   preventiva
│   │   │   └── relatorio_pdf.py
│   │   └── financeiro/          # MÓDULO 3 — Orçamento / Financeiro
│   │       ├── orcamentos.py
│   │       ├── recebimentos.py
│   │       └── asaas.py
│   └── integrations/            # clientes de serviços externos (também usados pelo worker)
│       ├── uazapi.py            #   contrato validado na História 7.1
│       ├── openai_client.py
│       ├── r2.py
│       ├── asaas.py
│       └── viacep.py
├── tests/
├── pyproject.toml               # gerenciado com uv
└── Dockerfile
```

> O `worker/` reaproveita `app/core` e `app/integrations` instalando o `backend` como dependência local (uv), em vez de copiar código.

## Como a liberação por módulo funciona

1. `core/licensing.py` lê os módulos liberados (hoje: variável `FRIOCERTO_MODULES`; no SaaS: tabela por empresa).
2. `main.py` só registra os routers dos módulos liberados — a rota de um módulo não contratado nem existe.
3. Cada rota confere a permissão do perfil (RBAC), e o banco reforça com RLS.
4. **O frontend esconde; o backend garante.** `@friocerto/modules` (frontend) e `licensing.py` (backend) usam o mesmo catálogo de módulos.

## Publicação no Easypanel (VPS Hostinger)

| Serviço | Comando | Origem |
|---|---|---|
| `frontend` | `node server.js` (Next.js `output: standalone`) | `frontend/Dockerfile` |
| `backend` | `uvicorn app.main:app` | `backend/Dockerfile` |
| `worker` | `python -m worker` | `worker/Dockerfile` |

Banco, autenticação e vetores (pgvector) ficam no **Supabase**; arquivos no **Cloudflare R2**.

## Preparação para a fase 2 (SaaS multi-tenant)

Mesmo com cliente único, toda tabela nasce com a coluna **`empresa_id`** (com um valor fixo por enquanto). Assim a fase 2 vira "ligar" o multi-tenant, sem refazer o banco:

- RLS já filtrando por `empresa_id`;
- módulos liberados por empresa (tabela `empresa_modulos`);
- instância uazapi por empresa.
