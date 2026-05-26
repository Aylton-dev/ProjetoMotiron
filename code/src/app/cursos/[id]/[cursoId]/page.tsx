import Link from "next/link";

function criarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const cursos = [
  {
    categoriaId: 1,
    slug: "html-css-e-responsividade",
    nome: "HTML, CSS e Responsividade",
    modulos: [
      "Estrutura semântica e acessibilidade (A11y)",
      "CSS moderno (Flexbox, Grid, variáveis)",
      "Responsividade e mobile-first",
      "Performance e otimização de CSS",
      "Padronização (BEM, organização de estilos)",
    ],
  },
  {
    categoriaId: 1,
    slug: "javascript-moderno",
    nome: "JavaScript moderno",
    modulos: [
      "ES6+ na prática (arrow, destructuring, modules)",
      "Manipulação de DOM e eventos",
      "Programação assíncrona (Promises, async/await)",
      "Tratamento de erros",
      "Boas práticas e clean code em JS",
    ],
  },
  {
    categoriaId: 1,
    slug: "react-o-mais-comum",
    nome: "React",
    modulos: [
      "Fundamentos (componentes, JSX)",
      "Hooks (useState, useEffect, custom hooks)",
      "Gerenciamento de estado",
      "Performance (memo, lazy loading)",
      "Integração com APIs",
      "Organização de projetos (arquitetura frontend)",
    ],
  },
  {
    categoriaId: 1,
    slug: "typescript",
    nome: "TypeScript",
    modulos: [
      "Tipagem básica e avançada",
      "Interfaces e tipos customizados",
      "Tipagem em funções e objetos",
      "Integração com React",
      "Boas práticas e escalabilidade",
    ],
  },
  {
    categoriaId: 1,
    slug: "consumo-de-apis",
    nome: "Consumo de APIs",
    modulos: [
      "Conceitos de API e HTTP",
      "Fetch / Axios",
      "Tratamento de erros e loading",
      "Integração com frontend",
      "Cache e otimização de requisições",
    ],
  },
  {
    categoriaId: 2,
    slug: "apis-rest",
    nome: "APIs REST",
    modulos: [
      "Conceitos REST (GET, POST, PUT, DELETE)",
      "Estrutura de endpoints",
      "Status HTTP",
      "Boas práticas de API",
      "Documentação (Swagger)",
    ],
  },
  {
    categoriaId: 2,
    slug: "nodejs",
    nome: "Node.js",
    modulos: [
      "Fundamentos do Node",
      "Criação de servidor",
      "Middleware",
      "Integração com banco",
      "Estrutura de projeto",
    ],
  },
  {
    categoriaId: 2,
    slug: "autenticacao-login-jwt",
    nome: "Autenticação (login, JWT)",
    modulos: [
      "Conceitos de autenticação",
      "JWT na prática",
      "Proteção de rotas",
      "Criptografia de senha",
      "Refresh token e segurança",
    ],
  },
  {
    categoriaId: 2,
    slug: "banco-de-dados",
    nome: "Banco de dados",
    modulos: [
      "SQL vs NoSQL",
      "CRUD",
      "Relacionamentos",
      "Indexação e performance",
      "Integração com backend",
    ],
  },
  {
    categoriaId: 2,
    slug: "arquitetura-mvc-clean-code",
    nome: "Arquitetura (MVC, Clean Code)",
    modulos: [
      "Padrão MVC",
      "Separação de responsabilidades",
      "Clean Code",
      "Boas práticas de organização",
      "Escalabilidade",
    ],
  },
  {
    categoriaId: 3,
    slug: "sql",
    nome: "SQL",
    modulos: [
      "Consultas básicas e avançadas",
      "JOINs",
      "Subqueries",
      "Otimização de queries",
      "Manipulação de dados",
    ],
  },
  {
    categoriaId: 3,
    slug: "modelagem-de-dados",
    nome: "Modelagem de dados",
    modulos: [
      "Entidades e relacionamentos",
      "Normalização",
      "Modelagem relacional",
      "Diagramas (ER)",
      "Boas práticas",
    ],
  },
  {
    categoriaId: 3,
    slug: "tratamento-de-dados",
    nome: "ETL (tratamento de dados)",
    modulos: [
      "Extração de dados",
      "Transformação",
      "Limpeza de dados",
      "Carga em banco",
      "Automação de processos",
    ],
  },
  {
    categoriaId: 3,
    slug: "python-para-dados",
    nome: "Python para dados",
    modulos: [
      "Fundamentos do Python",
      "Manipulação de dados (Pandas)",
      "Análise de dados",
      "Scripts automatizados",
      "Integração com banco",
    ],
  },
  {
    categoriaId: 3,
    slug: "dashboards",
    nome: "Dashboards",
    modulos: [
      "Visualização de dados",
      "Criação de relatórios",
      "Indicadores (KPIs)",
      "Storytelling com dados",
      "Ferramentas como Power BI",
    ],
  },
  {
    categoriaId: 4,
    slug: "git",
    nome: "Git",
    modulos: [
      "Versionamento",
      "Commits e histórico",
      "Branches",
      "Merge e conflitos",
      "Boas práticas",
    ],
  },
  {
    categoriaId: 4,
    slug: "github",
    nome: "GitHub",
    modulos: [
      "Repositórios",
      "Pull requests",
      "Code review",
      "Issues",
    ],
  },
  {
    categoriaId: 4,
    slug: "colaboracao-em-equipe",
    nome: "Colaboração em equipe",
    modulos: [
      "Metodologias ágeis",
      "Scrum",
      "Kanban",
      "Sprints",
      "Daily meetings",
      "Gestão de tarefas",
    ],
  },
  {
    categoriaId: 4,
    slug: "versionamento-e-branches",
    nome: "Versionamento e branches",
    modulos: [
      "Estratégias de branch",
      "Git Flow",
      "Feature branches",
      "Releases",
      "Integração contínua",
    ],
  },
  {
    categoriaId: 5,
    slug: "design-system",
    nome: "Design System",
    modulos: [
      "Componentes reutilizáveis",
      "Padronização visual",
      "Tokens (cores, tipografia)",
      "Escalabilidade",
      "Consistência",
    ],
  },
  {
    categoriaId: 5,
    slug: "prototipacao",
    nome: "Prototipação",
    modulos: [
      "Wireframes",
      "Protótipos interativos",
      "Fluxos de usuário",
      "Testes de navegação",
      "Validação de ideias",
    ],
  },
  {
    categoriaId: 5,
    slug: "usabilidade",
    nome: "Usabilidade",
    modulos: [
      "Heurísticas de UX",
      "Experiência do usuário",
      "Acessibilidade",
      "Testes de usabilidade",
      "Melhoria contínua",
    ],
  },
  {
    categoriaId: 5,
    slug: "figma",
    nome: "Figma",
    modulos: [
      "Criação de telas",
      "Componentes",
      "Auto layout",
      "Protótipos",
      "Handoff para dev",
    ],
  },
  {
    categoriaId: 6,
    slug: "comunicacao",
    nome: "Comunicação",
    modulos: [
      "Comunicação clara",
      "Comunicação técnica",
      "Alinhamento de equipe",
      "Documentação",
    ],
  },
  {
    categoriaId: 6,
    slug: "trabalho-em-equipe",
    nome: "Trabalho em equipe",
    modulos: [
      "Colaboração",
      "Resolução de conflitos",
      "Responsabilidade compartilhada",
      "Cultura de equipe",
    ],
  },
  {
    categoriaId: 6,
    slug: "gestao-de-tempo",
    nome: "Gestão de tempo",
    modulos: [
      "Priorização",
      "Organização",
      "Entrega de tarefas",
      "Produtividade",
    ],
  },
  {
    categoriaId: 6,
    slug: "feedback",
    nome: "Feedback",
    modulos: [
      "Dar e receber feedback",
      "Comunicação construtiva",
      "Melhoria contínua",
      "Cultura de aprendizado",
    ],
  },
];

