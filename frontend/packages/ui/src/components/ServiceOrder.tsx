import type { CSSProperties, ElementType, ReactNode } from 'react';
import { Icon, type IconName } from '@friocerto/icons';
import { ColorDot, Pill, Tag } from './Badges';
import { SERVICE_ORDER_STATUS, SERVICE_TYPES, type ServiceOrderStatus, type ServiceType } from '../domain';
import { cx } from '../utils';

export function ServiceTypeTag({ type }: { type: ServiceType }) {
  const t = SERVICE_TYPES[type];
  return <Tag icon={t.icon} color={t.color}>{type}</Tag>;
}

export function ServiceOrderStatusPill({ status }: { status: ServiceOrderStatus }) {
  return <Pill tone={SERVICE_ORDER_STATUS[status]}>{status}</Pill>;
}

export type ServiceOrderCardProps = {
  time?: string;
  status: ServiceOrderStatus;
  customer: string;
  /** bairro · problema relatado */
  description?: string;
  type: ServiceType;
  technician?: { name: string; color: string };
  href?: string;
  linkAs?: ElementType;
};

/** Cartão de OS (Agenda de hoje, Aguardando agendamento). Borda esquerda na cor do técnico. */
export function ServiceOrderCard({ time, status, customer, description, type, technician, href = '#', linkAs }: ServiceOrderCardProps) {
  const L: ElementType = linkAs ?? 'a';
  const color = technician?.color ?? '#94A3B8';
  return (
    <L className="oscard" href={href} style={{ '--c': color } as CSSProperties}>
      <div className="row" style={{ justifyContent: 'space-between', gap: 8 }}>
        <b className="hr">{time || '--:--'}</b>
        <ServiceOrderStatusPill status={status} />
      </div>
      <div className="b mt4">{customer}</div>
      {description && <div className="xsmall muted">{description}</div>}
      <div className="row mt8" style={{ gap: 6, justifyContent: 'space-between' }}>
        <ServiceTypeTag type={type} />
        <span className="xsmall">
          <ColorDot color={color} /> {technician ? technician.name.split(' ')[0] : 'Sem técnico'}
        </span>
      </div>
    </L>
  );
}

/** Grade de cartões de OS. */
export function ServiceOrderGrid({ children }: { children: ReactNode }) {
  return <div className="osgrid">{children}</div>;
}

export type AlertListItemProps = {
  icon?: IconName;
  severity: 'bad' | 'warn';
  title: ReactNode;
  subtitle?: ReactNode;
  status: ReactNode;
  actions?: ReactNode;
};

/** Item de lista com alerta (ex.: "Manutenções a vencer"): ícone colorido, textos e ações à direita. */
export function AlertListItem({ icon = 'snow', severity, title, subtitle, status, actions }: AlertListItemProps) {
  const c = severity === 'bad' ? 'danger' : 'warn';
  return (
    <div className="row" style={{ padding: '8px 0', borderTop: '1px solid var(--line)', alignItems: 'flex-start' }}>
      <span className="circbtn" style={{ width: 32, height: 32, margin: 0, flexShrink: 0, background: `var(--${c}-bg)`, color: `var(--${c})` }}>
        <Icon name={icon} size="sm" />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="b small">{title}</div>
        {subtitle && <div className="xsmall muted">{subtitle}</div>}
        <div className={cx('xsmall')} style={{ color: `var(--${c})`, fontWeight: 600 }}>{status}</div>
      </div>
      {actions && <div className="row" style={{ gap: 4 }}>{actions}</div>}
    </div>
  );
}
