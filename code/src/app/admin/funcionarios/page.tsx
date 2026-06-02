
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabaseProxy } from '@/lib/proxy';
import type { Employees } from '@/types/employees';
import { Loader2, Plus, Trash2, Edit2, ArrowLeft, X } from 'lucide-react';

export default function FuncionariosPage() {
  const [employees, setEmployees] = useState<Employees[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para o Modal de Cadastro
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '', 
    job_title: '',
    role: 'employee', 
    bio: '',
    avatar_url: ''
  });

  const fetchEmployees = async () => {
    try {
      const result = await supabaseProxy.employees.getAll();
      if (result.success && result.data) {
        setEmployees(result.data);
      } else {
        setError(result.error?.message || 'Erro ao carregar funcionários');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este funcionário?')) return;
    
    try {
      const result = await supabaseProxy.employees.delete(id);
      if (result.success) {
        setEmployees(employees.filter(e => e.employee_id !== id));
      } else {
        alert(result.error?.message || 'Erro ao deletar funcionário');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar funcionário');
    }
  };

  // Envia os dados do formulário para a Rota de API do Servidor
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Faz o disparo para a nossa a api
      const response = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Ocorreu um erro ao cadastrar o funcionário.');
      }

      // Se deu certo, adiciona o novo funcionário direto no topo da lista local (evita refresh de página)
      setEmployees((prev) => [result.data, ...prev]);
      setIsModalOpen(false); // Fecha o modal
      
      // Reseta todos os campos do formulário
      setFormData({
        name: '',
        email: '',
        password: '',
        job_title: '',
        role: 'employee',
        bio: '',
        avatar_url: ''
      });

      alert('Funcionário cadastrado e conta de acesso ativada com sucesso!');

    } catch (err: any) {
      setError(err.message || 'Erro ao processar a requisição.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-[#046279]" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-[#046279] hover:text-[#035067]">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Funcionários</h1>
            <p className="text-gray-600 mt-1">Gerencie todos os funcionários da plataforma</p>
          </div>
        </div>

        {/* Mensagens de Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        )}

        {/* Botão para Abrir o Modal */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#046279] text-white px-6 py-3 rounded-xl hover:bg-[#035067] transition mb-8 font-semibold shadow-xs"
        >
          <Plus size={20} />
          Adicionar Funcionário
        </button>

        {/* Tabela de Funcionários */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
          {employees.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 mb-4">Nenhum funcionário cadastrado ainda</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-[#046279] font-semibold hover:underline flex items-center gap-2 mx-auto"
              >
                <Plus size={20} />
                Adicionar o primeiro funcionário
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nome</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cargo</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {employees.map((employee) => (
                    <tr key={employee.employee_id} className="hover:bg-gray-50/80 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {/* Tratamento dinâmico para avatar opcional */}
                          {employee.avatar_url ? (
                            <img 
                              src={employee.avatar_url} 
                              alt={employee.name}
                              className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            
                            <div className="w-10 h-10 rounded-full bg-[#046279]/10 text-[#046279] flex items-center justify-center font-bold text-xs uppercase tracking-wider border border-[#046279]/20">
                              {employee.name.substring(0, 2)}
                            </div>
                          )}
                          <p className="font-medium text-gray-900">{employee.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{employee.email}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{employee.job_title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(employee.employee_id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ESTRUTURA DO MODAL DE CADASTRO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-gray-900 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-gray-900">Novo Funcionário</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nome Completo *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: João Silva"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#046279]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email de Login *</label>
                  <input 
                    type="email" 
                    required
                    placeholder="nome@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#046279]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Senha Inicial *</label>
                  <input 
                    type="password" 
                    required
                    minLength={6}
                    placeholder="Mínimo 6 dígitos"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#046279]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Cargo *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Designer UI"
                    value={formData.job_title}
                    onChange={(e) => setFormData({...formData, job_title: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#046279]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Permissão</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#046279]"
                  >
                    <option value="employee">Funcionário</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">URL da Imagem de Perfil (Opcional)</label>
                <input 
                  type="url" 
                  placeholder="https://linkdafoto.com/foto.jpg"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#046279]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Minibiografia (Opcional)</label>
                <textarea 
                  rows={2}
                  placeholder="Informações adicionais sobre o funcionário..."
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#046279] resize-none"
                />
              </div>

              
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-[#046279] text-white px-5 py-2 text-sm font-semibold rounded-lg hover:bg-[#035067] transition disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Salvando...
                    </>
                  ) : (
                    'Criar Conta'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}