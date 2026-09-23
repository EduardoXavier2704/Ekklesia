(() => {
  'use strict';
  if (!Ekklesia.access.requireRole('member')) return;
  const {store,schedule,access} = Ekklesia;
  const $ = selector=>document.querySelector(selector);
  const escape = value=>String(value ?? '—').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const normalize = value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const page = document.body.dataset.page;
  const carousel = $('.dashboard-carousel') ? Ekklesia.createCampaignCarousel(page === 'campanhas' ? Infinity : 3) : null;
  let data, availability = [], view = location.hash === '#disponibilidades' ? 'availability' : 'worships', currentPage = 1, visibleRows = [];
  const columns = {
    membros: [['nome','Nome'],['ministerio','Ministério'],['celula','Célula'],['status','Status']],
    ministerios: [['nome','Ministério'],['lider','Líder'],['area','Área'],['status','Status']],
    celulas: [['nome','Célula'],['lider','Líder'],['dia','Dia'],['horario','Horário'],['local','Local'],['status','Status']],
    escalas: [['nome','Culto'],['data','Data'],['horario','Horário'],['ministerio','Ministério'],['local','Local'],['status','Situação']],
    campanhas: [['nome','Campanha'],['tipo','Tipo'],['inicio','Início'],['fim','Fim'],['status','Status']]
  };
  function futureWorships() { return schedule.upcoming(data.escalas).filter(schedule.isWorship); }
  function state(record) {
    const row = data.escalas.find(item=>item.id===record.id_escala);
    if (!record.disponivel) return 'Cancelada';
    if (!row || ['Concluída','Cancelada'].includes(row.status)) return 'Culto indisponível';
    if (record.data !== row.data || record.horario !== row.horario) return 'Culto alterado: confirme novamente';
    if (!schedule.scheduleDate(row) || schedule.scheduleDate(row) <= new Date()) return 'Encerrada';
    return 'Disponível';
  }
  function formatted(field,value) { return ['data','inicio','fim'].includes(field) && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value.split('-').reverse().join('/') : value; }
  function scheduleItem(row, personal = false) {
    const date = schedule.scheduleDate(row);
    const assignment = row.designacoes?.find(item=>item.membroId===access.current().memberId);
    return '<div class="schedule-item"><div class="schedule-date"><strong>'+date.getDate()+'</strong><span>'+date.toLocaleDateString('pt-BR',{month:'short'}).replace('.','').toUpperCase()+'</span></div><div><strong>'+escape(row.nome)+'</strong><p>'+escape(personal ? assignment?.funcao || row.ministerio : row.local)+'</p><p>'+date.toLocaleDateString('pt-BR',{weekday:'long'})+' • '+escape(row.horario)+'</p></div><span class="status '+(row.status==='Pendente'?'pending':'confirmed')+'">'+escape(personal ? assignment?.status || 'Designado' : row.status)+'</span></div>';
  }
  const dashboardIcons = {"membros":"<svg class=\"dashboard-icon\" viewBox=\"355 420 545 445\" aria-hidden=\"true\" focusable=\"false\"><image href=\"../../assets/membros.png\" width=\"1280\" height=\"1280\"/></svg>","ministerios":"<svg class=\"dashboard-icon\" viewBox=\"355 385 545 520\" aria-hidden=\"true\" focusable=\"false\"><image href=\"../../assets/ministerios.png\" width=\"1280\" height=\"1280\"/></svg>","celulas":"<svg class=\"dashboard-icon\" viewBox=\"355 400 545 465\" aria-hidden=\"true\" focusable=\"false\"><image href=\"../../assets/celulas.png\" width=\"1280\" height=\"1280\"/></svg>","escalas":"<svg class=\"dashboard-icon\" viewBox=\"370 380 515 505\" aria-hidden=\"true\" focusable=\"false\"><image href=\"../../assets/escalas.png\" width=\"1280\" height=\"1280\"/></svg>","campanhas":"<svg class=\"dashboard-icon\" viewBox=\"330 390 605 500\" aria-hidden=\"true\" focusable=\"false\"><image href=\"../../assets/campanhas.png\" width=\"1280\" height=\"1280\"/></svg>"};
  function dashboard() {
    const session = access.current();
    const member = data.membros.find(row=>row.id===session.memberId);
    const now = new Date();
    const end = new Date(now); end.setDate(now.getDate()+7);
    const future = futureWorships();
    const ministries = data.ministerios.filter(row=>row.nome===member?.ministerio);
    const mine = availability.filter(row=>state(row)==='Disponível' && row.data.slice(0,7)===now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0'));
    const metrics = [[future.filter(row=>schedule.scheduleDate(row)<=end).length,'Próximos cultos','Nos próximos 7 dias','escalas'],[ministries.length,'Ministérios em que participo','Vínculo do meu cadastro','ministerios'],[mine.length,'Minhas disponibilidades','Válidas neste mês','escalas'],[data.campanhas.filter(row=>row.status==='Em andamento').length,'Campanhas ativas','Na comunidade','campanhas']];
    $('#member-stats').innerHTML = metrics.map(([count,label,note,icon])=>'<div class="stat-card"><span class="stat-icon">'+dashboardIcons[icon]+'</span><div><span>'+label+'</span><strong>'+count+'</strong><small>'+note+'</small></div></div>').join('');
    // Equipe em texto livre não comprova que o membro foi designado.
    const assigned = schedule.upcoming(data.escalas).filter(row=>Array.isArray(row.designacoes) && row.designacoes.some(item=>item.membroId===session.memberId));
    $('#my-schedules').innerHTML = assigned.length ? assigned.slice(0,3).map(row=>scheduleItem(row,true)).join('') : '<p class="context-note">Nenhuma designação vinculada ao seu cadastro. Consulte ou registre suas disponibilidades em Escalas.</p>';
    $('#member-worships').innerHTML = future.length ? future.slice(0,3).map(row=>scheduleItem(row)).join('') : '<p class="context-note">Nenhum culto futuro cadastrado.</p>';
  }
  function table() {
    if (!$('#member-table')) return;
    const own = page==='escalas' && view==='availability';
    let rows = own ? availability.map(record=>{
      const worship = data.escalas.find(row=>row.id===record.id_escala);
      return {...record,nome:worship?.nome || 'Culto removido',status:state(record)};
    }) : page==='escalas' ? futureWorships() : data[page];
    const query = normalize($('#search').value.trim());
    const fields = own ? [['nome','Culto'],['data','Data registrada'],['horario','Horário'],['observacao','Observação'],['status','Disponibilidade']] : columns[page];
    rows = rows.filter(row=>fields.some(([field])=>normalize(row[field] || '').includes(query)));
    rows = page==='escalas' ? [...rows].sort((a,b)=>(a.data+a.horario).localeCompare(b.data+b.horario)) : rows;
    currentPage = Math.min(currentPage,Math.max(1,Math.ceil(rows.length/8)));
    visibleRows = rows;
    $('#member-table thead').innerHTML = '<tr>'+fields.map(([,label])=>'<th scope="col">'+label+'</th>').join('')+'<th scope="col">Ação</th></tr>';
    $('#member-table tbody').innerHTML = rows.slice((currentPage-1)*8,currentPage*8).map(row=>'<tr>'+fields.map(([field])=>'<td>'+escape(formatted(field,row[field]))+'</td>').join('')+'<td>'+(own ? row.disponivel ? '<button class="button secondary" type="button" data-cancel-own="'+escape(row.id)+'">Cancelar disponibilidade</button>' : '—' : page==='escalas' ? '<button class="button secondary" type="button" data-offer="'+escape(row.id)+'">Informar disponibilidade</button>' : '<button class="button secondary" type="button" data-detail="'+escape(row.id)+'">Ver detalhes</button>')+'</td></tr>').join('') || '<tr><td colspan="'+(fields.length+1)+'">Nenhum registro encontrado.</td></tr>';
    $('#member-count').textContent = rows.length+' registro(s) • página '+currentPage;
    $('#member-pagination').innerHTML = '<button class="button secondary" type="button" data-paging="-1" '+(currentPage===1?'disabled':'')+'>Anterior</button><button class="button secondary" type="button" data-paging="1" '+(currentPage*8>=rows.length?'disabled':'')+'>Próxima</button>';
    document.querySelectorAll('[data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===view)));
  }
  function refresh() {
    try {
      data = store.loadMemberView(); availability = store.loadMyAvailability();
      $('#member-error').hidden = true;
      if(page==='inicio') dashboard();
      table(); carousel?.update(data.campanhas);
    } catch(error) {
      $('#member-error').textContent = error.message; $('#member-error').hidden=false;
      if($('#member-table tbody')) $('#member-table tbody').textContent='';
    }
  }
  $('#member-search')?.addEventListener('submit',event=>event.preventDefault());
  $('#search')?.addEventListener('input',()=>{currentPage=1;table();});
  $('#member-search')?.addEventListener('reset',()=>{ $('#search').value=''; currentPage=1;table(); });
  $('#close-detail').addEventListener('click',()=>$('#member-detail').close());
  document.addEventListener('click',event=>{
    const button = event.target.closest('button');
    if(!button) return;
    if(button.dataset.view) { view=button.dataset.view; currentPage=1; table(); }
    if(button.dataset.paging) { currentPage+=Number(button.dataset.paging);table(); }
    if(button.dataset.cancelOwn) {
      if(!confirm('Cancelar sua disponibilidade para este culto?')) return;
      try { store.cancelMyAvailability(button.dataset.cancelOwn); }
      catch(error) { $('#member-error').textContent=error.message; $('#member-error').hidden=false; }
    }
    if(button.dataset.detail) {
      const row = visibleRows.find(item=>item.id===button.dataset.detail);
      if(!row) return;
      const fields = columns[page].concat(page==='campanhas' ? [['unidade','Unidade'],['arrecadado','Arrecadado'],['meta','Meta'],['entregue','Entregue']] : []);
      $('#detail-content').innerHTML = fields.map(([field,label])=>'<p><strong>'+label+':</strong> '+escape(formatted(field,row[field]))+'</p>').join('');
      if(page==='ministerios') {
        const description = row.descricao || row.description || 'Descrição não informada.';
        $('#detail-content').insertAdjacentHTML('beforeend','<p><strong>Descrição:</strong> '+escape(description)+'</p>');
      }
      if(page==='celulas') {
        const members = data.membros.filter(member=>member.celula===row.nome);
        $('#detail-content').insertAdjacentHTML('beforeend','<p><strong>Membros vinculados:</strong> '+(members.length ? members.map(member=>escape(member.nome)).join(', ') : 'Nenhum vínculo cadastrado.')+'</p>');
      }
      $('#member-detail').showModal();
    }
  });
  store.subscribe(refresh);
  window.addEventListener('focus',refresh);
  window.addEventListener('pageshow',refresh);
  refresh();
})();