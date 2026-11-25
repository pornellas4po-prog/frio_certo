# EP07: Base de Conhecimento

**Status:** 📋 Planejamento
**Responsável (owner):** @pm (Morgan)
**Módulo de lançamento:** Módulo 1 — Atendimento e Agendamento
**Sequência:** 7 de 11
**Criado em:** 2026-11-25
**Fonte oficial:** `docs/prd.md` v0.3 — Épico 7 · `docs/architecture.md` D6 e §18 (onda 10)

---

## Objetivo

Dar ao agente técnico uma base confiável com os dados da empresa.

## Valor para o negócio

Os agentes respondem com as informações reais do prestador (serviços, valores, políticas), e o que não estiver na base vai para o atendente humano, em vez de a IA inventar.

---

## Escopo

### Dentro
- Serviços e valores (story 5.2) entram automaticamente na base e são atualizados quando mudam.
- Abas na página Base de Conhecimento (criada na story 3.4) para incluir e digitar outros conteúdos.
- Busca híbrida: pgvector (`text-embedding-3-small`) + texto em português, combinadas por RRF (D6).
- Sem resposta confiável → transbordo para o atendente único, respeitando o horário humano.

### Fora
- Entrada de compras via OCR / OpenAI Vision (pós-MVP, em análise).

---

## Stories

| Código | Story | Executor | Status |
|---|---|---|---|
| EP07.S01 | 7.1 Alimentar a base | @dev (+ @data-engineer no pgvector) | Ready — [7.1](../stories/7.1.alimentar-a-base.md) |
| EP07.S02 | 7.2 Busca híbrida | @dev | Ready — [7.2](../stories/7.2.busca-hibrida.md) |

## Ordem de execução

```
Onda 10: 7.1 → 7.2
```

---

## Dependências

- **Depende de:** EP03 (página Base de Conhecimento e transbordo) e EP05 (serviços e valores da story 5.2).
- **Bloqueia:** EP08 (agente técnico responde com esta base).
- **Pendências do dono:** P3 — metas de desempenho da IA (recomendação na arquitetura §15).

## Riscos

| Risco | Mitigação |
|---|---|
| Resposta errada com aparência de certa | Limite de confiança; abaixo dele, transbordo |
| Base desatualizada quando o preço muda | Reindexação automática ao alterar o serviço |

## Critérios de sucesso

- [ ] Alterar um serviço atualiza a base automaticamente.
- [ ] Conteúdo digitado pelo dono aparece nas respostas.
- [ ] Pergunta fora da base aciona o atendente único.

## Change Log

| Data | Versão | Descrição | Autor |
|---|---|---|---|
| 2026-11-25 | 1.0 | Épico criado a partir do PRD v0.3 | @pm (Morgan) |
