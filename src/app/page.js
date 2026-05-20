import styles from './login.module.css'
import logo from './assets/logo.png'

export default function Home() {
  return (
    <main className={styles.container}>
      <section className={styles.leftSide}>
        <img
          src={logo.src}
          alt="Logo"
          className={styles.logo}
        />

        <h1>UP SKILLS</h1>

        <p>O futuro pertence a quem evolui</p>
      </section>

      <section className={styles.rightSide}>
        <img
          src={logo.src}
          alt="Logo"
          className={styles.topLogo}
        />

        <h2>Bem vindo de volta</h2>

        <h3>ENTRAR</h3>

        <form className={styles.form}>
          <input
            type="email"
            placeholder="E-mail"
          />

          <input
            type="password"
            placeholder="Senha"
          />

          <div className={styles.checkboxArea}>
            <input type="checkbox" />
            <span>Manter Conectado</span>
          </div>

          <button type="submit">
            Entrar
          </button>

          <a href="#">Esqueci a senha</a>
        </form>

        <footer>
          <p>
            © 2026 UP SKILLS • Todos os direitos reservados
          </p>

          <div className={styles.footerLinks}>
            <a href="#">Termos de Uso</a>
            <a href="#">Privacidade</a>
          </div>
        </footer>
      </section>
    </main>
  )
}