import { useId, type ElementType, type ReactNode } from 'react';
import { Icon, type IconName } from '@friocerto/icons';
import { cx } from '../utils';

export type MiniChartProps = { values: number[]; kind?: 'area' | 'bars'; color?: string };

/** Mini gráfico do canto do KPI (barras ou área), igual ao `miniSVG` do protótipo. */
export function MiniChart({ values, kind = 'area', color = 'var(--accent)' }: MiniChartProps) {
  const gid = 'mg' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const w = 150, h = 44;
  if (!values.length) return null;
  const mx = Math.max(...values);
  const mn = kind === 'bars' ? 0 : Math.min(...values);
  const r = mx - mn || 1;

  if (kind === 'bars') {
    const bw = w / values.length;
    return (
      <svg className="mini" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
        {values.map((v, i) => {
          const bh = Math.max(3, ((v - mn) / r) * (h - 2));
          const hot = i === values.length - 3 || v === mx;
          return <rect key={i} x={i * bw + bw * 0.3} y={h - bh} width={bw * 0.4} height={bh} rx={1.5} style={{ fill: hot ? color : 'var(--line-2)' }} />;
        })}
      </svg>
    );
  }

  const pts = values.map((v, i) => [(i * (w - 2)) / Math.max(1, values.length - 1) + 1, h - 3 - ((v - mn) / r) * (h - 8)] as const);
  const d = 'M' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L');
  return (
    <svg className="mini" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: color }} stopOpacity=".55" />
          <stop offset="1" style={{ stopColor: color }} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d}L${w - 1},${h}L1,${h}Z`} fill={`url(#${gid})`} />
      <path d={d} fill="none" style={{ stroke: color }} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export type KpiTrend = 'up' | 'down';

export type KpiCardProps = {
  label: ReactNode;
  value: ReactNode;
  icon: IconName;
  hint?: ReactNode;
  /** up = valor em verde · down = valor em vermelho */
  trend?: KpiTrend;
  chart?: MiniChartProps;
  href?: string;
  as?: ElementType;
  className?: string;
};

/** Card de indicador do Painel (classe `.kpi`): rótulo + ícone redondo, valor grande, legenda e mini gráfico opcional. */
export function KpiCard({ label, value, icon, hint, trend, chart, href, as, className }: KpiCardProps) {
  const Comp: ElementType = as ?? (href ? 'a' : 'div');
  return (
    <Comp className={cx('kpi', className)} {...(href ? { href } : {})}>
      <div className="kpi-l">
        {label}
        <i><Icon name={icon} /></i>
      </div>
      <div className={cx('kpi-v', trend === 'up' && 'up', trend === 'down' && 'dn')}>{value}</div>
      {hint && <div className="kpi-s">{hint}</div>}
      {chart && <MiniChart {...chart} />}
    </Comp>
  );
}

/** Linha de 4 KPIs (2 no tablet, 1 no celular). */
export function KpiGrid({ children }: { children: ReactNode }) {
  return <div className="kpis">{children}</div>;
}
