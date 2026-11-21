'use client';

import Link from 'next/link';
import { FeatureGate } from '@friocerto/modules';
import {
  AlertListItem, Button, Card, CardBody, CardHeader, EmptyState, Grid, KpiCard, KpiGrid, PageHeader,
  ServiceOrderCard, ServiceOrderGrid, StatPill,
} from '@friocerto/ui';
import { currentUser } from '@/lib/config';
import { demoEvents, maintenanceDue } from '@/lib/demo';

const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

export default function PainelPage() {
  const today = demoEvents().filter((e) => e.date === todayKey());
  const done = today.filter((e) => e.status === 'Concluída').length;
  const running = today.filter((e) => e.status === 'Em andamento').length;

  return (
    <>
      <PageHeader
        title={`Olá, ${currentUser.name.split(' ')[0]}`}
        breadcrumb={[{ label: 'Painel' }]}
        linkAs={Link}
        actions={
          <>
            <StatPill icon="calendar" color="var(--accent)" label="OS hoje" value={today.length} />
            <StatPill icon="alert" color="var(--danger)" label="Alertas" value={14} />
            <FeatureGate feature="os">
              <Button as={Link} href="/os/nova" variant="primary" icon="plus">Nova OS</Button>
            </FeatureGate>
          </>
        }
      />

      <KpiGrid>
        <KpiCard as={Link} href="/agenda" label="Atendimentos hoje" icon="clipboard" value={today.length}
          hint={`${done} concluídos · ${running} em andamento`} chart={{ values: [3, 5, 4, 6, 5, 7, 6, today.length + 2], kind: 'bars' }} />
        <FeatureGate feature="equipamentos">
          <KpiCard as={Link} href="/equipamentos" label="Preventivas a vencer" icon="snow" value={10} trend="down" hint="5 vencidas · 5 em até 15 dias" />
        </FeatureGate>
        <FeatureGate feature="financeiro">
          <KpiCard as={Link} href="/financeiro" label="A receber" icon="wallet" value="R$ 3 mil" hint="4 vencido(s) · R$ 2.060,00" />
          <KpiCard as={Link} href="/financeiro" label="Recebido no mês" icon="trendUp" value="R$ 690,00" trend="up"
            hint="4 serviços concluídos" chart={{ values: [20, 26, 24, 31, 29, 36, 34, 40], kind: 'area' }} />
        </FeatureGate>
      </KpiGrid>

      <Grid cols="2-1" className="mb16">
        <Card>
          <CardHeader title="Agenda de hoje" icon="calendar" actions={<Button as={Link} href="/agenda" size="xs" iconRight="right">Semana</Button>} />
          <CardBody>
            {today.length ? (
              <ServiceOrderGrid>
                {today.map((e) => (
                  <ServiceOrderCard key={e.id} linkAs={Link} href={`/os/${e.id}`} time={e.time} status={e.status} customer={e.title}
                    description="Aldeota · Preventiva da sala de reuniões" type={e.type} technician={e.technician} />
                ))}
              </ServiceOrderGrid>
            ) : (
              <EmptyState icon="calendar" title="Nenhum atendimento hoje" text="Agende uma OS para hoje." />
            )}
          </CardBody>
        </Card>

        <FeatureGate feature="equipamentos">
          <Card>
            <CardHeader title="Manutenções a vencer" icon="bell" actions={<Button as={Link} href="/equipamentos" size="xs">Ver todas</Button>} />
            <CardBody>
              {maintenanceDue.map((m) => (
                <AlertListItem key={m.customer + m.equipment} severity={m.severity} title={m.customer} subtitle={m.equipment} status={m.status}
                  actions={
                    <>
                      <Button size="xs" icon="msg" title="Avisar o cliente no WhatsApp" aria-label="Avisar o cliente no WhatsApp" />
                      <Button size="xs" variant="primary" icon="calPlus" title="Agendar preventiva" aria-label="Agendar preventiva" />
                    </>
                  } />
              ))}
            </CardBody>
          </Card>
        </FeatureGate>
      </Grid>
    </>
  );
}
