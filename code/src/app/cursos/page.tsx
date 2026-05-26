'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Loader2 } from "lucide-react";
import { supabaseProxy } from "@/lib/proxy";
import type { Category } from "@/types/category";

export default function Cursos() {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const result = await supabaseProxy.categories.getAll();
        
        if (result.success && result.data) {
          setCategorias(result.data);
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

    fetchCategorias();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-[#046279]" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BookOpen size={28} className="text-[#046279]" />
        <h1 className="text-2xl font-bold">Categorias de cursos</h1>
      </div>

      {categorias.length === 0 ? (
        <p className="text-gray-500 py-8">Nenhuma categoria disponível no momento.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map((categoria) => (
            <Link
              key={categoria.category_id}
              href={`/cursos/${categoria.category_id}`}
              className="block"
            >
              <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer">

                <div className="h-40 w-full overflow-hidden bg-gray-200">
                  {categoria.image_url && (
                    <img
                      src={categoria.image_url}
                      alt={categoria.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  )}
                </div>

                <div className="p-5">
                  <h2 className="text-lg font-semibold group-hover:text-[#046279] transition">
                    {categoria.name}
                  </h2>

                  <p className="text-sm text-gray-500 mt-2">
                    {categoria.description}
                  </p>
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}