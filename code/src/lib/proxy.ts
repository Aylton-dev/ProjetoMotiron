import { supabase } from './supabase';

interface ProxyResponse<T> {
  success: boolean;
  data: T | null;
  error: { message: string; code?: string; } | null;
}

export const supabaseProxy = {

  /**
   * Método para cadastrar dados em uma tabela com tratamento de erro
   */
  async insertData<T>(table: string, dataToInsert: any): Promise<ProxyResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(table)
        .insert([dataToInsert])
        .select(); // O .select() força o retorno do dado criado

      if (error) {
        console.error(`[Supabase Error] Erro ao inserir na tabela ${table}:`, error);
        return {
          success: false,
          data: null,
          error: { message: traduzirErroSupabase(error.code) },
        };
      }

      return {
        success: true,
        data: data ? data[0] : null,
        error: null,
      };

    } catch (catchError: any) {
      console.error(`[Network Error] Falha ao enviar dados para o proxy:`, catchError);
      return {
        success: false,
        data: null,
        error: { message: 'Erro de conexão com o servidor. Tente novamente.' },
      };
    }
  }
};

function traduzirErroSupabase(code: string): string {
  switch (code) {
    case '23505': return 'Este e-mail já está cadastrado para outro funcionário.';
    case '42P01': return 'Tabela de funcionários não encontrada no banco.';
    default: return 'Ocorreu um erro ao salvar os dados no banco.';
  }
}
