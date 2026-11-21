import type { ElementType, ReactNode } from 'react';
import { Icon, type IconName } from '@friocerto/icons';

export type Crumb = { label: string; href?: string };

export type PageHeaderProps = {
  title: ReactNode;
  breadcrumb?: Crumb[];
  actions?: ReactNode;
  /** componente de link (ex.: next/link) */
  linkAs?: ElementType;
};

/** Título da página + trilha (casinha > Painel) + ações à direita. Classe `.ph`. */
export function PageHeader({ title, breadcrumb = [], actions, linkAs }: PageHeaderProps) {
  const L: ElementType = linkAs ?? 'a';
  return (
    <div className="ph">
      <div>
        <h1>{title}</h1>
        <div className="crumb">
          <Icon name="home" />
          {breadcrumb.map((c, i) => (
            <span key={i} style={{ display: 'contents' }}>
              <Icon name="right" />
              {c.href ? <L href={c.href}>{c.label}</L> : <span>{c.label}</span>}
            </span>
          ))}
        </div>
      </div>
      {actions && <div className="ph-actions">{actions}</div>}
    </div>
  );
}

export type EmptyStateProps = { icon: IconName; title: ReactNode; text?: ReactNode; action?: ReactNode };

/** Estado vazio (ícone azul em quadrado + título + texto + ação). */
export function EmptyState({ icon, title, text, action }: EmptyStateProps) {
  return (
    <div className="empty">
      <div className="ei"><Icon name={icon} size="lg" /></div>
      <h4>{title}</h4>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}
