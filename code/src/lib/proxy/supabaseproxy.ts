import { createClient } from '../supabase/client';
import type { Categories } from '../../types/categories';
import type { Courses } from '../../types/courses';
import type { Employees } from '../../types/employees';
import type { Enrollments } from '../../types/enrollments';
import type { Modules } from '../../types/modules';

interface ProxyResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    message: string;
    code?: string;
  } | null;
}

export const supabaseProxy = {

  /**
   * Inserir dados em uma tabela
   */
  async insertData<T>(
    table: string,
    dataToInsert: Partial<T>
  ): Promise<ProxyResponse<T>> {

    try {

      
      const supabase = createClient();
      const { data, error } = await supabase.from(table)
        .select();

      if (error) {

        console.error(
          `[Supabase Error] Erro ao inserir na tabela ${table}:`,
          error
        );

        return {
          success: false,
          data: null,
          error: {
            message: traduzirErroSupabase(error.code)
          }
        };
      }

      return {
        success: true,
        data: data ? data[0] : null,
        error: null
      };

    } catch (catchError: unknown) {

      console.error(
        `[Network Error] Falha ao enviar dados para o proxy:`,
        catchError
      );

      return {
        success: false,
        data: null,
        error: {
          message: 'Erro de conexão com o servidor. Tente novamente.'
        }
      };
    }
  },

  /**
   * Buscar todos os dados de uma tabela
   */
  async getData<T>(
    table: string
  ): Promise<ProxyResponse<T[]>> {

    try {

      const supabase = createClient();
        const { data, error } = await supabase
          .from(table)
          .select();

      if (error) {

        console.error(
          `[Supabase Error] Erro ao buscar dados da tabela ${table}:`,
          error
        );

        return {
          success: false,
          data: null,
          error: {
            message: traduzirErroSupabase(error.code)
          }
        };
      }

      return {
        success: true,
        data: data || [],
        error: null
      };

    } catch (catchError: unknown) {

      console.error(
        `[Network Error] Falha ao buscar dados:`,
        catchError
      );

      return {
        success: false,
        data: null,
        error: {
          message: 'Erro de conexão com o servidor. Tente novamente.'
        }
      };
    }
  },

  /**
   * Buscar um item específico por ID
   */
  async getDataById<T>(
    table: string,
    idColumn: string,
    id: number | string
  ): Promise<ProxyResponse<T>> {

    try {

      const supabase = createClient();
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq(idColumn, id)
        .single();

      if (error) {

        console.error(
          `[Supabase Error] Erro ao buscar dados da tabela ${table}:`,
          error
        );

        return {
          success: false,
          data: null,
          error: {
            message: traduzirErroSupabase(error.code)
          }
        };
      }

      return {
        success: true,
        data: data || null,
        error: null
      };

    } catch (catchError: unknown) {

      console.error(
        `[Network Error] Falha ao buscar dados:`,
        catchError
      );

      return {
        success: false,
        data: null,
        error: {
          message: 'Erro de conexão com o servidor. Tente novamente.'
        }
      };
    }
  },

  /**
   * Atualizar dados em uma tabela
   */
  async updateData<T>(
    table: string,
    idColumn: string,
    id: number | string,
    dataToUpdate: Partial<T>
  ): Promise<ProxyResponse<T>> {

    try {

      const supabase = createClient();  
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq(idColumn, id)
        .single();

      if (error) {

        console.error(
          `[Supabase Error] Erro ao atualizar na tabela ${table}:`,
          error
        );

        return {
          success: false,
          data: null,
          error: {
            message: traduzirErroSupabase(error.code)
          }
        };
      }

      return {
        success: true,
        data: data || null,
        error: null
      };

    } catch (catchError: unknown) {

      console.error(
        `[Network Error] Falha ao atualizar dados:`,
        catchError
      );

      return {
        success: false,
        data: null,
        error: {
          message: 'Erro de conexão com o servidor. Tente novamente.'
        }
      };
    }
  },

  /**
   * Deletar dados de uma tabela
   */
  async deleteData(
    table: string,
    idColumn: string,
    id: number | string
  ): Promise<ProxyResponse<null>> {

    try {

      const supabase = createClient();
      const { error } = await supabase
        .from(table)
        .delete()
        .eq(idColumn, id);

      if (error) {

        console.error(
          `[Supabase Error] Erro ao deletar na tabela ${table}:`,
          error
        );

        return {
          success: false,
          data: null,
          error: {
            message: traduzirErroSupabase(error.code)
          }
        };
      }

      return {
        success: true,
        data: null,
        error: null
      };

    } catch (catchError: unknown) {

      console.error(
        `[Network Error] Falha ao deletar dados:`,
        catchError
      );

      return {
        success: false,
        data: null,
        error: {
          message: 'Erro de conexão com o servidor. Tente novamente.'
        }
      };
    }
  },

  
  categories: {
    getAll: () => supabaseProxy.getData<Categories>('categories'),
    getById: (id: number) => supabaseProxy.getDataById<Categories>('categories', 'category_id', id),
    create: (data: Partial<Categories>) => supabaseProxy.insertData<Categories>('categories', data),
    update: (id: number, data: Partial<Categories>) => supabaseProxy.updateData<Categories>('categories', 'category_id', id, data),
    delete: (id: number) => supabaseProxy.deleteData('categories', 'category_id', id),
  },

  
  courses: {
    getAll: () => supabaseProxy.getData<Courses>('courses'),
    getById: (id: number) => supabaseProxy.getDataById<Courses>('courses', 'course_id', id),
    create: (data: Partial<Courses>) => supabaseProxy.insertData<Courses>('courses', data),
    update: (id: number, data: Partial<Courses>) => supabaseProxy.updateData<Courses>('courses', 'course_id', id, data),
    delete: (id: number) => supabaseProxy.deleteData('courses', 'course_id', id),
  },

  
  employees: {
    getAll: () => supabaseProxy.getData<Employees>('employees'),
    getById: (id: number) => supabaseProxy.getDataById<Employees>('employees', 'employee_id', id),
    create: (data: Partial<Employees>) => supabaseProxy.insertData<Employees>('employees', data),
    update: (id: number, data: Partial<Employees>) => supabaseProxy.updateData<Employees>('employees', 'employee_id', id, data),
    delete: (id: number) => supabaseProxy.deleteData('employees', 'employee_id', id),
  },

 
  enrollments: {
    getAll: () => supabaseProxy.getData<Enrollments>('enrollments'),
    getById: (id: number) => supabaseProxy.getDataById<Enrollments>('enrollments', 'enrollment_id', id),
    create: (data: Partial<Enrollments>) => supabaseProxy.insertData<Enrollments>('enrollments', data),
    update: (id: number, data: Partial<Enrollments>) => supabaseProxy.updateData<Enrollments>('enrollments', 'enrollment_id', id, data),
    delete: (id: number) => supabaseProxy.deleteData('enrollments', 'enrollment_id', id),
  },


  modules: {
    getAll: () => supabaseProxy.getData<Modules>('modules'),
    getById: (id: number) => supabaseProxy.getDataById<Modules>('modules', 'module_id', id),
    create: (data: Partial<Modules>) => supabaseProxy.insertData<Modules>('modules', data),
    update: (id: number, data: Partial<Modules>) => supabaseProxy.updateData<Modules>('modules', 'module_id', id, data),
    delete: (id: number) => supabaseProxy.deleteData('modules', 'module_id', id),
  }

};


function traduzirErroSupabase(code?: string): string {

  switch (code) {

    case '23505':
      return 'Este e-mail já está cadastrado para outro funcionário.';

    case '42P01':
      return 'Tabela não encontrada no banco de dados.';

    case '23503':
      return 'Foreign key inválida. Verifique os dados relacionados.';

    case '42501':
      return 'Sem permissão para acessar a tabela.';

    case 'PGRST116':
      return 'Nenhum registro encontrado.';

    default:
      return 'Ocorreu um erro ao acessar o banco de dados.';
  }
}