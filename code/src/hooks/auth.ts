'use client';

import { useState, useEffect } from 'react';
import { supabaseProxy } from '../lib/proxy';
import { supabase } from '@/lib/supabase';


export const authService = {
  /**
   * Realiza o login restrito para o funcionário padrão
   */
  async logarFuncionario(email: string, password: string) {
  //  Faz o login no Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password: password });
  if (authError) return { success: false, error: authError.message };

  //  Busca o role e os dados dele na tabela do banco usando a sua função genérica
  const { data: employeeData } = await supabaseProxy.getDataById('employees', 'auth_id', authData.user.id);

  return {
    success: true,
    data: employeeData 
  };
},

  /**
   * Realiza o logout do usuário atual
   */
  async deslogarFuncionario() {
    try {
      const { error } = await supabaseProxy.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Erro ao tentar sair." };
    }
  }
};