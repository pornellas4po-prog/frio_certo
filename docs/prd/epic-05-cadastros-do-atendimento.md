# EP05: Cadastros do Atendimento

**Status:** 📋 Planejamento
**Responsável (owner):** @pm (Morgan)
**Módulo de lançamento:** Módulo 1 — Atendimento e Agendamento
**Sequência:** 5 de 11
**Criado em:** 2026-11-25
**Fonte oficial:** `docs/prd.md` v0.3 — Épico 5 · `docs/architecture.md` §18 (onda 8)

---

## Objetivo

Cadastrar tudo de que a agenda, as OS e os agentes precisam.

## Valor para o negócio

São os dados que tornam o atendimento automático confiável: preços, durações, técnicos e clientes reais da empresa.

---

## Escopo

### Dentro
- Dados da empresa: nome (marca no app), responsável, chave Pix e horário de funcionamento (FR14).
- Serviços e peças em modal, com preço; serviços com duração e tempo de liberação da agenda; bloqueio de exclusão de itens usados em OS.
- Técnicos com telefone, cor na agenda e jornada de trabalho (eventos de jornada).
- Clientes PF e PJ, endereço pelo CEP (ViaCEP), atalhos de WhatsApp e mapa, conversão de contato em cliente (FR31).

### Fora
- Equipamentos dos clientes (EP09 — Módulo 2).
- Uso dos serviços pelo RAG (EP07).

---

## Stories

| Código | Story | Executor | Status |
|---|---|---|---|
| EP05.S01 | 5.1 Dados da empresa | @dev | Ready — [5.1](../stories/5.1.dados-da-empresa.md) |
| EP05.S02 | 5.2 Serviços e peças (modal) | @dev | Ready — [5.2](../stories/5.2.servicos-e-pecas.md) |
| EP05.S03 | 5.3 Técnicos e jornada | @dev | Ready — [5.3](../stories/5.3.tecnicos-e-jornada.md) |
| EP05.S04 | 5.4 Clientes | @dev | Ready — [5.4](../stories/5.4.clientes.md) |

## Ordem de execução

```
Onda 8: 5.1 · 5.2 · 5.3 · 5.4   (paralelas entre si)
```

---

## Dependências

- **Depende de:** EP04 (tabelas novas já nascem com RLS por perfil); EP02 para a story 5.4 (tabela de contatos).
- **Bloqueia:** EP06, EP07 (story 7.1 usa os serviços da 5.2) e EP08.
- **Pendências do dono:** nenhuma específica.

## Riscos

| Risco | Mitigação |
|---|---|
| ViaCEP fora do ar ou CEP não encontrado | Preenchimento manual (critério da 5.4) |
| Excluir serviço usado em OS | Bloqueio no backend e no banco (critério da 5.2) |

## Critérios de sucesso

- [ ] Nome da empresa aparece como marca no app.
- [ ] Serviços com preço, duração e tempo de liberação cadastrados.
- [ ] Técnicos com cor e jornada visíveis para a agenda.
- [ ] Contato do WhatsApp convertido em cliente.

## Change Log

| Data | Versão | Descrição | Autor |
|---|---|---|---|
| 2026-11-25 | 1.0 | Épico criado a partir do PRD v0.3 | @pm (Morgan) |
