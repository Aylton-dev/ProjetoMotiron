'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabaseProxy } from '@/lib/proxy';
import type { Courses } from '@/types/courses';
import type { Categories } from '@/types/categories';
import { Loader2, Plus, Trash2, Edit2, ArrowLeft } from 'lucide-react';

export default function CursosPage() {
  const [courses, setCourses] = useState<Courses[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesResult, categoriesResult] = await Promise.all([
          supabaseProxy.courses.getAll(),
          supabaseProxy.categories.getAll()
        ]);

        if (coursesResult.success && coursesResult.data) {
          setCourses(coursesResult.data);
        }
        if (categoriesResult.success && categoriesResult.data) {
          setCategories(categoriesResult.data);
        }

        if (!coursesResult.success || !categoriesResult.success) {
          setError('Erro ao carregar dados');
        }
      } catch (err) {
        setError('Erro ao conectar com o servidor');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryName = (categoryId: number) => {
    return categories.find(c => c.category_id === categoryId)?.name || 'N/A';
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este curso?')) return;
    
    try {
      const result = await supabaseProxy.courses.delete(id);
      if (result.success) {
        setCourses(courses.filter(c => c.course_id !== id));
      } else {
        alert(result.error?.message || 'Erro ao deletar curso');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar curso');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-[#046279]" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-[#046279] hover:text-[#035067]">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Cursos</h1>
            <p className="text-gray-600 mt-1">Gerencie todos os cursos disponíveis</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        )}

        {/* Add Button */}
        <button className="flex items-center gap-2 bg-[#046279] text-white px-6 py-3 rounded-xl hover:bg-[#035067] transition mb-8 font-semibold">
          <Plus size={20} />
          Adicionar Curso
        </button>

        {/* Courses Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {courses.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 mb-4">Nenhum curso cadastrado ainda</p>
              <button className="text-[#046279] font-semibold hover:underline flex items-center gap-2 mx-auto">
                <Plus size={20} />
                Adicionar o primeiro curso
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Título</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Categoria</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Descrição</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.course_id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{course.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {getCategoryName(course.category_id)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                        {course.description}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(course.course_id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
