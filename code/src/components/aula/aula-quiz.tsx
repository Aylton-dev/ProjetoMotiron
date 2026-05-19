"use client";

import { useState } from "react";
import { ClipboardCheck, RotateCcw } from "lucide-react";
import type { PerguntaQuiz } from "@/lib/types/aula";

type AulaQuizProps = {
  perguntas: PerguntaQuiz[];
  onConcluir?: () => void;
};

export function AulaQuiz({ perguntas, onConcluir }: AulaQuizProps) {
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [enviado, setEnviado] = useState(false);

  if (perguntas.length === 0) return null;

  const todasRespondidas = perguntas.every((p) => respostas[p.id]);
  const acertos = perguntas.filter(
    (p) => respostas[p.id] === p.respostaCorretaId,
  ).length;
  const aprovado = acertos === perguntas.length;

  function enviar() {
    if (!todasRespondidas) return;
    setEnviado(true);
    if (aprovado) onConcluir?.();
  }

  return (
    <section className="aula-animate-fade-in-up aula-delay-225 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-[#046279]/10 p-2.5 text-[#046279] transition-transform duration-300 hover:scale-105">
            <ClipboardCheck size={22} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Quiz da aula
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              Responda para consolidar o conteúdo antes de avançar.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-[#D6DCF0] px-3 py-1.5 text-xs font-medium text-[#046279]">
          {perguntas.length}{" "}
          {perguntas.length === 1 ? "pergunta" : "perguntas"}
        </span>
      </div>

      <div className="space-y-10">
        {perguntas.map((pergunta, indice) => (
          <fieldset
            key={pergunta.id}
            className="space-y-3 aula-animate-fade-in-up"
            style={{ animationDelay: `${indice * 75}ms` }}
          >
            <legend className="text-sm font-medium text-gray-900">
              {indice + 1}. {pergunta.pergunta}
            </legend>
            <div className="space-y-2.5">
              {pergunta.opcoes.map((opcao) => {
                const selecionada = respostas[pergunta.id] === opcao.id;
                const mostrarResultado = enviado;
                const correta = opcao.id === pergunta.respostaCorretaId;
                const errada = mostrarResultado && selecionada && !correta;

                let classes =
                  "flex w-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all duration-200 ";
                if (mostrarResultado && correta) {
                  classes += "border-emerald-300 bg-emerald-50 scale-[1.01]";
                } else if (errada) {
                  classes += "border-red-300 bg-red-50";
                } else if (selecionada) {
                  classes +=
                    "border-[#046279] bg-[#046279]/5 shadow-sm scale-[1.01]";
                } else {
                  classes +=
                    "border-gray-200 hover:border-[#046279]/40 hover:bg-gray-50 hover:shadow-sm active:scale-[0.99]";
                }

                return (
                  <label key={opcao.id} className={classes}>
                    <input
                      type="radio"
                      name={pergunta.id}
                      value={opcao.id}
                      checked={selecionada}
                      disabled={enviado}
                      onChange={() =>
                        setRespostas((prev) => ({
                          ...prev,
                          [pergunta.id]: opcao.id,
                        }))
                      }
                      className="h-4 w-4 accent-[#046279]"
                    />
                    <span className="text-gray-800">{opcao.texto}</span>
                    {mostrarResultado && correta && (
                      <span className="ml-auto text-xs font-medium text-emerald-600">
                        Correta
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {enviado && (
        <div
          className={`aula-animate-fade-in-up mt-8 rounded-xl px-4 py-3.5 text-sm ${
            aprovado
              ? "bg-emerald-50 text-emerald-800"
              : "bg-amber-50 text-amber-800"
          }`}
        >
          {aprovado
            ? "Parabéns! Você acertou todas as questões."
            : `Você acertou ${acertos} de ${perguntas.length}. Revise o conteúdo e tente novamente.`}
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        {!enviado ? (
          <button
            type="button"
            onClick={enviar}
            disabled={!todasRespondidas}
            className="rounded-xl bg-[#046279] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#035566] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-sm"
          >
            Enviar respostas
          </button>
        ) : !aprovado ? (
          <button
            type="button"
            onClick={() => {
              setRespostas({});
              setEnviado(false);
            }}
            className="flex items-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-[#046279]/30 hover:bg-gray-50 active:scale-[0.98]"
          >
            <RotateCcw size={16} />
            Tentar novamente
          </button>
        ) : null}
      </div>
    </section>
  );
}
