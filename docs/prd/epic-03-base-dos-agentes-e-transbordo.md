# EP03: Base dos Agentes e Transbordo

**Status:** 📋 Planejamento
**Responsável (owner):** @pm (Morgan)
**Módulo de lançamento:** Módulo 1 — fundação do atendimento
**Sequência:** 3 de 11
**Criado em:** 2026-11-25
**Fonte oficial:** `docs/prd.md` v0.3 — Épico 3 · `docs/architecture.md` §18 (onda 6)

---

## Objetivo

Colocar a estrutura de IA no ar — controles, orquestrador e transbordo para o atendente humano — para que o atendimento pelo WhatsApp funcione desde já, com um humano respondendo o que a IA ainda não sabe.

## Valor para o negócio

O prestador autônomo passa a ter atendimento 24/7: a IA recebe e classifica, e tudo o que ela ainda não resolve vai para um único atendente humano, sem a IA inventar preço ou horário (NFR7).

---

## Escopo

### Dentro
- Controle da IA na Área Developer: chaves, modelo por agente, ligar/desligar, prompts, palavras-chave, regra de transbordo, limite de gasto e registros (FR42).
- Agente orquestrador com classificação híbrida.
- Atendente único de transbordo (nome e número), avisado pelo WhatsApp institucional e respondendo pela caixa (FR39, FR40).
- Página Base de Conhecimento com a aba "Horário de atendimento" e modal de cadastro (FR44); regra fora do horário (FR45); agentes 24/7 (NFR13).
- Esqueleto dos agentes técnico, novos clientes, clientes antigos e financeiro, que por ora passam tudo ao atendente.

### Fora
- Regras de negócio dos agentes especialistas (EP08) e do agente financeiro (EP10).
- Abas de conteúdo do RAG na Base de Conhecimento (EP07).

---

## Stories

| Código | Story | Executor | Status |
|---|---|---|---|
| EP03.S01 | 3.1 Controle da IA na Área Developer | @dev | Ready — [3.1](../stories/3.1.controle-da-ia.md) |
| EP03.S02 | 3.2 Agente orquestrador | @dev | Ready — [3.2](../stories/3.2.agente-orquestrador.md) |
| EP03.S03 | 3.3 Atendente único de transbordo | @dev | Ready — [3.3](../stories/3.3.atendente-unico-de-transbordo.md) |
| EP03.S04 | 3.4 Horário de atendimento humano | @dev | Ready — [3.4](../stories/3.4.horario-de-atendimento-humano.md) |
| EP03.S05 | 3.5 Esqueleto dos agentes especialistas | @dev | Ready — [3.5](../stories/3.5.esqueleto-dos-agentes-especialistas.md) |

## Ordem de execução

```
Onda 6: 3.1 → 3.2 → 3.3 → 3.4 → 3.5
```

---

## Dependências

- **Depende de:** EP02 (receber e enviar mensagens; caixa de atendimento).
- **Bloqueia:** EP07 (página Base de Conhecimento) e EP08.
- **Pendências do dono:** P6 — persona de cada agente (nome, personalidade e tom de voz), a cobrar neste épico; P4 — chave da OpenAI.

## Riscos

| Risco | Mitigação |
|---|---|
| Custo da OpenAI fora de controle | Limite de gasto diário/mensal; ao atingir, transbordo (D16) |
| IA informar preço ou horário antes do EP08 | Esqueleto só faz transbordo nesta fase (NFR7) |
| OpenAI fora do ar | Transbordo para o atendente (D16) |

## Critérios de sucesso

- [ ] Toda mensagem é classificada pelo orquestrador e chega a um agente.
- [ ] O atendente único recebe o aviso no próprio número e responde pela caixa.
- [ ] Fora do horário humano, o cliente recebe o horário de atendimento e a conversa fica "Aguardando atendente".
- [ ] Controles da IA editáveis na Área Developer sem mexer no código.

## Change Log

| Data | Versão | Descrição | Autor |
|---|---|---|---|
| 2026-11-25 | 1.0 | Épico criado a partir do PRD v0.3 | @pm (Morgan) |
