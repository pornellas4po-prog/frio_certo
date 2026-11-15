import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { Icon, type IconName } from '@friocerto/icons';
import { cx } from '../utils';

export type ButtonVariant = 'default' | 'primary' | 'dark' | 'ghost' | 'danger' | 'danger-fill' | 'success';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

const variantClass: Record<ButtonVariant, string> = {
  default: '', primary: 'pri', dark: 'dark', ghost: 'ghost', danger: 'dan', 'danger-fill': 'dan fill', success: 'ok',
};

type ButtonOwnProps<E extends ElementType> = {
  as?: E;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  iconOnly?: boolean;
  loading?: boolean;
  children?: ReactNode;
};

export type ButtonProps<E extends ElementType = 'button'> = ButtonOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof ButtonOwnProps<E>>;

/**
 * Botão do Frio Certo (classe `.btn` do protótipo).
 * Para link: `<Button as={Link} href="/os/nova" variant="primary" icon="plus">Nova OS</Button>`.
 */
export function Button<E extends ElementType = 'button'>({
  as, variant = 'default', size = 'md', icon, iconRight, iconOnly, loading, className, children, ...rest
}: ButtonProps<E>) {
  const Comp: ElementType = as ?? 'button';
  const iconSize = size === 'xs' ? 'xs' : 'sm';
  const extra = Comp === 'button' && !('type' in rest) ? { type: 'button' } : {};
  return (
    <Comp
      className={cx('btn', variantClass[variant], size !== 'md' && size, iconOnly && 'ic-only', className)}
      {...extra}
      {...rest}
    >
      {loading ? <span className="spin" /> : icon && <Icon name={icon} size={iconSize} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize} />}
    </Comp>
  );
}

export type IconButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> & {
  icon: IconName;
  label: string;
  /** contador vermelho no canto (ex.: alertas) */
  count?: number;
  bordered?: boolean;
};

/** Botão só com ícone da barra superior (classe `.iconbtn`). */
export function IconButton({ icon, label, count, bordered, className, ...rest }: IconButtonProps) {
  return (
    <button type="button" className={cx('iconbtn', bordered && 'bd', className)} aria-label={label} title={label} {...rest}>
      <Icon name={icon} size="sm" />
      {count ? <span className="dot">{count > 99 ? '99+' : count}</span> : null}
    </button>
  );
}
