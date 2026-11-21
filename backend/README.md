# Backend do Frio Certo — sugestão de estrutura

> **Status:** proposta para validação do dono e do @architect. Nenhum código de backend foi escrito ainda.
> **Base:** PRD v0.2 (`docs/prd.md`), stack decidida (Python, Supabase, uazapi, OpenAI, R2, Asaas, VPS Hostinger + Easypanel) e a liberação por módulos.

## Recomendação em uma frase

**Um único backend Python (FastAPI), organizado por módulos, + um worker separado para WhatsApp e IA.** Os módulos são ligados/desligados por configuração — não vale a pena separar em um serviço por módulo agora.

## Por que não um serviço por módulo?

| Opção | Prós | Contras | Veredito |
|---|---|---|---|
| **Monólito modular** (1 API, pastas por módulo) | Simples de publicar e manter; 1 deploy; módulos ligados por configuração; ideal para cliente único e equipe júnior | Escala junto (aceitável no volume atual) | ✅ **Recomendado** |
| Microsserviço por módulo (3 APIs) | Escala e publica cada módulo separado | 3× deploys, comunicação entre serviços, mais custo na VPS, mais pontos de falha; os módulos dependem uns dos outros (OS precisa da agenda, financeiro precisa da OS) | ❌ Complexo demais agora |

Os módulos são **cumulativos** (Atendimento → +OS → +Financeiro), então separar fisicamente não traz ganho: o cliente sempre tem o módulo 1.

## Estrutura proposta

```
backend/
├── app/                         # API principal (FastAPI)
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
│   └── integrations/            # clientes de serviços externos
│       ├── uazapi.py            #   (contrato validado na História 7.1)
│       ├── openai_client.py
│       ├── r2.py
│       ├── asaas.py
│       └── viacep.py
├── worker/                      # processo separado (mesmo código, outro comando)
│   ├── webhook.py               # recebe a uazapi, responde 200 na hora, enfileira
│   ├── agents/                  # orquestrador + agentes especialistas
│   └── jobs.py                  # lembrete/confirmação de visita 24 h antes, cron do Supabase
├── tests/
├── pyproject.toml               # gerenciado com uv
└── Dockerfile
```

### Como a liberação por módulo funciona no backend

1. `core/licensing.py` lê os módulos liberados (hoje: variável `FRIOCERTO_MODULES`; no SaaS: tabela por empresa).
2. `main.py` só registra os routers dos módulos liberados — uma rota de módulo não contratado nem existe.
3. Cada rota ainda confere permissão do perfil (RBAC) e o banco reforça com RLS.
4. **O frontend esconde; o backend garante.** O pacote `@friocerto/modules` (frontend) e o `licensing.py` (backend) usam o mesmo catálogo de módulos.

### Por que o worker é separado

- O webhook da uazapi precisa responder **200 OK imediatamente** (NFR11); a IA pode levar segundos.
- Lembretes de 24 h antes e o cron do Supabase rodam em horário fixo.
- Se a IA travar, a API do painel continua no ar.

## Publicação no Easypanel (VPS Hostinger)

| Serviço no Easypanel | O que roda | Origem |
|---|---|---|
| `web` | Next.js (`frontend/`, `output: standalone`) | Dockerfile do frontend |
| `api` | FastAPI (`uvicorn app.main:app`) | `backend/Dockerfile` |
| `worker` | `python -m worker` | mesma imagem do `api`, outro comando |

Banco, autenticação e vetores (pgvector) ficam no **Supabase**; arquivos no **Cloudflare R2**.

## Preparação para a fase 2 (SaaS multi-tenant)

Mesmo com cliente único, recomendo criar **desde já** a coluna `empresa_id` (tenant) nas tabelas, com um valor fixo. Assim a fase 2 vira "ligar" o multi-tenant, e não refazer o banco:

- RLS já filtrando por `empresa_id`;
- módulos liberados por empresa (tabela `empresa_modulos`);
- instância uazapi por empresa.

> **Decisão para o dono / @architect:** confirmar o monólito modular + worker e a coluna `empresa_id` desde o início.
