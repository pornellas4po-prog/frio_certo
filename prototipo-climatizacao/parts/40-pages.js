
/* ================= PAINEL ================= */
const osHoje = () => db.os.filter(o => o.data===dkey(new Date()) && o.status!=='Cancelada').sort((a,b) => a.hora.localeCompare(b.hora));
function osCardHTML(o, big){
  const c = byId(db.clientes, o.clienteId);
  return `<a class="oscard ${big?'big':''}" href="#/os/${o.id}" style="--c:${tecCor(o.tecnicoId)}"><div class="row" style="justify-content:space-between;gap:8px"><b class="hr">${o.hora || '--:--'}</b>${pillOf(o.status, ST_OS)}</div><div class="b mt4">${esc(c?.nome||'—')}</div><div class="xsmall muted">${esc(c?.bairro||'')} · ${esc(o.problema.slice(0,60))}</div><div class="row mt8" style="gap:6px;justify-content:space-between">${tipoTag(o.tipo)}<span class="xsmall"><span class="dotc" style="--c:${tecCor(o.tecnicoId)}"></span> ${o.tecnicoId ? esc(tecNome(o.tecnicoId).split(' ')[0]) : 'Sem técnico'}</span></div></a>`;
}
ROUTES.painel = {title:'Painel', render(){
  const hoje = osHoje(); const tt = titulos(); const mes = new Date().getMonth();
  const aberto = tt.filter(t => t.situacao!=='Pago'), venc = tt.filter(t => t.situacao==='Vencido');
  const recMes = sum(tt.filter(t => t.situacao==='Pago' && t.pagoEm && new Date(t.pagoEm).getMonth()===mes), t => t.valor);
  const prev = db.equipamentos.filter(e => eqAlerta(e).k==='bad' || eqAlerta(e).k==='warn').sort((a,b) => eqProxima(a) - eqProxima(b));
  return `${pageHead(`Olá, ${esc(me().nome.split(' ')[0])}`, [['Painel']], `${statPill('calendar','var(--accent)','OS hoje', hoje.length)}${statPill('alert','var(--danger)','Alertas', alertasList().length)}<a class="btn pri" href="#/os/nova">${ic('plus','sm')} Nova OS</a>`)}
  <div class="kpis">
    <a class="kpi" href="#/agenda"><div class="kpi-l">Atendimentos hoje<i>${ic('clipboard')}</i></div><div class="kpi-v">${hoje.length}</div><div class="kpi-s">${hoje.filter(o=>o.status==='Concluída').length} concluídos · ${hoje.filter(o=>o.status==='Em andamento').length} em andamento</div>${miniSVG([3,5,4,6,5,7,6,hoje.length+2],'bars')}</a>
    <a class="kpi" href="#/equipamentos?alerta=1"><div class="kpi-l">Preventivas a vencer<i>${ic('snow')}</i></div><div class="kpi-v ${prev.some(e=>eqAlerta(e).k==='bad')?'dn':''}">${prev.length}</div><div class="kpi-s">${prev.filter(e=>eqAlerta(e).k==='bad').length} vencidas · ${prev.filter(e=>eqAlerta(e).k==='warn').length} em até 15 dias</div></a>
    <a class="kpi" href="#/financeiro"><div class="kpi-l">A receber<i>${ic('wallet')}</i></div><div class="kpi-v">${brlk(sum(aberto, t=>t.valor))}</div><div class="kpi-s">${venc.length ? `${venc.length} vencido(s) · ${brl(sum(venc,t=>t.valor))}` : 'nada vencido'}</div></a>
    <a class="kpi" href="#/financeiro"><div class="kpi-l">Recebido no mês<i>${ic('trendUp')}</i></div><div class="kpi-v up">${brlk(recMes)}</div><div class="kpi-s">${db.os.filter(o => o.status==='Concluída' && o.concluidaEm && new Date(o.concluidaEm).getMonth()===mes).length} serviços concluídos</div>${miniSVG([20,26,24,31,29,36,34,40],'area')}</a>
  </div>
  <div class="grid g-21 mb16">
    <div class="card"><div class="card-h"><h3>${ic('calendar')} Agenda de hoje</h3><a class="btn xs" href="#/agenda">Semana ${ic('right','xs')}</a></div><div class="card-b"><div class="osgrid">${hoje.map(o => osCardHTML(o)).join('') || emptyState('calendar','Nenhum atendimento hoje','Agende uma OS para hoje.', `<a class="btn pri sm" href="#/os/nova">${ic('plus','sm')} Nova OS</a>`)}</div></div></div>
    <div class="card"><div class="card-h"><h3>${ic('bell')} Manutenções a vencer</h3><a class="btn xs" href="#/equipamentos?alerta=1">Ver todas</a></div><div class="card-b">${prev.slice(0,6).map(e => `<div class="row" style="padding:8px 0;border-top:1px solid var(--line);align-items:flex-start"><span class="circbtn" style="width:32px;height:32px;margin:0;flex-shrink:0;background:var(--${eqAlerta(e).k==='bad'?'danger-bg':'warn-bg'});color:var(--${eqAlerta(e).k==='bad'?'danger':'warn'})">${ic('snow','sm')}</span><div style="flex:1;min-width:0"><div class="b small">${esc(cliNome(e.clienteId))}</div><div class="xsmall muted">${esc(e.local)} · ${esc(e.marca)} ${nf(e.btus)}</div><div class="xsmall" style="color:var(--${eqAlerta(e).k==='bad'?'danger':'warn'});font-weight:600">${esc(eqAlerta(e).l)}</div></div><div class="row" style="gap:4px"><a class="btn xs" target="_blank" rel="noopener" href="${waTexto(avisoTxt(e))}" title="Avisar o cliente no WhatsApp">${ic('msg','xs')}</a><a class="btn xs pri" href="#/os/nova?cliente=${e.clienteId}&eq=${e.id}&tipo=Preventiva" title="Agendar preventiva">${ic('calPlus','xs')}</a></div></div>`).join('') || '<div class="small muted">Todos os equipamentos em dia.</div>'}</div></div>
  </div>
  <div class="grid g-21">
    <div class="card"><div class="card-h"><h3>${ic('bars')} Faturamento · 6 meses</h3><div class="legend"><span style="--c:var(--accent)"><i></i>Serviços concluídos</span></div></div><div class="card-b"><div class="chart" id="chFat"></div></div></div>
    <div class="grid" style="align-content:start">
      <div class="card"><div class="card-h"><h3>${ic('pie')} Atendimentos por tipo</h3></div><div class="card-b" style="display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:center">${donutSVG(Object.keys(TIPO).map(t => ({l:t, v:db.os.filter(o => o.tipo===t && o.status!=='Cancelada').length, c:TIPO[t].c})), {size:130, thick:18, center:String(db.os.filter(o=>o.status!=='Cancelada').length), centerSub:'OS'})}<div>${Object.keys(TIPO).map(t => `<div class="ip-row"><span class="row" style="gap:6px"><span class="dotc" style="--c:${TIPO[t].c}"></span>${t}</span><b>${db.os.filter(o => o.tipo===t && o.status!=='Cancelada').length}</b></div>`).join('')}</div></div></div>
      <div class="card"><div class="card-h"><h3>${ic('wallet')} Recebimentos em atenção</h3></div><div class="card-b">${aberto.sort((a,b) => a.dias-b.dias).slice(0,5).map(t => `<div class="ip-row"><span>${esc(cliNome(t.clienteId))}<br><small class="${t.situacao==='Vencido'?'':'muted'}" style="${t.situacao==='Vencido'?'color:var(--danger);font-weight:600':''}">${t.situacao==='Vencido' ? `vencido há ${-t.dias} dia(s)` : t.dias===0 ? 'vence hoje' : `vence em ${t.dias} dia(s)`} · ${esc(t.forma)}</small></span><b>${brl(t.valor)}</b></div>`).join('') || '<div class="small muted">Nada em aberto.</div>'}</div></div>
    </div>
  </div>`;
}, mount(){
  const M = Array.from({length:6}, (_,i) => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth()-5+i); return d; });
  const R = rng(5); const real = M.map((d,i) => i===5 ? sum(db.os.filter(o => o.status==='Concluída' && o.concluidaEm && new Date(o.concluidaEm).getMonth()===d.getMonth()), osTotal) : 2600 + R()*1800 + i*250);
  onChart(() => lineChart($('#chFat'), {labels:M.map(d => MON[d.getMonth()]), h:230, series:[{name:'Faturamento', color:'var(--accent)', values:real}], fmtY:brlk}));
}};
const avisoTxt = e => { const c = byId(db.clientes, e.clienteId); return `Olá, ${c?.nome.split(' ')[0]}! Aqui é da ${brandName()}. A manutenção preventiva do seu ar-condicionado (${e.local} · ${e.marca} ${nf(e.btus)} BTUs) ${eqAlerta(e).k==='bad' ? 'está vencida' : 'vence em breve'}. Manutenção em dia economiza energia e evita problemas de saúde. Vamos agendar?`; };

