import type { CalendarEvent, ServiceOrderStatus, ServiceType } from '@friocerto/ui';

/**
 * Dados de demonstração (fictícios), iguais aos do protótipo, com datas relativas a hoje.
 * Servem só para visualizar os componentes até o backend existir.
 */
export const technicians = {
  rafael: { name: 'Rafael', color: '#0284C7' },
  diego: { name: 'Diego', color: '#16A34A' },
  bruno: { name: 'Bruno', color: '#F59E0B' },
};

export function weekDays(base = new Date()): Date[] {
  const start = new Date(base);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7)); // segunda-feira
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
}

const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

type Seed = [dayIndex: number, time: string, title: string, type: ServiceType, tech: keyof typeof technicians, status: ServiceOrderStatus];

const SEED: Seed[] = [
  [2, '08:00', 'Ana Beatriz Rocha', 'Preventiva', 'diego', 'Concluída'],
  [2, '09:00', 'Ricardo e Paula Nogueira', 'Instalação', 'rafael', 'Agendada'],
  [2, '10:30', 'Restaurante Mar & Brasa', 'Preventiva', 'diego', 'Em andamento'],
  [2, '14:00', 'Escritório Lima & Castro Advogados', 'Corretiva', 'bruno', 'Agendada'],
  [2, '15:30', 'Condomínio Residencial Aldeota', 'Preventiva', 'diego', 'Agendada'],
  [3, '08:30', 'Academia Corpo em Forma', 'Corretiva', 'bruno', 'Agendada'],
  [3, '14:00', 'Loja Casa & Decor', 'Preventiva', 'diego', 'Agendada'],
  [4, '09:00', 'João Victor Albuquerque', 'Preventiva', 'diego', 'Agendada'],
  [4, '16:00', 'Mariana Teixeira', 'Orçamento / Visita', 'rafael', 'Agendada'],
  [5, '08:00', 'Clínica Sorriso Pleno', 'Preventiva', 'diego', 'Agendada'],
  [6, '10:00', 'Escritório Lima & Castro Advogados', 'Preventiva', 'rafael', 'Agendada'],
];

export function demoEvents(base = new Date()): CalendarEvent[] {
  const days = weekDays(base);
  return SEED.map(([di, time, title, type, tech, status], i) => ({
    id: `os-${i + 1}`,
    date: key(days[di]!),
    time,
    title,
    type,
    status,
    technician: technicians[tech],
  }));
}

export const maintenanceDue = [
  { customer: 'Ricardo e Paula Nogueira', equipment: 'Escritório · LG 12.000', status: 'Vencida há 21 dias', severity: 'bad' as const },
  { customer: 'Academia Corpo em Forma', equipment: 'Sala de musculação · Carrier 60.000', status: 'Vencida há 12 dias', severity: 'bad' as const },
  { customer: 'Ana Beatriz Rocha', equipment: 'Quarto do casal · LG 12.000', status: 'Vencida há 10 dias', severity: 'bad' as const },
  { customer: 'Clínica Sorriso Pleno', equipment: 'Recepção · Daikin 36.000', status: 'Vencida há 7 dias', severity: 'bad' as const },
  { customer: 'Restaurante Mar & Brasa', equipment: 'Salão principal · Carrier 60.000', status: 'Vencida há 2 dias', severity: 'bad' as const },
  { customer: 'Escritório Lima & Castro Advogados', equipment: 'Sala de reuniões · Daikin 24.000', status: 'Vence hoje', severity: 'warn' as const },
];
