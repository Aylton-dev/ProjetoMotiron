'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabaseProxy } from '@/lib/proxy';
import type { Categorys } from '@/types/categories';
import { Loader2, Plus, Trash2, Edit2, ArrowLeft } from 'lucide-react';

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Categorys[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await supabaseProxy.categories.getAll();
        if (result.success && result.data) {
          setCategories(result.data);
        } else {
          setError(result.error?.message || 'Erro ao carregar categorias');
        }
      } catch (err) {
        setError('Erro ao conectar com o servidor');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta categoria?')) return;
    
    try {
      const result = await supabaseProxy.categories.delete(id);
      if (result.success) {
        setCategories(categories.filter(c => c.category_id !== id));
      } else {
        alert(result.error?.message || 'Erro ao deletar categoria');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar categoria');
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
            <h1 className="text-4xl font-bold text-gray-900">Categorias</h1>
            <p className="text-gray-600 mt-1">Gerencie todas as categorias de cursos</p>
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
          Adicionar Categoria
        </button>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white rounded-xl border border-gray-200">
              <p className="text-gray-600 mb-4">Nenhuma categoria cadastrada ainda</p>
              <button className="text-[#046279] font-semibold hover:underline flex items-center gap-2 mx-auto">
                <Plus size={20} />
                Adicionar a primeira categoria
              </button>
            </div>
          ) : (
            categories.map((category) => (
              <div key={category.category_id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                {category.image_url && (
                  <div className="h-40 w-full overflow-hidden bg-gray-200">
                    <img 
                      src={category.image_url} 
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description}</p>
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                    <button className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition flex items-center justify-center gap-2">
                      <Edit2 size={18} />
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(category.category_id)}
                      className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} />
                      Deletar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
