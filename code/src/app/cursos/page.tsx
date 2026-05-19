import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getCategorias } from "@/lib/data/cursos-catalogo";

export default function Cursos() {
  const categorias = getCategorias();

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <BookOpen size={28} className="text-[#046279]" />
        <h1 className="text-2xl font-bold">Categorias de cursos</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categorias.map((categoria) => (
          <Link
            key={categoria.slug}
            href={`/cursos/${categoria.slug}`}
            className="block"
          >
            <div className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={categoria.imagem}
                  alt={categoria.nome}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-5">
                <h2 className="text-lg font-semibold transition group-hover:text-[#046279]">
                  {categoria.nome}
                </h2>
                <p className="mt-2 text-sm text-gray-500">{categoria.descricao}</p>
                <p className="mt-2 text-xs font-medium text-[#046279]">
                  {categoria.aulas.length} aulas →
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
