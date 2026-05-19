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

type AulaBase = Omit<Aula, "status" | "videoUrl" | "quiz" | "duracao"> & {
  duracao?: string;
  quiz?: PerguntaQuiz[];
  videoIndice?: number;
};

function aplicarStatus(aulas: AulaBase[], videoOffset = 0): Aula[] {
  return aulas.map((aula, indice) => ({
    slug: aula.slug,
    titulo: aula.titulo,
    descricao: aula.descricao,
    duracao: aula.duracao ?? `${12 + (indice % 5) * 3} min`,
    videoUrl: videoUrl(videoOffset + indice + (aula.videoIndice ?? 0)),
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
            "Estruture páginas com HTML semântico, tags essenciais, formulários e boas práticas de acessibilidade.",
          quiz: quiz(
            "HTML é usado principalmente para:",
            "Estruturar o conteúdo da página",
            ["Estilizar visualmente", "Executar lógica no servidor"],
          ),
        },
        {
          slug: "css",
          titulo: "CSS",
          descricao:
            "Aprenda seletores, box model, Flexbox, Grid e técnicas de layout responsivo para interfaces modernas.",
          quiz: quiz(
            "Flexbox é ideal para:",
            "Distribuir espaço em um eixo",
            ["Consultar banco de dados", "Autenticar usuários"],
          ),
        },
        {
          slug: "javascript",
          titulo: "JavaScript",
          descricao:
            "Domine variáveis, funções, DOM, eventos e ES6+ para criar interatividade no navegador.",
          quiz: quiz(
            "JavaScript no navegador manipula principalmente:",
            "O DOM e eventos da página",
            ["Apenas estilos CSS", "Somente o banco SQL"],
          ),
        },
        {
          slug: "react",
          titulo: "React",
          descricao:
            "Construa interfaces com componentes, props, estado e hooks — a biblioteca mais usada no frontend.",
          quiz: quiz(
            "React é classificado como:",
            "Uma biblioteca para interfaces",
            ["Um banco de dados", "Uma linguagem compilada"],
          ),
        },
        {
          slug: "typescript",
          titulo: "TypeScript",
          descricao:
            "Adicione tipagem estática ao JavaScript para código mais seguro e manutenível em projetos grandes.",
          quiz: quiz(
            "TypeScript adiciona ao JavaScript:",
            "Tipagem estática opcional",
            ["Um novo runtime de servidor", "Substituição total do HTML"],
          ),
        },
        {
          slug: "consumo-de-apis",
          titulo: "Consumo de APIs",
          descricao:
            "Integre frontends com APIs REST usando fetch, tratamento de erros, loading e exibição de dados.",
          quiz: quiz(
            "Uma API REST comum usa o protocolo:",
            "HTTP",
            ["FTP exclusivo", "SMTP para UI"],
          ),
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
          quiz: quiz(
            "Em REST, GET geralmente serve para:",
            "Ler recursos",
            ["Apagar todos os dados", "Compilar TypeScript"],
          ),
        },
        {
          slug: "nodejs",
          titulo: "Node.js",
          descricao:
            "Execute JavaScript no servidor com Node.js, módulos, npm e criação de APIs escaláveis.",
          quiz: quiz(
            "Node.js permite executar:",
            "JavaScript no servidor",
            ["Apenas CSS", "Somente consultas SQL no browser"],
          ),
        },
        {
          slug: "autenticacao",
          titulo: "Autenticação (login, JWT)",
          descricao:
            "Implemente login, sessões, tokens JWT e boas práticas de segurança em aplicações web.",
          quiz: quiz(
            "JWT é comumente usado para:",
            "Transmitir claims de forma assinada",
            ["Substituir HTML", "Renderizar componentes React"],
          ),
        },
        {
          slug: "banco-de-dados",
          titulo: "Banco de dados",
          descricao:
            "Conecte aplicações a bancos relacionais e NoSQL, queries, migrations e persistência de dados.",
          quiz: quiz(
            "Um banco relacional organiza dados em:",
            "Tabelas com relações",
            ["Apenas arquivos JSON soltos", "Camadas de CSS"],
          ),
        },
        {
          slug: "arquitetura",
          titulo: "Arquitetura (MVC, Clean Code)",
          descricao:
            "Organize projetos com MVC, separação de camadas, Clean Code e padrões de manutenção.",
          quiz: quiz(
            "MVC separa a aplicação em:",
            "Model, View e Controller",
            ["HTML, CSS e PNG", "Git, GitHub e Figma"],
          ),
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
          quiz: quiz(
            "SQL é usado para:",
            "Consultar e manipular dados estruturados",
            ["Criar animações CSS", "Autenticar com JWT"],
          ),
        },
        {
          slug: "modelagem",
          titulo: "Modelagem de dados",
          descricao:
            "Modele entidades, relacionamentos, normalização e diagramas para bases consistentes.",
          quiz: quiz(
            "Normalização busca principalmente:",
            "Reduzir redundância",
            ["Aumentar duplicação", "Eliminar índices"],
          ),
        },
        {
          slug: "etl",
          titulo: "ETL (tratamento de dados)",
          descricao:
            "Extraia, transforme e carregue dados entre sistemas com pipelines confiáveis.",
          quiz: quiz(
            "ETL significa:",
            "Extract, Transform, Load",
            ["Edit, Test, Launch", "Export, Tag, Link"],
          ),
        },
        {
          slug: "python-dados",
          titulo: "Python para dados",
          descricao:
            "Use Python com pandas e bibliotecas de análise para explorar e tratar conjuntos de dados.",
          quiz: quiz(
            "Pandas é popular para:",
            "Manipulação de tabelas de dados",
            ["Estilizar páginas web", "Versionar com Git"],
          ),
        },
        {
          slug: "dashboards",
          titulo: "Dashboards",
          descricao:
            "Crie visualizações e painéis para apoiar decisões com KPIs e gráficos claros.",
          quiz: quiz(
            "Um dashboard eficaz prioriza:",
            "Clareza e métricas relevantes",
            ["Excesso de cores sem legenda", "Dados sem contexto"],
          ),
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
          quiz: quiz(
            "Git é uma ferramenta de:",
            "Controle de versão",
            ["Design de interfaces", "Consultas SQL"],
          ),
        },
        {
          slug: "github",
          titulo: "GitHub",
          descricao:
            "Hospede repositórios, pull requests, code review e colaboração em equipe na nuvem.",
          quiz: quiz(
            "Pull Request serve para:",
            "Revisar e integrar mudanças",
            ["Compilar CSS automaticamente", "Substituir banco de dados"],
          ),
        },
        {
          slug: "metodologias-ageis",
          titulo: "Metodologias ágeis (Scrum, Kanban)",
          descricao:
            "Organize entregas com sprints, quadros Kanban, cerimônias e feedback contínuo.",
          quiz: quiz(
            "Scrum trabalha com ciclos chamados:",
            "Sprints",
            ["Commits", "Dashboards SQL"],
          ),
        },
        {
          slug: "versionamento",
          titulo: "Versionamento e branches",
          descricao:
            "Estratégias de branching (Git Flow, trunk), releases e trabalho paralelo em equipe.",
          quiz: quiz(
            "Uma branch permite:",
            "Desenvolver features em paralelo",
            ["Eliminar histórico do Git", "Bloquear deploys"],
          ),
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
          quiz: quiz(
            "Design System garante:",
            "Consistência entre produtos",
            ["Apenas mais cores aleatórias", "Remoção de acessibilidade"],
          ),
        },
        {
          slug: "prototipacao",
          titulo: "Prototipação",
          descricao:
            "Valide ideias com wireframes e protótipos navegáveis antes do desenvolvimento.",
          quiz: quiz(
            "Prototipação ajuda a:",
            "Testar fluxos cedo",
            ["Substituir testes de API", "Evitar feedback do usuário"],
          ),
        },
        {
          slug: "usabilidade",
          titulo: "Usabilidade",
          descricao:
            "Aplique heurísticas, testes com usuários e métricas para interfaces intuitivas.",
          quiz: quiz(
            "Usabilidade mede principalmente:",
            "Facilidade de uso",
            ["Velocidade do Git", "Tamanho do bundle SQL"],
          ),
        },
        {
          slug: "figma",
          titulo: "Figma",
          descricao:
            "Produza layouts colaborativos no Figma com componentes, auto layout e handoff.",
          quiz: quiz(
            "Figma é usado principalmente para:",
            "Design de interfaces colaborativo",
            ["Executar queries SQL", "Hospedar APIs Node"],
          ),
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
          quiz: quiz(
            "Comunicação assertiva prioriza:",
            "Clareza e respeito",
            ["Evitar todo feedback", "Falar apenas por jargões"],
          ),
        },
        {
          slug: "trabalho-em-equipe",
          titulo: "Trabalho em equipe",
          descricao:
            "Colabore em squads, divida responsabilidades e resolva conflitos construtivamente.",
          quiz: quiz(
            "Trabalho em equipe eficaz requer:",
            "Confiança e alinhamento",
            ["Competição interna constante", "Silêncio total"],
          ),
        },
        {
          slug: "gestao-de-tempo",
          titulo: "Gestão de tempo",
          descricao:
            "Priorize tarefas, evite procrastinação e use métodos como Pomodoro e backlog pessoal.",
          quiz: quiz(
            "Priorização ajuda a:",
            "Focar no que gera mais valor",
            ["Fazer tudo ao mesmo tempo", "Ignorar prazos"],
          ),
        },
        {
          slug: "feedback",
          titulo: "Feedback",
          descricao:
            "Dê e receba feedback de forma construtiva para evolução contínua.",
          quiz: quiz(
            "Feedback construtivo deve ser:",
            "Específico e orientado a ação",
            ["Apenas crítico e vago", "Público e humilhante"],
          ),
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
