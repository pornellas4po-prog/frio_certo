import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from '@friocerto/icons';
import { cx } from '../utils';

export type PillTone = 'neutral' | 'ok' | 'warn' | 'bad' | 'info' | 'violet' | 'accent' | 'teal';
const toneClass: Record<PillTone, string> = { neutral: '', ok: 'ok', warn: 'warn', bad: 'bad', info: 'info', violet: 'vio', accent: 'or', teal: 'teal' };

export type PillProps = HTMLAttributes<HTMLSpanElement> & { tone?: PillTone; dot?: boolean; live?: boolean };

/** Etiqueta de status com bolinha (ex.: "● Agendada"). Classe `.pill`. */
export function Pill({ tone = 'neutral', dot = true, live, className, ...rest }: PillProps) {
  return <span className={cx('pill', toneClass[tone], !dot && 'nodot', live && 'live', className)} {...rest} />;
}

export type TagProps = HTMLAttributes<HTMLSpanElement> & { icon?: IconName; color?: string };

/** Etiqueta discreta com ícone. Com `color`, fica tingida (ex.: tipo de atendimento "Preventiva"). */
export function Tag({ icon, color, className, style, children, ...rest }: TagProps) {
  const tinted: CSSProperties | undefined = color ? { color, background: `color-mix(in srgb, ${color} 12%, transparent)` } : undefined;
  return (
    <span className={cx('tag', className)} style={{ ...tinted, ...style }} {...rest}>
      {icon && <Icon name={icon} />}
      {children}
    </span>
  );
}

export type ChipProps = HTMLAttributes<HTMLButtonElement> & { active?: boolean; color?: string };

/** Botão de filtro (ex.: técnicos na agenda). `color` mostra a bolinha colorida. */
export function Chip({ active, color, className, children, ...rest }: ChipProps) {
  return (
    <button type="button" className={cx('chip', active && 'on', className)} aria-pressed={active} {...rest}>
      {color && <ColorDot color={color} />}
      {children}
    </button>
  );
}

/** Bolinha de cor (ex.: cor do técnico). */
export function ColorDot({ color, className }: { color: string; className?: string }) {
  return <span className={cx('dotc', className)} style={{ '--c': color } as CSSProperties} />;
}

/** Contador do menu lateral. `muted` = cinza (ex.: OS pendentes); padrão = azul. */
export function NavBadge({ children, muted }: { children: ReactNode; muted?: boolean }) {
  return <span className={cx('nb', muted && 'n2')}>{children}</span>;
}

export type StatPillProps = { icon: IconName; color: string; label: ReactNode; value: ReactNode };

/** Indicador compacto do cabeçalho da página (ex.: "OS hoje 1", "Alertas 14"). */
export function StatPill({ icon, color, label, value }: StatPillProps) {
  return (
    <span className="stat-pill">
      <i style={{ background: color }}><Icon name={icon} /></i>
      {label} <b>{value}</b>
    </span>
  );
}
