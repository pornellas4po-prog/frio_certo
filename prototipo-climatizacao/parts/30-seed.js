
/* ================= DADOS DE DEMONSTRAÇÃO (fictícios; datas relativas a hoje) ================= */
function rng(seed){ return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const pick = (R, a) => a[Math.floor(R()*a.length)];
const CHECK = {
  'Preventiva': ['Limpeza dos filtros','Higienização da serpentina (evaporadora)','Limpeza da bandeja e teste do dreno','Limpeza da condensadora','Reaperto das conexões elétricas','Verificação de vazamentos'],
  'Corretiva': ['Diagnóstico do defeito','Teste de tensão na alimentação','Verificação de capacitor e compressor','Teste de estanqueidade','Carga de gás conforme fabricante','Teste de funcionamento após o reparo'],
  'Instalação': ['Local aprovado com o cliente','Fixação do suporte e da condensadora','Passagem e isolamento da tubulação','Vácuo na tubulação (mín. 500 mícrons)','Teste de estanqueidade com nitrogênio','Ligação elétrica com disjuntor dedicado','Teste de funcionamento e orientação ao cliente'],
  'Orçamento / Visita': ['Levantamento do ambiente','Medição das distâncias da tubulação','Verificação da rede elétrica','Fotos do local'],
};
function seed(){
  const R = rng(20261111); const today = startOfDay(new Date());
  const dk = n => dkey(addDays(today, n));
  const at = (n, h, m=0) => { const d = addDays(today, n); d.setHours(h, m, 0, 0); return d.toISOString(); };
  const db = {v:1};
  db.empresa = {nome:'FrioCerto Climatização', cnpj:'41.552.780/0001-12', telefone:'(85) 3456-7788', whatsapp:'(85) 98877-6655', email:'contato@friocerto.com.br', endereco:'Rua Barão de Aracati, 1200 · Aldeota · Fortaleza/CE', pix:'41.552.780/0001-12', responsavel:'Carlos Mendes'};
  db.tecnicos = [
    {id:'t1', nome:'Rafael Souza', telefone:'(85) 99811-2201', especialidade:'Instalação e VRF', cor:'#0284C7', ativo:true},
    {id:'t2', nome:'Diego Lima', telefone:'(85) 99811-2202', especialidade:'Manutenção e higienização', cor:'#16A34A', ativo:true},
    {id:'t3', nome:'Bruno Alves', telefone:'(85) 99811-2203', especialidade:'Corretiva e eletrônica', cor:'#F59E0B', ativo:true},
  ];
  db.catalogo = [
    ['Higienização Split 9k–12k BTUs','Serviço','un',180],['Higienização Split 18k–24k BTUs','Serviço','un',230],['Higienização Cassete / Piso Teto','Serviço','un',350],
    ['Instalação Split 9k–12k BTUs (até 3 m)','Serviço','un',450],['Instalação Split 18k–24k BTUs (até 3 m)','Serviço','un',650],['Instalação Cassete / Piso Teto','Serviço','un',1200],
    ['Visita técnica / diagnóstico','Serviço','un',90],['Mão de obra corretiva (hora)','Serviço','h',120],['Carga de gás R410A','Insumo','kg',120],['Carga de gás R32','Insumo','kg',130],['Carga de gás R22','Insumo','kg',150],
    ['Metro de tubulação de cobre 1/4" + 3/8"','Peça','m',85],['Metro de tubulação de cobre 1/4" + 1/2"','Peça','m',105],['Capacitor 35+5 µF','Peça','un',65],['Suporte para condensadora','Peça','par',90],['Bomba de dreno','Peça','un',320],['Placa eletrônica (evaporadora)','Peça','un',680],['Disjuntor bipolar 20 A','Peça','un',55],
  ].map(([nome, categoria, un, preco], i) => ({id:'s'+(i+1), nome, categoria, un, preco, ativo:true}));
  const CL = [
    ['PF','Ana Beatriz Rocha','452.118.903-20','(85) 99701-1122','ana.rocha@gmail.com','60160-230','Rua Silva Paulet','845','Apto 1202','Meireles'],
    ['PJ','Clínica Sorriso Pleno','12.887.450/0001-63','(85) 98812-3344','adm@sorrisopleno.com.br','60150-160','Av. Santos Dumont','2300','Sala 405','Aldeota'],
    ['PJ','Restaurante Mar & Brasa','33.104.221/0001-90','(85) 98745-5566','gerencia@marebrasa.com','60165-121','Av. Beira Mar','3100','','Meireles'],
    ['PF','João Victor Albuquerque','089.334.215-77','(85) 99633-7788','jv.albuquerque@hotmail.com','60811-000','Rua Pereira Valente','1550','Casa','Dionísio Torres'],
    ['PJ','Condomínio Residencial Atlântico','07.442.981/0001-05','(85) 3271-9900','sindico@resatlantico.com.br','60192-010','Rua Tibúrcio Cavalcante','2900','','Varjota'],
    ['PJ','Escritório Lima & Castro Advogados','25.778.103/0001-41','(85) 98720-4411','contato@limacastro.adv.br','60150-160','Av. Dom Luís','500','Sala 1801','Aldeota'],
    ['PF','Mariana Teixeira','221.904.377-15','(85) 99812-0099','mari.teixeira@gmail.com','60822-130','Rua Professor Dias da Rocha','720','Apto 302','Cocó'],
    ['PJ','Academia Corpo em Forma','44.019.632/0001-88','(85) 98877-1020','financeiro@corpoemforma.fit','60115-221','Rua Barão de Studart','1880','','Aldeota'],
    ['PF','Ricardo e Paula Nogueira','318.552.004-61','(85) 99744-3218','ricardo.nog@gmail.com','60177-115','Rua Frederico Borges','415','','Varjota'],
    ['PJ','Loja Casa & Decor','19.330.715/0001-27','(85) 98756-0011','loja@casaedecor.com.br','60160-230','Rua Silva Paulet','2001','Loja 3','Meireles'],
  ];
  db.clientes = CL.map(([tipo,nome,doc,tel,email,cep,end,num,comp,bairro],i) => ({id:'c'+(i+1), tipo, nome, doc, telefone:tel, email, cep, endereco:end, numero:num, complemento:comp, bairro, cidade:'Fortaleza', uf:'CE', obs:'', desde:at(-400+i*30,10)}));
  /* equipamentos: preventivas espalhadas para gerar alertas (vencidas, próximas e em dia) */
  const EQ = [
    ['c1','Split Hi-Wall','Inverter','LG','S4-Q12JA31A',12000,'Quarto do casal',-190,6],['c1','Split Hi-Wall','Inverter','LG','S4-Q09WA51A',9000,'Quarto das crianças',-120,6],
    ['c2','Cassete','Inverter','Daikin','FCQ36AVL',36000,'Recepção',-95,3],['c2','Split Hi-Wall','Inverter','Samsung','AR12BVHZ',12000,'Consultório 1',-80,3],['c2','Split Hi-Wall','Inverter','Samsung','AR12BVHZ',12000,'Consultório 2',-30,3],
    ['c3','Piso Teto','Convencional','Carrier','42XQV060',60000,'Salão principal',-182,6],['c3','Piso Teto','Convencional','Carrier','42XQV048',48000,'Varanda coberta',-176,6],['c3','Split Hi-Wall','Convencional','Elgin','HJFI24C2',24000,'Cozinha',-60,6],
    ['c4','Split Hi-Wall','Inverter','Gree','GWC12ATCXB',12000,'Suíte',-300,12],['c4','Split Hi-Wall','Inverter','Gree','GWC18ATCXB',18000,'Sala de estar',-20,12],
    ['c5','Piso Teto','Convencional','Springer','PTE-42',42000,'Salão de festas',-170,6],['c5','Split Hi-Wall','Inverter','Midea','42AGVCI12',12000,'Portaria',-100,6],
    ['c6','Cassete','Inverter','Daikin','FCQ24AVL',24000,'Sala de reuniões',-88,3],['c6','Split Hi-Wall','Inverter','LG','S4-Q18KL31A',18000,'Sala do sócio',-40,6],
    ['c7','Split Hi-Wall','Inverter','Samsung','AR09BVHZ',9000,'Quarto',-15,12],
    ['c8','Piso Teto','Convencional','Carrier','42XQV060',60000,'Sala de musculação',-100,3],['c8','Cassete','Inverter','Daikin','FCQ48AVL',48000,'Sala de spinning',-75,3],
    ['c9','Split Hi-Wall','Inverter','LG','S4-Q24K231A',24000,'Sala integrada',-160,6],['c9','Split Hi-Wall','Inverter','LG','S4-Q12JA31A',12000,'Escritório',-200,6],
    ['c10','Cassete','Inverter','Midea','42MKCB36',36000,'Área de vendas',-150,6],
  ];
  db.equipamentos = EQ.map(([cli,tipo,tec,marca,modelo,btus,local,ult,per],i) => ({id:'e'+(i+1), clienteId:cli, tipo, tecnologia:tec, marca, modelo, btus, serie:`${marca.slice(0,2).toUpperCase()}${210000+i*7331}`, local, instaladoEm:dk(ult-200), ultimaPreventiva:dk(ult), periodicidade:per}));
  /* ordens de serviço */
  const S_ = id => byId(db.catalogo, id); const it = (id, qtd=1) => ({servicoId:id, desc:S_(id).nome, qtd, preco:S_(id).preco});
  let n = 140;
  const OS = (cli, eqs, tipo, status, tec, dia, hora, problema, itens=[], extra={}) => {
    const o = {id:'os'+(++n), numero:`OS-${n}`, clienteId:cli, equipamentoIds:eqs, tipo, status, tecnicoId:tec, data: dia==null ? '' : dk(dia), hora: hora||'', problema, itens, checklist:{}, medicoes:{}, fotos:{antes:[], depois:[]}, assinatura:null, criadaEm:at(Math.min(dia??0,0)-2, 9), ...extra};
    if (status==='Concluída'){ (CHECK[tipo]||[]).forEach(c => o.checklist[c] = true); o.medicoes = tipo==='Orçamento / Visita' ? {} : {pressao:118+Math.round(R()*14), tensao:218+Math.round(R()*8), corrente:(4+R()*4).toFixed(1), tempIns:12+Math.round(R()*3), tempRet:24+Math.round(R()*2)};
      o.fotos = {antes:[{seed:n%5}], depois:[{seed:n%5}]}; o.assinatura = {sig:true, nome: db.clientes.find(c => c.id===cli).nome.split(' ').slice(0,2).join(' '), em:at(dia, (+hora.split(':')[0])+1)}; o.iniciadaEm = at(dia, +hora.split(':')[0]); o.concluidaEm = at(dia, (+hora.split(':')[0])+1, 20); }
    if (status==='Em andamento'){ o.iniciadaEm = at(0, +hora.split(':')[0]); (CHECK[tipo]||[]).slice(0,3).forEach(c => o.checklist[c] = true); o.fotos.antes = [{seed:2}]; }
    db.os.push(o); return o;
  };
  db.os = [];
  const pay = (o, forma, pago, vencDias) => { o.pagamento = {valor:osTotal(o), forma, status: pago ? 'Pago' : 'Em aberto', venc: dkey(addDays(dfrom(dkey(o.concluidaEm)), vencDias)), pagoEm: pago ? o.concluidaEm : null}; };
  // passado (concluídas, com recebimentos)
  pay(OS('c2',['e3','e4'],'Preventiva','Concluída','t2',-34,'08:00','Preventiva trimestral da clínica',[it('s3'),it('s1')]),'Faturado 30 dias',false,30);
  pay(OS('c3',['e8'],'Corretiva','Concluída','t3',-27,'14:00','Ar da cozinha não gela',[it('s7'),it('s14'),it('s9',1.5)]),'Pix',true,0);
  pay(OS('c6',['e13'],'Preventiva','Concluída','t2',-26,'09:00','Preventiva trimestral',[it('s3')]),'Boleto',false,5);
  pay(OS('c4',['e10'],'Instalação','Concluída','t1',-20,'08:00','Instalação de split novo na sala',[it('s5'),it('s12',2),it('s15'),it('s18')]),'Cartão de crédito',true,0);
  pay(OS('c7',['e15'],'Preventiva','Concluída','t2',-15,'10:00','Higienização anual',[it('s1')]),'Pix',true,0);
  pay(OS('c5',['e12'],'Corretiva','Concluída','t3',-12,'15:00','Pingando água na portaria',[it('s7'),it('s16')]),'Boleto',false,7);
  pay(OS('c8',['e16','e17'],'Preventiva','Concluída','t2',-9,'07:00','Preventiva das salas',[it('s3',2)]),'Faturado 30 dias',false,30);
  pay(OS('c2',['e5'],'Preventiva','Concluída','t2',-30,'11:00','Preventiva consultório 2',[it('s1')]),'Pix',true,0);
  pay(OS('c9',['e18'],'Corretiva','Concluída','t3',-5,'13:30','Barulho alto na condensadora',[it('s7'),it('s8',2)]),'Cartão de débito',true,0);
  pay(OS('c10',['e20'],'Corretiva','Concluída','t3',-40,'09:00','Erro E1 no display',[it('s7'),it('s17')]),'Faturado 30 dias',false,30);
  OS('c1',[],'Orçamento / Visita','Concluída','t1',-3,'16:00','Orçamento para instalar mais um split no escritório');
  // hoje
  OS('c1',['e1','e2'],'Preventiva','Concluída','t2',0,'08:00','Preventiva semestral dos quartos',[it('s1',2)]);
  pay(db.os[db.os.length-1],'Pix',true,0);
  OS('c3',['e6','e7'],'Preventiva','Em andamento','t2',0,'10:30','Preventiva semestral do salão e da varanda',[it('s3',2)]);
  OS('c6',['e14'],'Corretiva','Agendada','t3',0,'14:00','Não liga, display apagado');
  OS('c9',[],'Instalação','Agendada','t1',0,'09:00','Instalar split 12k no quarto de hóspedes',[it('s4'),it('s12',3),it('s15')]);
  OS('c5',['e11'],'Preventiva','Agendada','t2',0,'15:30','Preventiva do salão de festas',[it('s3')]);
  // próximos dias
  OS('c8',['e16'],'Corretiva','Agendada','t3',1,'08:30','Ar da musculação desarmando o disjuntor');
  OS('c10',['e20'],'Preventiva','Agendada','t2',1,'14:00','Preventiva da loja',[it('s3')]);
  OS('c4',['e9'],'Preventiva','Agendada','t2',2,'09:00','Higienização da suíte',[it('s1')]);
  OS('c7',[],'Orçamento / Visita','Agendada','t1',2,'16:00','Orçamento para split na sala');
  OS('c2',['e3','e4','e5'],'Preventiva','Agendada','t2',3,'08:00','Preventiva trimestral',[it('s3'),it('s1',2)]);
  OS('c6',['e13'],'Preventiva','Agendada','t1',4,'10:00','Preventiva da sala de reuniões',[it('s3')]);
  // pendentes de agendamento e cancelada
  OS('c3',['e8'],'Preventiva','Pendente',null,null,'','Cliente pediu preventiva da cozinha');
  OS('c5',[],'Orçamento / Visita','Pendente',null,null,'','Síndico quer orçamento de 2 splits para a academia do prédio');
  OS('c9',['e19'],'Corretiva','Cancelada','t3',-6,'10:00','Cliente resolveu trocar o aparelho',[], {motivo:'Cliente optou por comprar aparelho novo'});
  /* orçamentos */
  const OR = (num, cli, status, dias, itens, desconto=0, extra={}) => ({id:'or'+num, numero:`ORC-${num}`, clienteId:cli, itens, desconto, validade:dk(dias+15), status, criadoEm:at(dias,11), obs:'', ...extra});
  db.orcamentos = [
    OR(301,'c1','Enviado',-3,[it('s4'),it('s12',4),it('s15'),it('s18')],5),
    OR(302,'c5','Rascunho',0,[it('s5',2),it('s12',8),it('s15',2)]),
    OR(303,'c8','Aprovado',-12,[it('s6'),it('s13',6)],0,{osId:''}),
    OR(304,'c3','Enviado',-6,[it('s16'),it('s8',2)]),
    OR(305,'c10','Recusado',-20,[it('s17'),it('s7')]),
    OR(306,'c9','Aprovado',-8,[it('s4'),it('s12',3),it('s15')],0,{osId:db.os.find(o => o.clienteId==='c9' && o.tipo==='Instalação')?.id}),
  ];
  return db;
}
function seedVazio(){ const d = seed(); ['clientes','equipamentos','os','orcamentos'].forEach(k => d[k] = []); return d; }
