"use client";

import { useState } from "react";
import { Award, Clock, BookOpen, Download, Share2, User, ShieldCheck } from "lucide-react";
import { GlassCard } from "@/app/components/GlassCard"; // Ajuste o caminho se necessário

export default function PerfilPage() {
  // Simulando dados do usuário logado
  const [usuario, setUsuario] = useState({
   nomeCompleto: "",
   email: ""
  });

  // Simulando histórico de cursos e certificados
  const conquistas = {
    horasEstudadas: 120,
    cursosConcluidos: 3,
    certificadosEmitidos: 2,
  };

  const certificados = [
    {
      id: "cert-1",
      curso: "Formação Frontend Avançada",
      cargaHoraria: "60h",
      conclusao: "12/04/2026",
      status: "disponivel",
      hash: "FRNT-8832-UX91"
    },
    {
      id: "cert-2",
      curso: "UI/UX Design Especialista",
      cargaHoraria: "40h",
      conclusao: "28/02/2026",
      status: "disponivel",
      hash: "UIUX-1049-LK82"
    },
    {
      id: "cert-3",
      curso: "Banco de Dados & SQL",
      cargaHoraria: "20h",
      conclusao: "Incompleto",
      status: "em_andamento",
      progresso: 85,
      aulasRestantes: 3
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* SEÇÃO 1: STATS / CONTADORES (Ficam no topo da página) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <GlassCard className="p-5 flex items-center gap-4 bg-slate-900/20 border-white/10 rounded-2xl">
          <div className="p-3 bg-blue-500/20 text-blue-300 rounded-xl">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{conquistas.cursosConcluidos}</p>
            <p className="text-xs text-white/60 font-medium">Cursos Concluídos</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4 bg-slate-900/20 border-white/10 rounded-2xl">
          <div className="p-3 bg-teal-500/20 text-teal-300 rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{conquistas.horasEstudadas}h</p>
            <p className="text-xs text-white/60 font-medium">Horas de Estudo</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4 bg-slate-900/20 border-white/10 rounded-2xl">
          <div className="p-3 bg-purple-500/20 text-purple-300 rounded-xl">
            <Award size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{conquistas.certificadosEmitidos}</p>
            <p className="text-xs text-white/60 font-medium">Certificados Conquistados</p>
          </div>
        </GlassCard>
      </div>

      {/* SEÇÃO 2: GRID DO PERFIL (Dados na esquerda, Certificados na direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Bloco de Dados do Aluno */}
        <div className="lg:col-span-1">
          <GlassCard className="p-6 bg-slate-900/30 border-white/10 rounded-[2rem] space-y-6">
            <div className="flex flex-col items-center text-center pb-4 border-b border-white/10">
              <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-teal-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20 mb-3">
                <User size={36} />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">{usuario.nomeCompleto}</h2>
              <p className="text-xs text-white/50">{usuario.email}</p>
            </div>

            {/* Input crucial do nome do certificado */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/80 tracking-wide uppercase">
                Nome para o Certificado
              </label>
              <input
                type="text"
                value={usuario.nomeCompleto}
                onChange={(e) => setUsuario({ ...usuario, nomeCompleto: e.target.value })}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition"
              />
              <p className="text-[11px] text-white/50 leading-relaxed">
                 **Atenção:** Use seu nome oficial e sem erros, ele será impresso de forma definitiva nos seus documentos.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Bloco de Certificados e Andamento */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6 bg-slate-900/20 border-white/10 rounded-[2rem]">
            <h3 className="text-lg font-bold text-white tracking-tight mb-5 flex items-center gap-2">
              <Award className="text-blue-300" size={20} /> Meus Certificados & Conquistas
            </h3>

            <div className="space-y-4">
              {certificados.map((cert) => (
                <div 
                  key={cert.id} 
                  className="p-4 bg-white/[0.02] border border-white/5 hover:border-white/15 rounded-2xl transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-white group-hover:text-blue-200 transition text-base tracking-tight">
                      {cert.curso}
                    </h4>
                    
                    {cert.status === "disponivel" ? (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/60">
                        <span>Carga Horária: **{cert.cargaHoraria}**</span>
                        <span>Concluído em: {cert.conclusao}</span>
                        <span className="text-teal-300 flex items-center gap-0.5 font-medium">
                          <ShieldCheck size={12} /> Autenticado
                        </span>
                      </div>
                    ) : (
                      // Exibição caso o curso esteja quase terminando
                      <div className="w-full sm:w-64 pt-1">
                        <div className="flex justify-between text-xs text-white/60 mb-1">
                          <span>Faltam {cert.aulasRestantes} aulas para o certificado</span>
                          <span>{cert.progresso}%</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-400 to-teal-400 h-full rounded-full" 
                            style={{ width: `${cert.progresso}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Botões de Ação do lado direito */}
                  {cert.status === "disponivel" && (
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <button 
                        onClick={() => alert(`Gerando PDF para o código hash: ${cert.hash}`)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-400/30 hover:border-blue-400/60 rounded-xl text-xs font-bold text-blue-200 transition-all shadow-sm"
                      >
                        <Download size={14} /> Baixar Certificado
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}