/* ================= MEU DIA (tela do técnico no celular) ================= */
ROUTES.meudia = {title:'Meu dia', render(){
  const tecs = db.tecnicos.filter(t => t.ativo); if (!tecs.length) return emptyState('hardhat','Cadastre os técnicos','', '<a class="btn pri" href="#/tecnicos?novo=1">Novo técnico</a>');
  const tec = byId(db.tecnicos, S.tec) || tecs[0]; S.tec = tec.id;
  const dia = S.mdDia || dkey(new Date()); const list = db.os.filter(o => o.tecnicoId===tec.id && o.data===dia && o.status!=='Cancelada').sort((a,b) => a.hora.localeCompare(b.hora));
  const feitos = list.filter(o => o.status==='Concluída').length;
  return `${pageHead('Meu dia', [['Meu dia']], '')}
  <div class="card mb16"><div class="card-b"><div class="fgrid">${fld('Técnico', `<select class="sel" data-ch="mdTec">${opts(tecs.map(t => ({v:t.id,l:t.nome})), tec.id)}</select>`)}${fld('Dia', `<input class="inp" type="date" value="${dia}" data-ch="mdDia">`)}</div>
    <div class="row mt12" style="justify-content:space-between"><span class="small t2">${feitos} de ${list.length} atendimentos concluídos</span><b class="small">${list.length ? Math.round(feitos/list.length*100) : 0}%</b></div><div class="meter mt8"><i style="width:${list.length ? feitos/list.length*100 : 0}%"></i></div></div></div>
  <div class="grid" style="gap:12px">${list.map(o => { const c = byId(db.clientes, o.clienteId); return `<div class="card md-card" style="--c:${TIPO[o.tipo].c}"><div class="card-b"><div class="row" style="justify-content:space-between"><b style="font-size:20px">${o.hora}</b>${pillOf(o.status, ST_OS)}</div><div class="b mt8" style="font-size:15px">${esc(c?.nome||'—')}</div><div class="small t2">${esc(enderecoDe(c))}</div><div class="row mt8" style="gap:6px">${tipoTag(o.tipo)}<span class="xsmall muted">${o.equipamentoIds.length} equipamento(s)</span></div><div class="small mt8">${esc(o.problema)}</div>
    <div class="row mt12" style="gap:8px"><a class="btn sm" href="${c?mapsUrl(c):'#'}" target="_blank" rel="noopener">${ic('route','sm')} Rota</a><a class="btn sm" href="tel:${onlyDigits(c?.telefone)}">${ic('phone','sm')} Ligar</a><a class="btn sm pri" style="margin-left:auto" href="#/os/${o.id}">${o.status==='Concluída' ? 'Ver OS' : o.status==='Em andamento' ? 'Continuar' : 'Abrir OS'} ${ic('right','sm')}</a></div></div></div>`; }).join('') || `<div class="card">${emptyState('smartphone','Nenhum atendimento neste dia','Escolha outro dia ou outro técnico.')}</div>`}</div>`;
}};
IN.mdTec = t => { S.tec = t.value; lsSet(LS_TEC, t.value); refresh(); };
IN.mdDia = t => { S.mdDia = t.value; refresh(); };

