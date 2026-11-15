# Frontend do Frio Certo

App web em **Next.js 16** + **pacotes de design system** com a identidade visual idêntica ao protótipo aprovado (`climatizacao-prototipo02.html`).

## Estrutura

```
frontend/
├── apps/
│   └── web/                 # app Next.js (App Router)
│       ├── app/(app)/painel # Painel (igual ao protótipo)
│       ├── app/(app)/agenda # Agenda semanal com arrastar e soltar
│       ├── app/(app)/[tela] # demais telas: "em construção" ou "módulo não contratado"
│       ├── components/Shell.tsx
│       └── lib/             # menu, configuração, dados de demonstração
└── packages/
    ├── theme/    @friocerto/theme   tokens (claro/escuro), fontes, CSS base, ThemeProvider
    ├── icons/    @friocerto/icons   137 ícones do protótipo como <Icon name="snow" />
    ├── ui/       @friocerto/ui      componentes React + CSS dos componentes
    └── modules/  @friocerto/modules liberação por módulo/plano (<FeatureGate>, useModules)
```

## Como rodar

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm run typecheck  # checa os tipos de todos os pacotes
```

## Pacotes

### `@friocerto/theme`
- `styles.css`: tokens de cor (tema azul gelo + marinho), claro e escuro, e CSS base.
- `tokens.ts`: os mesmos valores em TypeScript (cores, fontes, raios, cores dos tipos de serviço).
- `ThemeProvider`, `useTheme()`, `themeInitScript` (evita piscar ao trocar de tema).

### `@friocerto/icons`
`<Icon name="calendar" size="sm" />` — tamanhos `xs | sm | md | lg | xl`, iguais ao protótipo.

### `@friocerto/ui`
| Grupo | Componentes |
|---|---|
| Estrutura | `AppShell` (menu lateral + barra superior + rodapé), `Brand`, `BrandMark`, `PageHeader`, `Grid`, `Toolbar` |
| Ações | `Button` (default, primary, dark, ghost, danger, success · xs/sm/md/lg · `as={Link}`), `IconButton` |
| Conteúdo | `Card`, `CardHeader`, `CardBody`, `KpiCard`, `KpiGrid`, `MiniChart`, `EmptyState` |
| Etiquetas | `Pill`, `Tag`, `Chip`, `ColorDot`, `NavBadge`, `StatPill`, `Avatar` |
| Formulários | `Field`, `Input`, `Textarea`, `Select` |
| Domínio | `ServiceOrderCard`, `ServiceOrderGrid`, `ServiceTypeTag`, `ServiceOrderStatusPill`, `AlertListItem`, `WeekCalendar` |

O CSS dos componentes (`@friocerto/ui/styles.css`) foi portado do protótipo — inclui também as classes das telas que ainda serão construídas (atendimento, tabelas, modais etc.).

### `@friocerto/modules`
Liberação do sistema por módulo, na ordem definida pelo dono:

| Plano | Módulos |
|---|---|
| `atendimento` | Atendimento / Agendamento |
| `atendimento-os` | + Ordem de Serviço (com cadastros) |
| `completo` | + Orçamento / Financeiro |

```tsx
<ModulesProvider modules={['atendimento', 'os']}>
  <FeatureGate feature="financeiro" fallback={<p>Módulo não contratado</p>}>…</FeatureGate>
</ModulesProvider>
```

Nesta instalação, os módulos vêm da variável `NEXT_PUBLIC_FRIOCERTO_MODULES` (ex.: `atendimento,os`). Sem ela, libera tudo.

## Usar no layout raiz

```tsx
import '@friocerto/theme/styles.css';
import '@friocerto/ui/styles.css';
```
