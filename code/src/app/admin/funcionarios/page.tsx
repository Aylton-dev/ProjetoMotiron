"use client";

import { useState } from "react";
// Importamos o proxy para interceptar e tratar os erros
import { supabaseProxy } from "@/lib/proxy"; 

export default function FuncionariosPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState({ text: "", isError: false });
  const [carregando, setCarregando] = useState(false);

  async function cadastrarFuncionario() {
    // Validação simples antes de enviar
    if (!nome || !email) {
      setStatusMessage({ text: "Por favor, preencha todos os campos.", isError: true });
      return;
    }

    setCarregando(true);
    setStatusMessage({ text: "", isError: false });

    // Envia os dados para a tabela 'funcionarios' do Supabase via proxy
    const resultado = await supabaseProxy.insertData("funcionarios", {
      nome: nome,
      email: email
    });

    setCarregando(false);

    if (resultado.success) {
      // CORREÇÃO AQUI: Mudado para crases (backticks) para permitir o uso de ${nome}
      setStatusMessage({ text: `Funcionário ${nome} cadastrado com sucesso!`, isError: false });
      // Limpa os campos após o sucesso
      setNome("");
      setEmail("");
    } else {
      // Exibe a mensagem de erro traduzida que veio do proxy
      setStatusMessage({ 
        text: resultado.error?.message || "Erro desconhecido ao cadastrar.", 
        isError: true 
      });
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Cadastro de Funcionários
      </h1>

      <div className="flex flex-col gap-4 max-w-md">
        {/* Alerta de Status */}
        {statusMessage.text && (
          <div className={`p-3 rounded text-sm ${
            statusMessage.isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}>
            {statusMessage.text}
          </div>
        )}

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#046279]"
          disabled={carregando}
        />

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#046279]"
          disabled={carregando}
        />

        <button
          onClick={cadastrarFuncionario}
          className={`text-white p-3 rounded font-medium transition ${
            carregando ? "bg-gray-400 cursor-not-allowed" : "bg-[#046279] hover:bg-[#034f62]"
          }`}
          disabled={carregando}
        >
          {carregando ? "Cadastrando..." : "Cadastrar"}
        </button>
      </div>
    </div>
  );
}
