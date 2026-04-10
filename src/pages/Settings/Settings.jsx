import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth.store';
import styles from './Settings.module.scss';

export function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.page}>
      <h1>Configurações</h1>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}
