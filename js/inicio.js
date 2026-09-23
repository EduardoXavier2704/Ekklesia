(() => {
  'use strict';
  if (!Ekklesia.access.requireRole('admin')) return;
  const { store, schedule } = window.Ekklesia;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const formatNumber = value => value.toLocaleString('pt-BR');
  let data = null;
  const carousel = Ekklesia.createCampaignCarousel();

  function loadIndicators() {
    $$('[data-count]').forEach(element => {
      element.textContent = data ? formatNumber(data[element.dataset.count].length) : '—';
    });
  }
  function loadUpcomingSchedules() {
    const future = data ? schedule.upcoming(data.escalas) : [];
    const worships = future.filter(schedule.isWorship);
    const rows = (worships.length ? worships : future).slice(0,3);
    $('#upcoming-schedules').innerHTML = rows.length ? rows.map(row => {
      const date = schedule.scheduleDate(row);
      const status = row.status === 'Pendente' ? 'pending' : 'confirmed';
      return '<div class="schedule-item"><div class="schedule-date"><strong>' + String(date.getDate()).padStart(2,'0') + '</strong><span>' + date.toLocaleDateString('pt-BR',{month:'short'}).replace('.','').toUpperCase() + '</span></div>' +
        '<div><strong>' + escape(row.nome) + '</strong><p>' + escape(row.equipe || row.ministerio) + '</p><p>' + date.toLocaleDateString('pt-BR',{weekday:'long'}) + ' • ' + escape(row.horario) + '</p></div><span class="status ' + status + '">' + escape(row.status) + '</span></div>';
    }).join('') : '<p class="context-note">' + (data ? 'Nenhuma escala futura cadastrada. Consulte a agenda completa em “Ver todas”.' : 'Não foi possível carregar as próximas escalas.') + '</p>';
  }


  function refreshDashboard() {
    try {
      data = store.load();
      $('#dashboard-error').hidden = true;
      $('#dashboard-source').textContent = 'Dados locais compartilhados';
      $('#last-update').textContent = 'Última leitura: '+new Date().toLocaleString('pt-BR')+' • demonstração';
    } catch {
      data = null;
      $('#dashboard-error').textContent = 'Não foi possível carregar os registros locais.';
      $('#dashboard-error').hidden = false;
    }
    loadIndicators(); loadUpcomingSchedules(); carousel.update(data?.campanhas || []);
  }
  $('#refresh-dashboard').addEventListener('click',refreshDashboard);
  store.subscribe(refreshDashboard);
  window.addEventListener('focus',refreshDashboard);
  window.addEventListener('pageshow',refreshDashboard);
  refreshDashboard();
})();