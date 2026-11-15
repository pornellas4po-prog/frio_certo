import { useId, type ElementType } from 'react';

/** Símbolo do Frio Certo: floco de neve branco em quadrado com degradê azul. */
export function BrandMark({ size = 34 }: { size?: number }) {
  const gid = 'bg' + useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" style={{ width: size, height: size, flexShrink: 0 }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38BDF8" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill={`url(#${gid})`} />
      <g stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M20 8v24M9.6 14l20.8 12M9.6 26l20.8-12" />
        <path d="m16 10 4 3 4-3M16 30l4-3 4 3" />
      </g>
    </svg>
  );
}

export type BrandProps = {
  /** Nome da empresa (editável em Configurações). A 1ª palavra vira o destaque. */
  name?: string;
  href?: string;
  linkAs?: ElementType;
};

/** Logo completo do menu lateral: símbolo + "FrioCerto / Climatização". */
export function Brand({ name = 'FrioCerto Climatização', href = '/painel', linkAs }: BrandProps) {
  const L: ElementType = linkAs ?? 'a';
  const [first, ...rest] = name.split(' ');
  return (
    <L className="brand" href={href} aria-label={`${name} · início`}>
      <BrandMark />
      <span className="wm" style={{ color: '#fff' }}>
        {first}
        <small style={{ color: '#9FC3E6' }}>{rest.join(' ') || 'Climatização'}</small>
      </span>
    </L>
  );
}
