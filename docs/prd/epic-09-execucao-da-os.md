# EP09: Execução da OS

**Status:** 📋 Planejamento
**Responsável (owner):** @pm (Morgan)
**Módulo de lançamento:** 🚀 **Módulo 2 — + Ordem de Serviço (marco de lançamento)**
**Sequência:** 9 de 11
**Criado em:** 2026-11-25
**Fonte oficial:** `docs/prd.md` v0.3 — Épico 9 · `docs/architecture.md` D9, D10 e §18 (onda 12)

---

## Objetivo

Executar a OS completa pelo celular, do atendimento ao PDF. **Ao fim deste épico, o Módulo 2 pode ser liberado.**

## Valor para o negócio

O técnico trabalha em campo pelo celular e o cliente recebe um relatório profissional; a preventiva recorrente gera novos atendimentos.

---

## Escopo

### Dentro
- Equipamentos vinculados ao cliente, com situação da preventiva (em dia, vence em até 15 dias, vencida) e filtro.
- Tela Meu dia do técnico; iniciar e finalizar com checklist e estado dos filtros; fotos de antes e depois no R2; assinatura do cliente com nome.
- PDF da OS (itens, checklist, fotos, assinatura) enviado pelo WhatsApp; recálculo da próxima preventiva.
- Equipamentos na OS (item M1 da validação).
- Ativa o critério 2 da story 8.3 (equipamentos e preventiva vencida no agente de clientes antigos).

### Fora
- Orçamentos e cobrança (EP10).

---

## Stories

| Código | Story | Executor | Status |
|---|---|---|---|
| EP09.S01 | 9.1 Equipamentos e preventiva | @dev | Ready — [9.1](../stories/9.1.equipamentos-e-preventiva.md) |
| EP09.S02 | 9.2 Execução da OS e Meu dia | @dev (+ @ux-design-expert em SignaturePad e PhotoUploader) | Ready — [9.2](../stories/9.2.execucao-da-os-e-meu-dia.md) |
| EP09.S03 | 9.3 Relatório em PDF e próxima preventiva | @dev | Ready — [9.3](../stories/9.3.relatorio-pdf-e-proxima-preventiva.md) |

## Ordem de execução

```
Onda 12: 9.1 → 9.2 → 9.3   ✅ libera o Módulo 2
```

---

## Dependências

- **Depende de:** EP06 (OS) e EP08 (Módulo 1 lançado); EP02 (envio de mídia — story 2.5).
- **Bloqueia:** lançamento do Módulo 2; EP10.
- **Pendências do dono:** P4 — credenciais do Cloudflare R2.

## Riscos

| Risco | Mitigação |
|---|---|
| Internet fraca em campo | Upload direto ao R2 por URL pré-assinada (D9); comportamento offline não consta no PRD — levar ao dono se necessário |
| Fotos com dados pessoais | Bucket privado; acesso só por URL pré-assinada |

## Critérios de sucesso

- [ ] Técnico executa a OS do início ao fim pelo celular.
- [ ] PDF chega ao cliente pelo WhatsApp.
- [ ] Próxima preventiva recalculada ao concluir.
- [ ] Módulo 2 liberado no catálogo `@friocerto/modules`.

## Change Log

| Data | Versão | Descrição | Autor |
|---|---|---|---|
| 2026-11-25 | 1.0 | Épico criado a partir do PRD v0.3 | @pm (Morgan) |
