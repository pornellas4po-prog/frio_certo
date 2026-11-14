
/* ================= ÍCONES EXTRAS (climatização) ================= */
Object.assign(IC, {
  snow:'<path d="M2 12h20"/><path d="M12 2v20"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/>',
  wind:'<path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>',
  thermo:'<path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>',
  gauge:'<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  route:'<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
  signature:'<path d="m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284"/><path d="M3 21h18"/>',
});

/* ================= MARCA (nome editável em Configurações) ================= */
const brandName = () => db?.empresa?.nome || 'FrioCerto Climatização';
const BRAND_IC = `<svg viewBox="0 0 40 40" aria-hidden="true" style="width:34px;height:34px;flex-shrink:0"><defs><linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38BDF8"/><stop offset="1" stop-color="#0284C7"/></linearGradient></defs><rect width="40" height="40" rx="10" fill="url(#bg1)"/><g stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M20 8v24M9.6 14l20.8 12M9.6 26l20.8-12"/><path d="m16 10 4 3 4-3M16 30l4-3 4 3"/></g></svg>`;
const brandHTML = () => { const n = brandName().split(' '); return `<a class="brand" href="#/painel" aria-label="${esc(brandName())} · início">${BRAND_IC}<span class="wm" style="color:#fff">${esc(n[0])}<small style="color:#9FC3E6">${esc(n.slice(1).join(' ') || 'Climatização')}</small></span></a>`; };

