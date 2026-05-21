import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">
        Dashboard Administrativo
      </h1>

      <p className="text-gray-600 mb-6">
        Gerencie funcionários, cursos e treinamentos.
      </p>

      {/* Botões de Navegação Rápida */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <Link 
          href="/admin/funcionarios" 
          className="p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition bg-white block"
        >
          <h3 className="text-xl font-semibold mb-1 text-gray-800">
            👥 Gerenciar Funcionários
          </h3>
          <p className="text-sm text-gray-500">
            Visualize, edite e controle a lista de colaboradores e usuários.
          </p>
        </Link>

        <Link 
          href="/admin/cursos" 
          className="p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition bg-white block"
        >
          <h3 className="text-xl font-semibold mb-1 text-gray-800">
            📚 Gerenciar Cursos
          </h3>
          <p className="text-sm text-gray-500">
            Controle a grade de treinamentos e cursos ofertados.
          </p>
        </Link>
      </div>
    </div>
  );
}