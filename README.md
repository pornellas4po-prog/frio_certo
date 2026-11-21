# Frio Certo

Aplicativo de gestão para técnicos de refrigeração e climatização: agenda sem conflito, atendimento automático pelo WhatsApp com agentes de IA, ordens de serviço, orçamentos e financeiro.

## Estrutura do repositório

| Pasta | Serviço no Easypanel | O que é |
|---|---|---|
| [`frontend/`](frontend/README.md) | `frontend` | App web em Next.js + pacotes de tema, ícones, componentes e módulos |
| [`backend/`](backend/README.md) | `backend` | API em Python (FastAPI), organizada por módulos |
| [`worker/`](worker/README.md) | `worker` | WhatsApp (webhook), agentes de IA e tarefas agendadas |
| [`docs/`](docs/prd.md) | — | Project brief, PRD e referências (uazapi) |

## Módulos (liberação total ou por módulo)

1. **Atendimento / Agendamento**
2. **\+ Ordem de Serviço** (com os cadastros necessários)
3. **\+ Orçamento / Financeiro**

Fase 1: cliente único. Fase 2: SaaS multi-tenant.

## Método

Desenvolvimento pelo método **AIOX** (stories em `docs/stories/`). Todo commit vai para uma branch e vira PR contra a `main`; o merge é manual.
