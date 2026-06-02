import type { Aula, Categoria, PerguntaQuiz, StatusAula } from "@/lib/types/aula";

const VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
];

function videoUrl(indice: number) {
  return VIDEOS[indice % VIDEOS.length];
}

function quiz(
  pergunta: string,
  correta: string,
  incorretas: [string, string],
): PerguntaQuiz[] {
  return [
    {
      id: "q1",
      pergunta,
      opcoes: [
        { id: "a", texto: incorretas[0] },
        { id: "b", texto: correta },
        { id: "c", texto: incorretas[1] },
      ],
      respostaCorretaId: "b",
    },
  ];
}

function quizTresPerguntas(
  perguntas: {
    pergunta: string;
    correta: string;
    incorretas: [string, string];
  }[],
): PerguntaQuiz[] {
  return perguntas.map((item, index) => {
    const numero = index + 1;

    return {
      id: "q" + numero,
      pergunta: item.pergunta,
      opcoes: [
        { id: "q" + numero + "-a", texto: item.incorretas[0] },
        { id: "q" + numero + "-b", texto: item.correta },
        { id: "q" + numero + "-c", texto: item.incorretas[1] },
      ],
      respostaCorretaId: "q" + numero + "-b",
    };
  });
}
type AulaBase = Omit<Aula, "status" | "videoUrl" | "quiz" | "duracao"> & {
  duracao?: string;
  quiz?: PerguntaQuiz[];
  videoIndice?: number;
  videoUrl?: string;
};

function aplicarStatus(aulas: AulaBase[], videoOffset = 0): Aula[] {
  return aulas.map((aula, indice) => ({
    slug: aula.slug,
    titulo: aula.titulo,
    descricao: aula.descricao,
    duracao: aula.duracao ?? `${12 + (indice % 5) * 3} min`,
    videoUrl: aula.videoUrl ?? videoUrl(videoOffset + indice + (aula.videoIndice ?? 0)),
    quiz: aula.quiz ?? [],
    status: (indice === 0
      ? "concluida"
      : indice === 1
        ? "atual"
        : "disponivel") as StatusAula,
  }));
}

