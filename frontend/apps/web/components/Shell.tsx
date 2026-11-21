'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { ModulesProvider, useModules } from '@friocerto/modules';
import { AppShell, Button } from '@friocerto/ui';
import { NAV } from '@/lib/nav';
import { company, currentUser, enabledModules } from '@/lib/config';

function ShellInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { can } = useModules();
  const activeKey = pathname.split('/')[1] || 'painel';

  // Só aparecem no menu as telas dos módulos liberados.
  const nav = NAV.map((s) => ({ title: s.title, items: s.items.filter((i) => can(i.feature)) })).filter((s) => s.items.length);

  return (
    <AppShell
      nav={nav}
      activeKey={activeKey}
      user={currentUser}
      brandName={company.name}
      linkAs={Link}
      messagesCount={1}
      alertsCount={14}
      topbarActions={can('os') ? <Button as={Link} href="/os/nova" variant="primary" size="sm" icon="plus" className="hide-m">Nova OS</Button> : null}
    >
      {children}
    </AppShell>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <ModulesProvider modules={enabledModules()}>
      <ShellInner>{children}</ShellInner>
    </ModulesProvider>
  );
}
