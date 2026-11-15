import type { ModuleKey } from '@friocerto/modules';

/**
 * Módulos liberados nesta instalação (cliente único).
 * Defina NEXT_PUBLIC_FRIOCERTO_MODULES no Easypanel, ex.: "atendimento" ou "atendimento,os" ou "atendimento,os,financeiro".
 * Sem a variável, libera tudo (plano completo).
 */
export function enabledModules(): ModuleKey[] {
  const raw = process.env.NEXT_PUBLIC_FRIOCERTO_MODULES;
  if (!raw) return ['atendimento', 'os', 'financeiro'];
  const valid: ModuleKey[] = ['atendimento', 'os', 'financeiro'];
  return raw.split(',').map((s) => s.trim()).filter((s): s is ModuleKey => (valid as string[]).includes(s));
}

export const company = { name: 'FrioCerto Climatização' };
export const currentUser = { name: 'Carlos Mendes', role: 'Proprietário' };
