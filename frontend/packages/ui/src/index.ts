// @friocerto/ui · componentes do Frio Certo (idênticos ao protótipo aprovado)
// Estilos: importe "@friocerto/theme/styles.css" e "@friocerto/ui/styles.css" no layout raiz.

export { cx, initials, hue } from './utils';
export * from './domain';

export { AppShell, type AppShellProps, type NavItem, type NavSection, type AppShellUser } from './components/AppShell';
export { Brand, BrandMark, type BrandProps } from './components/Brand';
export { Button, IconButton, type ButtonProps, type ButtonVariant, type ButtonSize, type IconButtonProps } from './components/Button';
export { Card, CardHeader, CardBody, Grid, Toolbar, type CardProps, type CardHeaderProps, type GridCols } from './components/Card';
export { KpiCard, KpiGrid, MiniChart, type KpiCardProps, type MiniChartProps, type KpiTrend } from './components/Kpi';
export { Pill, Tag, Chip, ColorDot, NavBadge, StatPill, type PillProps, type PillTone, type TagProps, type ChipProps, type StatPillProps } from './components/Badges';
export { Avatar, type AvatarProps } from './components/Avatar';
export { PageHeader, EmptyState, type PageHeaderProps, type Crumb, type EmptyStateProps } from './components/PageHeader';
export { Field, Input, Textarea, Select, type FieldProps, type SelectOption } from './components/Form';
export {
  ServiceOrderCard, ServiceOrderGrid, ServiceTypeTag, ServiceOrderStatusPill, AlertListItem,
  type ServiceOrderCardProps, type AlertListItemProps,
} from './components/ServiceOrder';
export { WeekCalendar, type WeekCalendarProps, type CalendarEvent } from './components/WeekCalendar';