export default async function CursoDetalhes({
  params,
}: {
  params: Promise<{ id: string; cursoId: string }>;
}) {
  const { id, cursoId } = await params;
  const curso = cursos.find((item) => item.slug === cursoId);

  if (!curso) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-red-500">Curso não encontrado</h1>
        <p className="mt-2 text-gray-600">Verifique se o link está correto ou escolha outro curso.</p>
        <Link href={`/cursos/${id}`} className="mt-4 inline-block text-[#046279] font-semibold hover:underline">
          Voltar para a categoria
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Link href={`/cursos/${id}`} className="text-sm text-[#046279] hover:underline">
        ← Voltar para a categoria
      </Link>

      <div className="space-y-2 border-b border-white/10 pb-5 mb-6">
        
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-100 drop-shadow-sm">
          {curso.nome}
        </h1>

        <p className="text-sm md:text-base text-white/60 tracking-wide font-medium">
          Módulos disponíveis para este curso
        </p>
      </div>
      <div className="mt-8 space-y-4">
        {curso.modulos.map((modulo) => {
          const moduloSlug = criarSlug(modulo);
          return (
            <Link
              key={modulo}
              href={`/cursos/${id}/${cursoId}/${moduloSlug}`}
              className="block"
            >
              
              <div className="group bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-md hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
  
                <p className="text-lg font-bold text-white tracking-tight group-hover:text-blue-200 transition duration-300">
                  {modulo}
                </p>

                <p className="text-xs font-semibold text-blue-300/80 mt-4 flex items-center gap-1 group-hover:text-blue-300 transition duration-300">
                  Acessar módulo →
                </p>

              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
