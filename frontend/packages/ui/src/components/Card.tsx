import type { HTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from '@friocerto/icons';
import { cx } from '../utils';

export type CardProps = HTMLAttributes<HTMLDivElement> & { padded?: boolean };

/** Card branco com borda e sombra leve (classe `.card`). */
export function Card({ padded, className, ...rest }: CardProps) {
  return <div className={cx('card', padded && 'pad', className)} {...rest} />;
}

export type CardHeaderProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  title: ReactNode;
  icon?: IconName;
  subtitle?: ReactNode;
  actions?: ReactNode;
};

/** Cabeçalho do card: ícone azul + título à esquerda, ações à direita. */
export function CardHeader({ title, icon, subtitle, actions, className, ...rest }: CardHeaderProps) {
  return (
    <div className={cx('card-h', className)} {...rest}>
      <div>
        <h3>
          {icon && <Icon name={icon} />}
          {title}
        </h3>
        {subtitle && <div className="sub">{subtitle}</div>}
      </div>
      {actions}
    </div>
  );
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('card-b', className)} {...rest} />;
}

export type GridCols = '2' | '3' | '4' | '2-1' | '1-2';
const gridClass: Record<GridCols, string> = { '2': 'g2', '3': 'g3', '4': 'g4', '2-1': 'g-21', '1-2': 'g-12' };

/** Grade responsiva do protótipo. `cols="2-1"` = coluna larga + coluna estreita (layout do Painel). */
export function Grid({ cols, className, ...rest }: HTMLAttributes<HTMLDivElement> & { cols?: GridCols }) {
  return <div className={cx('grid', cols && gridClass[cols], className)} {...rest} />;
}

/** Barra de ferramentas acima de listas (filtros, busca, chips). */
export function Toolbar({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('toolbar', className)} {...rest} />;
}
