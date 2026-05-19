"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  ListVideo,
} from "lucide-react";
import type { Aula, Categoria } from "@/lib/types/aula";
import { VideoPlayer } from "./video-player";
import { AulaSidebar } from "./aula-sidebar";
import { AulaQuiz } from "./aula-quiz";

type AulaViewProps = {
  categoriaSlug: string;
  categoria: Categoria;
  aula: Aula;
  proximaAula?: Aula;
  progressoPercentual: number;
};

export function AulaView({
  categoriaSlug,
  categoria,
  aula,
  proximaAula,
  progressoPercentual,
}: AulaViewProps) {
  const [quizAprovado, setQuizAprovado] = useState(
    aula.quiz.length === 0 || aula.status === "concluida",
  );
  const [sidebarMobile, setSidebarMobile] = useState(false);

  const temQuiz = aula.quiz.length > 0;
  const podeAvancar = !temQuiz || quizAprovado;

  useEffect(() => {
    setSidebarMobile(false);
    setQuizAprovado(aula.quiz.length === 0 || aula.status === "concluida");
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [aula.slug, aula.quiz.length, aula.status]);

  useEffect(() => {
    if (!sidebarMobile) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarMobile(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [sidebarMobile]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-[#D6DCF0]/40">
      <header className="sticky top-0 z-30 border-b border-gray-200/80 bg-white/90 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link
            href={`/cursos/${categoriaSlug}`}
            className="flex items-center gap-2 rounded-lg px-1 py-0.5 text-sm font-medium text-[#046279] transition-colors hover:bg-[#046279]/5 hover:underline"
          >
            <ArrowLeft size={16} />
            Voltar ao curso
          </Link>
          <span className="hidden max-w-[50%] truncate text-sm text-gray-500 sm:block">
            {categoria.nome}
          </span>
          <button
            type="button"
            onClick={() => setSidebarMobile(true)}
            className="flex items-center gap-2 rounded-xl border border-[#046279]/20 bg-[#D6DCF0] px-3 py-2 text-xs font-semibold text-[#046279] transition-all duration-200 hover:bg-[#D6DCF0]/80 active:scale-95 xl:hidden"
          >
            <ListVideo size={16} />
            Aulas
          </button>
        </div>
      </header>

      <div className="border-b border-gray-200/60 bg-white/70 px-4 py-3 backdrop-blur-sm xl:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#D6DCF0]">
            <div
              className="h-full rounded-full bg-[#046279] transition-[width] duration-700 ease-out"
              style={{ width: `${progressoPercentual}%` }}
            />
          </div>
          <span className="shrink-0 text-xs font-bold tabular-nums text-[#046279]">
            {progressoPercentual}%
          </span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-start xl:gap-12">
          <main className="min-w-0 flex-1 space-y-8 pb-20 sm:space-y-10 xl:pb-0">
            <div className="aula-animate-fade-in-up">
              <VideoPlayer src={aula.videoUrl} titulo={aula.titulo} />
            </div>

            <article className="aula-animate-fade-in-up aula-delay-75 space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full bg-[#D6DCF0] px-3 py-1.5 text-xs font-medium text-[#046279]">
                  <Clock size={14} />
                  {aula.duracao}
                </span>
                {aula.status === "concluida" && (
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700">
                    <CheckCircle2 size={14} />
                    Concluída
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold leading-tight text-[#046279] sm:text-3xl">
                {aula.titulo}
              </h1>
              <p className="max-w-3xl text-base leading-8 text-gray-600">
                {aula.descricao}
              </p>
            </article>

            <AulaQuiz
              perguntas={aula.quiz}
              onConcluir={() => setQuizAprovado(true)}
            />

            <div
              className={`aula-animate-fade-in-up aula-delay-300 flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 sm:flex-row sm:items-center sm:justify-between sm:p-8 ${
                podeAvancar && proximaAula ? "ring-2 ring-[#046279]/15" : ""
              }`}
            >
              <p className="text-sm leading-relaxed text-gray-500">
                {temQuiz && !quizAprovado
                  ? "Complete o quiz para desbloquear a próxima aula."
                  : proximaAula
                    ? "Pronto para continuar?"
                    : "Você chegou à última aula disponível."}
              </p>
              {proximaAula && proximaAula.status !== "bloqueada" ? (
                <Link
                  href={`/cursos/${categoriaSlug}/aulas/${proximaAula.slug}`}
                  className={`group inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold transition-all duration-200 ${
                    podeAvancar
                      ? "bg-[#046279] text-white shadow-md hover:bg-[#035566] hover:shadow-lg active:scale-[0.98]"
                      : "pointer-events-none cursor-not-allowed bg-gray-200 text-gray-500"
                  }`}
                  aria-disabled={!podeAvancar}
                  onClick={(e) => {
                    if (!podeAvancar) e.preventDefault();
                  }}
                >
                  Próxima aula
                  <ArrowRight
                    size={18}
                    className={
                      podeAvancar
                        ? "transition-transform duration-200 group-hover:translate-x-0.5"
                        : ""
                    }
                  />
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="h-12 cursor-not-allowed rounded-xl bg-gray-200 px-6 text-sm font-semibold text-gray-500"
                >
                  Próxima aula indisponível
                </button>
              )}
            </div>
          </main>

          <AulaSidebar
            categoriaSlug={categoriaSlug}
            tituloCurso={categoria.nome}
            aulas={categoria.aulas}
            aulaAtualSlug={aula.slug}
            progressoPercentual={progressoPercentual}
            mobileAberta={sidebarMobile}
            onFecharMobile={() => setSidebarMobile(false)}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setSidebarMobile(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#046279] text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#035566] hover:shadow-xl active:scale-95 xl:hidden"
        aria-label="Abrir lista de aulas"
      >
        <ListVideo size={22} />
      </button>
    </div>
  );
}
