(() => {
  'use strict';
  const app = window.Ekklesia;
  const key = 'ekklesia.sessao.v1';
  const base = new URL('../', document.currentScript?.src || new URL('../../js/acesso.js', location.href));
  const loginUrl = new URL('pages/login.html', base).href;
  function current() {
    try {
      const session = JSON.parse(sessionStorage.getItem(key) || 'null');
      if (session?.role === 'admin') return { role: 'admin', name: 'Administrador' };
      if (session?.role === 'member') {
        const member = app.store.listDemoMembers().find(row => row.id === session.memberId);
        if (member) return { role: 'member', memberId: member.id, name: member.nome };
      }
    } catch {}
    return null;
  }
  function home(role) { return new URL('pages/' + (role === 'admin' ? 'Administrador' : 'Membros') + '/inicio.html', base).href; }
  function assertRole(role) {
    const session = current();
    if (!session || session.role !== role) throw new Error('Este perfil não tem permissão para realizar esta operação.');
    return session;
  }
  function requireRole(role) {
    const session = current();
    if (session?.role === role) return true;
    location.replace(session ? home(session.role) : loginUrl);
    return false;
  }
  function signInDemo(role, memberId) {
    if (!['admin','member'].includes(role)) throw new Error('Selecione um perfil.');
    if (role === 'member' && !app.store.listDemoMembers().some(row => row.id === memberId)) throw new Error('Selecione um membro ativo.');
    sessionStorage.setItem(key, JSON.stringify({role, memberId: role === 'member' ? memberId : null}));
    return home(role);
  }
  function signOut() { sessionStorage.removeItem(key); location.assign(loginUrl); }
  // Sessão demonstrativa por aba. A autorização real deverá ser aplicada no servidor.
  app.access = { current, assertRole, requireRole, signInDemo, signOut, home };
})();