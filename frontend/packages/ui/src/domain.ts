import type { IconName } from '@friocerto/icons';
import type { PillTone } from './components/Badges';

/** Tipos de atendimento e status de OS — mesmos nomes, ícones e cores do protótipo. */
export type ServiceType = 'Instalação' | 'Preventiva' | 'Corretiva' | 'Orçamento / Visita';
export type ServiceOrderStatus = 'Pendente' | 'Agendada' | 'Em andamento' | 'Concluída' | 'Cancelada';

export const SERVICE_TYPES: Record<ServiceType, { icon: IconName; color: string }> = {
  'Instalação': { icon: 'download', color: '#0284C7' },
  'Preventiva': { icon: 'snow', color: '#16A34A' },
  'Corretiva': { icon: 'wrench', color: '#DC2626' },
  'Orçamento / Visita': { icon: 'calc', color: '#7C3AED' },
};

export const SERVICE_ORDER_STATUS: Record<ServiceOrderStatus, PillTone> = {
  'Pendente': 'neutral',
  'Agendada': 'info',
  'Em andamento': 'warn',
  'Concluída': 'ok',
  'Cancelada': 'bad',
};
