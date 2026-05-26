import { ReactNode } from "react";

// Mantemos a definição da interface para tipagem
interface GlassCardProps {
  children: ReactNode;
  className?: string; 
}

// Transformando em uma função declarativa tradicional
export function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div 
      className={`bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[2.5rem] ${className}`}
    >
      {children}
    </div>
  );
}