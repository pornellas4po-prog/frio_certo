'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { ThemeMode } from './tokens';

export const THEME_STORAGE_KEY = 'friocerto-theme';

type ThemeContextValue = { theme: ThemeMode; setTheme: (t: ThemeMode) => void; toggleTheme: () => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Script inline para aplicar o tema salvo antes da página aparecer (evita "piscar" claro → escuro).
 * Use no <head> do layout raiz: <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
 */
export const themeInitScript = `try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}catch(e){}`;

export function ThemeProvider({ children, defaultTheme = 'light' }: { children: ReactNode; defaultTheme?: ThemeMode }) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === 'light' || current === 'dark') setThemeState(current);
  }, []);

  const setTheme = useCallback((t: ThemeMode) => {
    setThemeState(t);
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem(THEME_STORAGE_KEY, t); } catch { /* armazenamento indisponível: segue sem salvar */ }
  }, []);

  const toggleTheme = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [theme, setTheme]);

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme precisa estar dentro de <ThemeProvider>.');
  return ctx;
}
