/**
 * Catálogo de módulos e planos do Frio Certo.
 *
 * O sistema é desenvolvido COMPLETO, mas liberado por módulo, nesta ordem lógica (definida pelo dono em 2026-11-15):
 *   1. Atendimento / Agendamento
 *   2. + Ordem de Serviço (com os cadastros necessários)
 *   3. + Orçamento / Financeiro
 * Cada plano inclui o anterior. "Completo" = todos os módulos.
 *
 * ⚠️ O encaixe de cada tela no módulo (FEATURES abaixo) é a interpretação inicial a partir do protótipo — confirmar com o dono.
 */

export type ModuleKey = 'atendimento' | 'os' | 'financeiro';

export type ModuleInfo = { key: ModuleKey; name: string; description: string; requires: ModuleKey[] };

export const MODULES: Record<ModuleKey, ModuleInfo> = {
  atendimento: {
    key: 'atendimento',
    name: 'Atendimento e Agendamento',
    description:
      'Cliente entra em contato pelo WhatsApp, pede orçamento e visita; a automação consulta a agenda, marca, remarca, cancela, envia a confirmação e pede a confirmação da visita 24 horas antes.',
    requires: [],
  },
  os: {
    key: 'os',
    name: 'Ordem de Serviço',
    description: 'Inclui a ordem de serviço (execução, checklist, fotos, assinatura, PDF) e as áreas de cadastro necessárias.',
    requires: ['atendimento'],
  },
  financeiro: {
    key: 'financeiro',
    name: 'Orçamento e Financeiro',
    description: 'Orçamentos (envio, aprovação, conversão em OS) e financeiro (contas a receber, Pix, checkout Asaas).',
    requires: ['atendimento', 'os'],
  },
};

export type PlanKey = 'atendimento' | 'atendimento-os' | 'completo';

export const PLANS: Record<PlanKey, { name: string; modules: ModuleKey[] }> = {
  atendimento: { name: 'Atendimento / Agendamento', modules: ['atendimento'] },
  'atendimento-os': { name: 'Atendimento / Agendamento / OS', modules: ['atendimento', 'os'] },
  completo: { name: 'Completo (Atendimento / Agendamento / OS / Orçamento / Financeiro)', modules: ['atendimento', 'os', 'financeiro'] },
};

/** Cada funcionalidade (tela/rota) e o módulo mínimo que a libera. `null` = sempre disponível. */
export const FEATURES = {
  painel: null,
  agenda: 'atendimento',
  atendimento: 'atendimento',
  canais: 'atendimento',
  transbordo: 'atendimento',
  clientes: 'atendimento',
  servicos: 'atendimento',
  tecnicos: 'atendimento',
  configuracoes: null,
  perfis: null,
  developer: null,
  os: 'os',
  meudia: 'os',
  equipamentos: 'os',
  orcamentos: 'financeiro',
  financeiro: 'financeiro',
} as const satisfies Record<string, ModuleKey | null>;

export type FeatureKey = keyof typeof FEATURES;
