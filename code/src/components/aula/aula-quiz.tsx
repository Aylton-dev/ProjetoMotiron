import { useState } from "react";
import { ClipboardCheck } from "lucide-react";
import type { PerguntaQuiz } from "@/lib/types/aula";

type AulaQuizProps = {
  perguntas: PerguntaQuiz[];
  onConcluir?: () => void;
};

export function AulaQuiz({ perguntas, onConcluir }: AulaQuizProps) {
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [enviado, setEnviado] = useState(false);

  if (perguntas.length === 0) return null;

  const totalRespondidas = Object.keys(respostas).length;
const todasRespondidas = totalRespondidas === perguntas.length;

  const acertos = perguntas.filter(
    (p) => respostas[p.id] === p.respostaCorretaId,
  ).length;

  const erros = perguntas.length - acertos;
  const porcentagem = Math.round((acertos / perguntas.length) * 100);

  function enviar() {
    if (!todasRespondidas) return;
  
    setEnviado(true);
    onConcluir?.();
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
              Responda as perguntas para revisar o conteúdo. Ao final, você verá
              seus acertos, erros e aproveitamento.
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
                      checked={respostas[pergunta.id] === opcao.id}
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

                    {errada && (
                      <span className="ml-auto text-xs font-medium text-red-600">
                        Sua resposta
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
        <div className="aula-animate-fade-in-up mt-8 rounded-xl bg-emerald-50 px-4 py-3.5 text-sm text-emerald-800">
          <p className="font-semibold">Resultado do quiz</p>

          <p className="mt-1">
            Acertos: {acertos} de {perguntas.length}
          </p>

          <p>Erros: {erros}</p>

          <p>Aproveitamento: {porcentagem}%</p>

          <p className="mt-2 text-xs">
            Você pode continuar para a próxima videoaula mesmo que tenha errado
            alguma questão.
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        {!enviado && (
          <button
            type="button"
            onClick={enviar}
            disabled={false}
            className="rounded-xl bg-[#046279] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#035566] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-sm"
          >
            Enviar respostas
          </button>
        )}
      </div>
    </section>
  );
}