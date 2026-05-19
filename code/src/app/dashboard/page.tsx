import Link from "next/link";
import { ReactNode } from "react";
import Saudacao from "./greeting";
import { 
  BookOpen, 
  LayoutDashboard,  
  User, 
  HomeIcon, 
  PlayCircle, 
  Clock, 
  ChevronRight 
} from 'lucide-react';
interface GlassCardProps {
  children: ReactNode;
  className?: string; 
}
const GlassCard = ({ children, className = "" }: GlassCardProps) => (
  <div className={`bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[2.5rem] ${className}`}>
    {children}
  </div>
);

export default function Dashboard() {
return(
    
      <div className="min-h-screen w-full bg-[#046279] relative overflow-hidden flex font-sans text-white">
      
      {/* Esferas Decorativas de Fundo  */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[0%] right-[0%] w-[400px] h-[400px] bg-teal-300/20 rounded-full blur-[100px]" />

      {/* 1. SIDEBAR (GLASS) */}
      <aside className="w-24 lg:w-64 m-6 mr-0 z-10 flex flex-col">
        <GlassCard className="h-full flex flex-col p-6 items-center lg:items-start">
          <div className="text-2xl font-bold mb-5 hidden lg:block tracking-tighter">Logo</div>
          <div className="text-blue-200">
              <Saudacao />
          </div>
          
          <nav className="flex-1 space-y-4 w-full">
            <Link href={`/dashboard`}>
                <span className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all">
                    <HomeIcon />
                    Home
                </span>
            </Link>
            <Link href={`/dashboard`}>
                <span className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all">
                    <LayoutDashboard />
                    Cursos
                </span>
            </Link>
            <Link href={`/dashboard`}>
                <span className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all">
                    <User />
                    Perfil
                </span>
            </Link>
          </nav>

        </GlassCard>
      </aside>

      {/* 2. CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-6 z-10 overflow-y-auto">

        {/* SEÇÃO BENTO: PROCESSO E PRÓXIMA AULA */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          
          {/* Card Principal de Destaque */}
          <GlassCard className="col-span-12 lg:col-span-8 p-8 flex flex-col md:flex-row justify-between items-center group">
            <div className="space-y-4 max-w-md">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Em progresso</span>
              <h2 className="text-4xl font-bold leading-tight">React: O Guia Completo</h2>
              <div className="flex items-center gap-4 text-white/70">
                <div className="flex items-center gap-1"><Clock size={16}/> 45min restantes</div>
                <div className="flex items-center gap-1"><BookOpen size={16}/> Módulo 04</div>
              </div>
              <Link
                href="/cursos/frontend/aulas/react"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3 font-bold text-[#046279] transition-transform hover:scale-105"
              >
                <PlayCircle size={20} /> Continuar Assistindo
              </Link>
            </div>
            <div className="hidden md:block relative w-48 h-48">
                {/* Efeito visual do curso */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-blue-500 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform" />
                <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30">
                   <BookOpen size={60} />
                </div>
            </div>
          </GlassCard>
        </div>

        {/* GRID DE CURSOS MENORES */}
        <h3 className="text-xl font-bold mb-6 px-2 italic uppercase tracking-wider opacity-80">Meus Cursos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseTile title="UI/UX Design" progress={80} />
          <CourseTile title="Linguagem Java" progress={50} />
          <CourseTile title="Linguagem Python" progress={12} />
        </div>
      </main>
    </div>
  );
}

/* componente gerado para conseguir criar um elemento para exemplo.
futuramente alterar isso criando um object de produto com uma pasta "products"
*/
interface CourseTileProps {
  title: String;
  progress: number;
}
const CourseTile = ({ title, progress }: CourseTileProps) => (
  <GlassCard className="p-6 group hover:bg-white/15 transition-colors cursor-pointer">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 bg-[#046279] rounded-2xl flex items-center justify-center border border-white/20">
        <PlayCircle size={24} />
      </div>
      <ChevronRight className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
    </div>
    <h4 className="font-bold text-lg mb-4">{title}</h4>
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-white/60 font-medium">
        <span>Progresso</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
        <div className="bg-white h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
      </div>
    </div>
  </GlassCard>

);
