"use client";

import { useState } from "react";
import { Home, BookOpen, ListTodo, User } from "lucide-react";

export default function CursosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cursos = [
    { id: 1, nome: "React" },
    { id: 2, nome: "UI/UX" },
    { id: 3, nome: "JavaScript" },
  ];

  const [busca, setBusca] = useState("");

  const cursosFiltrados = cursos.filter((curso) =>
    curso.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#D6DCF0]">

      {/* 🔝 NAVBAR */}
      <header className="bg-[#046279] text-white px-6 py-4 flex items-center shadow-md">
        <div className="font-bold text-xl w-1/4">
          LOGO
        </div>

        <nav className="flex w-2/4 justify-center gap-10">
          <a href="/" className="flex items-center gap-2 hover:text-gray-200">
            <Home size={18} /> Início
          </a>

          <a href="/cursos" className="flex items-center gap-2 hover:text-gray-200">
            <BookOpen size={18} /> Cursos
          </a>

          <a href="/atividades" className="flex items-center gap-2 hover:text-gray-200">
            <ListTodo size={18} /> Atividades
          </a>

          <a href="/perfil" className="flex items-center gap-2 hover:text-gray-200">
            <User size={18} /> Perfil
          </a>
        </nav>

        <div className="w-1/4"></div>
      </header>

      {/* 📦 CONTEÚDO */}
      <div className="flex flex-1">

        {/* 📚 SIDEBAR */}
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
            {cursosFiltrados.map((curso) => (
              <a
                key={curso.id}
                href={`/cursos/${curso.id}`}
                className="block p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition"
              >
                <p className="font-medium">{curso.nome}</p>
                <p className="text-xs text-gray-500">Acessar →</p>
              </a>
            ))}
          </div>

        </aside>

        {/* 🎬 ÁREA PRINCIPAL (NETFLIX STYLE GRID) */}
        <main className="flex-1 p-8">

          <h1 className="text-2xl font-bold mb-6">
            Cursos disponíveis
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {cursos.map((curso) => (
              <a
                key={curso.id}
                href={`/cursos/${curso.id}`}
                className="bg-white rounded-2xl p-5 shadow-md
                           hover:shadow-xl hover:-translate-y-1
                           transition"
              >
                <h2 className="text-lg font-semibold">
                  {curso.nome}
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  Clique para acessar o curso
                </p>

                <div className="mt-4 text-[#046279] font-medium">
                  Assistir →
                </div>
              </a>
            ))}

          </div>

        </main>

      </div>
    </div>
  );
}