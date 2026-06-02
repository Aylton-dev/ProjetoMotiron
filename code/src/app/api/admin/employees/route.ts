import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Inicializa o cliente com a Service Role Key (Chave Mestra do Servidor)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, job_title, role, bio, avatar_url } = body;

    // 1. Validação simples de campos obrigatórios
    if (!email || !password || !name || !job_title) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios ausentes.' },
        { status: 400 }
      );
    }

    // Criação do usuário na Autenticação do Supabase
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, 
      user_metadata: { 
        full_name: name,
        role: role 
      }
    });

    if (authError || !authUser.user) {
      console.error('[Supabase Auth Admin Error]:', authError);
      return NextResponse.json(
        { success: false, error: authError?.message || 'Erro ao criar conta no sistema de autenticação.' },
        { status: 400 }
      );
    }

    // Insere os dados na tabela 'employees'
    const { data: employee, error: dbError } = await supabaseAdmin
      .from('employees')
      .insert({
        auth_id: authUser.user.id, 
        name,
        email,
        job_title,
        role: role || 'employee',
        bio: bio || null,         
        avatar_url: avatar_url || null,
        created_at: new Date().toISOString() 
      })
      .select()
      .single();

    if (dbError) {
      console.error('[Supabase DB Admin Error]:', dbError);
      
      // Rollback de segurança
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);

      return NextResponse.json(
        { success: false, error: 'Usuário autenticado, mas erro ao salvar dados na tabela.' },
        { status: 400 }
      );
    }

   
    
   // Criação do enrollment para curso padrao
    
    const ID_DO_CURSO_PADRAO = 1; 

    const { error: enrollError } = await supabaseAdmin
      .from('enrollments') 
      .insert({
        employee_id: employee.employee_id, 
        course_id: 1,     
        status: 'active',                  
        created_at: new Date().toISOString(),
        progress: 0,
        categorie_id: 1
      });

    if (enrollError) {
 
      console.error('[Supabase Enrollment Error - Ignorado para não travar o cadastro]:', enrollError);
    }

    

    // Retorna o funcionário criado com sucesso
    return NextResponse.json({ success: true, data: employee });

  } catch (error: any) {
    console.error('[API Route Handler Catch]:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno no servidor.' },
      { status: 500 }
    );
  }
}