/* ================= STORE ================= */
const LS_DB = 'clima-proto-db-v1', LS_THEME = 'clima-proto-theme', LS_SBC = 'clima-proto-sbc', LS_TEC = 'clima-proto-tec';
let db;
function lsGet(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
function lsSet(k,v){ try { localStorage.setItem(k,v); } catch(e){} }
function lsDel(k){ try { localStorage.removeItem(k); } catch(e){} }
function loadDB(){ const raw = lsGet(LS_DB); if (raw){ try { db = JSON.parse(raw); if (db && db.v === 1) return; } catch(e){} } db = seed(); saveDB(true); S.firstRun = true; }
let _svT; function saveDB(now){ clearTimeout(_svT); const f = () => { try { localStorage.setItem(LS_DB, JSON.stringify(db)); } catch(e){ toast('Armazenamento cheio', 'Remova algumas fotos para continuar salvando.', 'warn'); } }; if (now) f(); else _svT = setTimeout(f, 120); }
const S = { route:{name:'painel'}, list:{}, ag:{}, tec: lsGet(LS_TEC) || '' };
function can(){ return true; }

/* ================= MENU ================= */
const NAV = [
  {sec:'Operação', items:[ {k:'painel', l:'Painel', i:'dashboard'}, {k:'meudia', l:'Meu dia (técnico)', i:'smartphone'}, {k:'agenda', l:'Agenda', i:'calendar'}, {k:'os', l:'Ordens de serviço', i:'clipboard'} ]},
  {sec:'Cadastros', items:[ {k:'clientes', l:'Clientes', i:'users'}, {k:'equipamentos', l:'Equipamentos', i:'snow'}, {k:'catalogo', l:'Serviços e peças', i:'tag'}, {k:'tecnicos', l:'Técnicos', i:'hardhat'} ]},
  {sec:'Comercial', items:[ {k:'orcamentos', l:'Orçamentos', i:'calc'}, {k:'financeiro', l:'Financeiro', i:'wallet'} ]},
  {sec:'Sistema', items:[ {k:'config', l:'Configurações', i:'settings'} ]},
];
const MOD_FLAT = NAV.flatMap(s => s.items.map(i => ({...i, g:s.sec})));
function navBadge(k){
  if (k==='equipamentos'){ const n = db.equipamentos.filter(e => eqAlerta(e).k !== 'ok').length; return n ? `<span class="nb">${n}</span>` : ''; }
  if (k==='financeiro'){ const n = titulos().filter(t => t.situacao==='Vencido').length; return n ? `<span class="nb">${n}</span>` : ''; }
  if (k==='os'){ const n = db.os.filter(o => o.status==='Pendente').length; return n ? `<span class="nb n2">${n}</span>` : ''; }
  return '';
}
const me = () => ({nome: db.empresa.responsavel || 'Carlos Mendes', cargo:'Proprietário'});
function shellHTML(){
  return `
  <aside class="sidebar" aria-label="Menu principal"><div class="sb-top" id="sbTop"></div><nav class="nav" id="nav"></nav>
    <div class="sb-user">${av(me(), 34, '<span class="on"></span>')}<div style="min-width:0"><div class="nm" id="sbUser">${esc(me().nome)}</div><div class="rl">Proprietário</div></div></div></aside>
  <div class="main">
    <header class="topbar">
      <button class="iconbtn tb-mobile" data-a="navToggle" aria-label="Menu">${ic('menu')}</button>
      <button class="iconbtn hide-m" data-a="sbCollapse" aria-label="Recolher menu" title="Recolher menu">${ic('collapse')}</button>
      <div class="search" role="search"><input id="gsearch" data-in="gsearch" placeholder="Buscar cliente, OS ou equipamento" autocomplete="off" aria-label="Buscar"><kbd>CTRL + /</kbd></div>
      <div class="tb-sp"></div>
      <a class="btn pri sm hide-m" href="#/os/nova">${ic('plus','sm')} Nova OS</a>
      <button class="iconbtn" data-a="toggleTheme" aria-label="Alternar tema" id="themeBtn"></button>
      <button class="iconbtn" data-a="alertas" data-menu-anchor aria-label="Alertas" id="bellBtn">${ic('bell','sm')}</button>
      <button class="userbtn" data-a="userMenu" data-menu-anchor aria-label="Menu do usuário">${av(me(), 34)}</button>
    </header>
    <main class="view" id="view" tabindex="-1"></main>
    <footer class="foot"><span>2026 © <span id="ftNome"></span> · protótipo navegável</span><span>Dados de demonstração salvos neste navegador</span></footer>
  </div>
  <nav class="tabbar" id="tabbar" aria-label="Navegação"></nav>`;
}
function renderNav(){
  const r = S.route.name;
  $('#sbTop').innerHTML = brandHTML(); $('#ftNome').textContent = brandName(); $('#sbUser').textContent = me().nome;
  $('#nav').innerHTML = NAV.map(s => `<div class="nav-gt">${s.sec}</div>${s.items.map(i => `<a href="#/${i.k}" class="nav-i ${i.k===r?'open':''}" title="${i.l}">${ic(i.i)}<span>${i.l}</span>${navBadge(i.k)}</a>`).join('')}`).join('');
  const tabs = [{k:'painel',l:'Painel',i:'home'},{k:'meudia',l:'Meu dia',i:'smartphone'},{k:'agenda',l:'Agenda',i:'calendar'},{k:'os',l:'OS',i:'clipboard'},{k:'mais',l:'Menu',i:'menu'}];
  $('#tabbar').innerHTML = tabs.map(t => t.k==='mais' ? `<a href="#" data-a="navToggle"><span>${ic(t.i)}</span>${t.l}</a>` : `<a href="#/${t.k}" class="${t.k===r?'on':''}"><span>${ic(t.i)}</span>${t.l}</a>`).join('');
  const n = alertasList().length; $('#bellBtn').innerHTML = ic('bell','sm') + (n ? `<span class="dot">${n}</span>` : '');
  $('#themeBtn').innerHTML = ic(D.documentElement.dataset.theme==='dark' ? 'sun' : 'moon', 'sm');
  D.title = `${S.docTitle || ''} · ${brandName()}`;
}
A.navToggle = (t, e) => { e?.preventDefault(); D.body.classList.toggle('nav-open'); };
D.addEventListener('click', e => { if (D.body.classList.contains('nav-open') && (e.target.closest('.nav a') || (!e.target.closest('.sidebar') && !e.target.closest('[data-a=navToggle]')))) D.body.classList.remove('nav-open'); });
A.sbCollapse = () => { const c = D.body.classList.toggle('sbc'); c ? lsSet(LS_SBC,'1') : lsDel(LS_SBC); setTimeout(redrawCharts, 220); };
function applyTheme(t){ D.documentElement.dataset.theme = t; lsSet(LS_THEME, t); }
A.toggleTheme = () => { applyTheme(D.documentElement.dataset.theme==='dark' ? 'light' : 'dark'); renderNav(); redrawCharts(); };
A.userMenu = t => popMenu(t, `<div style="display:flex;gap:10px;align-items:center;padding:8px 10px 10px">${av(me(),40)}<div><b>${esc(me().nome)}</b><div class="xsmall muted">${esc(brandName())}</div></div></div><div class="msep"></div>${mi('toggleTheme', D.documentElement.dataset.theme==='dark'?'Usar tema claro':'Usar tema escuro', D.documentElement.dataset.theme==='dark'?'sun':'moon')}${mi('go','Configurações da empresa','settings','data-h="#/config"')}${mi('resetDemo','Recomeçar com dados de exemplo','refresh')}${mi('resetZero','Começar do zero (sistema vazio)','trash')}`, {w:290});

/* alertas: preventivas vencidas ou próximas e recebimentos vencidos */
function alertasList(){
  const a = [];
  db.equipamentos.forEach(e => { const s = eqAlerta(e); if (s.k==='bad' || s.k==='warn') a.push({i:'snow', t: s.k==='bad' ? 'Preventiva vencida' : 'Preventiva próxima', d:`${cliNome(e.clienteId)} · ${eqNome(e)} · ${s.l}`, h:`#/equipamentos?id=${e.id}`, k:s.k}); });
  titulos().filter(t => t.situacao==='Vencido').forEach(t => a.push({i:'wallet', t:'Recebimento vencido', d:`${cliNome(t.clienteId)} · ${brl(t.valor)} · ${t.forma}`, h:`#/financeiro`, k:'bad'}));
  return a.sort((x,y) => (x.k==='bad'?0:1) - (y.k==='bad'?0:1));
}
A.alertas = t => { const a = alertasList(); popMenu(t, `<div class="row" style="padding:6px 10px 8px"><b>Alertas</b><span class="sp"></span><span class="xsmall muted">${a.length}</span></div>${a.slice(0,10).map(n => `<a class="ni" href="${n.h}" data-a="closeMenuA"><span class="nic" style="${n.k==='bad'?'background:var(--danger-bg);color:var(--danger)':''}">${ic(n.i,'sm')}</span><div><div class="t">${esc(n.t)}</div><div class="d">${esc(n.d)}</div></div></a>`).join('') || '<div class="empty">Nenhum alerta. Tudo em dia!</div>'}`, {cls:'notif'}); };
A.closeMenuA = () => closeMenu();

/* busca global */
IN.gsearch = t => {
  const q = normalize(t.value.trim()); $('.sr-pop')?.remove(); if (q.length < 2) return;
  const row = (h, icon, t1, t2) => `<a class="sr-i" href="${h}" data-a="srGo">${icon}<div style="min-width:0"><div>${t1}</div><small>${t2}</small></div></a>`;
  const box = i => `<span style="width:30px;height:30px;border-radius:8px;display:grid;place-items:center;background:var(--accent-soft);color:var(--accent)">${ic(i,'sm')}</span>`;
  const cl = db.clientes.filter(c => normalize(c.nome + c.telefone + c.bairro).includes(q)).slice(0,4);
  const os = db.os.filter(o => normalize(o.numero + cliNome(o.clienteId) + o.problema).includes(q)).slice(0,4);
  const eq = db.equipamentos.filter(e => normalize(eqNome(e) + e.local + e.serie).includes(q)).slice(0,3);
  let html = '';
  if (cl.length) html += `<div class="sr-g">Clientes</div>` + cl.map(c => row(`#/clientes?id=${c.id}`, av(c,30), esc(c.nome), `${esc(c.bairro)} · ${esc(c.telefone)}`)).join('');
  if (os.length) html += `<div class="sr-g">Ordens de serviço</div>` + os.map(o => row(`#/os/${o.id}`, box(TIPO[o.tipo].i), `${o.numero} · ${esc(cliNome(o.clienteId))}`, `${o.tipo} · ${o.status}`)).join('');
  if (eq.length) html += `<div class="sr-g">Equipamentos</div>` + eq.map(e => row(`#/equipamentos?id=${e.id}`, box('snow'), esc(eqNome(e)), `${esc(cliNome(e.clienteId))} · ${esc(e.local)}`)).join('');
  if (!html) html = `<div class="empty" style="padding:22px">Nada encontrado para "${esc(t.value)}".</div>`;
  const pop = D.createElement('div'); pop.className = 'sr-pop'; pop.innerHTML = html; t.parentElement.appendChild(pop);
};
A.srGo = () => { $('.sr-pop')?.remove(); const s = $('#gsearch'); if (s) s.value=''; };
D.addEventListener('mousedown', e => { const p = $('.sr-pop'); if (p && !e.target.closest('.search')) p.remove(); });

/* reset */
A.resetDemo = async () => { closeMenu(); if (!await confirmDlg({title:'Recomeçar com dados de exemplo?', text:'Tudo o que foi cadastrado neste navegador será apagado e os dados de exemplo voltam.', ok:'Recomeçar', danger:false})) return; resetTo(seed()); toast('Dados de exemplo carregados'); };
A.resetZero = async () => { closeMenu(); if (!await confirmDlg({title:'Começar do zero?', text:'Clientes, equipamentos, OS, orçamentos e recebimentos serão apagados. Ficam o catálogo de serviços, os técnicos e os dados da empresa.', ok:'Apagar e começar'})) return; resetTo(seedVazio()); toast('Sistema vazio', 'Comece cadastrando um cliente.', 'info'); location.hash = '#/clientes'; };
function resetTo(d){ closeAll(); db = d; saveDB(true); S.list = {}; S.osDraft = null; S.orcDraft = null; render(); }

/* ================= ROTEADOR ================= */
const ROUTES = {};
function parseHash(){ const h = location.hash.replace(/^#\/?/, '') || 'painel'; const [path, qs] = h.split('?'); const parts = path.split('/'); return { name: parts[0] || 'painel', id: parts[1] ? decodeURIComponent(parts[1]) : '', sub: parts[2] || '', q: Object.fromEntries(new URLSearchParams(qs || '')) }; }
let _chartsRedraw = [];
function onChart(fn){ _chartsRedraw.push(fn); fn(); }
function redrawCharts(){ _chartsRedraw.forEach(f => { try { f(); } catch(e){ console.error(e); } }); }
let _rz; window.addEventListener('resize', () => { clearTimeout(_rz); _rz = setTimeout(redrawCharts, 150); });
let _timers = [];
function every(fn, ms){ const id = setInterval(fn, ms); _timers.push(id); return id; }
function render(){
  const prev = S.route; const r = parseHash(); S.route = r;
  _timers.forEach(clearInterval); _timers = []; _chartsRedraw = []; closeMenu();
  if (!$('#nav')) $('#app').innerHTML = shellHTML();
  const def = ROUTES[r.name] || ROUTES.painel;
  D.body.className = (lsGet(LS_SBC) ? 'sbc ' : '') + (def.doc ? 'doc' : '');
  S.docTitle = def.title; renderNav();
  try { $('#view').innerHTML = def.render(r); } catch(e){ console.error(e); $('#view').innerHTML = `<div class="card pad">Erro ao montar a tela: ${esc(e.message)}</div>`; }
  if (prev.name !== r.name || prev.id !== r.id) window.scrollTo(0,0);
  def.mount && def.mount(r);
}
function refresh(){ const y = window.scrollY; const def = ROUTES[S.route.name] || ROUTES.painel; _timers.forEach(clearInterval); _timers=[]; _chartsRedraw=[]; $('#view').innerHTML = def.render(S.route); def.mount && def.mount(S.route); renderNav(); window.scrollTo(0, y); }
window.addEventListener('hashchange', () => { closeAll(); render(); });

/* ================= HELPERS ================= */
const cliNome = id => byId(db.clientes, id)?.nome || '—';
const tecNome = id => byId(db.tecnicos, id)?.nome || 'Sem técnico';
const tecCor = id => byId(db.tecnicos, id)?.cor || '#94A3B8';
const eqNome = e => e ? `${e.tipo} ${e.marca} ${nf(e.btus)} BTUs` : '—';
const enderecoDe = c => c ? `${c.endereco}${c.numero?', '+c.numero:''}${c.complemento?' · '+c.complemento:''} · ${c.bairro} · ${c.cidade}/${c.uf}${c.cep?' · CEP '+c.cep:''}` : '';
const mapsUrl = c => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(`${c.endereco}, ${c.numero} - ${c.bairro}, ${c.cidade} - ${c.uf}, ${c.cep}`);
const waTexto = txt => 'https://wa.me/?text=' + encodeURIComponent(txt);
const TIPO = {'Instalação':{i:'download', c:'#0284C7'}, 'Preventiva':{i:'snow', c:'#16A34A'}, 'Corretiva':{i:'wrench', c:'#DC2626'}, 'Orçamento / Visita':{i:'calc', c:'#7C3AED'}};
const ST_OS = {'Pendente':['','Pendente'], 'Agendada':['info','Agendada'], 'Em andamento':['warn','Em andamento'], 'Concluída':['ok','Concluída'], 'Cancelada':['bad','Cancelada']};
const tipoTag = t => `<span class="tag" style="color:${TIPO[t]?.c};background:color-mix(in srgb,${TIPO[t]?.c} 12%,transparent)">${ic(TIPO[t]?.i||'info')} ${esc(t)}</span>`;
/* próxima preventiva e alerta (vencida, até 15 dias, em dia) */
function eqProxima(e){ if (!e.ultimaPreventiva) return null; const d = dfrom(e.ultimaPreventiva); d.setMonth(d.getMonth() + (+e.periodicidade || 6)); return d; }
function eqAlerta(e){ const p = eqProxima(e); if (!p) return {k:'info', l:'Sem preventiva registrada'}; const dd = diffDays(new Date(), p); return dd < 0 ? {k:'bad', l:`Vencida há ${-dd} dia${dd===-1?'':'s'}`} : dd <= 15 ? {k:'warn', l: dd===0 ? 'Vence hoje' : `Vence em ${dd} dia${dd===1?'':'s'}`} : {k:'ok', l:`Em dia · ${fdate(p)}`}; }
const eqPill = e => { const a = eqAlerta(e); return `<span class="pill ${a.k}">${esc(a.l)}</span>`; };
const osTotal = o => sum(o.itens||[], i => i.qtd*i.preco);
/* títulos a receber = OS concluídas com pagamento registrado */
function titulos(){
  const hoje = startOfDay(new Date());
  return db.os.filter(o => o.status==='Concluída' && o.pagamento).map(o => { const p = o.pagamento; const venc = dfrom(p.venc); const dd = diffDays(hoje, venc);
    const situacao = p.status==='Pago' ? 'Pago' : dd < 0 ? 'Vencido' : 'Em aberto';
    return {id:o.id, os:o, numero:o.numero, clienteId:o.clienteId, valor:p.valor, forma:p.forma, venc:p.venc, pagoEm:p.pagoEm, situacao, dias:dd, data:o.concluidaEm}; });
}
const fld = (label, inner, {req=false, hint='', cls=''}={}) => `<div class="field ${cls}"><label>${label}${req?'<span class="req">*</span>':''}</label>${inner}${hint?`<span class="hint">${hint}</span>`:''}<span class="ferr"></span></div>`;
const opts = (arr, val, ph) => (ph!=null?`<option value="">${ph}</option>`:'') + arr.map(o => { const v = typeof o==='object'? o.v : o, l = typeof o==='object'? o.l : o; return `<option value="${esc(v)}" ${String(v)===String(val??'')?'selected':''}>${esc(l)}</option>`; }).join('');
function formData(form){ const o = {}; $$('[name]', form).forEach(el => { if (el.type==='checkbox') o[el.name] = el.checked; else if (el.type==='radio'){ if (el.checked) o[el.name] = el.value; } else o[el.name] = el.value.trim(); }); return o; }
function fieldErr(form, name, msg){ const f = form.querySelector(`[name="${name}"]`)?.closest('.field'); if (!f) return; f.classList.toggle('err', !!msg); const e = f.querySelector('.ferr'); if (e) e.textContent = msg || ''; }
function emptyState(icon, title, text, btn=''){ return `<div class="empty"><div class="ei">${ic(icon,'lg')}</div><h4>${title}</h4><p>${text}</p>${btn}</div>`; }
function pageHead(title, crumbs=[], actions=''){ return `<div class="ph"><div><h1>${title}</h1><div class="crumb">${ic('home')}${crumbs.map(([l,h]) => `${ic('right')}${h?`<a href="${h}">${esc(l)}</a>`:`<span>${esc(l)}</span>`}`).join('')}</div></div><div class="ph-actions">${actions}</div></div>`; }
const statPill = (icon, color, label, val) => `<span class="stat-pill"><i style="background:${color}">${ic(icon)}</i>${label} <b>${val}</b></span>`;
const pillOf = (s, map) => { const m = map[s] || ['', s]; return `<span class="pill ${m[0]}">${esc(m[1])}</span>`; };
function copyText(txt){ try { navigator.clipboard?.writeText(txt).catch(()=>{}); } catch(e){} }
A.copy = t => { copyText(t.dataset.v); toast('Copiado', esc(t.dataset.v.slice(0,60))); };
A.print = () => window.print();
A.fileDl = t => toast('Download iniciado', esc(t.dataset.n || 'arquivo.pdf'));
/* foto de exemplo (sem imagens externas): ar-condicionado antes/depois */
let PHN = 0;
function acPhoto(seed=0, depois=false){
  const g = 'ap' + (++PHN); const sujo = !depois;
  return `<svg viewBox="0 0 320 240" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(${200+seed*12} 30% ${sujo?78:90}%)"/><stop offset="1" stop-color="hsl(${200+seed*12} 25% ${sujo?70:84}%)"/></linearGradient></defs><rect width="320" height="240" fill="url(#${g})"/><rect x="40" y="60" width="240" height="80" rx="14" fill="${sujo?'#E7E2D6':'#FBFBFA'}" stroke="#B9C2CC" stroke-width="2"/><rect x="58" y="112" width="204" height="14" rx="6" fill="${sujo?'#9C9381':'#D9E2EA'}"/>${sujo?`<g fill="#7B715E" opacity=".55"><circle cx="90" cy="88" r="6"/><circle cx="150" cy="96" r="9"/><circle cx="215" cy="84" r="7"/><circle cx="245" cy="100" r="5"/></g>`:`<g stroke="#38BDF8" stroke-width="3" stroke-linecap="round" opacity=".7"><path d="M90 160q10 18 0 36M160 160q10 18 0 36M230 160q10 18 0 36"/></g>`}<circle cx="262" cy="76" r="4" fill="${sujo?'#F59E0B':'#22C55E'}"/><text x="16" y="226" font-size="13" font-family="Arial" fill="#475569">${sujo?'ANTES':'DEPOIS'}</text></svg>`;
}
const fotoHTML = (f, depois) => f.src ? `<img src="${f.src}" alt="${esc(f.desc||'Foto')}" style="width:100%;height:100%;object-fit:cover;display:block">` : acPhoto(f.seed||0, depois);
