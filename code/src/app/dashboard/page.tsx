'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseProxy } from '../../lib/proxy';
import { BookOpen, PlayCircle, Clock, ChevronRight, Loader2, Award } from 'lucide-react';
import { GlassCard } from "@/app/components/GlassCard";

function criarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface MatriculaCurso {
  enrollment_id: number;
  progress: number;
  courses: {
    category_id: number;
    title: string;
    description: string;
  };
}

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cursosMatriculados, setCursosMatriculados] = useState<MatriculaCurso[]>([]);
  const [cursoDestaque, setCursoDestaque] = useState<MatriculaCurso | null>(null);

  useEffect(() => {
    async function carregarDadosDashboard() {
      try {
        // 1. Obtém o usuário logado
        const { data: { user }, error: authError } = await supabaseProxy.auth.getUser();

        if (authError || !user) {
          router.push('/');
          return;
        }

        // 2. Busca o employee correspondente
        const { data: employeeData, error: employeeError } = await supabaseProxy
          .from('employees')
          .select('employee_id')
          .eq('auth_id', user.id)
          .single();

        if (employeeError || !employeeData) {
          console.error('Funcionário não localizado no banco.');
          setLoading(false);
          return;
        }

        // 3. Busca as matrículas trazendo os dados do curso acoplados
        const { data: enrollments, error: enrollmentsError } = await supabaseProxy
          .from('enrollments')
          .select(`
            enrollment_id,
            progress,
            courses (
              category_id,
              title,
              description
            )
          `)
          .eq('employee_id', employeeData.employee_id);

        if (enrollmentsError) throw enrollmentsError;

        if (enrollments && enrollments.length > 0) {
          const dadosFormatados = enrollments as unknown as MatriculaCurso[];
          setCursosMatriculados(dadosFormatados);
          
          // REGRA DE NEGÓCIO: O destaque será o primeiro curso que ainda NÃO foi concluído (< 100%)
          const proximoCursoIncompleto = dadosFormatados.find(c => Number(c.progress) < 100);
          
          // Se todos já estiverem em 100%, mantém o primeiro da lista como destaque por padrão
          setCursoDestaque(proximoCursoIncompleto || dadosFormatados[0]);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do Supabase:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarDadosDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#046279] flex flex-col items-center justify-center gap-3 text-white">
        <Loader2 className="animate-spin text-teal-300" size={40} />
        <p className="text-sm font-medium tracking-wider">Buscando seus cursos no banco...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#046279] relative overflow-hidden flex font-sans text-white">
      <main className="flex-1 p-6 z-10 overflow-y-auto">

        {/* SEÇÃO BENTO: CURSO EM DESTAQUE DINÂMICO */}
        {cursoDestaque && (
          <div className="grid grid-cols-12 gap-6 mb-8">
            <GlassCard className="col-span-12 p-8 flex flex-col md:flex-row justify-between items-center group">
              <div className="space-y-4 max-w-md">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {cursoDestaque.progress === 100 ? "✓ Concluído (100%)" : `Em progresso (${cursoDestaque.progress}%)`}
                </span>
                <h2 className="text-4xl font-bold leading-tight">
                  {cursoDestaque.courses?.title}
                </h2>
                <p className="text-white/70 text-sm line-clamp-2">
                  {cursoDestaque.courses?.description}
                </p>
                <div className="flex items-center gap-4 text-white/70 pt-2">
                  <div className="flex items-center gap-1"><Clock size={16}/> Status: Ativo</div>
                  <div className="flex items-center gap-1"><BookOpen size={16}/> Conteúdo Líquido</div>
                </div>
                <button 
                  onClick={() => {
                    const curso = cursoDestaque?.courses;
                    if (curso?.category_id && curso?.title) {
                      const slug = criarSlug(curso.title);
                      router.push(`/cursos/${curso.category_id}/${slug}`);
                    }
                  }}
                  className="bg-white text-[#046279] px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <PlayCircle size={20}/> {cursoDestaque.progress === 100 ? "Revisar Conteúdo" : "Continuar Assistindo"}
                </button>
              </div>
              <div className="hidden md:block relative w-48 h-48">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-blue-500 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform" />
                <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30">
                   <BookOpen size={60} />
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* GRID DE CURSOS DO SUPABASE */}
        <h3 className="text-xl font-bold mb-6 px-2 italic uppercase tracking-wider opacity-80">Meus Cursos</h3>
        
        {cursosMatriculados.length === 0 ? (
          <p className="text-white/50 px-2 text-sm">Nenhum curso vinculado a este perfil de funcionário.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursosMatriculados.map((matricula) => (
              <CourseTile 
                key={matricula.enrollment_id} 
                title={matricula.courses?.title || "Curso Sem Nome"} 
                progress={matricula.progress} 
                onClick={() => {
                  const curso = matricula.courses;
                  if (curso?.category_id && curso?.title) {
                    const slug = criarSlug(curso.title);
                    router.push(`/cursos/${curso.category_id}/${slug}`);
                  }
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

interface CourseTileProps {
  title: string;
  progress: number;
  onClick: () => void;
}

const CourseTile = ({ title, progress, onClick }: CourseTileProps) => (
  <div onClick={onClick} className="cursor-pointer block">
    <GlassCard className="p-6 group hover:bg-white/15 transition-colors relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-[#046279] rounded-2xl flex items-center justify-center border border-white/20">
          {progress === 100 ? (
            <Award size={24} className="text-teal-300" />
          ) : (
            <PlayCircle size={24} />
          )}
        </div>
        <ChevronRight className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
      </div>
      <h4 className="font-bold text-lg mb-4">{title}</h4>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-medium">
          {progress === 100 ? (
            <span className="text-teal-300 font-bold bg-teal-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
              Certificado Disponível
            </span>
          ) : (
            <span className="text-white/60">Progresso</span>
          )}
          <span className={progress === 100 ? "text-teal-300 font-bold" : "text-white/60"}>{progress}%</span>
        </div>
        <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${progress === 100 ? 'bg-gradient-to-r from-teal-400 to-emerald-400' : 'bg-white'}`} 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    </GlassCard>
  </div>
);