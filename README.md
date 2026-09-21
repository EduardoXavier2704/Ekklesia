# Ekklesia — Gestão para Comunidades

Protótipo de interface em HTML, CSS e JavaScript, sem frameworks ou dependências no frontend.

## Executar localmente

Abra um terminal na pasta do projeto e, se tiver Python instalado, execute:

```powershell
py -m http.server 8000 --bind 127.0.0.1
```

Acesse http://localhost:8000. Também é possível visualizar as páginas diretamente pelos arquivos HTML, mas o compartilhamento dos dados locais entre páginas depende do navegador no protocolo file://. Use o servidor local para testar a navegação e a persistência de forma consistente.

## Páginas

- Login e Início: interfaces originais. O login é apenas demonstrativo e não autentica usuários.
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
- `js/dados.js`: campos dos módulos e registros fictícios.
- `js/gestao.js`: interações, armazenamento local, relatórios e navegação responsiva.
- `assets/`: imagens existentes de logo e fundo.
- `docs/`: documento de visão do projeto.

## Limites desta etapa

Os novos módulos usam dados fictícios e localStorage. Não há backend, banco de dados, autenticação, notificações reais, controle de acesso ou integração com IA. Não utilize dados pessoais ou credenciais reais. O formulário original de login usa GET e precisa ser substituído pelo fluxo de autenticação antes de uso real.

Os indicadores das novas telas são calculados a partir dos registros locais. As quantidades de membros/participantes dos grupos são informadas manualmente; não representam vínculos automáticos com o cadastro de Membros. O dashboard original mantém seus exemplos estáticos. As alterações locais não atualizam seus indicadores.

A IA permanece restrita ao escopo futuro de sugestões de escalas revisadas pelo líder. A escala demonstrativa registra os dados gerais e uma descrição manual de equipe/funções; não verifica conflitos de disponibilidade nem distribui voluntários automaticamente.

As campanhas validam o intervalo de datas e impedem que a quantidade entregue supere a arrecadada. Relatórios incluem todos os registros do módulo selecionado, sem misturar unidades de arrecadação. Configurações afetam somente a apresentação local, sem simular permissões ou mudanças de senha.

Os dados podem ser restaurados em Configurações. Eles são compartilhados apenas por páginas na mesma origem do navegador, sem sincronização entre dispositivos.

## Validação realizada

Verificados: sintaxe JavaScript, caminhos locais, IDs únicos e consistência dos dados de exemplo. Testes de integração em DOM simulado cobriram cadastro, edição, detalhes, exclusão/cancelamento, busca, filtros, paginação, persistência, escape de HTML, validações de campanhas, calendário, exportação CSV, configurações e alternância do menu. A ferramenta de testes foi instalada somente em uma pasta temporária, sem dependências adicionadas ao frontend.

A conferência visual em navegador real permanece pendente: a política do navegador integrado bloqueou a abertura de arquivos locais.
