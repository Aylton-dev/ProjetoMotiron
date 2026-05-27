
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log("--- DIAGNÓSTICO DO PROCESSO ---");
console.log("Caminho atual do projeto:", process.cwd());
console.log("Chave URL encontrada?", !!supabaseUrl);
console.log("Chave Anon encontrada?", !!supabaseAnonKey);
console.log("-------------------------------");

// teste temporário para garantir que as chaves estão sendo lidas corretamente
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ERRO: O Next.js não encontrou as chaves no .env.local!");
}

// Cria o cliente global para usar no projeto
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
