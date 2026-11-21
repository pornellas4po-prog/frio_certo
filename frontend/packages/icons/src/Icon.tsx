import type { SVGProps } from 'react';
import { ICON_PATHS, type IconName } from './paths';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  name: IconName;
  /** xs 13px · sm 15px · md 18px (padrão) · lg 22px · xl 28px — iguais ao protótipo */
  size?: IconSize;
};

/** Ícone SVG do Frio Certo. Herda a cor do texto (currentColor). */
export function Icon({ name, size = 'md', className, ...rest }: IconProps) {
  const cls = ['ic', size !== 'md' ? size : '', className ?? ''].filter(Boolean).join(' ');
  return (
    <svg
      className={cls}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] }}
      {...rest}
    />
  );
}
