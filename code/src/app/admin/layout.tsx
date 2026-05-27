export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen flex">
  
        {/* SIDEBAR */}
        <aside className="w-64 bg-[#046279] text-white p-6 shadow-lg">
          <h1 className="text-2xl font-bold mb-8 text-white">
            Painel ADM
          </h1>
  
          <nav className="flex flex-col gap-2">
            <a href="/admin" className="px-4 py-3 rounded-lg hover:bg-[#035067] transition font-medium">
              📊 Dashboard
            </a>
  
            <a href="/admin/funcionarios" className="px-4 py-3 rounded-lg hover:bg-[#035067] transition font-medium">
              👥 Funcionários
            </a>
  
            <a href="/admin/cursos" className="px-4 py-3 rounded-lg hover:bg-[#035067] transition font-medium">
              📚 Cursos
            </a>

            <a href="/admin/categorias" className="px-4 py-3 rounded-lg hover:bg-[#035067] transition font-medium">
              🏷️ Categorias
            </a>
          </nav>
        </aside>
  
        {/* CONTEÚDO */}
        <main className="flex-1 bg-gray-50">
          {children}
        </main>
      </div>
    );
  }