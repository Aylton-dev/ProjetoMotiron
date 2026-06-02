'use client';

import styles from './login.module.css';
import logo from '../../public/imgs/logo.png';
import { authService } from '../hooks/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 


export default function Home() {
  const router = useRouter();

  //  Estados para controlar os campos do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  //  Função que processa o envio do formulário
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault(); 
  setLoading(true);
  setErrorFeedback(null);

  try {
    // Validações básicas de formato
    if (!email.includes('@') || !email.includes('.')) {
      throw new Error('Por favor, insira um formato de e-mail válido (ex: nome@empresa.com).');
    }

    if (password.length < 6) {
      throw new Error('A senha deve conter pelo menos 6 caracteres.');
    }

    // Executa o serviço de autenticação do funcionário
    const result = await authService.logarFuncionario(email, password);

    if (result.success && result.data) {
      
      
      const dadosUsuario = result.data as { role?: string };
      const userRole = dadosUsuario.role;

        // Redireciona com base na role do usuário
      if (userRole === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }

    } else {
      // Dispara o erro retornado pelo Supabase ou pela regra de e-mail bloqueado
      throw new Error(result.error || 'Falha ao realizar login. Verifique suas credenciais.');
    }

  } catch (error: any) {
    // Captura a exceção 
    setErrorFeedback(error.message || 'Ocorreu um erro inesperado.');
  } finally {
    setLoading(false);
  }
};

  return (
    <main className={styles.container}>
      <section className={styles.leftSide}>
        <img src={logo.src} alt="Logo" className={styles.logo} />
        <h1>UP SKILLS</h1>
        <p>O futuro pertence a quem evolui</p>
      </section>

      <section className={styles.rightSide}>
        <img src={logo.src} alt="Logo" className={styles.topLogo} />
        <h2>Bem vindo de volta</h2>
        <h3>ENTRAR</h3>

       
        {errorFeedback && (
          <div className={styles.errorAlert} style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            fontSize: '0.8rem',
            marginBottom: '1rem',
            fontWeight: '600'
          }}>
             {errorFeedback}
          </div>
        )}

        
        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="email" 
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <div className={styles.checkboxArea}>
            <input type="checkbox" id="keepConnected" />
            <label htmlFor="keepConnected" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
              Manter Conectado
            </label>
          </div>

          {/* O redirecionamento agora é controlado pelo handleLogin */}
          <button type="submit" disabled={loading}>
            {loading ? 'Carregando...' : 'Entrar'}
          </button>

          <a href="#">Esqueci a senha</a>
        </form>

        <footer>
          <p>© 2026 UP SKILLS • Todos os direitos reservados</p>
          <div className={styles.footerLinks}>
            <a href="#">Termos de Uso</a>
            <a href="#">Privacidade</a>
          </div>
        </footer>
      </section>
    </main>
  );
}