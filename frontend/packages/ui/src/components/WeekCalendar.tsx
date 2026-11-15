'use client';

import { useState, type CSSProperties } from 'react';
import { Icon } from '@friocerto/icons';
import { Pill } from './Badges';
import { SERVICE_TYPES, type ServiceOrderStatus, type ServiceType } from '../domain';
import { cx } from '../utils';

export type CalendarEvent = {
  id: string;
  /** dia no formato AAAA-MM-DD */
  date: string;
  time: string;
  title: string;
  type: ServiceType;
  status: ServiceOrderStatus;
  technician?: { name: string; color: string };
};

export type WeekCalendarProps = {
  /** 7 dias da semana (segunda a domingo) */
  days: Date[];
  events: CalendarEvent[];
  today?: Date;
  /** chamado ao arrastar um evento para outro dia */
  onMove?: (eventId: string, newDate: string) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onAdd?: (date: string) => void;
};

const DOW = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Agenda semanal com arrastar e soltar (classes `.week`, `.wday`, `.wcard`). */
export function WeekCalendar({ days, events, today = new Date(), onMove, onEventClick, onAdd }: WeekCalendarProps) {
  const [over, setOver] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  return (
    <div className="week">
      {days.map((d) => {
        const k = key(d);
        const list = events.filter((e) => e.date === k && e.status !== 'Cancelada').sort((a, b) => a.time.localeCompare(b.time));
        return (
          <div
            key={k}
            className={cx('wday', key(today) === k && 'today', over === k && 'over')}
            onDragOver={(e) => { e.preventDefault(); setOver(k); }}
            onDragLeave={() => setOver(null)}
            onDrop={(e) => {
              e.preventDefault();
              setOver(null);
              const id = e.dataTransfer.getData('text/plain');
              if (id) onMove?.(id, k);
            }}
          >
            <div className="wh"><b>{DOW[d.getDay()]}</b><span>{d.getDate()}</span></div>
            <div className="wb">
              {list.map((ev) => {
                const t = SERVICE_TYPES[ev.type];
                return (
                  <div
                    key={ev.id}
                    className={cx('wcard', dragging === ev.id && 'drag')}
                    draggable
                    style={{ '--c': ev.technician?.color ?? '#94A3B8' } as CSSProperties}
                    onDragStart={(e) => { e.dataTransfer.setData('text/plain', ev.id); setDragging(ev.id); }}
                    onDragEnd={() => setDragging(null)}
                    onClick={() => onEventClick?.(ev)}
                  >
                    <div className="row" style={{ justifyContent: 'space-between' }}>
                      <b>{ev.time}</b>
                      <span style={{ color: t.color }}><Icon name={t.icon} size="xs" /></span>
                    </div>
                    <div className="t">{ev.title}</div>
                    <div className="s">{ev.type} · {ev.technician?.name.split(' ')[0] ?? 'Sem técnico'}</div>
                    {ev.status === 'Concluída' && <Pill tone="ok" dot={false} style={{ height: 18, fontSize: 10, marginTop: 4 }}>Concluída</Pill>}
                    {ev.status === 'Em andamento' && <Pill tone="warn" dot={false} style={{ height: 18, fontSize: 10, marginTop: 4 }}>Em andamento</Pill>}
                  </div>
                );
              })}
              <button type="button" className="wadd" aria-label="Novo atendimento neste dia" onClick={() => onAdd?.(k)}>
                <Icon name="plus" size="xs" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
