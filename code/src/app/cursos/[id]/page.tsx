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
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg hover:border-[#046279] transition cursor-pointer">
                <p className="text-lg font-medium text-gray-800 hover:text-[#046279]">
                  {course.title}
                </p>
                <p className="text-sm text-gray-500 mt-2">{course.description}</p>
                <p className="text-xs text-[#046279] mt-2 font-semibold">Clique para acessar →</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}