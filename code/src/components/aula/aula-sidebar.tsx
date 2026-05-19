"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Lock,
  ListVideo,
  X,
} from "lucide-react";
import type { Aula, StatusAula } from "@/lib/types/aula";
import { ProgressoAluno } from "./progresso-aluno";

type AulaSidebarProps = {
  categoriaSlug: string;
  tituloCurso: string;
  aulas: Aula[];
  aulaAtualSlug: string;
  progressoPercentual: number;
  mobileAberta?: boolean;
  onFecharMobile?: () => void;
};

function IconeStatus({ status }: { status: StatusAula | "atual" }) {
  if (status === "concluida") {
    return (
      <CheckCircle2
        size={20}
        className="shrink-0 text-emerald-600 transition-transform duration-200"
      />
    );
  }
  if (status === "bloqueada") {
    return <Lock size={18} className="shrink-0 text-gray-400" />;
  }
  if (status === "atual") {
    return (
      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#046279]/30 motion-reduce:animate-none" />
        <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-[#046279]">
          <Circle size={10} className="fill-white text-white" />
        </span>
      </span>
    );
  }
  return <Circle size={20} className="shrink-0 text-gray-300" />;
}

function ListaAulas({
  categoriaSlug,
  aulas,
  aulaAtualSlug,
  onItemClick,
}: {
  categoriaSlug: string;
  aulas: Aula[];
  aulaAtualSlug: string;
  onItemClick?: () => void;
}) {
  return (
    <ul className="divide-y divide-gray-100">
      {aulas.map((aula, index) => {
        const ativa = aula.slug === aulaAtualSlug;
        const bloqueada = aula.status === "bloqueada";

        const conteudo = (
          <div
            className={`group relative flex gap-3 px-5 py-4 transition-all duration-200 ${
              ativa
                ? "bg-[#046279]/8 pl-4"
                : bloqueada
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-50 hover:pl-5"
            }`}
          >
            {ativa && (
              <span
                className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-[#046279]"
                aria-hidden
              />
            )}
            <IconeStatus status={ativa ? "atual" : aula.status} />
            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-sm font-medium transition-colors ${
                  ativa
                    ? "text-[#046279]"
                    : "text-gray-800 group-hover:text-[#046279]"
                }`}
              >
                {index + 1}. {aula.titulo}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">{aula.duracao}</p>
            </div>
          </div>
        );

        if (bloqueada) {
          return <li key={aula.slug}>{conteudo}</li>;
        }

        return (
          <li key={aula.slug}>
            <Link
              href={`/cursos/${categoriaSlug}/aulas/${aula.slug}`}
              aria-current={ativa ? "page" : undefined}
              onClick={onItemClick}
              className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#046279]/40 focus-visible:ring-inset"
            >
              {conteudo}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ConteudoSidebar({
  categoriaSlug,
  tituloCurso,
  aulas,
  aulaAtualSlug,
  progressoPercentual,
  onItemClick,
}: {
  categoriaSlug: string;
  tituloCurso: string;
  aulas: Aula[];
  aulaAtualSlug: string;
  progressoPercentual: number;
  onItemClick?: () => void;
}) {
  const concluidas = aulas.filter((a) => a.status === "concluida").length;

  return (
    <div className="flex flex-col gap-6">
      <ProgressoAluno
        percentual={progressoPercentual}
        concluidas={concluidas}
        total={aulas.length}
        tituloCurso={tituloCurso}
      />

      <nav className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
        <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
          <ListVideo size={18} className="text-[#046279]" />
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Conteúdo do curso
            </h2>
            <p className="text-xs text-gray-500">{aulas.length} aulas</p>
          </div>
        </div>

        <div className="max-h-[min(24rem,45vh)] overflow-y-auto overscroll-contain scroll-smooth xl:max-h-[min(28rem,50vh)]">
          <ListaAulas
            categoriaSlug={categoriaSlug}
            aulas={aulas}
            aulaAtualSlug={aulaAtualSlug}
            onItemClick={onItemClick}
          />
        </div>
      </nav>
    </div>
  );
}

export function AulaSidebar({
  categoriaSlug,
  tituloCurso,
  aulas,
  aulaAtualSlug,
  progressoPercentual,
  mobileAberta = false,
  onFecharMobile,
}: AulaSidebarProps) {
  const propsConteudo = {
    categoriaSlug,
    tituloCurso,
    aulas,
    aulaAtualSlug,
    progressoPercentual,
  };

  return (
    <>
      <aside className="hidden w-full flex-col xl:sticky xl:top-6 xl:flex xl:w-80 xl:shrink-0 xl:self-start">
        <div className="aula-animate-fade-in-up aula-delay-150">
          <ConteudoSidebar {...propsConteudo} onItemClick={onFecharMobile} />
        </div>
      </aside>

      {mobileAberta && (
        <div className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal>
          <button
            type="button"
            aria-label="Fechar menu de aulas"
            className="aula-animate-fade-in absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={onFecharMobile}
          />
          <aside className="aula-animate-slide-in-right absolute right-0 top-0 flex h-full w-full max-w-sm flex-col gap-5 overflow-y-auto bg-[#D6DCF0]/95 p-5 pt-6 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#046279]">
                Conteúdo da aula
              </h2>
              <button
                type="button"
                onClick={onFecharMobile}
                className="rounded-xl p-2 text-gray-600 transition hover:bg-white/80"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>
            <ConteudoSidebar
              {...propsConteudo}
              onItemClick={onFecharMobile}
            />
          </aside>
        </div>
      )}
    </>
  );
}