export const categorias: Categoria[] = [
  {
    slug: "frontend",
    nome: "Cursos de Frontend",
    descricao:
      "HTML, CSS e responsividade, JavaScript moderno, React, TypeScript e consumo de APIs.",
    imagem: "/imgs/frontend.jpg",
    aulas: aplicarStatus(
      [
      
        {
        slug: "html",
        titulo: "HTML",
        descricao:
          "Estruture páginas com HTML semântico, tags essenciais, formulários e boas práticas.",
      
          videoUrl: "https://www.youtube.com/watch?v=BjQvU8H_DKY",
      
          quiz: quizTresPerguntas([
            {
              pergunta: "HTML é usado principalmente para:",
              correta: "Estruturar o conteúdo da página",
              incorretas: ["Estilizar visualmente", "Executar lógica no servidor"],
            },
            {
              pergunta: "Qual tag HTML é usada para criar um parágrafo?",
              correta: "<p>",
              incorretas: ["<img>", "<style>"],
            },
            {
              pergunta: "Qual é a função da tag <h1>?",
              correta: "Criar um título principal na página",
              incorretas: ["Criar um link", "Adicionar uma imagem"],
            },
          ]),
        },
        {
          slug: "css",
          titulo: "CSS",
          descricao:
            "Aprenda seletores, box model, Flexbox, Grid e técnicas de layout responsivo para interfaces modernas.",
            videoUrl: "https://www.youtube.com/watch?v=I-MbP7QddmQ",
          quiz: quizTresPerguntas([
            {
              pergunta: "Flexbox é ideal para:",
              correta: "Distribuir espaço em um eixo",
              incorretas: ["Consultar banco de dados", "Autenticar usuários"],
            },
            {
              pergunta: "Qual propriedade muda a direção do Flexbox?",
              correta: "flex-direction",
              incorretas: ["font-size", "background-color"],
            },
            {
              pergunta: "Qual propriedade centraliza itens no eixo principal?",
              correta: "justify-content",
              incorretas: ["position", "z-index"],
            },
          ]),
        },
        {
          slug: "javascript",
          titulo: "JavaScript",
          descricao:
            "Domine variáveis, funções, DOM, eventos e ES6+ para criar interatividade no navegador.",
            videoUrl: "http://www.youtube.com/watch?v=_YV7BgVh9Wc",

          quiz: quizTresPerguntas([
            {
              pergunta: "JavaScript no navegador manipula principalmente:",
              correta: "O DOM e eventos da página",
              incorretas: ["Apenas estilos CSS", "Somente o banco SQL"],
            },
            {
              pergunta: "Qual palavra cria uma variável que pode mudar de valor?",
              correta: "let",
              incorretas: ["const", "style"],
            },
            {
              pergunta: "Qual evento acontece quando o usuário clica em algo?",
              correta: "click",
              incorretas: ["submit", "hover"],
            },
          ]),
        },
        {
          slug: "react",
          titulo: "React",
          descricao:
            "Construa interfaces com componentes, props, estado e hooks — a biblioteca mais usada no frontend.",
            videoUrl: "https://youtu.be/3rph5q0d90I?si=hVWIZ3e-YIcHKRnP",

          quiz: quizTresPerguntas([
            {
              pergunta: "React é classificado como:",
              correta: "Uma biblioteca para interfaces",
              incorretas: ["Um banco de dados", "Uma linguagem compilada"],
            },
            {
              pergunta: "Em React, componentes servem para:",
              correta: "Dividir a interface em partes reutilizáveis",
              incorretas: ["Criar tabelas SQL", "Editar imagens"],
            },
            {
              pergunta: "Qual hook é usado para criar estado?",
              correta: "useState",
              incorretas: ["useImage", "useHTML"],
            },
          ]),
        },
        {
          slug: "typescript",
          titulo: "TypeScript",
          descricao:
            "Adicione tipagem estática ao JavaScript para código mais seguro e manutenível em projetos grandes.",
            videoUrl: "https://youtu.be/gmupEp468lY?si=R7Vy9Sa8MloPzrkl",

          quiz: quizTresPerguntas([
            {
              pergunta: "TypeScript adiciona ao JavaScript:",
              correta: "Tipagem estática opcional",
              incorretas: ["Um novo runtime de servidor", "Substituição total do HTML"],
            },
            {
              pergunta: "Qual tipo representa texto em TypeScript?",
              correta: "string",
              incorretas: ["boolean", "number"],
            },
            {
              pergunta: "TypeScript ajuda principalmente a:",
              correta: "Evitar erros com tipos no código",
              incorretas: ["Criar imagens automaticamente", "Substituir o CSS"],
            },
          ]),
        },
        {
          slug: "consumo-de-apis",
          titulo: "Consumo de APIs",
          descricao:
            "Integre frontends com APIs REST usando fetch, tratamento de erros, loading e exibição de dados.",
            videoUrl: "https://youtu.be/H-uku8gaWtQ?si=A36jtwq_zr9Gr7m8",
          quiz: quizTresPerguntas([
            {
              pergunta: "Uma API REST comum usa o protocolo:",
              correta: "HTTP",
              incorretas: ["FTP exclusivo", "SMTP para UI"],
            },
            {
              pergunta: "Qual função do JavaScript é muito usada para buscar dados de APIs?",
              correta: "fetch",
              incorretas: ["alert", "console.log"],
            },
            {
              pergunta: "Quando uma API está carregando, é comum mostrar:",
              correta: "Um estado de loading",
              incorretas: ["Uma tela quebrada", "Nada para o usuário"],
            },
          ]),
        },
      ],
      0,
    ),
  },

  {
    slug: "backend",
    nome: "Cursos de Backend",
    descricao:
      "APIs REST, Node.js, autenticação, banco de dados e arquitetura.",
    imagem: "/imgs/backend.jpg",
    aulas: aplicarStatus(
      [
        {
          slug: "apis-rest",
          titulo: "APIs REST",
          descricao:
            "Projete endpoints RESTful, verbos HTTP, status codes e contratos JSON entre cliente e servidor.",
            videoUrl: "https://youtu.be/S7MduKwvVGk?si=epZCwXf2LQLCU_d4",
          quiz: quizTresPerguntas([
            {
              pergunta: "Em REST, GET geralmente serve para:",
              correta: "Ler recursos",
              incorretas: ["Apagar todos os dados", "Compilar TypeScript"],
            },
            {
              pergunta: "Qual formato é muito usado em respostas de APIs?",
              correta: "JSON",
              incorretas: ["MP3", "PNG"],
            },
            {
              pergunta: "O código HTTP 404 indica:",
              correta: "Recurso não encontrado",
              incorretas: ["Sucesso total", "Senha criada"],
            },
          ]),
        },
        {
          slug: "nodejs",
          titulo: "Node.js",
          descricao:
            "Execute JavaScript no servidor com Node.js, módulos, npm e criação de APIs escaláveis.",
            videoUrl: "https://youtu.be/vYekSMBCCiM?si=EzjZKTrI8rQNRG3H",
          quiz: quizTresPerguntas([
            {
              pergunta: "Node.js permite executar:",
              correta: "JavaScript no servidor",
              incorretas: ["Apenas CSS", "Somente consultas SQL no browser"],
            },
            {
              pergunta: "npm é usado principalmente para:",
              correta: "Gerenciar pacotes do projeto",
              incorretas: ["Desenhar telas", "Criar imagens"],
            },
            {
              pergunta: "Em Node.js, módulos ajudam a:",
              correta: "Organizar e reutilizar código",
              incorretas: ["Colorir HTML", "Apagar o navegador"],
            },
          ]),
        },
        {
          slug: "autenticacao",
          titulo: "Autenticação (login, JWT)",
          descricao:
            "Implemente login, sessões, tokens JWT e boas práticas de segurança em aplicações web.",
            videoUrl: "https://youtu.be/YcH2kxqK3nc?si=XKYew1MVpFKV5--l",
          quiz: quizTresPerguntas([
            {
              pergunta: "JWT é comumente usado para:",
              correta: "Transmitir claims de forma assinada",
              incorretas: ["Substituir HTML", "Renderizar componentes React"],
            },
            {
              pergunta: "Autenticação serve para:",
              correta: "Verificar a identidade do usuário",
              incorretas: ["Trocar a cor da página", "Criar tabelas CSS"],
            },
            {
              pergunta: "Uma boa prática para senhas é:",
              correta: "Armazenar com hash seguro",
              incorretas: ["Salvar em texto puro", "Enviar no console"],
            },
          ]),
        },
        {
          slug: "banco-de-dados",
          titulo: "Banco de dados",
          descricao:
            "Conecte aplicações a bancos relacionais e NoSQL, queries, migrations e persistência de dados.",
            videoUrl: "https://youtu.be/N6KsCN8kfOk?si=J041IO5lWIGW9HSM",
          quiz: quizTresPerguntas([
            {
              pergunta: "Um banco relacional organiza dados em:",
              correta: "Tabelas com relações",
              incorretas: ["Apenas arquivos JSON soltos", "Camadas de CSS"],
            },
            {
              pergunta: "SQL é usado para:",
              correta: "Consultar e manipular dados",
              incorretas: ["Estilizar botões", "Criar vídeos"],
            },
            {
              pergunta: "Persistência de dados significa:",
              correta: "Manter dados salvos mesmo após fechar o sistema",
              incorretas: ["Apagar dados automaticamente", "Mudar a fonte da tela"],
            },
          ]),
        },
        {
          slug: "arquitetura",
          titulo: "Arquitetura (MVC, Clean Code)",
          descricao:
            "Organize projetos com MVC, separação de camadas, Clean Code e padrões de manutenção.",
            videoUrl: "https://youtu.be/kYx1QC1XZSo?si=eP94sifx2hFUbOyc",
          quiz: quizTresPerguntas([
            {
              pergunta: "MVC separa a aplicação em:",
              correta: "Model, View e Controller",
              incorretas: ["HTML, CSS e PNG", "Git, GitHub e Figma"],
            },
            {
              pergunta: "Clean Code busca principalmente:",
              correta: "Código claro e fácil de manter",
              incorretas: ["Código confuso", "Mais erros de sintaxe"],
            },
            {
              pergunta: "Separar camadas ajuda a:",
              correta: "Organizar responsabilidades do sistema",
              incorretas: ["Misturar todas as funções", "Remover o backend"],
            },
          ]),
        },
      ],
      1,
    ),
  },
  {
    slug: "dados",
    nome: "Cursos de Dados",
    descricao: "SQL, modelagem, ETL, Python para dados e dashboards.",
    imagem: "/imgs/banco-de-dados.jpg",
    aulas: aplicarStatus(
      [
        {
          slug: "sql",
          titulo: "SQL",
          descricao:
            "Consulte e manipule dados com SELECT, JOINs, agregações e filtros em bancos relacionais.",
            videoUrl: "https://youtu.be/u8n2lN3c9lI?si=CQuBd83R2BrWWXsY",
          quiz: quizTresPerguntas([
            {
              pergunta: "SQL é usado para:",
              correta: "Consultar e manipular dados estruturados",
              incorretas: ["Criar animações CSS", "Autenticar com JWT"],
            },
            {
              pergunta: "Qual comando é muito usado para consultar dados?",
              correta: "SELECT",
              incorretas: ["STYLE", "LOGIN"],
            },
            {
              pergunta: "JOIN é usado para:",
              correta: "Relacionar dados de tabelas diferentes",
              incorretas: ["Criar imagens", "Apagar o navegador"],
            },
          ]),
        },
        {
          slug: "modelagem",
          titulo: "Modelagem de dados",
          descricao:
            "Modele entidades, relacionamentos, normalização e diagramas para bases consistentes.",
            videoUrl: "https://youtu.be/ica1CB_S4jE?si=8G4xq2rPEEyaH3CS",
          quiz: quizTresPerguntas([
            {
              pergunta: "Normalização busca principalmente:",
              correta: "Reduzir redundância",
              incorretas: ["Aumentar duplicação", "Eliminar índices"],
            },
            {
              pergunta: "Na modelagem, entidade representa:",
              correta: "Um objeto ou conceito do sistema",
              incorretas: ["Uma cor do site", "Um botão da tela"],
            },
            {
              pergunta: "Relacionamento indica:",
              correta: "Como as entidades se conectam",
              incorretas: ["O tamanho da fonte", "A velocidade da internet"],
            },
          ]),
        },
        {
          slug: "etl",
          titulo: "ETL (tratamento de dados)",
          descricao:
            "Extraia, transforme e carregue dados entre sistemas com pipelines confiáveis.",
            videoUrl: "https://youtu.be/U6TeMa9b71U?si=0G_RyqfzW71JJ1jl",
          quiz: quizTresPerguntas([
            {
              pergunta: "ETL significa:",
              correta: "Extract, Transform, Load",
              incorretas: ["Edit, Test, Launch", "Export, Tag, Link"],
            },
            {
              pergunta: "A etapa Transform serve para:",
              correta: "Tratar e organizar os dados",
              incorretas: ["Criar telas", "Enviar e-mails"],
            },
            {
              pergunta: "ETL é comum em:",
              correta: "Integração de dados entre sistemas",
              incorretas: ["Desenho de logotipos", "Animação de botões"],
            },
          ]),
        },
        {
          slug: "python-dados",
          titulo: "Python para dados",
          descricao:
            "Use Python com pandas e bibliotecas de análise para explorar e tratar conjuntos de dados.",
            videoUrl: "https://youtu.be/sODNyvVW8wY?si=QCkmodjuU1b3ACCO",
          quiz: quizTresPerguntas([
            {
              pergunta: "Pandas é popular para:",
              correta: "Manipulação de tabelas de dados",
              incorretas: ["Estilizar páginas web", "Versionar com Git"],
            },
            {
              pergunta: "Python pode ser usado em dados para:",
              correta: "Analisar e tratar informações",
              incorretas: ["Pintar a tela do computador", "Criar cabos de rede"],
            },
            {
              pergunta: "Um DataFrame representa:",
              correta: "Uma tabela de dados",
              incorretas: ["Uma imagem", "Uma senha"],
            },
          ]),
        },
        {
          slug: "dashboards",
          titulo: "Dashboards",
          descricao:
            "Crie visualizações e painéis para apoiar decisões com KPIs e gráficos claros.",
            videoUrl: "https://youtu.be/oJcXE0UAO20?si=Kr6ZNbjmDA6ViPTk",
          quiz: quizTresPerguntas([
            {
              pergunta: "Um dashboard eficaz prioriza:",
              correta: "Clareza e métricas relevantes",
              incorretas: ["Excesso de cores sem legenda", "Dados sem contexto"],
            },
            {
              pergunta: "KPI significa:",
              correta: "Indicador-chave de desempenho",
              incorretas: ["Código de página inicial", "Imagem de perfil"],
            },
            {
              pergunta: "Gráficos em dashboards ajudam a:",
              correta: "Visualizar informações rapidamente",
              incorretas: ["Esconder dados importantes", "Excluir relatórios"],
            },
          ]),
        },
      ],
      2,
    ),
  },

    {
      slug: "ferramentas",
      nome: "Ferramentas do dia a dia",
      descricao: "Git, GitHub, metodologias ágeis e versionamento.",
      imagem: "/imgs/ferramentas-do-dia-a-dia.jpg",
      aulas: aplicarStatus(
        [
          {
            slug: "git",
            titulo: "Git",
            descricao:
              "Controle versões localmente com commits, branches, merge e histórico de alterações.",
              videoUrl: "https://youtu.be/za5KWZ5pRag?si=Ye7zf-XQZQ2t59sb",
            quiz: quizTresPerguntas([
              {
                pergunta: "Git é uma ferramenta de:",
                correta: "Controle de versão",
                incorretas: ["Design de interfaces", "Consultas SQL"],
              },
              {
                pergunta: "Um commit serve para:",
                correta: "Salvar uma alteração no histórico",
                incorretas: ["Apagar o projeto", "Criar banco de dados"],
              },
              {
                pergunta: "Branch no Git permite:",
                correta: "Trabalhar em versões separadas do código",
                incorretas: ["Editar imagens", "Criar senhas automáticas"],
              },
            ]),
          },
          {
            slug: "github",
            titulo: "GitHub",
            descricao:
              "Hospede repositórios, pull requests, code review e colaboração em equipe na nuvem.",
              videoUrl: "https://youtu.be/myQuetgSEsY?si=9IbixjwPs9UTCBN_",
            quiz: quizTresPerguntas([
              {
                pergunta: "Pull Request serve para:",
                correta: "Revisar e integrar mudanças",
                incorretas: ["Compilar CSS automaticamente", "Substituir banco de dados"],
              },
              {
                pergunta: "GitHub é usado principalmente para:",
                correta: "Hospedar e colaborar em repositórios",
                incorretas: ["Editar vídeos", "Criar planilhas offline"],
              },
              {
                pergunta: "Code review significa:",
                correta: "Revisão de código",
                incorretas: ["Exclusão de arquivos", "Instalação de programas"],
              },
            ]),
          },
          {
            slug: "metodologias-ageis",
            titulo: "Metodologias ágeis (Scrum, Kanban)",
            descricao:
              "Organize entregas com sprints, quadros Kanban, cerimônias e feedback contínuo.",
              videoUrl: "https://youtu.be/5ByWvpW2zw0?si=_9JD80T_SBcowYJM",
            quiz: quizTresPerguntas([
              {
                pergunta: "Scrum trabalha com ciclos chamados:",
                correta: "Sprints",
                incorretas: ["Commits", "Dashboards SQL"],
              },
              {
                pergunta: "Kanban costuma usar:",
                correta: "Quadros com etapas das tarefas",
                incorretas: ["Somente banco de dados", "Apenas comandos Git"],
              },
              {
                pergunta: "Metodologias ágeis valorizam:",
                correta: "Entregas frequentes e feedback contínuo",
                incorretas: ["Trabalho sem organização", "Ausência de comunicação"],
              },
            ]),
          },
          {
            slug: "versionamento",
            titulo: "Versionamento e branches",
            descricao:
              "Estratégias de branching (Git Flow, trunk), releases e trabalho paralelo em equipe.",
              videoUrl: "https://youtu.be/q9Db8JgApqg?si=OYbqVy8Fy1entdFd",
            quiz: quizTresPerguntas([
              {
                pergunta: "Uma branch permite:",
                correta: "Desenvolver features em paralelo",
                incorretas: ["Eliminar histórico do Git", "Bloquear deploys"],
              },
              {
                pergunta: "Versionamento ajuda a:",
                correta: "Controlar mudanças no código ao longo do tempo",
                incorretas: ["Remover todos os arquivos", "Substituir o navegador"],
              },
              {
                pergunta: "Git Flow é uma estratégia para:",
                correta: "Organizar branches e releases",
                incorretas: ["Criar dashboards", "Estilizar páginas com CSS"],
              },
            ]),
          },
        ],
        3,
      ),
    },
  
    {
      slug: "ui-ux",
      nome: "UI/UX",
      descricao: "Design system, prototipação, usabilidade e Figma.",
      imagem: "/imgs/UI-UX.jpg",
      aulas: aplicarStatus(
        [
          {
            slug: "design-system",
            titulo: "Design System",
            descricao:
              "Crie bibliotecas de componentes, tokens e documentação para consistência visual.",
              videoUrl: "https://youtu.be/rbEbsF8o1-8?si=2QNAZ2AOMP-FriZK",
            quiz: quizTresPerguntas([
              {
                pergunta: "Design System garante:",
                correta: "Consistência entre produtos",
                incorretas: ["Apenas mais cores aleatórias", "Remoção de acessibilidade"],
              },
              {
                pergunta: "Tokens de design ajudam a:",
                correta: "Padronizar cores, fontes e espaçamentos",
                incorretas: ["Apagar componentes", "Criar banco de dados"],
              },
              {
                pergunta: "Componentes reutilizáveis servem para:",
                correta: "Manter padrão visual e agilizar o design",
                incorretas: ["Duplicar erros", "Remover documentação"],
              },
            ]),
          },
          {
            slug: "prototipacao",
            titulo: "Prototipação",
            descricao:
              "Valide ideias com wireframes e protótipos navegáveis antes do desenvolvimento.",
              videoUrl: "https://youtu.be/8YbAHNCv9-w?si=8JD_SM8YPARpjtV4",
            quiz: quizTresPerguntas([
              {
                pergunta: "Prototipação ajuda a:",
                correta: "Testar fluxos cedo",
                incorretas: ["Substituir testes de API", "Evitar feedback do usuário"],
              },
              {
                pergunta: "Wireframe é usado para:",
                correta: "Representar a estrutura inicial da interface",
                incorretas: ["Programar o backend", "Criar banco de dados"],
              },
              {
                pergunta: "Protótipos navegáveis permitem:",
                correta: "Simular a experiência do usuário",
                incorretas: ["Excluir telas automaticamente", "Hospedar APIs"],
              },
            ]),
          },
          {
            slug: "usabilidade",
            titulo: "Usabilidade",
            descricao:
              "Aplique heurísticas, testes com usuários e métricas para interfaces intuitivas.",
              videoUrl: "https://youtu.be/R-bzA9oV-4w?si=T56o-TywlBnePd1y",
            quiz: quizTresPerguntas([
              {
                pergunta: "Usabilidade mede principalmente:",
                correta: "Facilidade de uso",
                incorretas: ["Velocidade do Git", "Tamanho do bundle SQL"],
              },
              {
                pergunta: "Testes com usuários ajudam a:",
                correta: "Identificar dificuldades reais na interface",
                incorretas: ["Ignorar problemas", "Apagar o design system"],
              },
              {
                pergunta: "Uma interface intuitiva deve ser:",
                correta: "Clara e fácil de entender",
                incorretas: ["Confusa de propósito", "Sem organização visual"],
              },
            ]),
          },
          {
            slug: "figma",
            titulo: "Figma",
            descricao:
              "Produza layouts colaborativos no Figma com componentes, auto layout e handoff.",
              videoUrl: "https://youtu.be/jQ1sfKIl50E?si=6w5sJlq8BEYuuWwe",
            quiz: quizTresPerguntas([
              {
                pergunta: "Figma é usado principalmente para:",
                correta: "Design de interfaces colaborativo",
                incorretas: ["Executar queries SQL", "Hospedar APIs Node"],
              },
              {
                pergunta: "Auto layout no Figma ajuda a:",
                correta: "Organizar elementos de forma responsiva",
                incorretas: ["Criar servidores", "Rodar comandos Git"],
              },
              {
                pergunta: "Handoff no Figma facilita:",
                correta: "A passagem do design para o desenvolvimento",
                incorretas: ["Excluir componentes", "Criar senhas automáticas"],
              },
            ]),
          },
        ],
        4,
      ),
    },



    {
      slug: "soft-skills",
      nome: "Soft skills",
      descricao:
        "Comunicação, trabalho em equipe, gestão de tempo e feedback.",
      imagem: "/imgs/Soft skills.jpg",
      aulas: aplicarStatus(
        [
        
          {
            slug: "comunicacao",
            titulo: "Comunicação",
            descricao:
              "Comunique ideias com clareza em reuniões, documentos e apresentações técnicas.",
              videoUrl: "https://youtu.be/PGtNYd8CURg?si=DA4T3X-KhkbNOmcG",
            quiz: quizTresPerguntas([
              {
                pergunta: "Comunicação assertiva prioriza:",
                correta: "Clareza e respeito",
                incorretas: ["Evitar todo feedback", "Falar apenas por jargões"],
              },
              {
                pergunta: "Uma boa comunicação ajuda a:",
                correta: "Evitar mal-entendidos",
                incorretas: ["Criar confusão", "Impedir colaboração"],
              },
              {
                pergunta: "Em apresentações técnicas, é importante:",
                correta: "Explicar ideias com objetividade",
                incorretas: ["Usar apenas termos difíceis", "Não organizar o conteúdo"],
              },
            ]),
          },
          {
            slug: "trabalho-em-equipe",
            titulo: "Trabalho em equipe",
            descricao:
              "Colabore em squads, divida responsabilidades e resolva conflitos construtivamente.",
              videoUrl: "https://youtu.be/BwfR3pbjByY?si=utWR5smWI1dBI-gs",
            quiz: quizTresPerguntas([
              {
                pergunta: "Trabalho em equipe eficaz requer:",
                correta: "Confiança e alinhamento",
                incorretas: ["Competição interna constante", "Silêncio total"],
              },
              {
                pergunta: "Dividir responsabilidades ajuda a:",
                correta: "Organizar melhor as tarefas",
                incorretas: ["Sobrecarregar uma pessoa", "Eliminar comunicação"],
              },
              {
                pergunta: "Resolver conflitos de forma construtiva significa:",
                correta: "Buscar diálogo e soluções",
                incorretas: ["Ignorar o problema", "Culpar alguém publicamente"],
              },
            ]),
          },
          {
            slug: "gestao-de-tempo",
            titulo: "Gestão de tempo",
            descricao:
              "Priorize tarefas, evite procrastinação e use métodos como Pomodoro e backlog pessoal.",
              videoUrl: "https://youtu.be/eDzipPIiWrw?si=kd8FpUk-rEXoLa_-",
            quiz: quizTresPerguntas([
              {
                pergunta: "Priorização ajuda a:",
                correta: "Focar no que gera mais valor",
                incorretas: ["Fazer tudo ao mesmo tempo", "Ignorar prazos"],
              },
              {
                pergunta: "O método Pomodoro ajuda em:",
                correta: "Organizar períodos de foco e pausa",
                incorretas: ["Apagar tarefas", "Criar conflitos"],
              },
              {
                pergunta: "Um backlog pessoal serve para:",
                correta: "Organizar tarefas pendentes",
                incorretas: ["Esquecer prazos", "Evitar planejamento"],
              },
            ]),
          },
          {
            slug: "feedback",
            titulo: "Feedback",
            descricao:
              "Dê e receba feedback de forma construtiva para evolução contínua.",
              videoUrl: "https://youtu.be/eDzipPIiWrw?si=kd8FpUk-rEXoLa_-",
            quiz: quizTresPerguntas([
              {
                pergunta: "Feedback construtivo deve ser:",
                correta: "Específico e orientado a ação",
                incorretas: ["Apenas crítico e vago", "Público e humilhante"],
              },
              {
                pergunta: "Receber feedback ajuda a:",
                correta: "Identificar pontos de melhoria",
                incorretas: ["Evitar crescimento", "Ignorar aprendizados"],
              },
              {
                pergunta: "Ao dar feedback, é importante:",
                correta: "Focar em comportamentos e soluções",
                incorretas: ["Atacar a pessoa", "Ser confuso de propósito"],
              },
            ]),
          },
        ],
        5,
      ),
    },
    ];

