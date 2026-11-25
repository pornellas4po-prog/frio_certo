# EP08: Agentes Especialistas

**Status:** 📋 Planejamento
**Responsável (owner):** @pm (Morgan)
**Módulo de lançamento:** 🚀 **Módulo 1 — Atendimento e Agendamento (marco de lançamento)**
**Sequência:** 8 de 11
**Criado em:** 2026-11-25
**Fonte oficial:** `docs/prd.md` v0.3 — Épico 8 · `docs/architecture.md` D7, D8, §7 e §18 (onda 11)

---

## Objetivo

Atender o cliente automaticamente no WhatsApp, do primeiro "oi" à OS agendada. **Ao fim deste épico, o Módulo 1 pode ser liberado.**

## Valor para o negócio

É o primeiro produto vendável: atendimento 24/7 que tira dúvidas, faz orçamento, agenda sem conflito e cria a OS para aprovação, com lembrete ao cliente 24 h antes.

---

## Escopo

### Dentro
- Agente técnico respondendo pela base de conhecimento.
- Agente de novos clientes: grava só o contato, pede nome e endereço antes do preço, orça pela base, pede documento só quando leva a OS.
- Agente de clientes antigos: reconhece pelo telefone, orça e agenda.
- Fluxo único de criação de OS pelos agentes: horário livre conferido de novo ao gravar, OS nasce Pendente, aprovação humana, aviso ao técnico, confirmação ao cliente e lembrete 24 h antes (FR37).
- A IA nunca calcula preço nem horário: chama ferramentas do backend (D7).

### Fora
- Critério 2 da story 8.3 (equipamentos e preventiva vencida): ativo só com o Módulo 2 (depende da story 9.1).
- Agente financeiro (EP10).

---

## Stories

| Código | Story | Executor | Status |
|---|---|---|---|
| EP08.S01 | 8.1 Agente técnico | @dev | Ready — [8.1](../stories/8.1.agente-tecnico.md) |
| EP08.S02 | 8.2 Agente de novos clientes | @dev | Ready — [8.2](../stories/8.2.agente-de-novos-clientes.md) |
| EP08.S03 | 8.3 Agente de clientes antigos | @dev | Ready — [8.3](../stories/8.3.agente-de-clientes-antigos.md) |
| EP08.S04 | 8.4 Fluxo de criação de OS pelos agentes | @dev | Ready — [8.4](../stories/8.4.fluxo-de-criacao-de-os.md) |

## Ordem de execução

```
Onda 11: 8.1 · 8.2 · 8.3 (paralelas) → 8.4   ✅ libera o Módulo 1
```

---

## Dependências

- **Depende de:** EP03 (orquestrador e esqueleto), EP06 (horários livres e OS) e EP07 (base de conhecimento).
- **Bloqueia:** lançamento do Módulo 1; EP09.
- **Pendências do dono:** M2/P1 — confirmar se o orçamento dos agentes no Módulo 1 é só o valor informado na conversa (a arquitetura assume que sim); P6 — persona dos agentes.

## Riscos

| Risco | Mitigação |
|---|---|
| Concorrente pedindo preço | Nome e endereço exigidos no código antes do preço, não só no prompt |
| IA inventar preço ou horário | Function calling: preço e horário vêm só do backend (NFR7, D7) |
| Conflito no momento de gravar | Nova conferência + constraint do banco (409) |

## Critérios de sucesso

- [ ] Conversa completa no WhatsApp termina em OS Pendente para aprovação.
- [ ] Após aprovação, técnico avisado e cliente confirmado pelo WhatsApp.
- [ ] Lembrete enviado 24 h antes da visita.
- [ ] Módulo 1 liberado no catálogo `@friocerto/modules`.

## Change Log

| Data | Versão | Descrição | Autor |
|---|---|---|---|
| 2026-11-25 | 1.0 | Épico criado a partir do PRD v0.3 | @pm (Morgan) |
