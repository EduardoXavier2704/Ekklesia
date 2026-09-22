# Ekklesia — Gestão para Comunidades

Protótipo de interface em HTML, CSS e JavaScript, sem frameworks ou dependências no frontend.

## Executar localmente

Abra um terminal na pasta do projeto e, se tiver Python instalado, execute:

```powershell
py -m http.server 8000 --bind 127.0.0.1
```

Acesse http://localhost:8000. Também é possível visualizar as páginas diretamente pelos arquivos HTML, mas o compartilhamento dos dados locais entre páginas depende do navegador no protocolo file://. Use o servidor local para testar a navegação e a persistência de forma consistente.

## Páginas

- Login: interface demonstrativa, sem autenticação.
- Início: indicadores compartilhados, resumo cronológico das escalas, calendário de disponibilidade e carrossel de campanhas.
- Membros: listagem, busca, filtros, cadastro, edição, detalhes e exclusão local.
- Ministérios: indicadores, filtros e gerenciamento demonstrativo.
- Células: líderes, participantes, dia, horário e local das reuniões.
- Escalas: listagem, filtros por status/mês, formulários e calendário mensal.
- Campanhas: metas, arrecadação, entregas e progresso por unidade.
- Relatórios: prévia dos módulos, exportação CSV e impressão pelo navegador.
- Configurações: identificação da comunidade e restauração dos registros de exemplo.

## Organização

- `pages/`: arquivos HTML de cada tela.
- `css/global.css`: configurações gerais.
- `css/inicio.css`: base visual existente, também utilizada pelas novas páginas.
- `css/gestao.css`: tabelas, filtros, formulários, calendário e complementos responsivos compartilhados.
- `js/dados.js`: campos dos módulos, exemplos existentes e repositório local compartilhado (`Ekklesia.store`).
- `js/inicio.js`: carregamento e interação dos componentes do Dashboard.
- `js/gestao.js`: interações, armazenamento local, relatórios e navegação responsiva.
- `assets/`: imagens existentes de logo e fundo.
- `docs/`: documento de visão do projeto.

## Limites desta etapa

Os novos módulos usam dados fictícios e localStorage. Não há backend, banco de dados, autenticação, notificações reais, controle de acesso ou integração com IA. Não utilize dados pessoais ou credenciais reais. O formulário original de login usa GET e precisa ser substituído pelo fluxo de autenticação antes de uso real.

Os indicadores das novas telas são calculados a partir dos registros locais. As quantidades de membros/participantes dos grupos são informadas manualmente; não representam vínculos automáticos com o cadastro de Membros. O Dashboard lê os mesmos registros dos módulos e atualiza seus contadores ao abrir, ao receber alterações de armazenamento, ao retornar à aba e pelo botão Atualizar. A agenda de eventos permanece demonstrativa.

A IA permanece restrita ao escopo futuro de sugestões de escalas revisadas pelo líder. A escala demonstrativa registra os dados gerais e uma descrição manual de equipe/funções; não distribui voluntários automaticamente. O Dashboard registra disponibilidades locais, conforme detalhado abaixo.

As campanhas validam o intervalo de datas e impedem que a quantidade entregue supere a arrecadada. Relatórios incluem todos os registros do módulo selecionado, sem misturar unidades de arrecadação. Configurações afetam somente a apresentação local, sem simular permissões ou mudanças de senha.

Os dados podem ser restaurados em Configurações. Eles são compartilhados apenas por páginas na mesma origem do navegador, sem sincronização entre dispositivos.

## Validação realizada

Verificados: sintaxe JavaScript, caminhos locais, IDs únicos e consistência dos dados de exemplo. Testes de integração em DOM simulado cobriram cadastro, edição, detalhes, exclusão/cancelamento, busca, filtros, paginação, persistência, escape de HTML, validações de campanhas, calendário, exportação CSV, configurações e alternância do menu. A ferramenta de testes foi instalada somente em uma pasta temporária, sem dependências adicionadas ao frontend.

A conferência visual em navegador real permanece pendente: a política do navegador integrado bloqueou a abertura de arquivos locais.

## Dashboard: dados e integração futura

Os contadores usam o tamanho das listas de membros, ministérios, células e escalas retornadas por `Ekklesia.store.load()`. A chave existente `ekklesia.demonstracao.v1` foi preservada. Sem dados salvos, são utilizados os mesmos exemplos que já alimentavam os módulos; nenhum novo exemplo foi adicionado. Listas salvas vazias permanecem vazias. Falhas de leitura no Dashboard mostram um erro e não sobrescrevem os dados.

O repositório concentra a leitura, validação e gravação. `saveModule` preserva os demais módulos da base; eventos `storage` atualizam outras abas da mesma origem e `ekklesia:storage` atualiza a própria página. Isto é sincronização local, não atualização de um servidor. Para integrar o backend, substituir esse ponto de acesso e adaptar seus consumidores à resposta assíncrona; nenhuma URL de API foi inventada.

