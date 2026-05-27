"use client";
import {useEffect, useState} from 'react';
import Link from "next/link";
import { BookOpen, FolderOpen } from "lucide-react";
import { GlassCard } from "@/app/components/GlassCard";
import { supabase } from "@/lib/supabase";

interface Curso {
  course_id: number;
  title: string;
  description: string;
  thumbnail_url: string;
}

interface Categoria {
  category_id: number;
  name: string;
  description: string;
  courses: Curso[];
}

export default function CursosPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarDados() {
      try {
        const { data, error } = await supabase
  .from('categories')
  .select(`
    category_id,
    name,
    description,
    courses!courses_category_id_fkey (
      course_id,
      title,
      description,
      thumbnail_url
    )
  `);

        if (error) throw error;

        if (data) {
          setCategorias(data as Categoria[]);
        }
      } catch (error) {
       console.log(error);
      } finally {
        setCarregando(false);
      }
    }

    buscarDados();
  }, []);

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-white/60 animate-pulse font-medium">Carregando trilhas de conhecimento...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen size={28} className="text-blue-300" />
        <h1 className="text-2xl font-bold tracking-tight">Categorias de Cursos</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categorias.map((categoria) => (
          <Link
            key={categoria.category_id}
            href={`/cursos/${categoria.category_id}`}
            className="block group"
          >
            <GlassCard className="h-full flex flex-col bg-slate-900/20 border border-white/10 rounded-3xl overflow-hidden shadow-lg hover:border-white/20 hover:bg-slate-900/40 transition-all duration-300 hover:-translate-y-1">
              
              {/* Espaço para Imagem (Usando a thumbnail do primeiro curso da categoria se houver, ou um ícone padrão) */}
              <div className="h-40 w-full overflow-hidden bg-white/5 flex items-center justify-center relative border-b border-white/5">
                {categoria.courses && categoria.courses.length > 0 ? (
                  <img
                    src={categoria.courses[0].thumbnail_url}
                    alt={categoria.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <FolderOpen size={48} className="text-white/20" />
                )}
              </div>

              {/* Textos ajustados para bater com o banco de dados (name e description) */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors tracking-tight">
                    {categoria.name}
                  </h2>

                  <p className="text-sm text-white/70 mt-2 leading-relaxed line-clamp-3">
                    {categoria.description}
                  </p>
                </div>
                

              </div>

            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}

