'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { FEATURES, MODULES, PLANS, type FeatureKey, type ModuleKey, type PlanKey } from './catalog';

/** Normaliza a lista de módulos liberados, incluindo os pré-requisitos de cada um. */
export function resolveModules(enabled: ModuleKey[]): Set<ModuleKey> {
  const set = new Set<ModuleKey>();
  const add = (k: ModuleKey) => { if (set.has(k)) return; set.add(k); MODULES[k].requires.forEach(add); };
  enabled.forEach(add);
  return set;
}

export function modulesOfPlan(plan: PlanKey): ModuleKey[] {
  return PLANS[plan].modules;
}

/** A funcionalidade está liberada para estes módulos? */
export function isFeatureEnabled(feature: FeatureKey, enabled: Set<ModuleKey>): boolean {
  const required = FEATURES[feature] as ModuleKey | null;
  return required === null || enabled.has(required);
}

type ModulesContextValue = {
  enabled: Set<ModuleKey>;
  hasModule: (m: ModuleKey) => boolean;
  can: (f: FeatureKey) => boolean;
};

const ModulesContext = createContext<ModulesContextValue | null>(null);

/**
 * Fornece os módulos liberados para o app. Hoje vem da configuração (cliente único);
 * no SaaS multi-tenant virá do plano contratado por cada empresa.
 */
export function ModulesProvider({ modules, plan, children }: { modules?: ModuleKey[]; plan?: PlanKey; children: ReactNode }) {
  const value = useMemo<ModulesContextValue>(() => {
    const enabled = resolveModules(modules ?? (plan ? modulesOfPlan(plan) : modulesOfPlan('completo')));
    return { enabled, hasModule: (m) => enabled.has(m), can: (f) => isFeatureEnabled(f, enabled) };
  }, [modules, plan]);
  return <ModulesContext.Provider value={value}>{children}</ModulesContext.Provider>;
}

export function useModules(): ModulesContextValue {
  const ctx = useContext(ModulesContext);
  if (!ctx) throw new Error('useModules precisa estar dentro de <ModulesProvider>.');
  return ctx;
}

/** Mostra o conteúdo só se a funcionalidade estiver liberada; senão, mostra `fallback`. */
export function FeatureGate({ feature, fallback = null, children }: { feature: FeatureKey; fallback?: ReactNode; children: ReactNode }) {
  const { can } = useModules();
  return <>{can(feature) ? children : fallback}</>;
}
