import Link from "next/link";
import { Users, BookOpen, Tag } from "lucide-react";

interface AdminCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

const AdminCard = ({ icon, title, description, href }: AdminCardProps) => (
  <Link href={href}>
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer p-6 border border-gray-100 hover:border-[#046279]">
      <div className="flex items-center gap-4 mb-3">
        <div className="text-[#046279] bg-blue-50 p-3 rounded-xl">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      <p className="text-gray-600 text-sm">{description}</p>
      <p className="text-[#046279] text-sm font-semibold mt-4">Acessar →</p>
    </div>
  </Link>
);

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard Administrativo
          </h1>
          <p className="text-gray-600">
            Gerencie funcionários, cursos, categorias e outras informações da plataforma.
          </p>
        </div>

        {/* Admin Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminCard
            icon={<Users size={24} />}
            title="Funcionários"
            description="Gerencie os funcionários da plataforma, adicione, edite ou remova registros."
            href="/admin/funcionarios"
          />
          <AdminCard
            icon={<BookOpen size={24} />}
            title="Cursos"
            description="Administre todos os cursos disponíveis, crie novos ou edite os existentes."
            href="/admin/cursos"
          />
          <AdminCard
            icon={<Tag size={24} />}
            title="Categorias"
            description="Gerencie as categorias de cursos e organize o conteúdo da plataforma."
            href="/admin/categorias"
          />
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">Total de Funcionários</p>
            <p className="text-3xl font-bold text-gray-900">—</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">Total de Cursos</p>
            <p className="text-3xl font-bold text-gray-900">—</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">Total de Categorias</p>
            <p className="text-3xl font-bold text-gray-900">—</p>
          </div>
        </div>
      </div>
    </div>
  );
}