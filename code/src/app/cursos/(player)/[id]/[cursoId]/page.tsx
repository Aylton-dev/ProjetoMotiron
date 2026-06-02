'use client';

import { use, useEffect, useState } from "react";
import { supabaseProxy } from "@/lib/proxy";
import type { Modules } from "@/types/modules";
import type { Lessons } from "@/types/lessons";
import { Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/app/components/Sidebar";

interface TelaModulosProps {
  params: Promise<{ id: string; cursoId: string }>;
}

export default function TelaListagemModulos({ params }: TelaModulosProps) {
  const { id, cursoId } = use(params); // cursoId aqui é "formacao-frontend-avancada"
  const router = useRouter();

  const [modulos, setModulos] = useState<Modules[]>([]);
  const [todasAulas, setTodasAulas] = useState<Lessons[]>([]);
  const [aulasConcluidasIds, setAulasConcluidasIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Função auxiliar para transformar o título do banco em slug e comparar com a URL
  const normalizarSlug = (texto: string) => {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/[^\w\s-]/g, "")       // Remove caracteres especiais
      .replace(/\s+/g, "-")           // Substitui espaços por hífen
      .replace(/-+/g, "-")            // Remove hífens duplicados
      .trim();
  };

  useEffect(() => {
    async function carregarDadosDoCurso() {
      try {
        // 1. Primeiro, buscamos todos os cursos para descobrir qual ID possui o slug da URL
        const cursosResult = await supabaseProxy.from('courses').select('course_id, title');
        
        if (!cursosResult.data) {
          console.error("Nenhum curso encontrado no banco.");
          setLoading(false);
          return;
        }

        // Encontra o curso correto comparando o slug gerado com o cursoId da URL
        const cursoEncontrado = cursosResult.data.find(
          (c) => normalizarSlug(c.title) === cursoId || String(c.course_id) === cursoId
        );

        if (!cursoEncontrado) {
          console.error("Curso correspondente não encontrado para o slug:", cursoId);
          setLoading(false);
          return;
        }

        const idDoCursoReal = cursoEncontrado.course_id;

        //  Busca e filtra os módulos usando o ID numérico correto do curso
        const modulosResult = await supabaseProxy.modules.getAll();
        if (modulosResult.success && modulosResult.data) {
          const filtrados = modulosResult.data
            .filter((m) => Number(m.course_id) === Number(idDoCursoReal))
            .sort((a, b) => Number(a.order_index) - Number(b.order_index));
          setModulos(filtrados);
        }

        //  Busca todas as videoaulas do sistema
        const aulasResult = await supabaseProxy.lessons.getAll();
        if (aulasResult.success && aulasResult.data) {
          setTodasAulas(aulasResult.data);
        }

        //  Busca o progresso (aulas concluídas) do aluno logado
        const authUser = await supabaseProxy.auth.getUser();
        if (authUser.data?.user) {
          const emp = await supabaseProxy
            .from('employees')
            .select('employee_id')
            .eq('auth_id', authUser.data.user.id)
            .single();

          if (emp.data) {
            const enrollment = await supabaseProxy
              .from('enrollments')
              .select('completed_lessons')
              .eq('employee_id', emp.data.employee_id)
              .eq('course_id', idDoCursoReal)
              .single();

            if (enrollment.data?.completed_lessons) {
              const dadosConcluidas = typeof enrollment.data.completed_lessons === 'string'
                ? JSON.parse(enrollment.data.completed_lessons)
                : enrollment.data.completed_lessons;
              
              setAulasConcluidasIds(Array.isArray(dadosConcluidas) ? dadosConcluidas.map(Number) : []);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do curso:", error);
      } finally {
        setLoading(false);
      }
    }

    if (cursoId) carregarDadosDoCurso();
  }, [cursoId]);

  // Função que valida se todas as aulas de um módulo específico foram assistidas
  const verificarModuloConcluido = (moduleId: number) => {
    const aulasDoModulo = todasAulas.filter(aula => Number(aula.module_id) === Number(moduleId));
    if (aulasDoModulo.length === 0) return false;
    return aulasDoModulo.every(aula => aulasConcluidasIds.includes(Number(aula.lesson_id)));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#046279]">
        <Loader2 className="animate-spin text-white" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#046279] relative overflow-x-hidden flex flex-col font-sans text-white">
    <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-[120px] pointer-events-none" />
    <div className="absolute bottom-[0%] right-[0%] w-[400px] h-[400px] bg-teal-300/20 rounded-full blur-[100px] pointer-events-none" />
    
          {/* NAVBAR GLASSMISM NO TOPO */}
          <Sidebar />
      
      {/* SEU HEADER ORIGINAL COMPLETO */}
      <div className="mb-8">
        <Link href="/cursos" className="text-white/80 hover:text-white flex items-center gap-2 mb-4 text-sm">
          <ChevronLeft size={16} /> Voltar para categorias
        </Link>
        <span className="text-white/60 text-sm block">Categoria Selecionada</span>
        <h1 className="text-3xl font-bold">Cursos De Frontend</h1>
      </div>

      {/* SUA ESTRUTURA VISUAL DE BOTÕES ARREDONDADOS ORIGINAL */}
      <div className="max-w-2xl mx-auto space-y-4 pt-12">
        {modulos.map((mod, index) => {
          // Lógica de bloqueio sequencial baseada no order_index
          const moduloAnterior = index > 0 ? modulos[index - 1] : null;
          const estaBloqueado = moduloAnterior ? !verificarModuloConcluido(moduloAnterior.module_id) : false;

          return (
            <button
              key={mod.module_id}
              disabled={estaBloqueado}
              onClick={() => {
                router.push(`/cursos/${id}/${cursoId}/${mod.module_id}`);
              }}
              className={`w-full text-left p-6 rounded-3xl transition flex items-center justify-between group ${
                estaBloqueado
                  ? "bg-white/5 opacity-40 cursor-not-allowed border border-white/10"
                  : "bg-white/10 hover:bg-white/15 border border-white/20 active:scale-[0.99]"
              }`}
            >
              <div>
                <h3 className="font-bold text-lg text-white">
                  {mod.order_index}. {mod.title}
                </h3>
                <p className="text-sm text-white/60 mt-1">
                  {estaBloqueado ? "Conteúdo bloqueado" : "Clique para acessar"}
                </p>
              </div>

              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 group-hover:bg-white/20 transition">
                {estaBloqueado ? "🔒" : "➔"}
              </div>
            </button>
          );
        })}

        {modulos.length === 0 && (
          <div className="bg-white/10 p-8 rounded-3xl text-center border border-white/20">
            <p className="text-white/80 font-medium">Ops! Algo deu errado</p>
            <p className="text-white/60 text-sm mt-1">Nenhum módulo encontrado para este curso.</p>
          </div>
        )}
      </div>
    </div>
  );
}