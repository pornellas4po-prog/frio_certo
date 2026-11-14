/* ================= UTILS ================= */
const D = document;
const $ = (s, r=D) => r.querySelector(s);
const $$ = (s, r=D) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid = (p='id') => p + Date.now().toString(36).slice(-4) + Math.random().toString(36).slice(2,7);
const BRLF = new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'});
const brl = v => BRLF.format(+v||0);
const brlk = v => { v = +v||0; return Math.abs(v) >= 1e6 ? `R$ ${(v/1e6).toLocaleString('pt-BR',{maximumFractionDigits:1})} mi` : Math.abs(v) >= 1e3 ? `R$ ${(v/1e3).toLocaleString('pt-BR',{maximumFractionDigits:0})} mil` : brl(v); };
const nf = v => new Intl.NumberFormat('pt-BR').format(v);
const pctf = (v, d=1) => (+v||0).toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d}) + '%';
const pad = n => String(n).padStart(2,'0');
const fdate = d => { d = new Date(d); return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`; };
const fdm = d => { d = new Date(d); return `${pad(d.getDate())}/${pad(d.getMonth()+1)}`; };
const ftime = d => { d = new Date(d); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const fdt = d => `${fdate(d)} ${ftime(d)}`;
const DOW = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const DOWL = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
const MON = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const MONL = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const sameDay = (a,b) => { a=new Date(a); b=new Date(b); return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate(); };
/* datas 'AAAA-MM-DD' são lidas no fuso local (new Date('2026-01-10') seria UTC e cairia no dia anterior em Brasília) */
const toD = d => typeof d==='string' && /^\d{4}-\d{2}-\d{2}$/.test(d) ? dfrom(d) : new Date(d);
const startOfDay = d => { d=toD(d); d.setHours(0,0,0,0); return d; };
const addDays = (d, n) => { d = toD(d); d.setDate(d.getDate()+n); return d; };
const dkey = d => { d = new Date(d); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; };
const dfrom = k => { const [y,m,d] = k.split('-').map(Number); return new Date(y, m-1, d); };
const diffDays = (a, b) => Math.round((startOfDay(b) - startOfDay(a)) / 864e5);
const isWE = d => { d = new Date(d).getDay(); return d===0 || d===6; };
function rel(d){
  const t = new Date(d), s = (Date.now() - t)/1000;
  if (s < 50) return 'agora';
  if (s < 3600) return `há ${Math.max(1,Math.round(s/60))} min`;
  if (sameDay(t, new Date())) return `há ${Math.round(s/3600)} h`;
  if (sameDay(t, addDays(new Date(),-1))) return 'ontem';
  if (s < 864e3) return `há ${Math.ceil(s/86400)} dias`;
  return fdate(t);
}
function chatTime(d){ const t = new Date(d); if (sameDay(t,new Date())) return ftime(t); if (sameDay(t, addDays(new Date(),-1))) return 'Ontem'; return fdm(t); }
const initials = n => String(n||'?').replace(/^@/,'').trim().split(/[\s._]+/).filter(Boolean).map((w,i,a)=> (i===0||i===a.length-1)? w[0] : '').join('').slice(0,2).toUpperCase();
const hue = s => { let h=0; for (const c of String(s)) h = (h*31 + c.charCodeAt(0)) % 360; return h; };
const onlyDigits = s => String(s||'').replace(/\D/g,'');
function maskPhone(v){ v=onlyDigits(v); if (v.startsWith('55') && v.length>11) v=v.slice(2); v=v.slice(0,11); if (v.length<=2) return v? `+55 ${v}`:''; if (v.length<=7) return `+55 ${v.slice(0,2)} ${v.slice(2)}`; return `+55 ${v.slice(0,2)} ${v.slice(2,7)}-${v.slice(7)}`; }
function maskDoc(v){ v=onlyDigits(v).slice(0,14); if (v.length<=11) return v.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2'); return v.replace(/^(\d{2})(\d)/,'$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/,'$1.$2.$3').replace(/\.(\d{3})(\d)/,'.$1/$2').replace(/(\d{4})(\d)/,'$1-$2'); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const normalize = s => String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const plural = (n, s, p) => `${nf(n)} ${n===1?s:(p||s+'s')}`;
const byId = (arr, id) => (arr||[]).find(x => x.id === id);
const sum = (a, f) => a.reduce((s,x) => s + (f ? f(x) : x), 0);
const cap = s => s ? s[0].toUpperCase() + s.slice(1) : '';
function av(person, size=34, extra=''){
  const name = person?.nome || person?.name || '?';
  return `<span class="av" style="--s:${size}px;--h:${hue(name)}"><i>${esc(initials(name))}</i>${extra}</span>`;
}

/* ================= OVERLAYS ================= */
function ensureOv(){ let o = $('#ov'); if (!o){ o = D.createElement('div'); o.id='ov'; D.body.appendChild(o); } return o; }
function modal({title='', sub='', body='', foot='', size='', onClose, cls=''}){
  const L = D.createElement('div'); L.className = 'layer';
  L.innerHTML = `<div class="modal ${size} ${cls}" role="dialog" aria-modal="true" aria-label="${esc(title)}">${title?`<div class="m-h"><div style="min-width:0"><h3>${title}</h3>${sub?`<p>${sub}</p>`:''}</div><button class="btn ghost ic-only sm x" data-a="closeM" aria-label="Fechar">${ic('x')}</button></div>`:''}<div class="m-b">${body}</div>${foot?`<div class="m-f">${foot}</div>`:''}</div>`;
  L._onClose = onClose;
  L.addEventListener('mousedown', e => { if (e.target === L) closeLayer(L); });
  ensureOv().appendChild(L);
  setTimeout(() => { const f = L.querySelector('[autofocus]'); if (f) f.focus(); }, 30);
  return L;
}
function drawer({head='', body='', foot='', onClose}){
  const L = D.createElement('div'); L.className = 'layer dr';
  L.innerHTML = `<div class="drawer" role="dialog" aria-modal="true"><div class="d-h">${head}<button class="btn ghost ic-only sm" style="margin-left:auto" data-a="closeM" aria-label="Fechar">${ic('x')}</button></div><div class="d-b">${body}</div>${foot?`<div class="m-f">${foot}</div>`:''}</div>`;
  L._onClose = onClose;
  L.addEventListener('mousedown', e => { if (e.target === L) closeLayer(L); });
  ensureOv().appendChild(L); return L;
}
function closeLayer(L){ if (!L) return; L._onClose && L._onClose(); L.remove(); }
function closeTop(){ const ls = $$('#ov .layer'); closeLayer(ls[ls.length-1]); }
function closeAll(){ $$('#ov .layer').forEach(l => l.remove()); }
function confirmDlg({title='Tem certeza?', text='', ok='Excluir', danger=true}){
  return new Promise(res => {
    const L = modal({title, size:'sm', body:`<p style="margin:0;color:var(--text-2);line-height:1.55">${text}</p>`, foot:`<button class="btn" data-a="cfNo">Cancelar</button><button class="btn ${danger?'dan fill':'pri'}" data-a="cfYes" autofocus>${ok}</button>`, onClose:()=>res(false)});
    L.querySelector('[data-a=cfNo]').onclick = e => { e.stopPropagation(); L._onClose=null; L.remove(); res(false); };
    L.querySelector('[data-a=cfYes]').onclick = e => { e.stopPropagation(); L._onClose=null; L.remove(); res(true); };
  });
}
function toast(title, sub='', type='ok', o={}){
  let w = $('.toasts'); if (!w){ w = D.createElement('div'); w.className='toasts'; D.body.appendChild(w); }
  const icn = {ok:'checkC', info:'info', warn:'alert', bad:'xC'}[type] || 'info';
  const t = D.createElement('div'); t.className = `toast ${type}${o.h?' link':''}`; t.setAttribute('role','status');
  t.innerHTML = `${o.av ? av({nome:o.av}, 32) : `<span class="ti">${ic(icn,'sm')}</span>`}<div style="min-width:0"><b>${title}</b>${sub?`<small>${sub}</small>`:''}</div>`;
  if (o.h){ t.onclick = () => { location.hash = o.h; t.remove(); }; }
  w.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 260); }, o.ms || 4200);
}
let _menu = null;
function closeMenu(){ if (_menu){ _menu.remove(); _menu = null; } }
function popMenu(anchor, html, {cls='', align='right', w}={}){
  closeMenu();
  const m = D.createElement('div'); m.className = `menu ${cls}`; m.innerHTML = html;
  if (w) m.style.width = w+'px';
  D.body.appendChild(m); _menu = m;
  const r = anchor.getBoundingClientRect(), mw = m.offsetWidth, mh = m.offsetHeight;
  let left = align==='right' ? r.right - mw : r.left; left = clamp(left, 8, innerWidth - mw - 8);
  let top = r.bottom + 6; if (top + mh > innerHeight - 8) top = Math.max(8, r.top - mh - 6);
  m.style.left = left+'px'; m.style.top = top+'px';
  return m;
}
const mi = (a, label, icon, extra='', cls='') => `<button class="mi ${cls}" data-a="${a}" ${extra}>${icon?ic(icon,'sm'):''}<span>${label}</span></button>`;
D.addEventListener('mousedown', e => { if (_menu && !_menu.contains(e.target) && !e.target.closest('[data-menu-anchor]')) closeMenu(); });
D.addEventListener('keydown', e => {
  if (e.key === 'Escape'){ if (_menu) return closeMenu(); if ($('#ov .layer')) return closeTop(); $('.sr-pop')?.remove(); D.body.classList.remove('nav-open'); }
  if ((e.metaKey || e.ctrlKey) && (e.key === '/' || e.key.toLowerCase()==='k')){ const s = $('#gsearch'); if (s){ e.preventDefault(); s.focus(); } }
});

/* ================= EVENT DELEGATION ================= */
const A = {}, IN = {};
D.addEventListener('click', e => { const t = e.target.closest('[data-a]'); if (!t) return; const f = A[t.dataset.a]; if (f) f(t, e); });
D.addEventListener('input', e => { const t = e.target.closest('[data-in]'); if (t && IN[t.dataset.in]) IN[t.dataset.in](t, e); });
D.addEventListener('change', e => { const t = e.target.closest('[data-ch]'); if (t && IN[t.dataset.ch]) IN[t.dataset.ch](t, e); });
A.closeM = t => closeLayer(t.closest('.layer'));
A.go = t => { closeAll(); closeMenu(); location.hash = t.dataset.h; };
A.toastInfo = t => toast(t.dataset.t || 'Ação executada', t.dataset.s || '', 'info');

/* ================= GRÁFICOS ================= */
function smoothPath(p){
  const n = p.length; if (n < 2) return n ? `M${p[0][0]},${p[0][1]}` : '';
  const dx=[],dy=[],m=[],t=[];
  for (let i=0;i<n-1;i++){ dx[i]=p[i+1][0]-p[i][0]; dy[i]=p[i+1][1]-p[i][1]; m[i]=dx[i]? dy[i]/dx[i] : 0; }
  t[0]=m[0]; t[n-1]=m[n-2];
  for (let i=1;i<n-1;i++) t[i] = (m[i-1]*m[i] <= 0) ? 0 : (m[i-1]+m[i])/2;
  for (let i=0;i<n-1;i++){ if (m[i]===0){ t[i]=0; t[i+1]=0; continue; } const a=t[i]/m[i], b=t[i+1]/m[i], s=a*a+b*b; if (s>9){ const k=3/Math.sqrt(s); t[i]=k*a*m[i]; t[i+1]=k*b*m[i]; } }
  let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;
  for (let i=0;i<n-1;i++){ const h=dx[i]/3; d += `C${(p[i][0]+h).toFixed(1)},${(p[i][1]+t[i]*h).toFixed(1)} ${(p[i+1][0]-h).toFixed(1)},${(p[i+1][1]-t[i+1]*h).toFixed(1)} ${p[i+1][0].toFixed(1)},${p[i+1][1].toFixed(1)}`; }
  return d;
}
function niceMax(v){ if (v<=4) return 4; const x = v/4; const p = Math.pow(10, Math.floor(Math.log10(x))); const f = x/p; return 4*(f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10)*p; }
/* mini-gráfico dos cards de KPI: 'area' (laranja degradê), 'bars' (barras finas) ou 'line' */
function miniSVG(vals, kind='area', color='var(--accent)'){
  const w=150, h=44, mx=Math.max(...vals), mn=kind==='bars'?0:Math.min(...vals), r=(mx-mn)||1;
  if (kind==='bars'){ const bw = w/vals.length; return `<svg class="mini" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">${vals.map((v,i) => { const bh = Math.max(3,(v-mn)/r*(h-2)); const hot = i===vals.length-3 || v===mx; return `<rect x="${i*bw+bw*.3}" y="${h-bh}" width="${bw*.4}" height="${bh}" rx="1.5" style="fill:${hot?color:'var(--line-2)'}"/>`; }).join('')}</svg>`; }
  const pts = vals.map((v,i) => [i*(w-2)/(vals.length-1)+1, h-3-((v-mn)/r)*(h-8)]);
  const d = kind==='line' ? smoothPath(pts) : 'M'+pts.map(p=>p.map(n=>n.toFixed(1)).join(',')).join('L'); const g = 'mg'+Math.random().toString(36).slice(2,7);
  return `<svg class="mini" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:${color}" stop-opacity=".55"/><stop offset="1" style="stop-color:${color}" stop-opacity="0"/></linearGradient></defs><path d="${d}L${w-1},${h}L1,${h}Z" fill="url(#${g})"/><path d="${d}" fill="none" style="stroke:${color}" stroke-width="1.6" vector-effect="non-scaling-stroke"/></svg>`;
}
/* área / linha com cursor e tooltip. series: [{name,color,values}] */
function lineChart(el, {labels, series, h=240, area=true, fmtY=v=>nf(v), tipTitle=i=>labels[i], smooth=true}){
  if (!el) return;
  const W = Math.max(280, el.clientWidth), H = h, L = 46, R = 10, T = 12, B = 26;
  const iw = W-L-R, ih = H-T-B;
  const all = series.flatMap(s => s.values); const mx = niceMax(Math.max(1, ...all));
  const n = labels.length; const x = i => L + (n===1? iw/2 : i*iw/(n-1)); const y = v => T + ih - (v/mx)*ih;
  let g = '';
  for (let k=0;k<=4;k++){ const v = mx*k/4, yy = y(v); g += `<line x1="${L}" x2="${W-R}" y1="${yy}" y2="${yy}" stroke="var(--grid)"/><text class="axis-t" x="${L-8}" y="${yy+3.5}" text-anchor="end">${fmtY(v)}</text>`; }
  const step = Math.ceil(n / Math.max(2, Math.floor(iw/64)));
  for (let i=0;i<n;i+=step) g += `<text class="axis-t" x="${x(i)}" y="${H-6}" text-anchor="middle">${labels[i]}</text>`;
  let paths = '';
  series.forEach((s,si) => {
    const pts = s.values.map((v,i) => [x(i), y(v)]); if (!pts.length) return;
    const d = smooth ? smoothPath(pts) : 'M'+pts.map(p=>p.map(n=>n.toFixed(1)).join(',')).join('L'); const gid = `lg${si}${Math.random().toString(36).slice(2,6)}`;
    if (area && pts.length>1) paths += `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:${s.color}" stop-opacity=".32"/><stop offset="1" style="stop-color:${s.color}" stop-opacity=".02"/></linearGradient></defs><path d="${d}L${pts[pts.length-1][0]},${T+ih}L${pts[0][0]},${T+ih}Z" fill="url(#${gid})"/>`;
    paths += `<path d="${d}" fill="none" style="stroke:${s.color}" stroke-width="${s.w||1.8}" stroke-linejoin="round" ${s.dash?'stroke-dasharray="5 4"':''}/>`;
  });
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" height="${H}" role="img" aria-label="${esc(series.map(s=>s.name).join(' e '))}">${g}${paths}<line class="xh" x1="0" x2="0" y1="${T}" y2="${T+ih}" stroke="var(--muted)" stroke-dasharray="3 3" opacity="0"/><g class="xdots"></g><rect x="${L}" y="${T}" width="${iw}" height="${ih}" fill="transparent"/></svg><div class="ch-tip"></div>`;
  const svg = el.querySelector('svg'), tip = el.querySelector('.ch-tip'), xh = el.querySelector('.xh'), dots = el.querySelector('.xdots');
  svg.addEventListener('pointermove', ev => {
    const r = svg.getBoundingClientRect(); const px = (ev.clientX - r.left) * (W / r.width);
    const i = clamp(Math.round((px - L) / (iw/(Math.max(1,n-1)))), 0, n-1);
    xh.setAttribute('x1', x(i)); xh.setAttribute('x2', x(i)); xh.setAttribute('opacity', .7);
    dots.innerHTML = series.map(s => s.values[i]==null?'':`<circle cx="${x(i)}" cy="${y(s.values[i])}" r="4.5" style="fill:${s.color}" stroke="var(--surface)" stroke-width="2"/>`).join('');
    tip.innerHTML = `<div class="tt">${esc(tipTitle(i))}</div>` + series.map(s => `<div class="tr" style="--c:${s.color}"><i></i>${esc(s.name)}: <b>${esc(fmtY(s.values[i]??0))}</b></div>`).join('');
    tip.classList.add('on');
    const tx = x(i) * (r.width / W); const tw = tip.offsetWidth;
    tip.style.top = '6px'; tip.style.left = (tx + 14 + tw > r.width ? Math.max(0, tx - tw - 14) : tx + 14) + 'px';
  });
  svg.addEventListener('pointerleave', () => { tip.classList.remove('on'); xh.setAttribute('opacity',0); dots.innerHTML=''; });
}
function donutSVG(items, {size=150, thick=20, center='', centerSub=''}={}){
  const tot = sum(items, i => i.v) || 1, r = (size-thick)/2, c = size/2, C = 2*Math.PI*r;
  let off = 0, arcs = '';
  items.forEach(it => { const len = (it.v/tot)*C; if (len<=0) return;
    arcs += `<circle cx="${c}" cy="${c}" r="${r}" fill="none" style="stroke:${it.c}" stroke-width="${thick}" stroke-dasharray="${Math.max(0,len-2)} ${C}" stroke-dashoffset="${-off}" transform="rotate(-90 ${c} ${c})"><title>${esc(it.l)}: ${esc(it.f ? it.f(it.v) : nf(it.v))} (${pctf(it.v/tot*100,0)})</title></circle>`; off += len; });
  return `<svg viewBox="0 0 ${size} ${size}" style="width:${size}px;max-width:100%" role="img" aria-label="Distribuição"><circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="var(--surface-3)" stroke-width="${thick}"/>${arcs}<text x="${c}" y="${c+3}" text-anchor="middle" style="font:700 18px var(--font);fill:var(--text)">${center}</text><text x="${c}" y="${c+20}" text-anchor="middle" class="axis-t">${centerSub}</text></svg>`;
}
/* barras arredondadas em "pílula" (Storage Usage do layout de referência) */
function pillBars(items, {max, hl, fmt=v=>v}={}){
  const mx = max || niceMax(Math.max(...items.map(i => i.v)));
  return `<div class="pbars"><div class="yl">${[4,3,2,1,0].map(k => `<span>${fmt(mx*k/4)}</span>`).join('')}</div>${items.map((it,i) => `<div class="pbar" title="${esc(it.l)}: ${esc(it.t||fmt(it.v))}"><div class="tr"><div class="fl ${i===hl||it.hl?'hl':''}" style="height:${clamp(it.v/mx*100,8,100)}%">${esc(it.t||fmt(it.v))}</div></div><small>${esc(it.l)}</small></div>`).join('')}</div>`;
}
/* placeholder de foto de obra (SVG gerado, sem imagens externas) */
let PH_N = 0;
function photoSVG(seed=0){
  const g = `phg${++PH_N}`; const hs = [200,28,170,12,140][seed%5];
  return `<svg viewBox="0 0 320 240" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(${hs} 45% 72%)"/><stop offset="1" stop-color="hsl(${hs} 30% 88%)"/></linearGradient></defs><rect width="320" height="240" fill="url(#${g})"/><rect y="170" width="320" height="70" fill="hsl(30 25% 55%)"/><g fill="hsl(210 10% 45%)"><rect x="60" y="${70+seed%3*10}" width="90" height="100"/><rect x="170" y="${100-seed%2*20}" width="70" height="70"/></g><g stroke="hsl(30 90% 50%)" stroke-width="4" fill="none"><path d="M250 170V40h40M250 40l-30 30"/><path d="M290 40v40"/></g><g fill="hsl(210 15% 85%)">${[0,1,2].map(r=>[0,1,2].map(c=>`<rect x="${70+c*27}" y="${82+r*28}" width="18" height="16"/>`).join('')).join('')}</g><rect x="20" y="185" width="40" height="20" fill="hsl(45 90% 55%)"/><circle cx="28" cy="210" r="6" fill="#333"/><circle cx="52" cy="210" r="6" fill="#333"/></svg>`;
}

