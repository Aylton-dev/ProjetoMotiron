"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, BookOpen, ListTodo, User } from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-[#D6DCF0]">

      {/* NAVBAR */}
      <header className="bg-[#046279] text-white px-6 py-4 flex items-center shadow-md">
        <div className="font-bold text-xl w-1/4">
          LOGO
        </div>

        <nav className="flex w-2/4 justify-center gap-10">
          <Link href="/" className="flex items-center gap-2 hover:text-gray-200">
            <Home size={18} /> Início
          </Link>

          <Link href="/cursos" className="flex items-center gap-2 hover:text-gray-200">
            <BookOpen size={18} /> Cursos
          </Link>

          <Link href="/atividades" className="flex items-center gap-2 hover:text-gray-200">
            <ListTodo size={18} /> Atividades
          </Link>

          <Link href="/perfil" className="flex items-center gap-2 hover:text-gray-200">
            <User size={18} /> Perfil
          </Link>
        </nav>

        <div className="w-1/4"></div>
      </header>

      {/* CONTEÚDO */}
      <div className="flex flex-1">

        {/* SIDEBAR */}
        <aside className="w-72 bg-white/70 backdrop-blur p-5 border-r">

          <h2 className="font-semibold mb-3">
            🔎 Buscar curso
          </h2>

          <input
            type="text"
            placeholder="Digite o nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full p-2 mb-5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#046279]"
          />

          <h2 className="font-semibold mb-3">
            ⭐ Mais acessados
          </h2>

          <div className="space-y-3">
            {categoriasFiltradas.map((categoria) => (
              <Link
                key={categoria.id}
                href={`/cursos/${categoria.id}`}
                className="block p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition"
              >
                <p className="font-medium">{categoria.nome}</p>
                <p className="text-xs text-gray-500">Acessar →</p>
              </Link>
            ))}
          </div>

        </aside>

        <main className="flex-1 p-8">{children}</main>

      </div>
    </div>
  );
}