import { Sidebar } from '@/app/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // flex-col garante que a navbar fique no topo e o conteúdo abaixo
    <div className="min-h-screen w-full bg-[#046279] relative overflow-x-hidden flex flex-col font-sans text-white">
      
      {/* Esferas Decorativas de Fundo (Exatamente como na imagem) */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[0%] right-[0%] w-[400px] h-[400px] bg-teal-300/20 rounded-full blur-[100px] pointer-events-none" />

      {/* NAVBAR GLASSMISM NO TOPO */}
      <Sidebar />

      {/* CONTEÚDO DA PÁGINA (Abaixo da Navbar) */}
      <main className="flex-1 z-10 m-6 mt-4 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}