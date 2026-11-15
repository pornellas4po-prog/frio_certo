import type { ElementType } from 'react';

/** Junta classes CSS ignorando valores vazios. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** Iniciais de um nome ("Carlos Mendes" → "CM"). */
export function initials(name: string): string {
  const p = name.replace(/^@/, '').trim().split(/[\s._]+/).filter(Boolean);
  if (!p.length) return '?';
  return ((p[0]?.[0] ?? '') + (p.length > 1 ? (p[p.length - 1]?.[0] ?? '') : '')).toUpperCase();
}

/** Matiz (0–359) estável a partir de um texto — cor do avatar, igual ao protótipo. */
export function hue(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) % 360;
  return h;
}

/** Componente de link injetável (ex.: `next/link`). Padrão: <a>. */
export type LinkComponent = ElementType;
