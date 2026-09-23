# Ekklesia — Gestão para Comunidades

Protótipo em HTML, CSS e JavaScript, sem frameworks, API ou autenticação real.

## Executar localmente

Na pasta do projeto, com Python instalado:

```powershell
py -m http.server 8000 --bind 127.0.0.1
```

Abra [o sistema](http://localhost:8000). O endereço inicial encaminha para
`pages/login.html`. Use um servidor local para que as páginas compartilhem
o mesmo armazenamento; abrir arquivos pelo protocolo file:// não garante isso.

## Acessos

O login permite selecionar **Administrador** ou **Membro**. No modo Membro,
selecione um cadastro ativo já existente. Não são solicitadas credenciais:
esta seleção serve apenas para demonstrar as duas experiências.

- Administrador: início, membros, ministérios, células, escalas, campanhas,
  relatórios e configurações. Mantém cadastros, edição, exclusão, filtros,
  calendário, exportação CSV e configurações locais.
- Membro: início pessoal, consulta de membros, ministérios, células, cultos
  e campanhas; registro e cancelamento das próprias disponibilidades.
- Sair remove a sessão demonstrativa da aba e retorna ao login.

As páginas anteriores foram movidas; atualize favoritos para os novos caminhos.

## Organização

```text
pages/
  login.html
  Administrador/
    inicio.html membros.html ministerios.html celulas.html
    escalas.html campanhas.html relatorios.html configuracoes.html
  Membros/
    inicio.html membros.html ministerios.html celulas.html
    escalas.html campanhas.html
```

- `js/dados.js`: repositório compartilhado, validação de registros e regras de disponibilidade.
- `js/acesso.js`: sessão demonstrativa, identidade e verificações de perfil.
- `js/login.js`: seleção de perfil e cadastro demonstrativo.
- `js/interface.js`: navegação responsiva, identidade da comunidade, topbar e saída.
- `js/gestao.js`: controlador exclusivo dos módulos administrativos.
- `js/inicio.js`: indicadores e resumo administrativo.
- `js/disponibilidades.js`: consulta administrativa de disponibilidades por escala.
- `js/membro.js`: consultas, busca, paginação, detalhes e painel pessoal.
- `js/disponibilidade-membro.js`: calendário e registro da disponibilidade pessoal.
- `js/campanhas.js`: carrossel compartilhado, progresso, QR e link de doação.
- CSS global/inicio/gestao são reaproveitados; `css/membro.css` contém apenas complementos da área do membro.

## Dados e indicadores

As chaves existentes foram preservadas:
- `ekklesia.demonstracao.v1`: cadastros no localStorage. Sem registros salvos,
  são usados os exemplos já existentes em `Ekklesia.seed`.
- `ekklesia.disponibilidades.v1`: disponibilidades no localStorage.
- `ekklesia.apresentacao.v1`: identificação visual da comunidade.
- `ekklesia.sessao.v1`: perfil e ID do membro no sessionStorage, por aba.

O painel administrativo conta os registros compartilhados. O painel pessoal
conta cultos nos próximos sete dias, ministérios associados ao cadastro,
disponibilidades válidas no mês e campanhas em andamento. Não há percentuais
de crescimento inventados. O vínculo atual de ministério usa o nome informado
no cadastro; futuras relações devem usar IDs.

Próximas escalas pessoais só são apresentadas se houver vínculos estruturados
`designacoes: [{ membroId, funcao, status }]` na escala.
O campo atual `equipe` é texto livre e não comprova uma designação. Sem esses
vínculos, o painel informa que não há designações. Os próximos cultos continuam
visíveis em sua própria seção.

## Disponibilidade

Exclusiva da área Membro, disponível no início e em Escalas.
O calendário usa apenas cultos futuros cadastrados. A identidade vem da sessão;
não existe seletor de outra pessoa no calendário.

O registro mantém `id`, `id_membro`, `id_usuario` (ainda nulo),
`id_escala`, `data`, `horario`, `disponivel`, `observacao`,
`origem` e `atualizadoEm`. Confirmar novamente atualiza o mesmo vínculo,
sem duplicar. Há verificação local de horários coincidentes e, quando fornecido,
de intervalos com `horarioFim`. O cancelamento preserva o histórico.

O membro consulta **Escalas → Minhas disponibilidades**. O administrador usa
**Escalas → Disponibilidades** ou o botão **Disponíveis** de uma escala.
Mudanças de data/horário são sinalizadas para nova confirmação.
Disponibilidade não significa que o membro foi escalado. Não são enviadas notificações.

## Campanhas e pagamentos

Os painéis exibem até três campanhas, com três indicadores. A tela Campanhas
do membro permite navegar por todas as campanhas e consultar seus detalhes.
Quantidades mantêm a unidade original. Valores em reais só aparecem quando
`raisedAmount` e `targetAmount` estiverem explicitamente cadastrados.

Cada campanha pode fornecer `description`, `donations`, `families`,
`qrCode`, `paymentUrl` e `qrCodeDemonstrativo`.
Sem QR ou link configurado, o componente informa a ausência e mantém
**Doar agora** desabilitado. Links de pagamento devem usar HTTPS.
Um QR marcado demonstrativo desabilita o link de pagamento.
Nenhuma transação ou chave PIX foi criada.

## Permissões e integração futura

Controladores administrativos não são carregados na área do membro.
As funções de escrita administrativa exigem perfil admin; as funções de
disponibilidade derivam o membro da sessão e verificam a propriedade do registro.

Essas verificações organizam o frontend, mas **não são segurança real**:
o usuário pode alterar JavaScript e armazenamento no navegador.
A integração com Firebase Authentication/backend deverá substituir a sessão
demonstrativa e validar papéis, propriedade dos registros e acesso aos dados
no servidor/regras do banco. O repositório local concentra os pontos de troca
pela persistência remota. Não há SDK Firebase ou API fictícia.

Ainda dependem do backend: autenticação, autorização efetiva, armazenamento
compartilhado entre dispositivos, conflitos concorrentes, designações formais,
notificações, pagamentos e futura geração de escalas por IA.
