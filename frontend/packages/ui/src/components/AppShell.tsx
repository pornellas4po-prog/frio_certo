'use client';

import { useEffect, useState, type ElementType, type ReactNode } from 'react';
import { Icon, type IconName } from '@friocerto/icons';
import { useTheme } from '@friocerto/theme';
import { Avatar } from './Avatar';
import { NavBadge } from './Badges';
import { Brand } from './Brand';
import { IconButton } from './Button';
import { cx } from '../utils';

export type NavItem = {
  key: string;
  label: string;
  icon: IconName;
  href: string;
  badge?: { count: number; muted?: boolean };
};

export type NavSection = { title: string; items: NavItem[] };

export type AppShellUser = { name: string; role: string };

export type AppShellProps = {
  nav: NavSection[];
  activeKey?: string;
  user: AppShellUser;
  brandName?: string;
  /** ações extras na barra superior, à esquerda dos ícones (ex.: botão "Nova OS") */
  topbarActions?: ReactNode;
  messagesCount?: number;
  alertsCount?: number;
  messagesHref?: string;
  onAlertsClick?: () => void;
  onSearch?: (term: string) => void;
  footer?: ReactNode;
  /** componente de link (ex.: next/link) */
  linkAs?: ElementType;
  children: ReactNode;
};

const COLLAPSE_KEY = 'friocerto-sidebar-collapsed';

/**
 * Estrutura principal do app, idêntica ao protótipo:
 * menu lateral (topo azul-marinho, seções, contadores, usuário) + barra superior (busca, Nova OS, mensagens, tema, alertas, avatar) + conteúdo + rodapé.
 */
export function AppShell({
  nav, activeKey, user, brandName, topbarActions, messagesCount, alertsCount, messagesHref = '/atendimento',
  onAlertsClick, onSearch, footer, linkAs, children,
}: AppShellProps) {
  const L: ElementType = linkAs ?? 'a';
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try { setCollapsed(localStorage.getItem(COLLAPSE_KEY) === '1'); } catch { /* sem armazenamento */ }
  }, []);

  const toggleCollapse = () => {
    setCollapsed((c) => {
      try { localStorage.setItem(COLLAPSE_KEY, c ? '0' : '1'); } catch { /* sem armazenamento */ }
      return !c;
    });
  };

  return (
    <div className={cx('app-shell', collapsed && 'sbc', mobileOpen && 'nav-open')} onClick={(e) => { if (mobileOpen && e.target === e.currentTarget) setMobileOpen(false); }}>
      <aside className="sidebar" aria-label="Menu principal">
        <div className="sb-top"><Brand name={brandName} linkAs={linkAs} /></div>
        <nav className="nav">
          {nav.map((section) => (
            <div key={section.title}>
              <div className="nav-gt">{section.title}</div>
              {section.items.map((item) => (
                <L
                  key={item.key}
                  href={item.href}
                  className={cx('nav-i', item.key === activeKey && 'open')}
                  title={item.label}
                  aria-current={item.key === activeKey ? 'page' : undefined}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                  {item.badge && item.badge.count > 0 && <NavBadge muted={item.badge.muted}>{item.badge.count}</NavBadge>}
                </L>
              ))}
            </div>
          ))}
        </nav>
        <div className="sb-user">
          <Avatar name={user.name} online />
          <div style={{ minWidth: 0 }}>
            <div className="nm">{user.name}</div>
            <div className="rl">{user.role}</div>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <IconButton
            className="tb-mobile"
            icon="menu"
            label="Menu"
            onClick={() => (window.matchMedia('(max-width: 900px)').matches ? setMobileOpen(true) : toggleCollapse())}
          />
          <IconButton className="hide-m" icon="collapse" label="Recolher menu" onClick={toggleCollapse} />
          <div className="search" role="search">
            <input
              placeholder="Buscar cliente, OS ou equipamento"
              autoComplete="off"
              aria-label="Buscar"
              onKeyDown={(e) => { if (e.key === 'Enter') onSearch?.((e.target as HTMLInputElement).value); }}
            />
            <kbd>CTRL + /</kbd>
          </div>
          <div className="tb-sp" />
          {topbarActions}
          <L className="iconbtn" href={messagesHref} aria-label="Atendimento" title="Atendimento">
            <Icon name="msgText" size="sm" />
            {messagesCount ? <span className="dot">{messagesCount}</span> : null}
          </L>
          <IconButton icon={theme === 'dark' ? 'sun' : 'moon'} label="Alternar tema" onClick={toggleTheme} />
          <IconButton icon="bell" label="Alertas" count={alertsCount} onClick={onAlertsClick} />
          <button type="button" className="userbtn" aria-label="Menu do usuário"><Avatar name={user.name} /></button>
        </header>
        <main className="view" id="view" tabIndex={-1}>{children}</main>
        {footer !== null && (
          <footer className="foot">{footer ?? <span>2026 © {brandName ?? 'FrioCerto Climatização'}</span>}</footer>
        )}
      </div>
    </div>
  );
}
