# EP02: WhatsApp e Caixa de Atendimento

**Status:** 📋 Planejamento
**Responsável (owner):** @pm (Morgan)
**Módulo de lançamento:** Módulo 1 — fundação do atendimento
**Sequência:** 2 de 11
**Criado em:** 2026-11-25
**Fonte oficial:** `docs/prd.md` v0.3 — Épico 2 · `docs/architecture.md` §18 (onda 5)

---

## Objetivo

Conectar o WhatsApp institucional pela uazapi e receber e responder as mensagens dentro do sistema.

## Valor para o negócio

É o canal de entrada de todos os clientes. Com este épico o prestador já atende pelo app, mesmo antes dos agentes de IA.

---

## Escopo

### Dentro
- Todas as chamadas à uazapi pelo backend (tokens nunca no navegador — NFR10).
- Modal "Conectar WhatsApp" com QR Code e fechamento automático ao conectar.
- Gerenciar a instância (status, desconectar, excluir com logout antes, ligar/desligar IA).
- Webhook com 200 OK imediato e processamento em fila (NFR11); tabela de contatos (FR31).
- Envio de texto e mídia com atraso e "digitando" (NFR12).
- Caixa de atendimento com filtros e estado "Aguardando atendente" (FR45).

### Fora
- Agentes de IA (EP03 e EP08).
- Ação "transferir a conversa" depende da decisão do dono (pendência P5).

---

## Stories

| Código | Story | Executor | Status |
|---|---|---|---|
| EP02.S01 | 2.1 Cadastro de instância e acesso seguro à uazapi | @dev (+ @data-engineer na tabela) | Ready — [2.1](../stories/2.1.cadastro-de-instancia-uazapi.md) |
| EP02.S02 | 2.2 Modal "Conectar WhatsApp" | @dev | Ready — [2.2](../stories/2.2.modal-conectar-whatsapp.md) |
| EP02.S03 | 2.3 Gerenciar a instância | @dev | Ready — [2.3](../stories/2.3.gerenciar-instancia.md) |
| EP02.S04 | 2.4 Receber mensagens (webhook) | @dev (+ @data-engineer nas tabelas) | Ready — [2.4](../stories/2.4.receber-mensagens-webhook.md) |
| EP02.S05 | 2.5 Enviar mensagens | @dev | Ready — [2.5](../stories/2.5.enviar-mensagens.md) |
| EP02.S06 | 2.6 Caixa de atendimento | @dev | Ready — [2.6](../stories/2.6.caixa-de-atendimento.md) |

## Ordem de execução

```
Onda 5: 2.1 → 2.2 → 2.3
        2.4 → 2.5 → 2.6   (2.4 e 2.5 podem começar junto com 2.2)
```

---

## Dependências

- **Depende de:** EP01 (em especial 1.6 — URL pública do webhook — e 1.7 — contrato validado).
- **Bloqueia:** EP03 e todo envio de mensagens dos épicos seguintes.
- **Pendências do dono:** P4 (credenciais uazapi e número institucional); P5 (manter ou não "transferir conversa").

## Riscos

| Risco | Mitigação |
|---|---|
| Vazamento de token | Só backend; token admin em variável de ambiente; auditoria das operações |
| Bloqueio do número pelo WhatsApp | Atraso entre mensagens e "digitando" (NFR12) |
| Perda de mensagens no webhook | 200 OK imediato + fila no Postgres (D4) |

## Critérios de sucesso

- [ ] Cliente conecta o número pelo QR Code e o modal fecha sozinho ao conectar.
- [ ] Mensagens recebidas aparecem na caixa de atendimento.
- [ ] Atendente responde pela caixa e a mensagem chega no WhatsApp do cliente.
- [ ] Nenhum token da uazapi exposto no navegador.

## Change Log

| Data | Versão | Descrição | Autor |
|---|---|---|---|
| 2026-11-25 | 1.0 | Épico criado a partir do PRD v0.3 | @pm (Morgan) |
