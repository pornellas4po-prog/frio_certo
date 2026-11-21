'use client';

import Link from 'next/link';
import { use } from 'react';
import { MODULES, FEATURES, useModules, type ModuleKey } from '@friocerto/modules';
import { Card, EmptyState, PageHeader } from '@friocerto/ui';
import { NAV_ITEMS } from '@/lib/nav';

/** Telas ainda não construídas: mostra "em construção" ou "módulo não contratado". */
export default function TelaPage({ params }: { params: Promise<{ tela: string }> }) {
  const { tela } = use(params);
  const { can } = useModules();
  const item = NAV_ITEMS.find((i) => i.key === tela);
  const title = item?.label ?? 'Página';

  let body = <EmptyState icon="hardhat" title="Tela em construção" text="Esta tela será construída seguindo as stories do PRD, com os mesmos componentes do Painel e da Agenda." />;
  if (item && !can(item.feature)) {
    const mod = MODULES[FEATURES[item.feature] as ModuleKey];
    body = <EmptyState icon="lock" title="Módulo não contratado" text={`Esta tela faz parte do módulo "${mod.name}".`} />;
  }

  return (
    <>
      <PageHeader title={title} breadcrumb={[{ label: title }]} linkAs={Link} />
      <Card>{body}</Card>
    </>
  );
}
