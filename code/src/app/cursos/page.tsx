import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Cursos() {
  const cursos = [
    {
      id: 1,
      nome: "React",
      imagem: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    },
    {
      id: 2,
      nome: "UI/UX",
      imagem: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d",
    },
    {
      id: 3,
      nome: "JavaScript",
      imagem: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Cursos disponíveis
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {cursos.map((curso) => (
          <Link
            key={curso.id}
            href={`/cursos/${curso.id}`}
            className="block"
          >
            <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer">

              <div className="h-40 w-full overflow-hidden">
                <img
                  src={curso.imagem}
                  alt={curso.nome}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              <div className="p-5">
                <h2 className="text-lg font-semibold group-hover:text-[#046279] transition">
                  {curso.nome}
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  Clique para acessar o curso
                </p>
              </div>

            </div>
          </Link>
        ))}

      </div>
    </div>
  );
}