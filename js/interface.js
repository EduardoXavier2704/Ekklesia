/* Interações locais do protótipo. Não realiza autenticação nem chamadas a APIs. */
(() => {
  'use strict';
  if (!window.Ekklesia.access.requireRole(document.body.dataset.role)) return;
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
  const layout = $('.layout');
  const menu = $('.menu-button');
  const mobile = matchMedia('(max-width: 700px)');
  function syncMenu() {
    layout?.classList.remove('menu-open', 'menu-collapsed');
    menu?.setAttribute('aria-expanded', String(!mobile.matches));
  }
  syncMenu();
  mobile.addEventListener('change', syncMenu);
  menu?.addEventListener('click', () => {
    const open = mobile.matches ? layout.classList.toggle('menu-open') : !layout.classList.toggle('menu-collapsed');
    menu.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobile.matches) {
      layout?.classList.remove('menu-open');
      menu?.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('click', event => {
    if (mobile.matches && layout?.classList.contains('menu-open') && !event.target.closest('.sidebar, .menu-button')) {
      layout.classList.remove('menu-open');
      menu.setAttribute('aria-expanded', 'false');
    }
  });
  $('.notification-button')?.addEventListener('click', () => notify('Não há notificações nesta demonstração.'));
  const settingsKey = 'ekklesia.apresentacao.v1';
  try {
    const settings = JSON.parse(localStorage.getItem(settingsKey) || '{}');
    if (settings.comunidade) $('.sidebar-logo span').textContent = settings.comunidade;
  } catch { /* Mantém a identificação padrão quando o armazenamento não está disponível. */ }

  const session = Ekklesia.access.current();
  $('.user-info strong').textContent = session.name;
  $('.user-info span').textContent = session.role === 'admin' ? 'Administrador' : 'Membro';
  $('.user-avatar').textContent = session.name.split(' ').map(word=>word[0]).slice(0,2).join('');
  $('.sidebar-footer a').addEventListener('click', event=>{event.preventDefault(); Ekklesia.access.signOut();});
})();