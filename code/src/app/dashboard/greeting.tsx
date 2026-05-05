'use client';

import { useState, useEffect } from 'react';
import { Sun, CloudSun, Moon } from 'lucide-react';

export default function Saudacao() {
  const [mounted, setMounted] = useState(false);
  const [saudacaoInfo, setSaudacaoInfo] = useState({ 
    texto: "", 
    icon: null as React.ReactNode 
  });

  useEffect(() => {
    setMounted(true);
    const hora = new Date().getHours();

    if (hora >= 5 && hora < 13) {
      setSaudacaoInfo({
        texto: "Bom dia",
        icon: <Sun className="w-5 h-5 text-yellow-400" />
      });
    } else if (hora >= 13 && hora < 18) {
      setSaudacaoInfo({
        texto: "Boa tarde",
        icon: <CloudSun className="text-orange-400 w-5 h-5" />
      });
    } else {
      setSaudacaoInfo({
        texto: "Boa noite",
        icon: <Moon className="text-indigo-300 w-5 h-5" />
      });
    }
  }, []);

  // Placeholder para evitar o "pulo" de layout antes de carregar
  if (!mounted) {
    return <div className="h-8 w-28 bg-white/5 animate-pulse rounded-lg" />;
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-xl border border-white/5 backdrop-blur-sm">
      <div className="animate-in zoom-in duration-500">
        {saudacaoInfo.icon}
      </div>
      <span className="text-sm font-semibold text-white tracking-wide">
        {saudacaoInfo.texto}
      </span>
    </div>
  );
}