### Disponibilidade

A chave `ekklesia.disponibilidades.v1` contém registros com:

```text
id, id_membro, id_usuario, id_escala, data, horario,
disponivel, observacao, origem, atualizadoEm
```

Como não há autenticação, o membro é escolhido explicitamente entre os cadastros ativos. `id_usuario` é nulo; não há associação fictícia com o perfil Administrador exibido no cabeçalho. A confirmação relê a base para validar membro, culto, data e horário. Confirmar novamente o mesmo culto atualiza o registro em vez de duplicá-lo.

O calendário permite somente cultos futuros não concluídos. Na estrutura atual, cultos são identificados pela palavra “culto” no nome; um futuro campo `tipo: 'culto'` tem prioridade sobre essa convenção. O resumo mostra até três cultos em ordem de data/horário (nome desempata horários iguais); na ausência de cultos, mostra as próximas escalas de outros tipos. Datas e horários seguem o fuso do navegador.

Conflitos com outro culto no mesmo horário de início são rejeitados localmente. Caso ambas as escalas possuam `horarioFim`, também é verificada a sobreposição de intervalos no mesmo dia. Sem duração cadastrada, não se infere a duração do culto. Disponibilidades de cultos alterados precisam ser confirmadas novamente. Restaurar a demonstração também limpa as disponibilidades locais, evitando vínculos com cadastros restaurados.

O backend deverá obter o usuário autenticado, validar permissões e vínculos, tratar conflitos de forma transacional, definir duração/fuso e disponibilizar esses registros para o módulo de Escalas e para a futura IA.

### Campanhas

O carrossel seleciona até três registros existentes, priorizando Em andamento, depois Planejada e Concluída. Há exatamente três indicadores: posições sem registro ficam desabilitadas. Setas e pontos navegam sem recarregar a página. A campanha selecionada é preservada nas atualizações quando ainda existir entre as três exibidas.

Os campos atuais `arrecadado`, `meta`, `unidade` e `entregue` alimentam o componente. Quantidades de itens nunca são tratadas como valores em reais. Estes metadados opcionais podem ser fornecidos posteriormente no mesmo registro:

```text
description: descrição da campanha
raisedAmount / targetAmount: valores financeiros em BRL, quando ambos existirem
donations: quantidade de doações, ou ausente quando não informada
families: famílias atendidas, ou ausente
qrCode: caminho/URL da imagem individual da campanha, ou null
qrCodeDemonstrativo: true para uma imagem de teste
paymentUrl: URL HTTPS de doação configurada, ou null
```

O formulário existente de Campanhas preserva esses metadados nas edições. Nenhum valor financeiro, contagem de doações, QR Code ou link de pagamento foi inventado. Sem configuração, o componente mostra o espaço de QR Code e o botão Doar agora desabilitado. QR Codes de teste são identificados como demonstrativos e não habilitam pagamento. A integração real de pagamento e a origem verificada do QR Code continuam pendentes.

### Verificação desta evolução

Testes em DOM simulado cobriram os contadores 1/2/1/3, atualização local/entre abas, ordenação de cultos, calendário, vínculo ao membro, gravação, duplicidade, conflitos, dados inválidos/vazios e navegação do carrossel. Também passou a regressão dos cinco módulos, relatórios e configurações. Não foram adicionadas dependências ao frontend. A renderização visual em navegador real ainda precisa ser conferida.

## Consulta de disponibilidades em Escalas

A tela Escalas possui as visualizações Escalas e Disponibilidades. O botão Disponíveis de cada escala abre a consulta filtrada por seu ID; cultos com o mesmo horário não são misturados. Após confirmar no Início, o link de confirmação também abre diretamente essa consulta.

A listagem apresenta membro, culto, data/horário informados, ministério do cadastro, observação e situação. Há busca por membro/ministério/observação, filtros por escala e situação e paginação. Os dados vêm da mesma chave `ekklesia.disponibilidades.v1`; nenhuma cópia de registros é criada.

Disponibilidades canceladas continuam no histórico com `disponivel: false`. Uma nova confirmação no Início reativa o mesmo registro. Cultos com data/horário alterados aparecem como Reconfirmar; registros passados, membros inativos/removidos e escalas removidas/concluídas não são contados como disponibilidade válida. Não há atribuição automática do membro à equipe da escala.

O script `js/disponibilidades.js` controla esta consulta. O repositório compartilhado oferece `cancelAvailability(id)` e informa as mudanças ao Dashboard e à listagem. O cancelamento pede confirmação e preserva o histórico. Permissões por usuário e compartilhamento entre dispositivos continuam dependendo do backend.
