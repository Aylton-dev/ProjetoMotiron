export type StatusAula = "concluida" | "atual" | "disponivel" | "bloqueada";

export type OpcaoQuiz = {
  id: string;
  texto: string;
};

export type PerguntaQuiz = {
  id: string;
  pergunta: string;
  opcoes: OpcaoQuiz[];
  respostaCorretaId: string;
};

export type Aula = {
  slug: string;
  titulo: string;
  descricao: string;
  duracao: string;
  videoUrl: string;
  status: StatusAula;
  quiz: PerguntaQuiz[];
};

export type Categoria = {
  slug: string;
  nome: string;
  descricao: string;
  imagem: string;
  aulas: Aula[];
};

/** @deprecated Use Categoria */
export type CursoAulas = Categoria;
