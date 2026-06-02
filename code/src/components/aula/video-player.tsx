"use client";

type VideoPlayerProps = {
  src: string;
  titulo: string;
};

export function VideoPlayer({ src, titulo }: VideoPlayerProps) {
  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className="flex aspect-video w-full items-center justify-center rounded-2xl bg-zinc-900 text-center text-white"
    >
      <div>
        <p className="text-xl font-bold">▶ Assistir videoaula</p>
        <p className="mt-2 text-sm">{titulo}</p>
        <p className="mt-4 text-sm underline">Abrir no YouTube</p>
      </div>
    </a>
  );
}