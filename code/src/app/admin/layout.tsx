export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen flex">
  
        {/* SIDEBAR */}
        <aside className="w-64 bg-[#046279] text-white p-6">
          <h1 className="text-2xl font-bold mb-8">
            Painel ADM
          </h1>
  
          <nav className="flex flex-col gap-4">
            <a href="/admin">Dashboard</a>
  
            <a href="/admin/funcionarios">
              Funcionários
            </a>
  
            <a href="/admin/cursos">
              Cursos
            </a>
          </nav>
        </aside>
  
        {/* CONTEÚDO */}
        <main className="flex-1 p-8 bg-gray-100">
          {children}
        </main>
      </div>
    );
  }