# EP06: Agenda e OS

**Status:** 📋 Planejamento
**Responsável (owner):** @pm (Morgan)
**Módulo de lançamento:** Módulo 1 — Atendimento e Agendamento (OS: criação e aprovação)
**Sequência:** 6 de 11
**Criado em:** 2026-11-25
**Fonte oficial:** `docs/prd.md` v0.3 — Épico 6 · `docs/architecture.md` §6, §7 e §18 (onda 9)

---

## Objetivo

Agendar sem conflito e criar e aprovar a OS (Módulo 1).

## Valor para o negócio

Zero conflito de agenda é a promessa central do produto: nenhum técnico com dois atendimentos no mesmo horário, inclusive com OS ainda Pendente.

---

## Escopo

### Dentro
- Cálculo de horários livres com as três fontes de verdade (funcionamento, jornada, agenda), duração e tempo de liberação.
- Criação e gestão da OS: quatro tipos, cinco status, itens do catálogo com total, histórico e aprovação da OS Pendente (FR36).
- Agenda no estilo Google Agenda (dia, semana, mês), com cor do técnico e reagendamento por arrastar.
- Garantia no banco contra conflito (exclusion constraint — D3).

### Fora
- Execução da OS em campo, checklist, fotos, assinatura e PDF (EP09 — Módulo 2).
- Equipamentos na OS (M1: entram no EP09).

---

## Stories

| Código | Story | Executor | Status |
|---|---|---|---|
| EP06.S01 | 6.1 Cálculo de horários livres | @dev | Ready — [6.1](../stories/6.1.calculo-de-horarios-livres.md) |
| EP06.S02 | 6.2 Criar e gerenciar OS | @dev (+ @data-engineer na constraint) | Ready — [6.2](../stories/6.2.criar-e-gerenciar-os.md) |
| EP06.S03 | 6.3 Agenda no estilo Google Agenda | @dev | Ready — [6.3](../stories/6.3.agenda-estilo-google.md) |

## Ordem de execução

```
Onda 9: 6.1 → 6.2 → 6.3
```

---

## Dependências

- **Depende de:** EP05 (empresa, serviços, técnicos e clientes).
- **Bloqueia:** EP08 (agentes criam OS) e EP09.
- **Pendências do dono:** nenhuma específica.

## Riscos

| Risco | Mitigação |
|---|---|
| Dois clientes no mesmo horário | Exclusion constraint no banco + nova conferência ao gravar (409) |
| Fuso horário incorreto | America/Sao_Paulo em todo cálculo (D15) |

## Critérios de sucesso

- [ ] Só horários realmente livres são oferecidos.
- [ ] O banco recusa OS sobreposta para o mesmo técnico.
- [ ] OS Pendente aprovada por uma pessoa vira Agendada.
- [ ] Agenda com dia, semana e mês e reagendamento por arrastar.

## Change Log

| Data | Versão | Descrição | Autor |
|---|---|---|---|
| 2026-11-25 | 1.0 | Épico criado a partir do PRD v0.3 | @pm (Morgan) |
