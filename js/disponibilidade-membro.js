(() => {
  'use strict';
  if (!Ekklesia.access.requireRole('member')) return;
  const {store,schedule} = Ekklesia;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const formatNumber = value => value.toLocaleString('pt-BR');
  const numeric = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;
  const dateKey = date => date.getFullYear() + '-' + String(date.getMonth()+1).padStart(2,'0') + '-' + String(date.getDate()).padStart(2,'0');
  const formatDate = key => key.split('-').reverse().join('/');

  let data = null, selectedDate = '';
  let calendarMonth = new Date(new Date().getFullYear(),new Date().getMonth(),1);
  const dialog = $('#availability-dialog');
  if (!dialog) return;
  $('#availability-identity').textContent = Ekklesia.access.current().name;
  function worships() { return data ? schedule.upcoming(data.escalas).filter(schedule.isWorship) : []; }
  function updateConfirmation() {
    $('#confirm-availability').disabled = !Ekklesia.access.current().memberId || !$('#availability-worship').value || !selectedDate;
  }
  function loadWorshipOptions() {
    const select = $('#availability-worship');
    const previous = select.value;
    const rows = worships().filter(row=>row.data===selectedDate);
    select.innerHTML = '<option value="">'+(selectedDate?'Selecione o culto':'Selecione uma data')+'</option>'+rows.map(row=>'<option value="'+escape(row.id)+'">'+escape(row.horario)+' • '+escape(row.nome)+' — '+escape(row.local)+'</option>').join('');
    select.disabled = rows.length === 0;
    if (rows.some(row=>row.id===previous)) select.value = previous;
    else if (rows.length === 1) select.value = rows[0].id;
    updateConfirmation();
  }
  function renderCalendar() {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const now = new Date();
    $('#previous-month').disabled = year*12+month <= now.getFullYear()*12+now.getMonth();
    $('#availability-month-title').textContent = calendarMonth.toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
    const first = new Date(year,month,1).getDay();
    const days = new Date(year,month+1,0).getDate();
    const dates = new Set(worships().map(row=>row.data));
    let content = '<span aria-hidden="true"></span>'.repeat(first);
    for (let day=1; day<=days; day++) {
      const key = dateKey(new Date(year,month,day));
      const enabled = dates.has(key);
      content += '<button type="button" data-availability-date="'+key+'" aria-label="'+formatDate(key)+(enabled?', culto disponível':', sem culto disponível')+'" aria-pressed="'+(key===selectedDate)+'" '+(!enabled?'disabled':'')+' '+(key===dateKey(now)?'aria-current="date"':'')+'>'+day+'</button>';
    }
    $('#availability-days').innerHTML = content;
    const hasMonth = [...dates].some(key=>key.startsWith(dateKey(calendarMonth).slice(0,7)));
    $('#calendar-help').textContent = selectedDate ? 'Data selecionada: '+formatDate(selectedDate) : hasMonth ? 'Os dias destacados possuem cultos disponíveis.' : 'Nenhum culto futuro cadastrado neste mês.';
  }
  function selectDate(value) {
    selectedDate = value;
    $('#availability-error').textContent = '';
    renderCalendar(); loadWorshipOptions();
    $('#availability-days [data-availability-date="'+value+'"]').focus();
  }
  function renderHistory() {
    const member = Ekklesia.access.current().memberId;
    if (!member) { $('#availability-history').textContent = ''; return; }
    try {
      const futureIds = new Set(worships().map(row=>row.id));
      const rows = store.loadMyAvailability().filter(row=>row.id_membro===member && row.disponivel && futureIds.has(row.id_escala));
      $('#availability-history').textContent = rows.length ? 'Disponibilidades locais: '+rows.map(row=>{
        const current = data.escalas.find(item=>item.id===row.id_escala);
        return formatDate(row.data)+' às '+row.horario+(current.data!==row.data||current.horario!==row.horario?' (culto alterado; confirme novamente)':'');
      }).join('; ')+'.' : 'Nenhuma disponibilidade futura registrada para este membro.';
    } catch { $('#availability-history').textContent = 'Não foi possível ler as disponibilidades salvas.'; }
  }
  function openCalendar() {
    try { data = store.loadMemberView(); }
    catch(error) {
      $('#availability-feedback').textContent = error.message;
      $('#availability-feedback').hidden = false;
      return;
    }
    selectedDate = '';
    $('#availability-observation').value = '';
    $('#availability-error').textContent = '';
    const first = worships()[0];
    const date = first ? schedule.scheduleDate(first) : new Date();
    calendarMonth = new Date(date.getFullYear(),date.getMonth(),1);
    renderCalendar(); loadWorshipOptions(); renderHistory();
    dialog.showModal();
    $('#availability-worship').focus();
  }
  function registerAvailability(event) {
    event.preventDefault();
    const row = data?.escalas.find(item=>item.id===$('#availability-worship').value);
    if (!row) return;
    try {
      const memberId = Ekklesia.access.current().memberId;
      const record = store.saveMyAvailability({id_membro:memberId, id_escala:row.id, data:selectedDate, horario:row.horario, observacao:$('#availability-observation').value});
      const member = data.membros.find(item=>item.id===memberId);
      $('#availability-feedback').textContent = 'Disponibilidade de '+member.nome+' registrada localmente para '+formatDate(record.data)+' às '+record.horario+'.';
      const link = document.createElement('a');
      link.href = 'escalas.html?escala='+encodeURIComponent(record.id_escala)+'#disponibilidades';
      link.textContent = ' Ver minhas disponibilidades';
      $('#availability-feedback').append(link);
      $('#availability-feedback').hidden = false;
      dialog.close();
    } catch (error) { $('#availability-error').textContent = error.message || 'Não foi possível registrar. Tente novamente.'; }
  }

  $('#open-availability').addEventListener('click', openCalendar);
  $('#close-availability').addEventListener('click', ()=>dialog.close());
  dialog.addEventListener('close', ()=>$('#open-availability').focus());
  $('#availability-worship').addEventListener('change', updateConfirmation);
  $('#availability-days').addEventListener('click', event=>{
    const button = event.target.closest('[data-availability-date]');
    if (button && !button.disabled) selectDate(button.dataset.availabilityDate);
  });
  $('#previous-month').addEventListener('click', ()=>{calendarMonth.setMonth(calendarMonth.getMonth()-1);renderCalendar();});
  $('#next-month').addEventListener('click', ()=>{calendarMonth.setMonth(calendarMonth.getMonth()+1);renderCalendar();});
  $('#availability-form').addEventListener('submit', registerAvailability);

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-offer]');
    if (!button) return;
    openCalendar();
    if (!dialog.open) return;
    const row = worships().find(item=>item.id===button.dataset.offer);
    if (row) {
      selectedDate = row.data;
      const date = schedule.scheduleDate(row);
      calendarMonth = new Date(date.getFullYear(),date.getMonth(),1);
      renderCalendar(); loadWorshipOptions();
      $('#availability-worship').value = row.id; updateConfirmation();
    }
  });
  store.subscribe(()=>{
    try { data = store.loadMemberView(); } catch { if(dialog.open) dialog.close(); return; }
    if (dialog.open) { renderCalendar(); loadWorshipOptions(); renderHistory(); }
  });
})();