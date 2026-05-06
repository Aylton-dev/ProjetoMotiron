import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Cursos() {
  const categorias = [
    {
      id: 1,
      nome: "Cursos de Frontend",
      descricao: "HTML, CSS e responsividade, JavaScript moderno, React, TypeScript e consumo de APIs.",
      imagem: "/imgs/frontend.jpg",
    },
    {
      id: 2,
      nome: "Cursos de Backend",
      descricao: "APIs REST, Node.js, autenticação, banco de dados e arquitetura.",
      imagem: "/imgs/backend.jpg",
    },
    {
      id: 3,
      nome: "Cursos de Dados",
      descricao: "SQL, modelagem, ETL, Python para dados e dashboards.",
      imagem: "/imgs/banco-de-dados.jpg",
    },
    {
      id: 4,
      nome: "Ferramentas do dia a dia",
      descricao: "Git, GitHub, metodologias ágeis e versionamento.",
      imagem: "/imgs/ferramentas-do-dia-a-dia.jpg",
    },
    {
      id: 5,
      nome: "UI/UX",
      descricao: "Design system, prototipação, usabilidade e Figma.",
      imagem: "/imgs/UI-UX.jpg",
    },
    {
      id: 6,
      nome: "Soft skills",
      descricao: "Comunicação, trabalho em equipe, gestão de tempo e feedback.",
      imagem: "/imgs/Soft skills.jpg",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BookOpen size={28} className="text-[#046279]" />
        <h1 className="text-2xl font-bold">Categorias de cursos</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {categorias.map((categoria) => (
          <Link
            key={categoria.id}
            href={`/cursos/${categoria.id}`}
            className="block"
          >
            <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer">

              <div className="h-40 w-full overflow-hidden">
                <img
                  src={categoria.imagem}
                  alt={categoria.nome}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              <div className="p-5">
                <h2 className="text-lg font-semibold group-hover:text-[#046279] transition">
                  {categoria.nome}
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  {categoria.descricao}
                </p>
              </div>

            </div>
          </Link>
        ))}

      </div>
    </div>
  );
}