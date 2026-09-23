(() => {
  const role = document.querySelector('#access-role'), members = document.querySelector('#demo-member');
  function update() {
    document.querySelector('#member-choice').hidden = role.value !== 'member';
    members.required = role.value === 'member';
    members.disabled = role.value !== 'member';
  }
  try {
    const choices = [{id:'',nome:'Selecione seu cadastro'}, ...Ekklesia.store.listDemoMembers()];
    choices.forEach(row=>{
      const option=document.createElement('option');
      option.value=row.id; option.textContent=row.nome; members.append(option);
    });
  } catch { document.querySelector('#login-error').textContent = 'Não foi possível carregar os cadastros locais.'; }
  role.addEventListener('change',update); update();
  document.querySelector('#demo-login').addEventListener('submit',event=>{
    event.preventDefault();
    try { location.assign(Ekklesia.access.signInDemo(role.value,members.value)); }
    catch(error) { document.querySelector('#login-error').textContent = error.message; }
  });
})();