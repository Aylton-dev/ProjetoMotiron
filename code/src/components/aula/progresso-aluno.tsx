"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

type ProgressoAlunoProps = {
  percentual: number;
  concluidas: number;
  total: number;
  tituloCurso: string;
};

function ProgressoCircular({ percentual }: { percentual: number }) {
  const raio = 36;
  const circunferencia = 2 * Math.PI * raio;
  const offset = circunferencia - (percentual / 100) * circunferencia;

  return (
    <div className="relative flex h-[88px] w-[88px] shrink-0 items-center justify-center">
      <svg className="-rotate-90" width="88" height="88" aria-hidden>
        <circle
          cx="44"
          cy="44"
          r={raio}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        <circle
          cx="44"
          cy="44"
          r={raio}
          fill="none"
          stroke="#046279"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <span className="absolute text-lg font-bold tabular-nums text-[#046279]">
        {percentual}%
      </span>
    </div>
  );
}

export function ProgressoAluno({
  percentual,
  concluidas,
  total,
  tituloCurso,
}: ProgressoAlunoProps) {
  const [exibido, setExibido] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setExibido(percentual), 80);
    return () => window.clearTimeout(timer);
  }, [percentual]);

  return (
    <div className="aula-animate-fade-in-up overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="flex items-start gap-5">
        <ProgressoCircular percentual={exibido} />

        <div className="min-w-0 flex-1 pt-1">
          <div className="mb-1 flex items-center gap-2 text-[#046279]">
            <TrendingUp size={18} className="shrink-0" />
            <p className="text-sm font-semibold text-gray-900">Seu progresso</p>
          </div>
          <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-gray-500">
            {tituloCurso}
          </p>

          <div className="aula-progress-shimmer relative h-3 overflow-hidden rounded-full bg-[#D6DCF0]">
            <div
              className="relative h-full rounded-full bg-gradient-to-r from-[#046279] to-[#046279]/80 transition-[width] duration-1000 ease-out"
              style={{ width: `${exibido}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-[#046279]">{concluidas}</span> de{" "}
              {total} aulas
            </p>
            <div className="flex gap-1">
              {Array.from({ length: total }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    i < concluidas
                      ? "scale-110 bg-[#046279]"
                      : i === concluidas
                        ? "scale-125 bg-[#046279]/40 ring-2 ring-[#046279]/30"
                        : "bg-gray-200"
                  }`}
                  aria-hidden
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
