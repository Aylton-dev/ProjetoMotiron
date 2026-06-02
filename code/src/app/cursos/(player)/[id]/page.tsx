'use client';

import Link from "next/link";
import { useState, useEffect, use } from "react";
import { supabaseProxy } from "@/lib/proxy";
import type { Courses } from "@/types/courses";
import { Loader2, ChevronLeft, ArrowRight, BookOpen } from "lucide-react";
import { GlassCard } from "@/app/components/GlassCard";
import { Sidebar } from "@/app/components/Sidebar";

function criarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface CategoriaProps {
  params: Promise<{ id: string }>;
}

export default function Categoria({ params }: CategoriaProps) {
  const { id } = use(params);

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [courses, setCourses] = useState<Courses[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parsedId = Number(id);
        setCategoryId(parsedId);

        // Buscar a categoria para pegar o nome
        const categoryResult = await supabaseProxy.categories.getById(parsedId);
        if (categoryResult.success && categoryResult.data) {
          setCategoryName(categoryResult.data.name);
        }

        // Buscar todos os cursos e filtrar pela categoria
        const coursesResult = await supabaseProxy.courses.getAll();
        if (coursesResult.success && coursesResult.data) {
          const filteredCourses = coursesResult.data.filter(
            (course) => course.category_id === parsedId
          );
          setCourses(filteredCourses);
        } else {
          setError(coursesResult.error?.message || 'Erro ao carregar cursos');
        }
      } catch (err) {
        setError('Erro ao conectar com o servidor');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="animate-spin text-white" size={32} />
        <p className="text-white/70 text-sm">Carregando cursos da categoria...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 font-medium">{error}</p>
        <Link href="/cursos" className="text-sm underline text-white/60 hover:text-white mt-2 block">
          Voltar para o início
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#046279] relative overflow-x-hidden flex flex-col font-sans text-white antialiased">
      
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-teal-300/15 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="mb-4">
        <Sidebar />
      </div>

      
      <div>
        <Link 
          href="/cursos" 
          className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition group font-medium bg-white/5 border border-white/5 px-4 py-2 rounded-xl backdrop-blur-sm mb-6"
        >
          <ChevronLeft size={16} className="transform group-hover:-translate-x-0.5 transition-transform" /> 
          Voltar para categorias
        </Link>
      </div>

      
      <div className="space-y-2 pl-2">
        <span className=" font-bold text-white/40  flex items-center gap-2">
          <BookOpen size={14} /> Categoria Selecionada
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight capitalize">
          {categoryName || "Cursos Disponíveis"}
        </h1>
      </div>

      
      {courses.length === 0 ? (
        <GlassCard className="p-8 text-center bg-slate-900/20 border border-white/5 rounded-3xl backdrop-blur-sm">
          <p className="text-white/60 text-sm">Nenhum curso disponível nesta categoria no momento.</p>
        </GlassCard>
      ) : (
        <div className="grid gap-4 mt-6">
          {courses.map((course) => (
            <Link
              key={course.course_id}
              href={`/cursos/${categoryId}/${criarSlug(course.title)}`}
              className="group block"
            >
             
                <GlassCard className="w-full max-w-xl mx-auto flex items-center justify-between p-5 bg-[#053d49]/40 hover:bg-[#053d49]/70 border border-white/5 hover:border-white/20 rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 backdrop-blur-sm pl-6">
  
                    <div className="space-y-1 min-w-0 pr-4">
    
                        <p className="text-lg font-semibold text-white tracking-tight group-hover:text-white/90 transition duration-300 truncate">
                            {course.title}
                        </p>
    
    
                        <p className="text-[11px] font-medium text-white/40 flex items-center gap-1">
                            Clique para acessar
                        </p>
                    </div>

  
                    <div className="p-2.5 bg-white/5 text-white/70 group-hover:bg-white group-hover:text-[#074e60] rounded-xl transition-all duration-300 shrink-0">
                        <ArrowRight size={16} className="transform group-hover:translate-x-0.5 transition-transform" />
                    </div>

                </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}