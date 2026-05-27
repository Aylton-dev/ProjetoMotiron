"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, BookOpen, ListTodo, User, Search } from "lucide-react";
import { GlassCard } from "@/app/components/GlassCard";
import { Sidebar } from "@/app/components/Sidebar";

const categorias = [
  { id: 1, nome: "Cursos de Frontend" },
  { id: 2, nome: "Cursos de Backend" },
  { id: 3, nome: "Cursos de Dados" },
  { id: 4, nome: "Ferramentas do dia a dia" },
  { id: 5, nome: "UI/UX" },
  { id: 6, nome: "Soft skills" },
];

export default function CursosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [busca, setBusca] = useState("");

  const categoriasFiltradas = categorias.filter((categoria) =>
    categoria.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    // 1. Mudamos o fundo para o tom escuro e adicionamos relative/overflow para as esferas
    <div className="min-h-screen w-full bg-[#046279] relative overflow-x-hidden flex flex-col font-sans text-white antialiased">
      
      {/* Esferas Decorativas de Fundo (Efeito Glass) */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-teal-300/15 rounded-full blur-[100px] pointer-events-none" />

      <Sidebar />

      {/* 3. CONTEÚDO PRINCIPAL (Dizemos adeus à antiga sidebar cinza lateral!) */}
      <div className="flex flex-1 flex-col md:flex-row gap-6 p-6 h-[calc(100vh-110px)] overflow-hidden z-10">
        
        {/* Nova Sidebar Compacta Lateral de Filtro dentro do Grid */}
        <aside className="w-full md:w-72 shrink-0">
          <GlassCard className="h-full p-5 flex flex-col rounded-[2rem]">
            
            <h2 className="font-semibold text-sm mb-3 flex items-center gap-2 text-white/90">
              <Search size={16} className="text-blue-300" /> Buscar curso
            </h2>

            <input
              type="text"
              placeholder="Digite o nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full p-2.5 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 transition mb-6"
            />

            <h2 className="font-semibold text-sm mb-3 text-white/90">
              ⭐ Mais acessados
            </h2>

            <div className="space-y-2 overflow-y-auto pr-1 flex-1 custom-scrollbar">
              {categoriasFiltradas.map((categoria) => (
                <Link
                  key={categoria.id}
                  href={`/cursos/${categoria.id}`}
                  className="block p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-white/20 transition group"
                >
                  <p className="font-medium text-sm text-white/90 group-hover:text-blue-200 transition">{categoria.nome}</p>
                  <p className="text-xs text-white/40 group-hover:text-white/60 transition mt-1">Acessar →</p>
                </Link>
              ))}
            </div>
          </GlassCard>
        </aside>

        <main className="flex-1 p-8">{children}</main>

      </div>
    </div>
  );
}