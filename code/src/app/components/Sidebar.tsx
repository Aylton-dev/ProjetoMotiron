import Link from 'next/link';
import { HomeIcon, LayoutDashboard, User } from 'lucide-react'; 
import { GlassCard } from './GlassCard';
import Saudacao from './Greeting';

export function Sidebar() {
  return (
    // m-6 cria o espaçamento flutuante nas bordas, w-[calc(105%-3rem)] desconta as margens
    <header className="w-[calc(100%-3rem)] m-6 mb-0 z-50 sticky top-0">
      {/* Removemos o h-full e usamos flex-row para alinhar tudo horizontalmente */}
      <GlassCard className="flex flex-row items-center justify-between px-8 py-4 w-full">
        
        {/* Lado Esquerdo: Logo */}
        <div className="text-2xl font-bold tracking-tighter text-white min-w-[100px]">
          Logo
        </div>
        
        {/* Centro: Menu de Navegação Horizontal */}
        <nav className="flex items-center gap-2 md:gap-6 bg-white/5 p-1.5 rounded-2xl border border-white/5">
          <Link href="/dashboard">
            <span className="flex items-center gap-2 px-5 py-2.5 rounded-xl cursor-pointer transition-all hover:bg-white/10 text-white text-sm font-medium">
              <HomeIcon size={18} className="shrink-0" />
              <span className="hidden sm:inline">Início</span>
            </span>
          </Link>
          
          <Link href="/cursos">
            <span className="flex items-center gap-2 px-5 py-2.5 rounded-xl cursor-pointer transition-all hover:bg-white/10 text-white text-sm font-medium">
              <LayoutDashboard size={18} className="shrink-0" />
              <span className="hidden sm:inline">Cursos</span>
            </span>
          </Link>
          
          <Link href="/perfil">
            <span className="flex items-center gap-2 px-5 py-2.5 rounded-xl cursor-pointer transition-all hover:bg-white/10 text-white text-sm font-medium">
              <User size={18} className="shrink-0" />
              <span className="hidden sm:inline">Perfil</span>
            </span>
          </Link>
        </nav>

        {/* Lado Direito: Saudação/Perfil */}
        <div className="text-blue-200 text-sm font-medium hidden md:block min-w-[100px] text-right">
          <Saudacao />
        </div>

      </GlassCard>
    </header>
  );
}