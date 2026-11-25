# EP10: Orçamentos e Financeiro

**Status:** 📋 Planejamento
**Responsável (owner):** @pm (Morgan)
**Módulo de lançamento:** 🚀 **Módulo 3 — + Orçamento / Financeiro (marco de lançamento)**
**Sequência:** 10 de 11
**Criado em:** 2026-11-25
**Fonte oficial:** `docs/prd.md` v0.3 — Épico 10 · `docs/architecture.md` D11, D12 e §18 (onda 13)

---

## Objetivo

Fechar o ciclo comercial — orçar, aprovar, executar e receber. **Ao fim deste épico, o Módulo 3 pode ser liberado.**

## Valor para o negócio

O prestador controla o que tem a receber e cobra pelo Pix ou pelo checkout Asaas, com o agente financeiro respondendo ao cliente antigo.

---

## Escopo

### Dentro
- Orçamentos: Rascunho → Enviado → Aprovado/Recusado, PDF pelo WhatsApp, conversão em OS com um clique, indicadores.
- Contas a receber: em aberto e recebidos, registro de recebimento, indicadores por mês e por forma.
- Pix ou checkout Asaas: Asaas API v3 + webhook de confirmação automática (D12); chave Asaas no Supabase Vault (D11); sem Asaas, exibe a chave Pix.
- Agente financeiro: só clientes antigos; sem o Módulo 3, financeiro continua indo para o atendente único (FR39).

### Fora
- Emissão de nota fiscal (não consta no PRD).

---

## Stories

| Código | Story | Executor | Status |
|---|---|---|---|
| EP10.S01 | 10.1 Orçamentos | @dev | Ready — [10.1](../stories/10.1.orcamentos.md) |
| EP10.S02 | 10.2 Contas a receber | @dev | Ready — [10.2](../stories/10.2.contas-a-receber.md) |
| EP10.S03 | 10.3 Pix ou checkout Asaas | @dev | Ready — [10.3](../stories/10.3.pix-ou-checkout-asaas.md) |
| EP10.S04 | 10.4 Agente financeiro | @dev | Ready — [10.4](../stories/10.4.agente-financeiro.md) |

## Ordem de execução

```
Onda 13: 10.1 · 10.2 → 10.3 → 10.4   ✅ libera o Módulo 3
```

---

## Dependências

- **Depende de:** EP09 (Módulo 2 lançado), EP03 (esqueleto do agente financeiro) e EP05 (chave Pix).
- **Bloqueia:** lançamento do Módulo 3; EP11.
- **Pendências do dono:** P4 — conta Asaas (opcional para o cliente); M2 — relação com o orçamento informado pelos agentes no Módulo 1.

## Riscos

| Risco | Mitigação |
|---|---|
| Webhook do Asaas falso | Validação do token de acesso do webhook |
| Chave Asaas exposta | Supabase Vault, nunca no navegador (D11) |

## Critérios de sucesso

- [ ] Orçamento aprovado vira OS com um clique.
- [ ] Pagamento pelo Asaas confirmado automaticamente.
- [ ] Agente financeiro informa valores a pagar ao cliente antigo.
- [ ] Módulo 3 liberado no catálogo `@friocerto/modules`.

## Change Log

| Data | Versão | Descrição | Autor |
|---|---|---|---|
| 2026-11-25 | 1.0 | Épico criado a partir do PRD v0.3 | @pm (Morgan) |
