'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabaseProxy } from "@/lib/proxy";
import type { Courses } from "@/types/courses";
import { Loader2, ChevronLeft } from "lucide-react";

function criarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function Categoria({ params }: { params: Promise<{ id: string }> }) {
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [courses, setCourses] = useState<Courses[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id } = await params;
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

    fetchData();
  }, [params]);
 
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <ChevronLeft className="text-[#046279]" />
        <Link href="/cursos" className="text-[#046279] font-semibold hover:underline">
          Voltar para categorias
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-[#046279] mt-4">{categoryName}</h1>

      {courses.length === 0 ? (
        <p className="text-gray-500 py-8">Nenhum curso disponível nesta categoria.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {courses.map((course) => (
            <Link
              key={course.course_id}
              href={`/cursos/${categoryId}/${criarSlug(course.title)}`}
              className="block"
            >
              <GlassCard className="h-full flex flex-col bg-slate-900/40 border border-white/10 rounded-2xl p-5 overflow-hidden shadow-lg hover:border-white/20 hover:bg-slate-900/60 transition-all duration-300 hover:-translate-y-1 group">
  
                <p className="text-lg font-bold text-white tracking-tight group-hover:text-blue-200 transition duration-300">
                  {curso}
                </p>
  
                <p className="text-xs font-semibold text-blue-300 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
                  Clique para acessar →
                </p>

              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}