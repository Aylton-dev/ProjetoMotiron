import Link from "next/link";
import { GlassCard } from "@/app/components/GlassCard";

// Função para converter nome do curso em slug
function criarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function Categoria({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categorias = [
    {
      id: 1,
      nome: "Cursos de Frontend",
      descricao: "HTML, CSS e responsividade, JavaScript moderno, React, TypeScript e consumo de APIs.",
      cursos: [
        "HTML, CSS e responsividade",
        "JavaScript moderno",
        "React (o mais comum)",
        "TypeScript",
        "Consumo de APIs",
      ],
    },
    {
      id: 2,
      nome: "Cursos de Backend",
      descricao: "APIs REST, Node.js, autenticação, banco de dados e arquitetura.",
      cursos: [
        "APIs REST",
        "Node.js",
        "Autenticação (login, JWT)",
        "Banco de dados",
        "Arquitetura (MVC, Clean Code)",
      ],
    },
    {
      id: 3,
      nome: "Cursos de Dados",
      descricao: "SQL, modelagem, ETL, Python para dados e dashboards.",
      cursos: [
        "SQL",
        "Modelagem de dados",
        "ETL (tratamento de dados)",
        "Python para dados",
        "Dashboards",
      ],
    },
    {
      id: 4,
      nome: "Ferramentas do dia a dia",
      descricao: "Git, GitHub, metodologias ágeis e versionamento.",
      cursos: [
        "Git",
        "GitHub",
        "Metodologias ágeis (Scrum, Kanban)",
        "Versionamento e branches",
      ],
    },
    {
      id: 5,
      nome: "UI/UX",
      descricao: "Design system, prototipação, usabilidade e Figma.",
      cursos: [
        "Design System",
        "Prototipação",
        "Usabilidade",
        "Figma",
      ],
    },
    {
      id: 6,
      nome: "Soft skills",
      descricao: "Comunicação, trabalho em equipe, gestão de tempo e feedback.",
      cursos: [
        "Comunicação",
        "Trabalho em equipe",
        "Gestão de tempo",
        "Feedback",
      ],
    },
  ];

  const categoria = categorias.find(
    (item) => item.id === Number(id)
  );

  // se não existir, retorna logo aqui
  if (!categoria) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-red-500">Categoria não encontrada</h1>
        <p className="mt-2 text-gray-600">Verifique se o link está correto e tente novamente.</p>
        <Link href="/cursos" className="mt-4 inline-block text-[#046279] font-semibold hover:underline">
          Voltar para categorias
        </Link>
      </div>
    );
  }

  // se existir, mostra a lista de cursos da categoria
  return (
    <div className="p-6">
      <Link href="/cursos" className="text-sm text-[#046279] hover:underline">
        ← Voltar para categorias
      </Link>

      <div className="space-y-2 border-b border-white/10 pb-4 mb-6">
        
        <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-200 drop-shadow-sm">
          {categoria.nome}
        </h1>
  
        <p className="text-sm md:text-base text-white/70 max-w-2xl leading-relaxed">
          {categoria.descricao}
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {categoria.cursos.map((curso) => {
          const cursoSlug = criarSlug(curso);
          return (
            <Link
              key={curso}
              href={`/cursos/${id}/${cursoSlug}`}
              className="block"
            >
              <GlassCard className="h-full flex flex-col bg-slate-900/40 border border-white/10 rounded-2xl p-5 overflow-hidden shadow-lg hover:border-white/20 hover:bg-slate-900/60 transition-all duration-300 hover:-translate-y-1 group">
  
                <p className="text-lg font-bold text-white tracking-tight group-hover:text-blue-200 transition duration-300">
                  {curso}
                </p>
  
                <p className="text-xs font-semibold text-blue-300 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
                  Clique para acessar →
                </p>

              </GlassCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}