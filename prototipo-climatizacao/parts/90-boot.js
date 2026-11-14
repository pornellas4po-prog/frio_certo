
/* ================= BOOT ================= */
function boot(){
  loadDB();
  if (lsGet(LS_SBC)) D.body.classList.add('sbc');
  render();
  if (S.firstRun) setTimeout(() => toast(`Bem-vindo à ${brandName()}`, 'Dados de exemplo carregados. Troque o nome da empresa em Configurações.', 'info', {ms:6000}), 500);
}
boot();
