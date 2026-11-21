import type { CSSProperties } from 'react';
import { cx, hue, initials } from '../utils';

export type AvatarProps = { name: string; size?: number; online?: boolean; className?: string };

/** Avatar redondo com iniciais e cor estável pelo nome (igual ao protótipo). */
export function Avatar({ name, size = 34, online, className }: AvatarProps) {
  const style = { '--s': `${size}px`, '--h': hue(name) } as CSSProperties;
  return (
    <span className={cx('av', className)} style={style} title={name}>
      <i>{initials(name)}</i>
      {online && <span className="on" />}
    </span>
  );
}
