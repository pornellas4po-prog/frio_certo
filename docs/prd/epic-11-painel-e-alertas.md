# EP11: Painel e Alertas

**Status:** 📋 Planejamento
**Responsável (owner):** @pm (Morgan)
**Módulo de lançamento:** Transversal — cada bloco aparece conforme o módulo liberado
**Sequência:** 11 de 11
**Criado em:** 2026-11-25
**Fonte oficial:** `docs/prd.md` v0.3 — Épico 11 · `docs/architecture.md` §18 (onda 14)

---

## Objetivo

Dar uma visão rápida do negócio e não deixar nada passar.

## Valor para o negócio

O dono abre o sistema e vê faturamento, agenda do dia e pendências, e é avisado sobre preventivas, recebimentos e OS sem data.

---

## Escopo

### Dentro
- Painel: faturamento, OS em andamento e concluídas no mês, agenda do dia, preventivas a vencer, recebimentos pendentes, OS sem agendamento, gráficos (faturamento 6 meses e atendimentos por tipo).
- Cada bloco aparece somente se o módulo correspondente estiver liberado.
- Central de alertas: preventivas, recebimentos e OS sem data.

### Fora
- Relatórios avançados e exportação (não constam no PRD).

---

## Stories

| Código | Story | Executor | Status |
|---|---|---|---|
| EP11.S01 | 11.1 Painel | @dev | Ready — [11.1](../stories/11.1.painel.md) |
| EP11.S02 | 11.2 Alertas | @dev | Ready — [11.2](../stories/11.2.alertas.md) |

## Ordem de execução

```
Onda 14: 11.1 → 11.2   ✅ produto completo
```

---

## Dependências

- **Depende de:** EP10 (dados financeiros) e EP09 (preventivas); os blocos do Módulo 1 dependem só do EP08.
- **Bloqueia:** nenhum.
- **Pendências do dono:** nenhuma específica.

## Riscos

| Risco | Mitigação |
|---|---|
| Bloco aparecer sem o módulo liberado | Mesmo catálogo no backend (`licensing.py`) e no `@friocerto/modules` |
| Painel lento | Metas de desempenho a definir pelo dono (P3); a arquitetura §15 deixa recomendação |

## Critérios de sucesso

- [ ] Painel exibe só os blocos dos módulos liberados.
- [ ] Os três tipos de alerta aparecem na central.

## Change Log

| Data | Versão | Descrição | Autor |
|---|---|---|---|
| 2026-11-25 | 1.0 | Épico criado a partir do PRD v0.3 | @pm (Morgan) |
