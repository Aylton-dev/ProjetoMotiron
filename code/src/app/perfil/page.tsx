"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../../hooks/auth";
import { supabaseProxy } from "../../lib/proxy"; 
import { Award, Clock, BookOpen, Download, User, ShieldCheck, LogOut, Loader2 } from "lucide-react";
import { GlassCard } from "@/app/components/GlassCard";

// Interface para estruturar os dados calculados dinamicamente
interface CursoProgresso {
  id: string;
  curso: string;
  cargaHoraria: string;
  conclusao: string;
  status: "disponivel" | "em_andamento";
  progresso: number;
  aulasRestantes: number;
  hash: string;
}

export default function PerfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const [usuario, setUsuario] = useState({
    nomeCompleto: "",
    email: ""
  });

  // Estados dinâmicos conectados ao banco de dados
  const [certificados, setCertificados] = useState<CursoProgresso[]>([]);
  const [stats, setStats] = useState({
    horasEstudadas: 0,
    cursosConcluidos: 0,
    certificadosEmitidos: 0
  });

  useEffect(() => {
    async function carregarDadosSessaoEProgresso() {
      try {
        // 1. Busca os dados de autenticação do usuário logado
        const { data: { user }, error } = await supabaseProxy.auth.getUser();

        if (error || !user) {
          router.push("/");
          return;
        }

        setUsuario({
          nomeCompleto: user.user_metadata?.full_name || "Funcionário Autorizado",
          email: user.email || ""
        });

        // 2. Localiza o employee correspondente na tabela associada
        const emp = await supabaseProxy
          .from('employees')
          .select('employee_id')
          .eq('auth_id', user.id)
          .single();

        if (!emp.data) {
          setLoadingUser(false);
          return;
        }

        const employeeId = emp.data.employee_id;

        // 3. Busca em paralelo os cursos cadastrados, matrículas do aluno, módulos e todas as aulas
        const [cursosRes, matriculasRes, modulosRes, aulasRes] = await Promise.all([
          supabaseProxy.from('courses').select('*'),
          supabaseProxy.from('enrollments').select('*').eq('employee_id', employeeId),
          supabaseProxy.modules.getAll(), // Buscando os módulos para fazer o cruzamento de IDs
          supabaseProxy.lessons.getAll()
        ]);

        if (cursosRes.data && matriculasRes.data && modulosRes.data && aulasRes.data) {
          const todosCursos = cursosRes.data;
          const asMatriculas = matriculasRes.data;
          const todosModulos = modulosRes.data;
          const todasAulas = aulasRes.data;

          let concluidosContador = 0;
          let totalAulasAssistidasGeral = 0;

          // Mapeia cada matrícula calculando matematicamente o progresso real
          const listaFormatada: CursoProgresso[] = asMatriculas.map((mat) => {
            const cursoInfo = todosCursos.find(c => c.course_id === mat.course_id);
            
            // CORREÇÃO AQUI: Primeiro pegamos os IDs de todos os módulos que pertencem a este curso
            const idsModulosDoCurso = todosModulos
              .filter(m => Number(m.course_id) === Number(mat.course_id))
              .map(m => m.module_id);

            // Agora filtramos as aulas cujo module_id pertence a este curso
            const aulasDoCurso = todasAulas.filter(aula => 
              idsModulosDoCurso.includes(aula.module_id)
            );

            // Tratamento seguro do array de aulas concluídas do banco
            const concluidasIds: number[] = typeof mat.completed_lessons === 'string'
              ? JSON.parse(mat.completed_lessons)
              : (mat.completed_lessons || []);

            const totalAulas = aulasDoCurso.length;
            
            // Conta quantas das aulas assistidas pertencem estritamente a este curso
            const assistidasNesteCurso = aulasDoCurso.filter(a => concluidasIds.map(Number).includes(Number(a.lesson_id))).length;
            totalAulasAssistidasGeral += assistidasNesteCurso;

            // Evita divisão por zero caso o curso ainda não possua aulas
            const porcentagemReal = totalAulas > 0 ? Math.min(Math.round((assistidasNesteCurso / totalAulas) * 100), 100) : 0;
            const concluido = porcentagemReal === 100 && totalAulas > 0;

            if (concluido) concluidosContador++;

            return {
              id: `cert-${mat.enrollment_id}`,
              curso: cursoInfo?.title || "Curso Desconhecido",
              cargaHoraria: cursoInfo?.duration ? `${cursoInfo.duration}h` : "40h",
              conclusao: concluido ? new Date(mat.created_at).toLocaleDateString('pt-BR') : "Incompleto",
              status: concluido ? "disponivel" : "em_andamento",
              progresso: porcentagemReal,
              aulasRestantes: Math.max(totalAulas - assistidasNesteCurso, 0),
              hash: `CERT-${mat.enrollment_id}-${mat.course_id}91`.toUpperCase()
            };
          });

          setCertificados(listaFormatada);

          // 4. Calcula e atualiza os blocos superiores de estatísticas (Stats)
          setStats({
            horasEstudadas: Math.round((totalAulasAssistidasGeral * 15) / 60) || 0, 
            cursosConcluidos: listaFormatada.length,
            certificadosEmitidos: concluidosContador
          });
        }

      } catch (err) {
        console.error("Erro ao carregar sessão e dados de progresso:", err);
      } finally {
        setLoadingUser(false);
      }
    }

    carregarDadosSessaoEProgresso();
  }, [router]);

  const handleLogoutClick = async () => {
    setLoading(true);
    setLogoutError(null);

    const result = await authService.deslogarFuncionario();

    if (result.success) {
      router.push("/");
    } else {
      setLogoutError(result.error);
      setLoading(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-white/70">
        <Loader2 className="animate-spin text-blue-400" size={40} />
        <p className="text-sm font-medium tracking-wide">Carregando dados do perfil...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* SEÇÃO 1: STATS / CONTADORES DINÂMICOS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <GlassCard className="p-5 flex items-center gap-4 bg-slate-900/20 border-white/10 rounded-2xl">
          <div className="p-3 bg-blue-500/20 text-blue-300 rounded-xl">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{stats.cursosConcluidos}</p>
            <p className="text-xs text-white/60 font-medium">Cursos em Andamento</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4 bg-slate-900/20 border-white/10 rounded-2xl">
          <div className="p-3 bg-teal-500/20 text-teal-300 rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{stats.horasEstudadas}h</p>
            <p className="text-xs text-white/60 font-medium">Horas Estimadas</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4 bg-slate-900/20 border-white/10 rounded-2xl">
          <div className="p-3 bg-purple-500/20 text-purple-300 rounded-xl">
            <Award size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{stats.certificadosEmitidos}</p>
            <p className="text-xs text-white/60 font-medium">Certificados Conquistados</p>
          </div>
        </GlassCard>
      </div>

      {/* SEÇÃO 2: GRID DO PERFIL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Bloco de Dados Reais do Aluno */}
        <div className="lg:col-span-1 space-y-4">
          <GlassCard className="p-6 bg-slate-900/30 border-white/10 rounded-[2rem] space-y-6">
            <div className="flex flex-col items-center text-center pb-4 border-b border-white/10">
              <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-teal-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20 mb-3">
                <User size={36} />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {usuario.nomeCompleto}
              </h2>
              <p className="text-xs text-white/50">{usuario.email}</p>
            </div>

            {/* Input dinâmico do nome do certificado */}
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
                Use seu nome oficial e sem erros, ele será impresso de forma definitiva nos seus documentos.
              </p>
            </div>

            {logoutError && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl text-center font-medium">
                ❌ {logoutError}
              </p>
            )}

            {/* Botão de Logout Dinâmico */}
            <div className="pt-2 border-t border-white/5">
              <button
                onClick={handleLogoutClick}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-300 font-bold text-sm rounded-xl transition disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <LogOut size={16} /> Sair da Conta
                  </>
                )}
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Bloco de Certificados e Andamento Dinâmicos */}
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
                  <div className="space-y-1 w-full sm:w-auto flex-1">
                    <h4 className="font-bold text-white group-hover:text-blue-200 transition text-base tracking-tight">
                      {cert.curso}
                    </h4>
                    
                    {cert.status === "disponivel" ? (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/60">
                        <span>Carga Horária: {cert.cargaHoraria}</span>
                        <span>Concluído em: {cert.conclusao}</span>
                        <span className="text-teal-300 flex items-center gap-0.5 font-medium">
                          <ShieldCheck size={12} /> Autenticado
                        </span>
                      </div>
                    ) : (
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

                  {cert.status === "disponivel" && (
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <button 
                        onClick={() => alert(`Gerando PDF oficial para o aluno ${usuario.nomeCompleto}.\nCódigo de Autenticação: ${cert.hash}`)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-400/30 hover:border-blue-400/60 rounded-xl text-xs font-bold text-blue-200 transition-all shadow-sm"
                      >
                        <Download size={14} /> Baixar Certificado
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {certificados.length === 0 && (
                <p className="text-sm text-white/40 text-center py-4">Você ainda não se matriculou em nenhum curso.</p>
              )}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}