export function getCategorias(): Categoria[] {
  return categorias;
}

export function getCategoria(categoriaSlug: string): Categoria | undefined {
  return categorias.find((c) => c.slug === categoriaSlug);
}

export function getAula(categoriaSlug: string, aulaSlug: string) {
  const categoria = getCategoria(categoriaSlug);
  if (!categoria) return undefined;

  const aula = categoria.aulas.find((a) => a.slug === aulaSlug);
  if (!aula) return undefined;

  const indice = categoria.aulas.findIndex((a) => a.slug === aulaSlug);
  const proximaAula = categoria.aulas[indice + 1];
  const concluidas = categoria.aulas.filter(
    (a) => a.status === "concluida",
  ).length;
  const progressoPercentual = Math.round(
    (concluidas / categoria.aulas.length) * 100,
  );

  return { categoria, aula, proximaAula, progressoPercentual };
}

export function getTodasRotasAulas() {
  return categorias.flatMap((categoria) =>
    categoria.aulas.map((aula) => ({
      categoriaSlug: categoria.slug,
      aulaSlug: aula.slug,
    })),
  );
}

/** Compatibilidade: mapeia ID numérico antigo para slug */
const idParaSlug: Record<string, string> = {
  "1": "frontend",
  "2": "backend",
  "3": "dados",
  "4": "ferramentas",
  "5": "ui-ux",
  "6": "soft-skills",
};

export function resolverCategoriaSlug(param: string): string | undefined {
  if (getCategoria(param)) return param;
  return idParaSlug[param];
}