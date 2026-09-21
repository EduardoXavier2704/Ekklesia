/* Dados fictícios para demonstração das interfaces. */
window.Ekklesia = {
  schemas: {
  "membros": {
    "title": "Membros",
    "subtitle": "Gerencie os membros da sua comunidade.",
    "singular": "Membro",
    "article": "Novo",
    "icon": "♙",
    "columns": [
      "nome",
      "email",
      "telefone",
      "ministerio",
      "celula",
      "status"
    ],
    "filters": [
      "ministerio",
      "celula",
      "status"
    ],
    "fields": [
      [
        "nome",
        "Nome completo"
      ],
      [
        "email",
        "E-mail",
        "email"
      ],
      [
        "telefone",
        "Telefone",
        "tel"
      ],
      [
        "ministerio",
        "Ministério",
        "select",
        [
          "Louvor",
          "Intercessão",
          "Recepção",
          "Crianças",
          "Ensino",
          "Ação Social",
          "Família",
          "Mídia"
        ]
      ],
      [
        "celula",
        "Célula",
        "select",
        [
          "Célula Esperança",
          "Célula Fé",
          "Célula Amor",
          "Célula Alegria",
          "Célula Vida",
          "Célula Graça",
          "Célula Família"
        ]
      ],
      [
        "status",
        "Status",
        "select",
        [
          "Ativo",
          "Inativo"
        ]
      ]
    ]
  },
  "ministerios": {
    "title": "Ministérios",
    "subtitle": "Gerencie os ministérios da sua comunidade.",
    "singular": "Ministério",
    "article": "Novo",
    "icon": "♧",
    "columns": [
      "nome",
      "lider",
      "membros",
      "area",
      "status"
    ],
    "filters": [
      "status",
      "lider",
      "area"
    ],
    "fields": [
      [
        "nome",
        "Ministério"
      ],
      [
        "lider",
        "Líder"
      ],
      [
        "membros",
        "Membros",
        "number"
      ],
      [
        "area",
        "Área",
        "select",
        [
          "Adoração",
          "Espiritual",
          "Acolhimento",
          "Ensino",
          "Social",
          "Família",
          "Comunicação"
        ]
      ],
      [
        "status",
        "Status",
        "select",
        [
          "Ativo",
          "Inativo"
        ]
      ]
    ]
  },
  "celulas": {
    "title": "Células",
    "subtitle": "Gerencie as células e seus participantes.",
    "singular": "Célula",
    "article": "Nova",
    "icon": "♧",
    "columns": [
      "nome",
      "lider",
      "ministerio",
      "participantes",
      "dia",
      "local",
      "status"
    ],
    "filters": [
      "lider",
      "ministerio",
      "status"
    ],
    "fields": [
      [
        "nome",
        "Célula"
      ],
      [
        "lider",
        "Líder"
      ],
      [
        "ministerio",
        "Ministério",
        "select",
        [
          "Louvor",
          "Intercessão",
          "Recepção",
          "Crianças",
          "Ensino",
          "Ação Social",
          "Família",
          "Mídia"
        ]
      ],
      [
        "participantes",
        "Participantes",
        "number"
      ],
      [
        "dia",
        "Dia da semana",
        "select",
        [
          "Segunda-feira",
          "Terça-feira",
          "Quarta-feira",
          "Quinta-feira",
          "Sexta-feira",
          "Sábado",
          "Domingo"
        ]
      ],
      [
        "horario",
        "Horário",
        "time"
      ],
      [
        "local",
        "Local"
      ],
      [
        "status",
        "Status",
        "select",
        [
          "Ativa",
          "Inativa"
        ]
      ]
    ]
  },
  "escalas": {
    "title": "Escalas",
    "subtitle": "Crie, visualize e gerencie as escalas da sua comunidade.",
    "singular": "Escala",
    "article": "Nova",
    "icon": "▦",
    "columns": [
      "nome",
      "ministerio",
      "data",
      "horario",
      "local",
      "servicos",
      "status"
    ],
    "filters": [
      "ministerio",
      "local",
      "status"
    ],
    "fields": [
      [
        "nome",
        "Escala"
      ],
      [
        "ministerio",
        "Ministério",
        "select",
        [
          "Louvor",
          "Intercessão",
          "Recepção",
          "Crianças",
          "Ensino",
          "Ação Social",
          "Família",
          "Mídia",
          "Jovens",
          "Geral"
        ]
      ],
      [
        "data",
        "Data",
        "date"
      ],
      [
        "horario",
        "Horário",
        "time"
      ],
      [
        "local",
        "Local"
      ],
      [
        "servicos",
        "Serviços previstos",
        "number"
      ],
      [
        "status",
        "Status",
        "select",
        [
          "Agendada",
          "Ativa",
          "Concluída",
          "Pendente"
        ]
      ],
      [
        "equipe",
        "Equipe e funções (opcional)",
        "textarea"
      ]
    ]
  },
  "campanhas": {
    "title": "Campanhas",
    "subtitle": "Gerencie as campanhas e acompanhe as arrecadações da sua comunidade.",
    "singular": "Campanha",
    "article": "Nova",
    "icon": "♡",
    "columns": [
      "nome",
      "tipo",
      "periodo",
      "meta",
      "arrecadado",
      "entregue",
      "status"
    ],
    "filters": [
      "status",
      "tipo"
    ],
    "fields": [
      [
        "nome",
        "Campanha"
      ],
      [
        "tipo",
        "Tipo",
        "select",
        [
          "Alimentos",
          "Roupas",
          "Livros",
          "Brinquedos",
          "Diversos"
        ]
      ],
      [
        "inicio",
        "Início",
        "date"
      ],
      [
        "fim",
        "Término",
        "date"
      ],
      [
        "unidade",
        "Unidade",
        "select",
        [
          "cestas",
          "peças",
          "livros",
          "brinquedos",
          "itens"
        ]
      ],
      [
        "meta",
        "Meta",
        "number"
      ],
      [
        "arrecadado",
        "Arrecadado",
        "number"
      ],
      [
        "entregue",
        "Entregue",
        "number"
      ],
      [
        "status",
        "Status",
        "select",
        [
          "Planejada",
          "Em andamento",
          "Concluída"
        ]
      ]
    ]
  }
},
  seed: {
  "membros": [
    {
      "id": "m0",
      "nome": "João Silva Santos",
      "email": "joao.silva@example.com",
      "telefone": "(81) 99999-0001",
      "ministerio": "Louvor",
      "celula": "Célula Esperança",
      "status": "Ativo"
    },
    {
      "id": "m1",
      "nome": "Maria Oliveira",
      "email": "maria.oliveira@example.com",
      "telefone": "(81) 98888-0002",
      "ministerio": "Intercessão",
      "celula": "Célula Fé",
      "status": "Ativo"
    },
    {
      "id": "m2",
      "nome": "Pedro Lima",
      "email": "pedro.lima@example.com",
      "telefone": "(81) 97777-0003",
      "ministerio": "Recepção",
      "celula": "Célula Amor",
      "status": "Ativo"
    },
    {
      "id": "m3",
      "nome": "Ana Clara",
      "email": "ana.clara@example.com",
      "telefone": "(81) 96666-0004",
      "ministerio": "Crianças",
      "celula": "Célula Alegria",
      "status": "Ativo"
    },
    {
      "id": "m4",
      "nome": "Lucas Ferreira",
      "email": "lucas.ferreira@example.com",
      "telefone": "(81) 95555-0005",
      "ministerio": "Ensino",
      "celula": "Célula Vida",
      "status": "Ativo"
    },
    {
      "id": "m5",
      "nome": "Juliana Souza",
      "email": "juliana.souza@example.com",
      "telefone": "(81) 94444-0006",
      "ministerio": "Ação Social",
      "celula": "Célula Graça",
      "status": "Inativo"
    },
    {
      "id": "m6",
      "nome": "Rafael Gomes",
      "email": "rafael.gomes@example.com",
      "telefone": "(81) 93333-0007",
      "ministerio": "Família",
      "celula": "Célula Família",
      "status": "Ativo"
    },
    {
      "id": "m7",
      "nome": "Beatriz Santos",
      "email": "beatriz.santos@example.com",
      "telefone": "(81) 92222-0008",
      "ministerio": "Mídia",
      "celula": "Célula Esperança",
      "status": "Ativo"
    }
  ],
  "ministerios": [
    {
      "id": "n0",
      "nome": "Louvor",
      "lider": "João Silva Santos",
      "membros": 28,
      "area": "Adoração",
      "status": "Ativo"
    },
    {
      "id": "n1",
      "nome": "Intercessão",
      "lider": "Maria Oliveira",
      "membros": 18,
      "area": "Espiritual",
      "status": "Ativo"
    },
    {
      "id": "n2",
      "nome": "Recepção",
      "lider": "Pedro Lima",
      "membros": 22,
      "area": "Acolhimento",
      "status": "Ativo"
    },
    {
      "id": "n3",
      "nome": "Crianças",
      "lider": "Ana Clara",
      "membros": 15,
      "area": "Ensino",
      "status": "Ativo"
    },
    {
      "id": "n4",
      "nome": "Ensino",
      "lider": "Lucas Ferreira",
      "membros": 20,
      "area": "Ensino",
      "status": "Ativo"
    },
    {
      "id": "n5",
      "nome": "Ação Social",
      "lider": "Juliana Souza",
      "membros": 16,
      "area": "Social",
      "status": "Inativo"
    },
    {
      "id": "n6",
      "nome": "Família",
      "lider": "Rafael Gomes",
      "membros": 14,
      "area": "Família",
      "status": "Ativo"
    },
    {
      "id": "n7",
      "nome": "Mídia",
      "lider": "Beatriz Santos",
      "membros": 23,
      "area": "Comunicação",
      "status": "Ativo"
    }
  ],
  "celulas": [
    {
      "id": "c0",
      "nome": "Célula Esperança",
      "lider": "João Silva Santos",
      "ministerio": "Louvor",
      "participantes": 18,
      "dia": "Terça-feira",
      "horario": "19:30",
      "local": "Casa do João",
      "status": "Ativa"
    },
    {
      "id": "c1",
      "nome": "Célula Fé",
      "lider": "Maria Oliveira",
      "ministerio": "Intercessão",
      "participantes": 15,
      "dia": "Quinta-feira",
      "horario": "20:00",
      "local": "Casa da Maria",
      "status": "Ativa"
    },
    {
      "id": "c2",
      "nome": "Célula Amor",
      "lider": "Pedro Lima",
      "ministerio": "Recepção",
      "participantes": 20,
      "dia": "Sexta-feira",
      "horario": "19:30",
      "local": "Salão da Igreja",
      "status": "Ativa"
    },
    {
      "id": "c3",
      "nome": "Célula Alegria",
      "lider": "Ana Clara",
      "ministerio": "Crianças",
      "participantes": 12,
      "dia": "Sábado",
      "horario": "17:00",
      "local": "Casa da Ana",
      "status": "Ativa"
    },
    {
      "id": "c4",
      "nome": "Célula Vida",
      "lider": "Lucas Ferreira",
      "ministerio": "Ensino",
      "participantes": 14,
      "dia": "Quarta-feira",
      "horario": "19:30",
      "local": "Casa do Lucas",
      "status": "Ativa"
    },
    {
      "id": "c5",
      "nome": "Célula Graça",
      "lider": "Juliana Souza",
      "ministerio": "Ação Social",
      "participantes": 11,
      "dia": "Domingo",
      "horario": "09:00",
      "local": "Salão Social",
      "status": "Inativa"
    },
    {
      "id": "c6",
      "nome": "Célula Família",
      "lider": "Rafael Gomes",
      "ministerio": "Família",
      "participantes": 16,
      "dia": "Sábado",
      "horario": "19:00",
      "local": "Casa do Rafael",
      "status": "Ativa"
    }
  ],
  "escalas": [
    {
      "id": "e0",
      "nome": "Culto de Domingo Manhã",
      "ministerio": "Louvor",
      "data": "2026-09-20",
      "horario": "09:00",
      "local": "Templo Principal",
      "servicos": 8,
      "status": "Agendada",
      "equipe": ""
    },
    {
      "id": "e1",
      "nome": "Culto de Domingo Noite",
      "ministerio": "Intercessão",
      "data": "2026-09-20",
      "horario": "18:30",
      "local": "Templo Principal",
      "servicos": 6,
      "status": "Agendada",
      "equipe": ""
    },
    {
      "id": "e2",
      "nome": "Ensaio de Louvor",
      "ministerio": "Louvor",
      "data": "2026-09-23",
      "horario": "19:30",
      "local": "Sala de Ensaios",
      "servicos": 4,
      "status": "Ativa",
      "equipe": ""
    },
    {
      "id": "e3",
      "nome": "Culto de Jovens",
      "ministerio": "Jovens",
      "data": "2026-09-26",
      "horario": "19:00",
      "local": "Salão Social",
      "servicos": 5,
      "status": "Agendada",
      "equipe": ""
    },
    {
      "id": "e4",
      "nome": "Culto de Ceia",
      "ministerio": "Geral",
      "data": "2026-09-27",
      "horario": "09:00",
      "local": "Templo Principal",
      "servicos": 10,
      "status": "Pendente",
      "equipe": ""
    },
    {
      "id": "e5",
      "nome": "Culto das Crianças",
      "ministerio": "Crianças",
      "data": "2026-09-27",
      "horario": "09:00",
      "local": "Sala Kids",
      "servicos": 3,
      "status": "Agendada",
      "equipe": ""
    },
    {
      "id": "e6",
      "nome": "Noite de Louvor",
      "ministerio": "Louvor",
      "data": "2026-09-30",
      "horario": "19:30",
      "local": "Templo Principal",
      "servicos": 6,
      "status": "Agendada",
      "equipe": ""
    }
  ],
  "campanhas": [
    {
      "id": "a0",
      "nome": "Doação com Amor",
      "tipo": "Alimentos",
      "inicio": "2026-09-01",
      "fim": "2026-10-30",
      "unidade": "cestas",
      "meta": 100,
      "arrecadado": 45,
      "entregue": 20,
      "status": "Em andamento"
    },
    {
      "id": "a1",
      "nome": "Campanha do Agasalho",
      "tipo": "Roupas",
      "inicio": "2026-08-01",
      "fim": "2026-09-30",
      "unidade": "peças",
      "meta": 500,
      "arrecadado": 320,
      "entregue": 200,
      "status": "Em andamento"
    },
    {
      "id": "a2",
      "nome": "Livros que Transformam",
      "tipo": "Livros",
      "inicio": "2026-07-01",
      "fim": "2026-08-30",
      "unidade": "livros",
      "meta": 200,
      "arrecadado": 200,
      "entregue": 200,
      "status": "Concluída"
    },
    {
      "id": "a3",
      "nome": "Dia das Crianças",
      "tipo": "Brinquedos",
      "inicio": "2026-09-01",
      "fim": "2026-10-12",
      "unidade": "brinquedos",
      "meta": 300,
      "arrecadado": 120,
      "entregue": 0,
      "status": "Em andamento"
    },
    {
      "id": "a4",
      "nome": "Apoio às Famílias",
      "tipo": "Alimentos",
      "inicio": "2026-06-01",
      "fim": "2026-07-31",
      "unidade": "cestas",
      "meta": 150,
      "arrecadado": 150,
      "entregue": 150,
      "status": "Concluída"
    },
    {
      "id": "a5",
      "nome": "Projeto Verão",
      "tipo": "Diversos",
      "inicio": "2026-12-01",
      "fim": "2027-01-31",
      "unidade": "itens",
      "meta": 100,
      "arrecadado": 0,
      "entregue": 0,
      "status": "Planejada"
    }
  ]
}
};
