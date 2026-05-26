'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabaseProxy } from '@/lib/proxy';
import type { Employee } from '@/types/employee';
import { Loader2, Plus, Trash2, Edit2, ArrowLeft } from 'lucide-react';

export default function FuncionariosPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-[#046279]" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
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

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        )}

        {/* Add Button */}
        <button className="flex items-center gap-2 bg-[#046279] text-white px-6 py-3 rounded-xl hover:bg-[#035067] transition mb-8 font-semibold">
          <Plus size={20} />
          Adicionar Funcionário
        </button>

        {/* Employees Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {employees.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 mb-4">Nenhum funcionário cadastrado ainda</p>
              <button className="text-[#046279] font-semibold hover:underline flex items-center gap-2 mx-auto">
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
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.employee_id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {employee.avatar_url && (
                            <img 
                              src={employee.avatar_url} 
                              alt={employee.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <p className="font-medium text-gray-900">{employee.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{employee.email}</td>
                      <td className="px-6 py-4 text-gray-600">{employee.job_title}</td>
                      <td className="px-6 py-4">
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
    </div>
  );
}