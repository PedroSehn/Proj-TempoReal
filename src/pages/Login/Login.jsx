import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../../store/auth.store';
import styles from './Login.module.scss';

export function Login() {
  const navigate = useNavigate();
  const { login, loginDemo, loading, error } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    if (useAuthStore.getState().isAuthenticated) navigate('/', { replace: true });
  };

  const handleDemo = () => {
    loginDemo();
    navigate('/', { replace: true });
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.emoji}>💰</span>
        <h1>Finança</h1>
        <p>Controle seu dinheiro com clareza</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />

        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <a href="#" className={styles.forgotPassword}>Esqueceu a senha?</a>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.buttonPrimary} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <a href="#" className={styles.register}>Cadastre-se</a>

      <div className={styles.demoCard}>
        <p>💡 Quer explorar sem criar conta?</p>
        <button type="button" onClick={handleDemo} className={styles.demoButton}>
          Entrar como Demo
        </button>
      </div>
    </div>
  );
}
