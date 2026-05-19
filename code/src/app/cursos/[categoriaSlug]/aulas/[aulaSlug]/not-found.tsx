import Link from "next/link";

export default function AulaNaoEncontrada() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-[#046279]">Aula não encontrada</h1>
      <p className="mt-2 text-gray-600">
        O conteúdo que você procura não existe ou foi removido.
      </p>
      <Link
        href="/cursos"
        className="mt-8 rounded-xl bg-[#046279] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#035566]"
      >
        Voltar aos cursos
      </Link>
    </div>
  );
}
