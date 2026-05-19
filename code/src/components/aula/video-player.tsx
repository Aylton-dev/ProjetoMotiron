"use client";

import { Play } from "lucide-react";

type VideoPlayerProps = {
  src: string;
  titulo: string;
};

export function VideoPlayer({ src, titulo }: VideoPlayerProps) {
  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-200 bg-zinc-900 shadow-lg transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-[#046279]/20">
      <video
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.01] motion-reduce:transform-none"
        controls
        playsInline
        preload="metadata"
        src={src}
        title={titulo}
      >
        Seu navegador não suporta reprodução de vídeo.
      </video>
      <span className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-[#046279]/90 px-3 py-1.5 text-xs font-medium text-white opacity-90 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
        <Play size={14} fill="currentColor" />
        Videoaula
      </span>
    </div>
  );
}
