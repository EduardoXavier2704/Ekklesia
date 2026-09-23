/* Interações locais do protótipo. Não realiza autenticação nem chamadas a APIs. */
(() => {
  'use strict';
  if (!window.Ekklesia.access.requireRole('admin')) return;
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  let toastTimer;
  function notify(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 6500);
  }
  const settingsKey = 'ekklesia.apresentacao.v1';
  const key = document.body.dataset.page;
  if (!key || !window.Ekklesia) return;
  const { schemas, seed } = window.Ekklesia;
  const store = window.Ekklesia.store;
  let data = JSON.parse(JSON.stringify(seed));
  try { data = store.load(); }
  catch { notify('Não foi possível ler os dados locais. Os exemplos foram carregados apenas para visualização.'); }
  function persist() {
    try {
      if (key === 'configuracoes') store.reset();
      else store.saveModule(key, data[key]);
      return true;
    } catch { notify('Não foi possível salvar a alteração. Verifique o armazenamento local antes de sair desta página.'); return false; }
  }
  const dialog = $('#record-dialog');
  $('[data-close]', dialog)?.addEventListener('click', () => dialog.close());
  const date = value => /^\d{4}-\d{2}-\d{2}$/.test(value) ? value.split('-').reverse().join('/') : '—';
  const number = value => Number(value).toLocaleString('pt-BR');
  const sum = (rows, field) => rows.reduce((total, row) => total + Number(row[field] || 0), 0);
  const cardIcons = {"membros":"<svg class=\"dashboard-icon\" viewBox=\"355 420 545 445\" aria-hidden=\"true\" focusable=\"false\"><image href=\"../../assets/membros.png\" width=\"1280\" height=\"1280\"/></svg>","ministerios":"<svg class=\"dashboard-icon\" viewBox=\"355 385 545 520\" aria-hidden=\"true\" focusable=\"false\"><image href=\"../../assets/ministerios.png\" width=\"1280\" height=\"1280\"/></svg>","celulas":"<svg class=\"dashboard-icon\" viewBox=\"355 400 545 465\" aria-hidden=\"true\" focusable=\"false\"><image href=\"../../assets/celulas.png\" width=\"1280\" height=\"1280\"/></svg>","escalas":"<svg class=\"dashboard-icon\" viewBox=\"370 380 515 505\" aria-hidden=\"true\" focusable=\"false\"><image href=\"../../assets/escalas.png\" width=\"1280\" height=\"1280\"/></svg>","campanhas":"<svg class=\"dashboard-icon\" viewBox=\"330 390 605 500\" aria-hidden=\"true\" focusable=\"false\"><image href=\"../../assets/campanhas.png\" width=\"1280\" height=\"1280\"/></svg>","notificacoes":"<svg class=\"dashboard-icon\" viewBox=\"390 380 500 495\" aria-hidden=\"true\" focusable=\"false\"><image href=\"../../assets/notificacoes.png\" width=\"1280\" height=\"1280\"/></svg>"};
  function cards(items) {
    return items.map(([value, label, note, icon]) => '<div class="stat-card"><span class="stat-icon" aria-hidden="true">' + cardIcons[icon] + '</span><div><strong>' + escape(value) + '</strong><span>' + label + '</span><small>' + note + '</small></div></div>').join('');
  }
  function stats(module) {
    const rows = data[module];
    const active = rows.filter(row => ['Ativo','Ativa','Em andamento'].includes(row.status)).length;
    if (module === 'membros') return [[rows.length,'Membros','Total de registros locais','membros'],[active,'Ativos','Na listagem de membros','membros'],[rows.length-active,'Inativos','Na listagem de membros','membros'],[new Set(rows.map(r=>r.ministerio)).size,'Ministérios representados','Nos registros de membros','ministerios']];
    if (module === 'ministerios') return [[rows.length,'Ministérios','Total cadastrados','ministerios'],[number(sum(rows,'membros')),'Vínculos informados','Contagem manual dos grupos','membros'],[active,'Ativos','Ministérios em atividade','ministerios'],[new Set(rows.map(r=>r.area)).size,'Áreas','Áreas de atuação','ministerios']];
    if (module === 'celulas') return [[rows.length,'Células','Total cadastradas','celulas'],[number(sum(rows,'participantes')),'Participações informadas','Contagem manual dos grupos','membros'],[new Set(rows.map(r=>r.lider)).size,'Líderes','Líderes distintos','membros'],[active,'Células ativas','Na listagem de células','celulas']];
    if (module === 'escalas') return [[rows.length,'Escalas','Total cadastradas','escalas'],[number(sum(rows,'servicos')),'Serviços previstos','Informados manualmente','membros'],[rows.filter(r=>r.status==='Agendada').length,'Agendadas','Aguardando realização','escalas'],[rows.filter(r=>r.status==='Pendente').length,'Pendentes','Precisam de atenção','notificacoes']];
    return [[rows.length,'Campanhas','Total cadastradas','campanhas'],[active,'Em andamento','Campanhas ativas','campanhas'],[rows.filter(r=>r.status==='Concluída').length,'Concluídas','Campanhas finalizadas','campanhas'],[rows.filter(r=>r.status==='Planejada').length,'Planejadas','A iniciar','campanhas']];
  }
  function label(module, field) {
    if (field === 'periodo') return 'Período';
    if (field === 'dia') return 'Dia e horário';
    return schemas[module].fields.find(f => f[0] === field)?.[1] || field;
  }
  function cell(module, field, row) {
    const value = row[field];
    if (field === 'nome') {
      const initials = row.nome.trim().split(/\s+/).slice(0,2).map(word=>word[0] || '').join('');
      return '<div class="cell-name"><span class="record-avatar" aria-hidden="true">' + escape(module === 'membros' ? initials : schemas[module].icon) + '</span><strong>' + escape(value) + '</strong></div>';
    }
    if (field === 'status') {
      const color = ['Inativo','Inativa'].includes(value) ? 'neutral' : ['Agendada','Concluída'].includes(value) ? 'blue' : ['Pendente','Planejada'].includes(value) ? 'amber' : '';
      return '<span class="badge ' + color + '">' + escape(value) + '</span>';
    }
    if (field === 'ministerio') return '<span class="badge">' + escape(value) + '</span>';
    if (field === 'data') return date(value);
    if (field === 'dia') return escape(value) + '<span class="cell-sub">' + escape(row.horario) + '</span>';
    if (field === 'periodo') return date(row.inicio) + '<span class="cell-sub">a ' + date(row.fim) + '</span>';
    if (module === 'campanhas' && ['meta','arrecadado','entregue'].includes(field)) {
      const text = number(value) + ' ' + escape(row.unidade);
      const percent = row.meta > 0 ? Math.round(row.arrecadado / row.meta * 100) : 0;
      return field === 'arrecadado' ? '<div class="progress-cell">' + text + '<progress max="100" value="' + Math.min(percent,100) + '" aria-label="Progresso da campanha"></progress><span class="cell-sub">' + (row.meta > 0 ? percent + '% da meta' : 'Meta não definida') + '</span></div>' : text;
    }
    return escape(typeof value === 'number' ? number(value) : value);
  }
  const icons = {
    view: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
    edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 4 5 5M4 16 16 4a2 2 0 0 1 4 4L8 20H4v-4ZM12 4H4v16h16v-8"/></svg>',
    delete: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7"/></svg>'
  };
  function actions(row) {
    return '<div class="actions">' + (key === 'escalas' ? '<button type="button" class="button secondary availability-shortcut" data-availability-scale="'+escape(row.id)+'" aria-label="Ver disponibilidades de '+escape(row.nome)+'">Disponíveis</button>' : '') + [['view','Visualizar'],['edit','Editar'],['delete','Excluir']].map(([action,title]) => '<button type="button" class="icon-button ' + (action==='delete'?'danger':'') + '" data-action="' + action + '" data-id="' + escape(row.id) + '" aria-label="' + title + ' ' + escape(row.nome) + '" title="' + title + '">' + icons[action] + '</button>').join('') + '</div>';
  }
  function table(module, rows, target, withActions) {
    const columns = schemas[module].columns;
    $('thead', target).innerHTML = '<tr>' + columns.map(field=>'<th scope="col">'+label(module,field)+'</th>').join('') + (withActions?'<th scope="col">Ações</th>':'') + '</tr>';
    $('tbody', target).innerHTML = rows.length ? rows.map(row => '<tr>' + columns.map(field=>'<td>'+cell(module,field,row)+'</td>').join('') + (withActions?'<td>'+actions(row)+'</td>':'') + '</tr>').join('') : '<tr><td colspan="'+(columns.length+(withActions?1:0))+'" class="empty-state"><strong>Nenhum registro encontrado</strong>Altere os filtros ou cadastre um novo registro.</td></tr>';
  }
  function confirmAction(title, message, onConfirm) {
    $('#dialog-title').textContent = title;
    $('#dialog-content').innerHTML = '<p class="context-note">'+escape(message)+'</p><div class="dialog-actions"><button class="button secondary" type="button" id="cancel-action">Cancelar</button><button class="button danger secondary" type="button" id="confirm-action">Confirmar</button></div>';
    $('#cancel-action').onclick = () => dialog.close();
    $('#confirm-action').onclick = () => { onConfirm(); dialog.close(); };
    dialog.showModal();
    $('#cancel-action').focus();
  }
  if (key === 'configuracoes') {
    const form = $('#settings-form');
    try { const settings = JSON.parse(localStorage.getItem(settingsKey) || '{}'); ['comunidade','cidade','email'].forEach(field => { form.elements[field].value = settings[field] || ''; }); } catch { /* Usa campos vazios. */ }
    form.addEventListener('submit', event => {
      event.preventDefault();
      const settings = Object.fromEntries(new FormData(form));
      settings.comunidade = settings.comunidade.trim();
      if (!settings.comunidade) { form.elements.comunidade.setCustomValidity('Informe o nome da comunidade.'); form.elements.comunidade.reportValidity(); return; }
      try { localStorage.setItem(settingsKey, JSON.stringify(settings)); $('.sidebar-logo span').textContent = settings.comunidade; notify('Informações de apresentação salvas neste navegador.'); }
      catch { notify('O navegador não permitiu salvar as informações.'); }
    });
    form.elements.comunidade.addEventListener('input', () => form.elements.comunidade.setCustomValidity(''));
    $('#reset-demo').onclick = () => confirmAction('Restaurar dados de exemplo', 'Todos os cadastros e alterações locais dos módulos serão substituídos pelos exemplos iniciais. As disponibilidades locais também serão removidas.', () => {
      data = JSON.parse(JSON.stringify(seed));
      if (persist()) notify('Dados demonstrativos restaurados.');
    });
    return;
  }
  if (key === 'relatorios') {
    const select = $('#report-module');
    function renderReport() { table(select.value, data[select.value], $('#report-table'), false); $('#report-summary').innerHTML = cards(stats(select.value)); }
    select.addEventListener('change', renderReport);
    $('#print-report').onclick = () => window.print();
    $('#export-report').onclick = () => {
      const module = select.value;
      const fields = schemas[module].fields;
      // Neutraliza fórmulas quando a planilha abre valores fornecidos pelo usuário.
      const csvCell = value => '"' + String(/^[\s]*[=+@-]/.test(String(value)) ? "'"+value : value).replace(/"/g,'""') + '"';
      const lines = [fields.map(f=>csvCell(f[1])).join(';'), ...data[module].map(row=>fields.map(([field])=>csvCell(row[field])).join(';'))];
      const url = URL.createObjectURL(new Blob(['\uFEFF'+lines.join('\r\n')], {type:'text/csv;charset=utf-8;'}));
      const link = document.createElement('a'); link.href = url; link.download = 'ekklesia-'+module+'-demonstracao.csv'; document.body.append(link); link.click(); link.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000);
      notify('Relatório demonstrativo exportado.');
    };
    renderReport(); return;
  }
  const schema = schemas[key];
  if (!schema) return;
  let page = 1;
  const pageSize = 8;
  let calendarVisible = false;
  let calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  function filteredRows() {
    const query = normalize($('#search').value.trim());
    return data[key].filter(row => {
      const searchMatch = !query || schema.fields.some(([field]) => normalize(row[field]).includes(query));
      const fieldsMatch = schema.filters.every(field => { const filter = $('#filter-'+field); return !filter.value || row[field] === filter.value; });
      const month = $('#filter-month')?.value;
      const dateMatch = !month || (key === 'escalas' ? row.data.startsWith(month) : row.inicio.slice(0,7) <= month && row.fim.slice(0,7) >= month);
      return searchMatch && fieldsMatch && dateMatch;
    });
  }
  function renderFilters() {
    const previous = Object.fromEntries($$('select', $('#filter-fields')).map(select=>[select.id,select.value]));
    const month = $('#filter-month')?.value || '';
    $('#filter-fields').innerHTML = schema.filters.map(field => {
      const values = [...new Set(data[key].map(row=>row[field]))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
      return '<div><label for="filter-'+field+'">'+label(key,field)+'</label><select id="filter-'+field+'"><option value="">Todos</option>'+values.map(value=>'<option value="'+escape(value)+'">'+escape(value)+'</option>').join('')+'</select></div>';
    }).join('') + (['escalas','campanhas'].includes(key) ? '<div><label for="filter-month">Período</label><input type="month" id="filter-month" aria-label="Filtrar por mês"></div>' : '');
    for (const [id,value] of Object.entries(previous)) { const select = $('#'+id); if (select && [...select.options].some(option=>option.value===value)) select.value = value; }
    if ($('#filter-month')) $('#filter-month').value = month;
  }
  function renderTabs() {
    if (key !== 'escalas') return;
    const current = $('#filter-status').value;
    $('#status-tabs').innerHTML = [['','Todas'],['Agendada','Agendadas'],['Ativa','Ativas'],['Concluída','Concluídas'],['Pendente','Pendentes']].map(([value,title])=>'<button type="button" data-status="'+value+'" aria-pressed="'+(current===value)+'">'+title+'</button>').join('');
  }
  function renderCalendar(rows) {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const first = new Date(year,month,1).getDay();
    const total = new Date(year,month+1,0).getDate();
    const prefix = year+'-'+String(month+1).padStart(2,'0')+'-';
    let days = '';
    for (let i=0; i<Math.ceil((first+total)/7)*7; i++) {
      const day = i-first+1;
      if (day<1 || day>total) { days += '<div class="calendar-day outside"></div>'; continue; }
      const events = rows.filter(row=>row.data===prefix+String(day).padStart(2,'0')).sort((a,b)=>a.horario.localeCompare(b.horario));
      days += '<div class="calendar-day"><span>'+day+'</span>'+events.map(row=>'<button type="button" class="calendar-event" data-action="view" data-id="'+escape(row.id)+'">'+escape(row.horario)+' · '+escape(row.nome)+'</button>').join('')+'</div>';
    }
    $('#calendar').innerHTML = '<div class="calendar-header"><button type="button" class="button secondary" data-month="-1" aria-label="Mês anterior">‹</button><h3>'+calendarMonth.toLocaleDateString('pt-BR',{month:'long',year:'numeric'})+'</h3><button type="button" class="button secondary" data-month="1" aria-label="Próximo mês">›</button></div><div class="table-scroll"><div class="calendar-grid">'+['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(day=>'<div class="calendar-weekday">'+day+'</div>').join('')+days+'</div></div><p class="report-note context-note">'+rows.filter(row=>row.data.startsWith(prefix)).length+' escala(s) neste mês com os filtros atuais.</p>';
  }
  function render() {
    const rows = filteredRows();
    const totalPages = Math.max(1, Math.ceil(rows.length/pageSize));
    page = Math.min(Math.max(1,page),totalPages);
    const start = (page-1)*pageSize;
    $('#module-stats').innerHTML = cards(stats(key));
    table(key, rows.slice(start,start+pageSize), $('#records-table'), true);
    $('#result-count').textContent = rows.length ? 'Mostrando '+(start+1)+' a '+Math.min(start+pageSize,rows.length)+' de '+rows.length+' registros' : 'Nenhum registro encontrado';
    $('#pagination').innerHTML = '<button class="page-button" type="button" data-page="'+(page-1)+'" aria-label="Página anterior" '+(page===1?'disabled':'')+'>‹</button>'+Array.from({length:totalPages},(_,i)=>i+1).filter(n=>n===1||n===totalPages||Math.abs(n-page)<=1).map(n=>'<button class="page-button" type="button" data-page="'+n+'" aria-label="Página '+n+'" '+(n===page?'aria-current="page"':'')+'>'+n+'</button>').join('')+'<button class="page-button" type="button" data-page="'+(page+1)+'" aria-label="Próxima página" '+(page===totalPages?'disabled':'')+'>›</button>';
    renderTabs();
    if (calendarVisible) renderCalendar(rows);
  }
  function showDetails(row) {
    $('#dialog-title').textContent = row.nome;
    $('#dialog-content').innerHTML = '<dl class="details-list">'+schema.fields.map(([field,title,type])=>'<div><dt>'+title+'</dt><dd>'+escape(type==='date'?date(row[field]):row[field] || (row[field]===0?'0':'Não informado'))+'</dd></div>').join('')+'</dl><div class="dialog-actions"><button type="button" class="button secondary" id="details-close">Fechar</button><button type="button" class="button" id="details-edit">Editar</button></div>';
    $('#details-close').onclick=()=>dialog.close();
    $('#details-edit').onclick=()=>{ dialog.close(); showForm(row); };
    dialog.showModal();
  }
  function showForm(row) {
    $('#dialog-title').textContent = row ? 'Editar '+schema.singular.toLowerCase() : schema.article+' '+schema.singular;
    $('#dialog-content').innerHTML = '<form id="record-form"><div class="form-grid">'+schema.fields.map(([field,title,type='text',options])=>{
      const value = row?.[field] ?? (type==='number'?0:'');
      const attributes = 'id="record-'+field+'" name="'+field+'" '+(type==='textarea'?'':'required');
      const input = type==='select' ? '<select '+attributes+'>'+options.map(option=>'<option '+(value===option?'selected':'')+'>'+escape(option)+'</option>').join('')+'</select>' : type==='textarea' ? '<textarea '+attributes+' maxlength="2000">'+escape(value)+'</textarea>' : '<input '+attributes+' type="'+type+'" value="'+escape(value)+'" '+(type==='number'?'min="0" max="1000000" step="1"':'maxlength="160"')+'>';
      return '<div class="field '+(field==='nome'||type==='textarea'?'full':'')+'"><label for="record-'+field+'">'+title+'</label>'+input+'</div>';
    }).join('')+'</div><p class="form-error" id="form-error" role="alert"></p><div class="dialog-actions"><button type="button" class="button secondary" id="cancel-form">Cancelar</button><button type="submit" class="button">Salvar '+schema.singular.toLowerCase()+'</button></div></form>';
    $('#cancel-form').onclick = () => dialog.close();
    $('#record-form').addEventListener('submit', event => {
      event.preventDefault();
      const record = {...row, id:row?.id || (Date.now().toString(36)+Math.random().toString(36).slice(2))};
      const form = new FormData(event.target);
      for (const [field, , type] of schema.fields) record[field] = type==='number' ? Number(form.get(field)) : String(form.get(field)).trim();
      if (schema.fields.some(([field, , type])=>type!=='textarea'&&typeof record[field]==='string'&&!record[field])) { $('#form-error').textContent='Preencha os campos obrigatórios com informações válidas.'; return; }
      if (key==='campanhas' && record.fim<record.inicio) { $('#form-error').textContent='O término deve ser igual ou posterior ao início.'; return; }
      if (key==='campanhas' && record.entregue>record.arrecadado) { $('#form-error').textContent='A quantidade entregue não pode superar a quantidade arrecadada.'; return; }
      if (row) data[key][data[key].findIndex(item=>item.id===row.id)] = record;
      else { data[key].unshift(record); $('#filters').reset(); page=1; }
      const saved = persist();
      dialog.close(); renderFilters(); render();
      if (saved) notify(schema.singular+' '+(schema.article==='Nova'?(row?'atualizada':'cadastrada'):(row?'atualizado':'cadastrado'))+' na demonstração local.');
    });
    dialog.showModal();
  }
  $('#add-record').onclick = () => showForm();
  $('#filters').addEventListener('submit', event=>event.preventDefault());
  $('#filters').addEventListener('input', () => { page=1; render(); });
  $('#filters').addEventListener('change', () => { if (calendarVisible && $('#filter-month')?.value) calendarMonth=new Date($('#filter-month').value+'-01T12:00:00'); page=1; render(); });
  $('#filters').addEventListener('reset', () => setTimeout(()=>{page=1;render();},0));
  $('#pagination').addEventListener('click', event=>{const button=event.target.closest('[data-page]'); if(button){page=Number(button.dataset.page);render();}});
  $('#status-tabs')?.addEventListener('click', event=>{
    const button=event.target.closest('[data-status]');
    if(!button) return;
    const select=$('#filter-status');
    if (![...select.options].some(option=>option.value===button.dataset.status)) select.add(new Option(button.dataset.status,button.dataset.status));
    select.value=button.dataset.status; page=1; render();
  });
  $('#calendar-toggle')?.addEventListener('click', () => {
    calendarVisible=!calendarVisible;
    $('#calendar-toggle').setAttribute('aria-pressed',String(calendarVisible));
    $('#calendar-toggle').textContent=calendarVisible?'▤ Listagem':'▦ Calendário';
    $('.table-panel').hidden=calendarVisible;
    $('#calendar').hidden=!calendarVisible;
    if (calendarVisible && $('#filter-month').value) calendarMonth=new Date($('#filter-month').value+'-01T12:00:00');
    render();
  });
  $('#calendar')?.addEventListener('click',event=>{const button=event.target.closest('[data-month]'); if(button){calendarMonth.setMonth(calendarMonth.getMonth()+Number(button.dataset.month)); if($('#filter-month').value) $('#filter-month').value=calendarMonth.getFullYear()+'-'+String(calendarMonth.getMonth()+1).padStart(2,'0');render();}});
  $('.module-page').addEventListener('click', event=>{
    const button=event.target.closest('[data-action]');
    if(!button) return;
    const row=data[key].find(item=>item.id===button.dataset.id);
    if(!row) return;
    if(button.dataset.action==='view') showDetails(row);
    if(button.dataset.action==='edit') showForm(row);
    if(button.dataset.action==='delete') confirmAction('Excluir '+schema.singular.toLowerCase(), 'Deseja excluir “'+row.nome+'” desta demonstração? Os outros módulos não serão alterados.',()=>{
      data[key]=data[key].filter(item=>item.id!==row.id);
      const saved=persist(); renderFilters(); render(); if(saved) notify('Registro excluído da demonstração local.');
    });
  });
  renderFilters(); render();
})();
