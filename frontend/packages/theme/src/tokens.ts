/**
 * Tokens de design do Frio Certo em TypeScript.
 * Espelham `styles/tokens.css` — use quando precisar do valor no código (ex.: gráficos, cores de técnico).
 * Nos componentes, prefira as variáveis CSS (`var(--accent)`), que já trocam com o tema.
 */
export const fonts = {
  sans: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace",
  baseSize: '13.5px',
} as const;

export const radius = { sm: '8px', md: '10px', lg: '12px' } as const;

export const layout = { sidebarWidth: 248, sidebarCollapsed: 72, topbarHeight: 64, viewMaxWidth: 1560 } as const;

export const brand = {
  navy: '#0B2545',
  accent: '#0284C7',
  accentLight: '#38BDF8',
  name: 'FrioCerto',
  tagline: 'Climatização',
} as const;

export const colors = {
  light: {
    bg: '#F3F6F9', surface: '#FFFFFF', surface2: '#F8F9FA', surface3: '#EEF0F3',
    line: '#ECEEF1', line2: '#E1E4E9', text: '#1D2433', text2: '#4B5563', muted: '#8A92A0',
    accent: '#0284C7', accentInk: '#0369A1', accentSoft: '#E0F2FE', accentLine: '#7DD3FC',
    teal: '#0B2545', success: '#16A34A', warn: '#B7791F', danger: '#DC2626', info: '#2563EB', violet: '#7C3AED',
  },
  dark: {
    bg: '#0E1116', surface: '#161B23', surface2: '#1B212B', surface3: '#232A36',
    line: '#232A35', line2: '#2E3644', text: '#E8ECF2', text2: '#B1B9C6', muted: '#7E8899',
    accent: '#38BDF8', accentInk: '#7DD3FC', accentSoft: 'rgba(56,189,248,.14)', accentLine: 'rgba(56,189,248,.4)',
    teal: '#3B82C4', success: '#34D399', warn: '#FBBF24', danger: '#F87171', info: '#6AA8FF', violet: '#B9A2FF',
  },
} as const;

/** Cores dos tipos de atendimento (iguais ao protótipo). */
export const serviceTypeColors = {
  'Instalação': '#0284C7',
  'Preventiva': '#16A34A',
  'Corretiva': '#DC2626',
  'Orçamento / Visita': '#7C3AED',
} as const;

/** Paleta sugerida para a cor de cada técnico na agenda. */
export const technicianPalette = ['#0284C7', '#16A34A', '#F59E0B', '#7C3AED', '#DC2626', '#0B2545'] as const;

export type ThemeMode = 'light' | 'dark';
