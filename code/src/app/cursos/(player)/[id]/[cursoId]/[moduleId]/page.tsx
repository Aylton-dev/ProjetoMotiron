'use client';

import { use, useEffect, useState, useRef } from "react";
import { supabaseProxy } from "@/lib/proxy";
import type { Modules } from "@/types/modules";
import type { Lessons } from "@/types/lessons";
import { Loader2, ChevronLeft, Play, BookOpen, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

// Injeta com segurança os tipos no escopo global do compilador
declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

function extrairVideoId(url: string): string {
  if (!url) return "";
  let videoId = "";
  if (url.includes("youtube.com/watch?v=")) {
    videoId = url.split("v=")[1]?.split("&")[0];
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  } else if (url.includes("youtube.com/embed/")) {
    return url.split("embed/")[1]?.split("?")[0];
  }
  return videoId;
}

interface TelaModuloProps {
  params: Promise<{ id: string; cursoId: string; moduleId: string }>;
}

export default function TelaReproducaoAula({ params }: TelaModuloProps) {
  // Desestrutura os parâmetros da sua estrutura real de pastas [id]/[cursoId]/[moduleId]
  const { id, cursoId, moduleId } = use(params);

  const [modulo, setModulo] = useState<Modules | null>(null);
  const [aulas, setAulas] = useState<Lessons[]>([]);
  const [aulaAtiva, setAulaAtiva] = useState<Lessons | null>(null);
  const [loading, setLoading] = useState(true);

  const [totalAulasCurso, setTotalAulasCurso] = useState<number>(0);
  const [aulasConcluidasIds, setAulasConcluidasIds] = useState<number[]>([]);
  const [exibirBotaoAvancar, setExibirBotaoAvancar] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState<number | null>(null);

  const playerRef = useRef<any>(null);
  const iframeId = "youtube-player-iframe";

  // 1. Carrega scripts e informações das tabelas do curso
  useEffect(() => {
    async function carregarDados() {
      try {
        const idDoModulo = Number(moduleId);

        // Busca detalhes do módulo
        const moduloResult = await supabaseProxy.modules.getById(idDoModulo);
        
        if (moduloResult.success && moduloResult.data) {
          const dadosModulo = moduloResult.data;
          setModulo(dadosModulo);

          // Busca todas as aulas
          const aulasResult = await supabaseProxy.lessons.getAll();
          if (aulasResult.success && aulasResult.data) {
            // Filtra as aulas do módulo atual
            const filtradas = aulasResult.data
              .filter((aula) => aula.module_id === idDoModulo)
              .sort((a, b) => a.order_index - b.order_index);
            
            setAulas(filtradas);

            if (filtradas.length > 0) {
              setAulaAtiva(filtradas[0]);
            }

            if (dadosModulo.course_id) {
              const modulosResult = await supabaseProxy.modules.getAll();
              if (modulosResult.success && modulosResult.data) {
                const idsModulosDoCurso = modulosResult.data
                  .filter((m) => m.course_id === dadosModulo.course_id)
                  .map((m) => m.module_id);

                const todasAulasDoCurso = aulasResult.data.filter((aula) =>
                  idsModulosDoCurso.includes(aula.module_id)
                );
                setTotalAulasCurso(todasAulasDoCurso.length);
              }
            }
          }

          // Recupera os dados da matrícula (enrollment_id)
          const authUser = await supabaseProxy.auth.getUser();
          if (authUser.data?.user) {
            const emp = await supabaseProxy
              .from('employees')
              .select('employee_id')
              .eq('auth_id', authUser.data.user.id)
              .single();

            if (emp.data && dadosModulo.course_id) {
              const enrollment = await supabaseProxy
                .from('enrollments')
                .select('enrollment_id, completed_lessons')
                .eq('employee_id', emp.data.employee_id)
                .eq('course_id', dadosModulo.course_id)
                .single();

              if (enrollment.data) {
                setEnrollmentId(enrollment.data.enrollment_id);
                if (enrollment.data.completed_lessons) {
                  const dadosConcluidas = typeof enrollment.data.completed_lessons === 'string' 
                    ? JSON.parse(enrollment.data.completed_lessons)
                    : enrollment.data.completed_lessons;
                  setAulasConcluidasIds(Array.isArray(dadosConcluidas) ? dadosConcluidas : []);
                }
              }
            }
          }
        } else {
          throw new Error("Módulo não encontrado no banco de dados.");
        }

      } catch (err) {
        console.error("Erro ao carregar dados da aula:", err);
      } finally {
        setLoading(false);
      }
    }

    if (moduleId) carregarDados();
  }, [moduleId]);

  // 2. Monitoramento seguro da API do YouTube
  useEffect(() => {
  if (!aulaAtiva) return;

  setExibirBotaoAvancar(aulasConcluidasIds.includes(aulaAtiva.lesson_id));

  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  }

  let timeoutId: NodeJS.Timeout;

  const criarPlayer = () => {
    const targetElement = document.getElementById(iframeId);
    
    // Só inicializa se o elemento existir na DOM real
    if (window.YT && window.YT.Player && targetElement) {
      if (playerRef.current && playerRef.current.destroy) {
        try { playerRef.current.destroy(); } catch (e) {}
      }

      playerRef.current = new window.YT.Player(iframeId, {
        events: {
          'onStateChange': async (event: any) => {
  if (event.data === 0 && aulaAtiva) { // Vídeo terminou
    setExibirBotaoAvancar(true);
    
    if (enrollmentId) {
      //  Busca o histórico MAIS RECENTE direto do banco para não apagar dados antigos
      const { data: atual } = await supabaseProxy
        .from('enrollments')
        .select('completed_lessons')
        .eq('enrollment_id', enrollmentId)
        .single();

      let idsDoBanco: number[] = [];
      if (atual?.completed_lessons) {
        const parsed = typeof atual.completed_lessons === 'string'
          ? JSON.parse(atual.completed_lessons)
          : atual.completed_lessons;
        idsDoBanco = Array.isArray(parsed) ? parsed.map(Number) : [];
      }

      //  Se essa aula já não estiver lá, adiciona mantendo as anteriores!
      if (!idsDoBanco.includes(Number(aulaAtiva.lesson_id))) {
        const novasConcluidas = [...idsDoBanco, Number(aulaAtiva.lesson_id)];
        
        // Atualiza o estado local e o banco de dados de forma cumulativa
        setAulasConcluidasIds(novasConcluidas);
        
        const novoProgresso = Math.round((novasConcluidas.length / totalAulasCurso) * 100);
        
        await supabaseProxy.updateData('enrollments', 'enrollment_id', enrollmentId, {
          progress: novoProgresso,
          completed_lessons: novasConcluidas // Salva a lista completa: [5, 6, 7, 8]
        });
      }
    }
  }
}
        }
      });
    } else {
      timeoutId = setTimeout(criarPlayer, 300);
    }
  };

  if (window.YT && window.YT.Player) {
    criarPlayer();
  } else {
    window.onYouTubeIframeAPIReady = () => {
      criarPlayer();
    };
  }

  return () => {
    clearTimeout(timeoutId);
    if (playerRef.current && playerRef.current.destroy) {
      try { 
        playerRef.current.destroy(); 
        playerRef.current = null;
      } catch (e) {}
    }
  };
}, [aulaAtiva]); // Reduzido as dependências para evitar loops agressivos que causam o removeChild

  const irParaProximaAula = () => {
    if (!aulaAtiva) return;
    const indexAtual = aulas.findIndex(a => a.lesson_id === aulaAtiva.lesson_id);
    if (indexAtual !== -1 && indexAtual + 1 < aulas.length) {
      setAulaAtiva(aulas[indexAtual + 1]);
      setExibirBotaoAvancar(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a]">
        <Loader2 className="animate-spin text-[#046279]" size={40} />
        <p className="text-gray-400 text-sm mt-2">Preparando o player de vídeo...</p>
      </div>
    );
  }

  if (!modulo || aulas.length === 0) {
    return (
      <div className="p-6 text-center min-h-screen flex flex-col items-center justify-center bg-[#0f172a]">
        <p className="text-gray-400 mb-4">Nenhum conteúdo encontrado para este módulo.</p>
        <Link href={`/cursos/${id}/${cursoId}`} className="text-[#046279] hover:underline flex items-center gap-2">
          <ChevronLeft size={16} /> Voltar ao curso
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0a0f1d] relative">
      
      <header className="h-16 border-b border-gray-800 bg-[#0f172a] px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <Link 
            href={`/cursos/${id}/${cursoId}`} 
            className="p-2 hover:bg-gray-800 rounded-xl transition text-gray-400 hover:text-white"
            title="Voltar para os módulos"
          >
            <ChevronLeft size={22} />
          </Link>
          <div>
            <span className="text-xs font-semibold text-[#046279] block uppercase tracking-wider">
              {modulo.title}
            </span>
            <h1 className="text-sm font-bold text-gray-200 line-clamp-1">
              {aulaAtiva?.order_index}. {aulaAtiva?.title}
            </h1>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 no-scrollbar pb-24">
          
          {aulaAtiva && (
            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-800 bg-black">
              <iframe
                key={aulaAtiva.video_url}
                id={iframeId}
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${extrairVideoId(aulaAtiva.video_url)}?enablejsapi=1&rel=0&modestbranding=1`}
                title={aulaAtiva.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          <div className="bg-[#0f172a] border border-gray-800/60 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white">{aulaAtiva?.title}</h2>
            
            {aulaAtiva?.description && (
              <p className="text-gray-400 mt-3 text-sm leading-relaxed border-t border-gray-800 pt-4">
                {aulaAtiva.description}
              </p>
            )}

            {aulaAtiva?.materials_url && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <a 
                  href={aulaAtiva.materials_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 px-3 py-1.5 rounded-lg transition"
                >
                  <BookOpen size={14} /> Acessar Material Complementar
                </a>
              </div>
            )}
          </div>
        </div>

        <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-800 bg-[#0f172a] flex flex-col h-full overflow-y-auto no-scrollbar">
          <div className="p-4 border-b border-gray-800 bg-[#0d1325]">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Conteúdo do Módulo</h3>
            <p className="text-xs text-gray-500 mt-1">{aulas.length} videoaulas disponíveis</p>
          </div>

          <div className="flex-1 divide-y divide-gray-800/50">
            {aulas.map((aula, idx) => {
              const estaAtiva = aula.lesson_id === aulaAtiva?.lesson_id;
              const aulaAnteriorConcluida = idx === 0 || aulasConcluidasIds.includes(aulas[idx - 1].lesson_id);
              const estaBloqueada = !aulaAnteriorConcluida && !aulasConcluidasIds.includes(aula.lesson_id);

              return (
                <button
                  key={aula.lesson_id}
                  disabled={estaBloqueada}
                  onClick={() => setAulaAtiva(aula)}
                  className={`w-full text-left p-4 flex items-start gap-3 transition ${
                    estaAtiva 
                      ? "bg-[#046279]/10 border-l-4 border-[#046279]" 
                      : "hover:bg-gray-800/40 border-l-4 border-transparent"
                  } ${estaBloqueada ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    estaAtiva ? "bg-[#046279] text-white" : "bg-gray-800 text-gray-500"
                  }`}>
                    {aulasConcluidasIds.includes(aula.lesson_id) ? (
                      <CheckCircle size={14} className="text-teal-400" />
                    ) : (
                      <Play size={12} fill="currentColor" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium mb-0.5 ${estaAtiva ? "text-[#046279]" : "text-gray-500"}`}>
                      Aula {aula.order_index} {estaBloqueada && "🔒"}
                    </p>
                    <h4 className={`text-sm font-semibold truncate ${estaAtiva ? "text-white" : "text-gray-300"}`}>
                      {aula.title}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      {exibirBotaoAvancar && aulas.findIndex(a => a.lesson_id === aulaAtiva?.lesson_id) + 1 < aulas.length && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <button
            onClick={irParaProximaAula}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-full shadow-2xl flex items-center gap-2 transition transform hover:scale-105 backdrop-blur-sm bg-opacity-95"
          >
            Avançar para Próxima Aula <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}