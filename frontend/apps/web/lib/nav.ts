import type { FeatureKey } from '@friocerto/modules';
import type { NavSection } from '@friocerto/ui';

type NavEntry = NavSection['items'][number] & { feature: FeatureKey };

/** Menu lateral, igual ao protótipo. Cada item aponta para a funcionalidade que o libera (@friocerto/modules). */
export const NAV: Array<{ title: string; items: NavEntry[] }> = [
  {
    title: 'Operação',
    items: [
      { key: 'painel', label: 'Painel', icon: 'dashboard', href: '/painel', feature: 'painel' },
      { key: 'meudia', label: 'Meu dia (técnico)', icon: 'smartphone', href: '/meudia', feature: 'meudia' },
      { key: 'agenda', label: 'Agenda', icon: 'calendar', href: '/agenda', feature: 'agenda' },
      { key: 'os', label: 'Ordens de serviço', icon: 'clipboard', href: '/os', feature: 'os', badge: { count: 2, muted: true } },
      { key: 'atendimento', label: 'Atendimento', icon: 'msg', href: '/atendimento', feature: 'atendimento', badge: { count: 1 } },
    ],
  },
  {
    title: 'Cadastros',
    items: [
      { key: 'clientes', label: 'Clientes', icon: 'users', href: '/clientes', feature: 'clientes' },
      { key: 'equipamentos', label: 'Equipamentos', icon: 'snow', href: '/equipamentos', feature: 'equipamentos', badge: { count: 10 } },
      { key: 'servicos', label: 'Serviços e peças', icon: 'tag', href: '/servicos', feature: 'servicos' },
      { key: 'tecnicos', label: 'Técnicos', icon: 'hardhat', href: '/tecnicos', feature: 'tecnicos' },
    ],
  },
  {
    title: 'Comercial',
    items: [
      { key: 'orcamentos', label: 'Orçamentos', icon: 'calc', href: '/orcamentos', feature: 'orcamentos' },
      { key: 'financeiro', label: 'Financeiro', icon: 'wallet', href: '/financeiro', feature: 'financeiro', badge: { count: 4 } },
    ],
  },
  {
    title: 'Canais Meta',
    items: [
      { key: 'canais', label: 'WhatsApp e Instagram', icon: 'wa', href: '/canais', feature: 'canais' },
      { key: 'transbordo', label: 'Transbordo humano', icon: 'transfer', href: '/transbordo', feature: 'transbordo' },
    ],
  },
  {
    title: 'Sistema',
    items: [{ key: 'configuracoes', label: 'Configurações', icon: 'settings', href: '/configuracoes', feature: 'configuracoes' }],
  },
];

export const NAV_ITEMS = NAV.flatMap((s) => s.items);
