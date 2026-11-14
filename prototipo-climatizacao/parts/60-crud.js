
/* ================= CADASTROS GENÉRICOS =================
   Um único motor de CRUD (tabela com busca, filtros e paginação + formulário em modal + exclusão com confirmação)
   atende as telas de cadastro simples do sistema. Cada tela é descrita por um "schema". */
const CRUD = {};
const PAGE = 10;
function crudRoute(sc){
  CRUD[sc.key] = sc;
  ROUTES[sc.key] = {title:sc.title, render:r => crudRender(sc, r), mount:r => { const q = r.q; if (q.id || q.novo){ history.replaceState(null, '', '#/'+sc.key); S.route.q = {}; } if (q.id && byId(crudColl(sc), q.id)) (sc.detail ? crudDetail(sc, q.id) : crudForm(sc, q.id)); if (q.novo) crudForm(sc); sc.mount && sc.mount(r); }};
}
const crudColl = sc => db[sc.coll];
function crudState(sc){ return S.list[sc.key] ||= {q:'', f:{}, page:1}; }
function crudRows(sc){
  const st = crudState(sc); const q = normalize(st.q);
  return crudColl(sc).filter(r => (!q || normalize(sc.search ? sc.search(r) : r.nome).includes(q)) && (sc.filters||[]).every(f => !st.f[f.n] || String(f.get ? f.get(r) : r[f.n]) === st.f[f.n]));
}
function fieldInput(f, v){
  const val = v ?? f.def ?? '';
  if (f.type==='select') return `<select class="sel" name="${f.n}">${opts(typeof f.opts==='function' ? f.opts() : f.opts, val, f.ph ?? 'Selecione')}</select>`;
  if (f.type==='multi'){ const sel = Array.isArray(val) ? val : []; return `<div class="row wrap" style="gap:6px;padding:4px 0">${(typeof f.opts==='function' ? f.opts() : f.opts).map(o => `<label class="chip ${sel.includes(o.v)?'on':''}" style="cursor:pointer"><input type="checkbox" class="sr" data-multi="${f.n}" value="${esc(o.v)}" ${sel.includes(o.v)?'checked':''} onchange="this.parentElement.classList.toggle('on', this.checked)">${esc(o.l)}</label>`).join('')}</div>`; }
  if (f.type==='bool') return `<label class="swrow" style="height:36px;padding:0 12px"><span class="t">${f.on||'Ativo'}</span><label class="sw"><input type="checkbox" name="${f.n}" ${val?'checked':''}><span></span></label></label>`;
  if (f.type==='textarea') return `<textarea class="inp" name="${f.n}" rows="3" placeholder="${esc(f.ph||'')}">${esc(val)}</textarea>`;
  if (f.type==='money') return `<input class="inp" name="${f.n}" type="number" step="0.01" min="0" value="${esc(val)}" placeholder="0,00">`;
  if (f.type==='number') return `<input class="inp" name="${f.n}" type="number" step="${f.step||1}" value="${esc(val)}">`;
  if (f.type==='date') return `<input class="inp" name="${f.n}" type="date" value="${esc(val)}">`;
  if (f.type==='time') return `<input class="inp" name="${f.n}" type="time" value="${esc(val)}">`;
  if (f.type==='color') return `<input class="inp" name="${f.n}" type="color" value="${esc(val||'#F26522')}" style="padding:3px">`;
  return `<input class="inp" name="${f.n}" ${f.type==='email'?'type="email"':''} value="${esc(val)}" placeholder="${esc(f.ph||'')}" ${f.mask?`data-in="mask_${f.mask}"`:''}>`;
}
IN.mask_phone = t => { t.value = maskPhone(t.value); };
IN.mask_doc = t => { t.value = maskDoc(t.value); };
function crudRender(sc){
  const st = crudState(sc); const rows = crudRows(sc); const pages = Math.max(1, Math.ceil(rows.length/PAGE)); st.page = clamp(st.page, 1, pages);
  const vis = rows.slice((st.page-1)*PAGE, st.page*PAGE); const canC = can(sc.perm||sc.key,'criar'), canE = can(sc.perm||sc.key,'editar'), canX = can(sc.perm||sc.key,'excluir');
  return `${pageHead(sc.title, sc.crumbs, `${sc.headActions ? sc.headActions() : ''}<button class="btn" data-a="crudExport" data-k="${sc.key}">${ic('download','sm')} Exportar</button>${canC && !sc.noNew ? `<button class="btn pri" data-a="crudNew" data-k="${sc.key}">${ic('plus','sm')} ${sc.newLabel || 'Novo cadastro'}</button>` : ''}`)}
  ${sc.kpis ? `<div class="kpis">${sc.kpis()}</div>` : ''}
  ${sc.top ? sc.top() : ''}
  <div class="toolbar"><div class="inp-ic search-in">${ic('search','sm')}<input class="inp" placeholder="Buscar ${esc(sc.searchPh || sc.title.toLowerCase())}" value="${esc(st.q)}" data-in="crudQ" data-k="${sc.key}" id="crudQ"></div>
    ${(sc.filters||[]).map(f => `<select class="sel" style="width:auto;min-width:150px" data-ch="crudF" data-k="${sc.key}" data-n="${f.n}">${opts(typeof f.opts==='function'?f.opts():f.opts, st.f[f.n], f.l)}</select>`).join('')}
    <span class="sp"></span><span class="small muted">${plural(rows.length, 'registro')}</span></div>
  <div class="tw"><div class="tw-scroll"><table class="tbl"><thead><tr>${sc.cols.map(c => `<th class="${c.cls||''}">${c.l}</th>`).join('')}<th class="c-act">Ações</th></tr></thead><tbody>
  ${vis.map(r => `<tr class="${sc.detail?'click':''}" ${sc.detail?`data-a="crudOpen" data-k="${sc.key}" data-id="${r.id}"`:''}>${sc.cols.map(c => `<td class="${c.cls||''}">${c.v(r)}</td>`).join('')}<td class="c-act">${sc.rowActions ? sc.rowActions(r) : ''}${canE?`<button class="btn ghost ic-only sm" data-a="crudEdit" data-k="${sc.key}" data-id="${r.id}" title="Editar" aria-label="Editar">${ic('edit','sm')}</button>`:''}${canX && !(sc.noDel && sc.noDel(r))?`<button class="btn ghost ic-only sm" data-a="crudDel" data-k="${sc.key}" data-id="${r.id}" title="Excluir" aria-label="Excluir" style="color:var(--danger)">${ic('trash','sm')}</button>`:''}</td></tr>`).join('') || `<tr><td colspan="${sc.cols.length+1}">${emptyState(sc.icon||'folder', 'Nada encontrado', st.q ? 'Ajuste a busca ou os filtros.' : 'Cadastre o primeiro registro.')}</td></tr>`}
  </tbody></table></div>
  <div class="tfoot"><span>Mostrando ${vis.length ? (st.page-1)*PAGE+1 : 0}–${(st.page-1)*PAGE+vis.length} de ${rows.length}</span><div class="pager"><button data-a="crudPage" data-k="${sc.key}" data-p="${st.page-1}" ${st.page<=1?'disabled':''} aria-label="Anterior">${ic('left','sm')}</button>${Array.from({length:pages}, (_,i) => `<button class="${i+1===st.page?'on':''}" data-a="crudPage" data-k="${sc.key}" data-p="${i+1}">${i+1}</button>`).join('')}<button data-a="crudPage" data-k="${sc.key}" data-p="${st.page+1}" ${st.page>=pages?'disabled':''} aria-label="Próxima">${ic('right','sm')}</button></div></div></div>`;
}
function crudRefreshKeepFocus(){ const q = $('#crudQ'); const pos = q?.selectionStart; refresh(); const n = $('#crudQ'); if (n && q && D.activeElement !== n && pos != null){ n.focus(); n.setSelectionRange(pos, pos); } }
IN.crudQ = t => { const st = crudState(CRUD[t.dataset.k]); st.q = t.value; st.page = 1; crudRefreshKeepFocus(); };
IN.crudF = t => { const st = crudState(CRUD[t.dataset.k]); st.f[t.dataset.n] = t.value; st.page = 1; refresh(); };
A.crudPage = t => { const st = crudState(CRUD[t.dataset.k]); st.page = +t.dataset.p; refresh(); };
A.crudNew = t => crudForm(CRUD[t.dataset.k]);
A.crudEdit = (t, e) => { e?.stopPropagation(); closeAll(); crudForm(CRUD[t.dataset.k], t.dataset.id); };
A.crudOpen = t => crudDetail(CRUD[t.dataset.k], t.dataset.id);
A.crudExport = t => { const sc = CRUD[t.dataset.k]; toast('Exportação gerada', `${sc.title}.xlsx · ${plural(crudRows(sc).length,'linha')}`); };
A.crudDel = async (t, e) => {
  e?.stopPropagation(); const sc = CRUD[t.dataset.k]; const r = byId(crudColl(sc), t.dataset.id); if (!r) return;
  const why = sc.inUse && sc.inUse(r); if (why) return toast('Não é possível excluir', why, 'warn');
  if (!await confirmDlg({title:`Excluir ${sc.singular||'registro'}?`, text:`<b>${esc(sc.label ? sc.label(r) : r.nome)}</b> será removido. Esta ação não pode ser desfeita.`})) return;
  db[sc.coll] = crudColl(sc).filter(x => x.id !== r.id); saveDB(); closeAll(); toast(`${cap(sc.singular||'registro')} excluído`); refresh();
};
function crudForm(sc, id){
  const r = id ? byId(crudColl(sc), id) : {...(typeof sc.defaults==='function' ? sc.defaults() : sc.defaults||{})};
  modal({title: id ? `Editar ${sc.singular||'registro'}` : (sc.newLabel || `Novo ${sc.singular||'registro'}`), sub: id && sc.label ? esc(sc.label(r)) : '', size: sc.fields.length > 6 ? 'lg' : '',
    body:`<form id="crudF" class="fgrid ${sc.fields.length > 8 ? 'c3' : ''}" onsubmit="return false">${sc.fields.map((f,i) => fld(f.l, fieldInput(f, f.read ? f.read(r) : r[f.n]), {req:f.req, hint:f.hint, cls:f.full?'full':''})).join('')}</form>`,
    foot:`<button class="btn" data-a="closeM">Cancelar</button><button class="btn pri" data-a="crudSave" data-k="${sc.key}" data-id="${id||''}">${ic('check','sm')} Salvar</button>`});
  setTimeout(() => $('#crudF [name]')?.focus(), 40);
}
A.crudSave = t => {
  const sc = CRUD[t.dataset.k]; const form = $('#crudF'); const f = formData(form); let ok = true;
  sc.fields.forEach(fd => { const bad = fd.req && (f[fd.n]==='' || f[fd.n]==null); fieldErr(form, fd.n, bad ? 'Campo obrigatório' : ''); if (bad) ok = false; });
  if (sc.validate){ const err = sc.validate(f, t.dataset.id); if (err){ fieldErr(form, err[0], err[1]); ok = false; } }
  if (!ok) return;
  sc.fields.forEach(fd => { if (['money','number'].includes(fd.type)) f[fd.n] = f[fd.n]==='' ? 0 : +f[fd.n]; if (fd.type==='multi') f[fd.n] = $$(`[data-multi="${fd.n}"]:checked`, form).map(i => i.value); if (fd.write) fd.write(f); });
  let r = t.dataset.id ? byId(crudColl(sc), t.dataset.id) : null; const isNew = !r;
  if (isNew){ r = {id:uid(sc.key.slice(0,3)), ...(typeof sc.defaults==='function' ? sc.defaults() : sc.defaults||{})}; crudColl(sc).unshift(r); }
  Object.assign(r, f); sc.onSave && sc.onSave(r, isNew);
  saveDB(); closeAll(); toast(isNew ? `${cap(sc.singular||'registro')} cadastrado` : 'Alterações salvas', esc(sc.label ? sc.label(r) : r.nome || '')); refresh();
};
function crudDetail(sc, id){ const r = byId(crudColl(sc), id); if (!r) return; closeAll(); const d = sc.detail(r); drawer({head:d.head, body:d.body, foot:`${can(sc.perm||sc.key,'editar')?`<button class="btn left" data-a="crudEdit" data-k="${sc.key}" data-id="${r.id}">${ic('edit','sm')} Editar</button>`:''}${d.foot||''}<button class="btn" data-a="closeM">Fechar</button>`}); }

