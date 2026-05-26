import { supabase } from './supabase';
import type { Category } from '../types/category';
import type { Course } from '../types/course';
import type { Employee } from '../types/employee';
import type { Enrollment } from '../types/enrollment';
import type { Module } from '../types/module';

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

      const { data, error } = await supabase
        .from(table)
        .insert([dataToInsert])
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

      const { data, error } = await supabase
        .from(table)
        .select('*');

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

      const { data, error } = await supabase
        .from(table)
        .update(dataToUpdate)
        .eq(idColumn, id)
        .select()
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
    getAll: () => supabaseProxy.getData<Category>('categories'),
    getById: (id: number) => supabaseProxy.getDataById<Category>('categories', 'category_id', id),
    create: (data: Partial<Category>) => supabaseProxy.insertData<Category>('categories', data),
    update: (id: number, data: Partial<Category>) => supabaseProxy.updateData<Category>('categories', 'category_id', id, data),
    delete: (id: number) => supabaseProxy.deleteData('categories', 'category_id', id),
  },

  
  courses: {
    getAll: () => supabaseProxy.getData<Course>('courses'),
    getById: (id: number) => supabaseProxy.getDataById<Course>('courses', 'course_id', id),
    create: (data: Partial<Course>) => supabaseProxy.insertData<Course>('courses', data),
    update: (id: number, data: Partial<Course>) => supabaseProxy.updateData<Course>('courses', 'course_id', id, data),
    delete: (id: number) => supabaseProxy.deleteData('courses', 'course_id', id),
  },

  
  employees: {
    getAll: () => supabaseProxy.getData<Employee>('employees'),
    getById: (id: number) => supabaseProxy.getDataById<Employee>('employees', 'employee_id', id),
    create: (data: Partial<Employee>) => supabaseProxy.insertData<Employee>('employees', data),
    update: (id: number, data: Partial<Employee>) => supabaseProxy.updateData<Employee>('employees', 'employee_id', id, data),
    delete: (id: number) => supabaseProxy.deleteData('employees', 'employee_id', id),
  },

 
  enrollments: {
    getAll: () => supabaseProxy.getData<Enrollment>('enrollments'),
    getById: (id: number) => supabaseProxy.getDataById<Enrollment>('enrollments', 'enrollment_id', id),
    create: (data: Partial<Enrollment>) => supabaseProxy.insertData<Enrollment>('enrollments', data),
    update: (id: number, data: Partial<Enrollment>) => supabaseProxy.updateData<Enrollment>('enrollments', 'enrollment_id', id, data),
    delete: (id: number) => supabaseProxy.deleteData('enrollments', 'enrollment_id', id),
  },


  modules: {
    getAll: () => supabaseProxy.getData<Module>('modules'),
    getById: (id: number) => supabaseProxy.getDataById<Module>('modules', 'module_id', id),
    create: (data: Partial<Module>) => supabaseProxy.insertData<Module>('modules', data),
    update: (id: number, data: Partial<Module>) => supabaseProxy.updateData<Module>('modules', 'module_id', id, data),
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