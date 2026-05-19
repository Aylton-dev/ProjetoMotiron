import Link from "next/link";
import { notFound } from "next/navigation";
import { PlayCircle, Clock, ChevronRight } from "lucide-react";
import {
  getCategoria,
  getCategorias,
  resolverCategoriaSlug,
} from "@/lib/data/cursos-catalogo";

type PageProps = {
  params: Promise<{ categoriaSlug: string }>;
};

export function generateStaticParams() {
  return getCategorias().map((c) => ({ categoriaSlug: c.slug }));
}

export default async function PaginaCategoria({ params }: PageProps) {
  const { categoriaSlug: param } = await params;
  const slug = resolverCategoriaSlug(param);
  const categoria = slug ? getCategoria(slug) : undefined;

  if (!categoria) notFound();

  return (
    <div className="p-4 sm:p-6">
      <Link
        href="/cursos"
        className="text-sm text-[#046279] transition hover:underline"
      >
        ← Voltar para categorias
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-[#046279]">{categoria.nome}</h1>
      <p className="mt-2 max-w-2xl text-gray-600">{categoria.descricao}</p>
      <p className="mt-2 text-sm text-gray-500">
        {categoria.aulas.length} aulas disponíveis
      </p>

      <div className="mt-8 space-y-3">
        {categoria.aulas.map((aula, index) => (
          <Link
            key={aula.slug}
            href={`/cursos/${categoria.slug}/aulas/${aula.slug}`}
            className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#046279]/30 hover:shadow-md hover:-translate-y-0.5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D6DCF0] text-sm font-bold text-[#046279] transition group-hover:bg-[#046279] group-hover:text-white">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-semibold text-gray-900 transition group-hover:text-[#046279]">
                {aula.titulo}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                {aula.descricao}
              </p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs text-gray-400">
                <Clock size={12} />
                {aula.duracao}
              </span>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-[#046279] opacity-0 transition group-hover:opacity-100">
              Assistir
              <PlayCircle size={18} />
            </span>
            <ChevronRight
              size={20}
              className="shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-[#046279] sm:hidden"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