/* ================= AGENDA SEMANAL ================= */
ROUTES.agenda = {title:'Agenda', render(){
  const ag = S.ag; if (!ag.base) ag.base = dkey(new Date()); ag.tecs ||= [];
  const b = dfrom(ag.base); const ini = addDays(b, -((b.getDay()+6)%7)); const dias = Array.from({length:7}, (_,i) => addDays(ini, i));
  const pend = db.os.filter(o => o.status==='Pendente');
  return `${pageHead('Agenda', [['Agenda']], `<div class="row" style="gap:6px"><button class="btn sm ic-only" data-a="agNav" data-v="-7" aria-label="Semana anterior">${ic('left','sm')}</button><button class="btn sm" data-a="agNav" data-v="0">Hoje</button><button class="btn sm ic-only" data-a="agNav" data-v="7" aria-label="Próxima semana">${ic('right','sm')}</button></div><a class="btn pri" href="#/os/nova">${ic('plus','sm')} Nova OS</a>`)}
  <div class="toolbar"><b>${fdate(dias[0])} a ${fdate(dias[6])}</b><span class="sp"></span>${db.tecnicos.map(t => `<button class="chip ${!ag.tecs.length || ag.tecs.includes(t.id) ? 'on' : ''}" data-a="agTec" data-id="${t.id}"><span class="dotc" style="--c:${t.cor}"></span>${esc(t.nome.split(' ')[0])}</button>`).join('')}</div>
  <div class="small muted mb16">Arraste um atendimento para outro dia para reagendar.</div>
  <div class="week">${dias.map(d => { const k = dkey(d); const os = db.os.filter(o => o.data===k && o.status!=='Cancelada' && (!ag.tecs.length || ag.tecs.includes(o.tecnicoId))).sort((a,b) => a.hora.localeCompare(b.hora)); return `<div class="wday ${sameDay(d,new Date())?'today':''}" data-dia="${k}"><div class="wh"><b>${DOW[d.getDay()]}</b><span>${d.getDate()}</span></div><div class="wb">${os.map(o => `<div class="wcard" draggable="true" data-os="${o.id}" style="--c:${tecCor(o.tecnicoId)}" data-a="go" data-h="#/os/${o.id}"><div class="row" style="justify-content:space-between"><b>${o.hora}</b><span style="color:${TIPO[o.tipo].c}">${ic(TIPO[o.tipo].i,'xs')}</span></div><div class="t">${esc(cliNome(o.clienteId))}</div><div class="s">${esc(o.tipo)} · ${esc(tecNome(o.tecnicoId).split(' ')[0])}</div>${o.status==='Concluída'?`<span class="pill ok nodot" style="height:18px;font-size:10px">Concluída</span>`:o.status==='Em andamento'?`<span class="pill warn nodot" style="height:18px;font-size:10px">Em andamento</span>`:''}</div>`).join('')}<a class="wadd" href="#/os/nova?data=${k}">${ic('plus','xs')}</a></div></div>`; }).join('')}</div>
  ${pend.length ? `<div class="card mt16"><div class="card-h"><h3>${ic('clock')} Aguardando agendamento (${pend.length})</h3></div><div class="card-b"><div class="osgrid">${pend.map(o => osCardHTML(o)).join('')}</div></div></div>` : ''}`;
}, mount(){
  $$('.wcard').forEach(el => { el.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', el.dataset.os); el.classList.add('drag'); }); el.addEventListener('dragend', () => el.classList.remove('drag')); });
  $$('.wday').forEach(col => { col.addEventListener('dragover', e => { e.preventDefault(); col.classList.add('over'); }); col.addEventListener('dragleave', () => col.classList.remove('over'));
    col.addEventListener('drop', e => { e.preventDefault(); col.classList.remove('over'); const o = byId(db.os, e.dataTransfer.getData('text/plain')); if (!o || o.data===col.dataset.dia) return; if (o.status==='Concluída') return toast('OS já concluída', 'Não é possível reagendar.', 'warn'); o.data = col.dataset.dia; if (o.status==='Pendente' && o.tecnicoId) o.status = 'Agendada'; saveDB(); toast('Reagendada', `${o.numero} · ${fdate(dfrom(o.data))} às ${o.hora}`); refresh(); }); });
}};
A.agNav = t => { const v = +t.dataset.v; S.ag.base = v===0 ? dkey(new Date()) : dkey(addDays(dfrom(S.ag.base), v)); refresh(); };
A.agTec = t => { const a = S.ag.tecs; const all = db.tecnicos.map(x => x.id); if (!a.length){ S.ag.tecs = all.filter(x => x!==t.dataset.id); } else { const i = a.indexOf(t.dataset.id); i<0 ? a.push(t.dataset.id) : a.splice(i,1); if (!S.ag.tecs.length || S.ag.tecs.length===all.length) S.ag.tecs = []; } refresh(); };
