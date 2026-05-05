export default function Curso({ params }: { params: { id: string } }) {
  const cursos = [
    { id: 1, nome: "React" },
    { id: 2, nome: "UI/UX" },
    { id: 3, nome: "JavaScript" },
  ];

  const curso = cursos.find(
    (c) => c.id === Number(params.id)
  );

  // ❌ se não existir, retorna logo aqui
  if (!curso) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-red-500">
          Curso não encontrado
        </h1>
      </div>
    );
  }

  // ✅ se existir, mostra normalmente
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#046279]">
        Curso de {curso.nome}
      </h1>
    </div>
  );
}