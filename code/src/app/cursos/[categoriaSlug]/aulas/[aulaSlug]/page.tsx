import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAula,
  getTodasRotasAulas,
  resolverCategoriaSlug,
} from "@/lib/data/cursos-catalogo";
import { AulaView } from "@/components/aula/aula-view";

type PageProps = {
  params: Promise<{ categoriaSlug: string; aulaSlug: string }>;
};

export function generateStaticParams() {
  return getTodasRotasAulas();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { categoriaSlug: paramCat, aulaSlug } = await params;
  const categoriaSlug = resolverCategoriaSlug(paramCat);
  if (!categoriaSlug) return { title: "Aula não encontrada | Motiron EAD" };
  const dados = getAula(categoriaSlug, aulaSlug);
  if (!dados) return { title: "Aula não encontrada | Motiron EAD" };
  return {
    title: `${dados.aula.titulo} | ${dados.categoria.nome}`,
    description: dados.aula.descricao,
  };
}

export default async function PaginaAula({ params }: PageProps) {
  const { categoriaSlug: paramCat, aulaSlug } = await params;
  const categoriaSlug = resolverCategoriaSlug(paramCat);
  if (!categoriaSlug) notFound();

  const dados = getAula(categoriaSlug, aulaSlug);
  if (!dados) notFound();

  const { categoria, aula, proximaAula, progressoPercentual } = dados;

  return (
    <AulaView
      categoriaSlug={categoriaSlug}
      categoria={categoria}
      aula={aula}
      proximaAula={proximaAula}
      progressoPercentual={progressoPercentual}
    />
  );
}
