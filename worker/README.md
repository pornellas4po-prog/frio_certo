# Worker do Frio Certo

> **Status:** estrutura **aprovada pelo dono em 2026-11-21**. O código ainda não foi escrito: ele nasce das stories do PRD (Épicos 7 e 8).

Serviço em Python que roda **em segundo plano**, separado do `backend`, para que o painel continue no ar mesmo se a IA ou o WhatsApp estiverem lentos.

## O que ele faz

| Tarefa | Por que fica no worker |
|---|---|
| **Webhook da uazapi** — recebe as mensagens do WhatsApp | Precisa responder **200 OK imediatamente** (exigência da uazapi) e processar depois |
| **Agentes de IA** — orquestrador, novos clientes, clientes antigos, técnico, financeiro, transbordo | Uma resposta da IA pode levar vários segundos |
| **Envio de mensagens** — respostas, avisos ao técnico, PDFs | Atraso entre mensagens e status "digitando" (contra bloqueio do número) |
| **Tarefas agendadas** — pedido de confirmação da visita **24 h antes**, lembretes, cron que mantém o Supabase ativo | Rodam em horário fixo, sem depender de alguém abrir o painel |

## Estrutura proposta

```
worker/
├── worker/
│   ├── __main__.py              # ponto de entrada: python -m worker
│   ├── webhook.py               # rota POST /webhook/{token}: responde 200 e enfileira
│   ├── queue.py                 # fila de processamento das mensagens
│   ├── agents/
│   │   ├── orquestrador.py      # classificação híbrida (palavras-chave + significado)
│   │   ├── novos_clientes.py
│   │   ├── clientes_antigos.py
│   │   ├── tecnico.py           # consulta a base de conhecimento (RAG híbrido)
│   │   ├── financeiro.py
│   │   └── transbordo.py
│   ├── sender.py                # envio pela uazapi (texto e mídia)
│   └── jobs.py                  # confirmação 24 h antes, lembretes, cron do Supabase
├── tests/
├── pyproject.toml               # uv; depende do backend local para reaproveitar core e integrations
└── Dockerfile
```

## Relação com o backend

- O worker **não duplica código**: instala o `backend` como dependência local (`uv`) e usa `app.core` (configuração, Supabase) e `app.integrations` (uazapi, OpenAI, R2).
- Os dois serviços conversam pelo **Supabase** (tabelas de conversas, mensagens, OS), sem chamada direta entre eles.
- Toda OS criada pelos agentes nasce **Pendente** e é aprovada por uma pessoa no painel.

## Publicação no Easypanel

Serviço **`worker`**, comando `python -m worker`, a partir de `worker/Dockerfile`. A URL pública do webhook é configurada na instância uazapi (História 7.3).
