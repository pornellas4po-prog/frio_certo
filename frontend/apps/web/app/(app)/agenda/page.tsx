'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FeatureGate } from '@friocerto/modules';
import { Button, Chip, PageHeader, Toolbar, WeekCalendar, type CalendarEvent } from '@friocerto/ui';
import { demoEvents, technicians, weekDays } from '@/lib/demo';

const fdate = (d: Date) => d.toLocaleDateString('pt-BR');

export default function AgendaPage() {
  const [base, setBase] = useState(() => new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(() => demoEvents());
  const [hidden, setHidden] = useState<string[]>([]);
  const days = useMemo(() => weekDays(base), [base]);

  const shift = (n: number) => setBase((b) => { const d = new Date(b); d.setDate(d.getDate() + n); return d; });
  const visible = events.filter((e) => !e.technician || !hidden.includes(e.technician.name));

  return (
    <>
      <PageHeader
        title="Agenda"
        breadcrumb={[{ label: 'Agenda' }]}
        linkAs={Link}
        actions={
          <>
            <div className="row" style={{ gap: 6 }}>
              <Button size="sm" iconOnly icon="left" aria-label="Semana anterior" onClick={() => shift(-7)} />
              <Button size="sm" onClick={() => setBase(new Date())}>Hoje</Button>
              <Button size="sm" iconOnly icon="right" aria-label="Próxima semana" onClick={() => shift(7)} />
            </div>
            <FeatureGate feature="os">
              <Button as={Link} href="/os/nova" variant="primary" icon="plus">Nova OS</Button>
            </FeatureGate>
          </>
        }
      />

      <Toolbar>
        <b>{fdate(days[0]!)} a {fdate(days[6]!)}</b>
        <span className="sp" />
        {Object.values(technicians).map((t) => (
          <Chip key={t.name} color={t.color} active={!hidden.includes(t.name)}
            onClick={() => setHidden((h) => (h.includes(t.name) ? h.filter((x) => x !== t.name) : [...h, t.name]))}>
            {t.name}
          </Chip>
        ))}
      </Toolbar>
      <div className="small muted mb16">Arraste um atendimento para outro dia para reagendar.</div>

      <WeekCalendar
        days={days}
        events={visible}
        onMove={(id, date) => setEvents((list) => list.map((e) => (e.id === id && e.status !== 'Concluída' ? { ...e, date } : e)))}
      />
    </>
  );
}
