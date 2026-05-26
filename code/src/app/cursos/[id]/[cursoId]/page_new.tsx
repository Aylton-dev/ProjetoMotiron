'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabaseProxy } from "@/lib/proxy";
import type { Module } from "@/types/module";
import type { Course } from "@/types/course";
import { Loader2, ChevronLeft, Play } from "lucide-react";

function criarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CursoDetalhes({ 
  params 
}: { 
  params: Promise<{ id: string; cursoId: string }> 
}) {
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id, cursoId } = await params;
        const parsedCategoryId = Number(id);
        setCategoryId(parsedCategoryId);

        // Buscar todos os cursos para encontrar pelo slug
        const coursesResult = await supabaseProxy.courses.getAll();
        if (coursesResult.success && coursesResult.data) {
          const foundCourse = coursesResult.data.find(
            (c) => criarSlug(c.title) === cursoId && c.category_id === parsedCategoryId
          );
          
          if (foundCourse) {
            setCourse(foundCourse);

            // Buscar módulos do curso
            const modulesResult = await supabaseProxy.modules.getAll();
            if (modulesResult.success && modulesResult.data) {
              const courseMod = modulesResult.data
                .filter((m) => m.course_id === foundCourse.course_id)
                .sort((a, b) => a.order_index - b.order_index);
              setModules(courseMod);
            }
          } else {
            setError('Curso não encontrado');
          }
        } else {
          setError(coursesResult.error?.message || 'Erro ao carregar dados');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-[#046279]" size={32} />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <ChevronLeft className="text-[#046279]" />
          <Link href={`/cursos/${categoryId}`} className="text-[#046279] font-semibold hover:underline">
            Voltar para a categoria
          </Link>
        </div>
        <h1 className="text-xl font-bold text-red-500 mt-4">Curso não encontrado</h1>
        <p className="mt-2 text-gray-600">Verifique se o link está correto ou escolha outro curso.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <ChevronLeft className="text-[#046279]" />
        <Link href={`/cursos/${categoryId}`} className="text-[#046279] font-semibold hover:underline">
          Voltar para a categoria
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-[#046279] mt-4">{course.title}</h1>
      <p className="text-gray-600 mt-2">Módulos disponíveis para este curso</p>

      {modules.length === 0 ? (
        <p className="text-gray-500 py-8">Nenhum módulo disponível para este curso.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {modules.map((modulo) => (
            <a
              key={modulo.module_id}
              href={modulo.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg hover:border-[#046279] transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <Play className="text-[#046279] flex-shrink-0" size={20} />
                  <div className="flex-1">
                    <p className="text-lg font-medium text-gray-800">
                      {modulo.order_index}. {modulo.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{modulo.description}</p>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
