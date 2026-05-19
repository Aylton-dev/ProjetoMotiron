"use client";

import { useState } from "react";

export default function FuncionariosPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  function cadastrarFuncionario() {
    alert(`Funcionário ${nome} cadastrado!`);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Cadastro de Funcionários
      </h1>

      <div className="flex flex-col gap-4 max-w-md">

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="p-3 border rounded"
        />

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 border rounded"
        />

        <button
          onClick={cadastrarFuncionario}
          className="bg-[#046279] text-white p-3 rounded"
        >
          Cadastrar
        </button>

      </div>
    </div>
  );
}