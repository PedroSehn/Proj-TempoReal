import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, User, Lock, Bell, Moon, FileText, Shield, Info } from 'lucide-react';
import useAuthStore from '../../store/auth.store';
import styles from './Settings.module.scss';

export function Settings() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Configurações</h1>

      {/* Perfil */}
      <div className={styles.sectionLabel}>Perfil</div>
      <div className={styles.card}>
        <button className={styles.row}>
          <User size={20} className={styles.rowIcon} />
          <span className={styles.rowLabel}>Editar Perfil</span>
          <ChevronRight size={18} className={styles.rowChevron} />
        </button>
        <div className={styles.divider} />
        <button className={styles.row}>
          <Lock size={20} className={styles.rowIcon} />
          <span className={styles.rowLabel}>Alterar Senha</span>
          <ChevronRight size={18} className={styles.rowChevron} />
        </button>
      </div>

      {/* Preferências */}
      <div className={styles.sectionLabel}>Preferências</div>
      <div className={styles.card}>
        <div className={styles.row}>
          <Bell size={20} className={styles.rowIcon} />
          <span className={styles.rowLabel}>Notificações</span>
          <button
            className={`${styles.toggle} ${notifications ? styles.toggleOn : ''}`}
            onClick={() => setNotifications((v) => !v)}
            aria-label="Notificações"
          >
            <span className={styles.thumb} />
          </button>
        </div>
        <div className={styles.divider} />
        <div className={styles.row}>
          <Moon size={20} className={styles.rowIcon} />
          <span className={styles.rowLabel}>Modo Escuro</span>
          <button
            className={`${styles.toggle} ${darkMode ? styles.toggleOn : ''}`}
            onClick={() => setDarkMode((v) => !v)}
            aria-label="Modo Escuro"
          >
            <span className={styles.thumb} />
          </button>
        </div>
      </div>

      {/* Sobre */}
      <div className={styles.sectionLabel}>Sobre</div>
      <div className={styles.card}>
        <button className={styles.row}>
          <FileText size={20} className={styles.rowIcon} />
          <span className={styles.rowLabel}>Termos de Uso</span>
          <ChevronRight size={18} className={styles.rowChevron} />
        </button>
        <div className={styles.divider} />
        <button className={styles.row}>
          <Shield size={20} className={styles.rowIcon} />
          <span className={styles.rowLabel}>Política de Privacidade</span>
          <ChevronRight size={18} className={styles.rowChevron} />
        </button>
        <div className={styles.divider} />
        <div className={styles.row}>
          <Info size={20} className={styles.rowIcon} />
          <span className={styles.rowLabel}>Versão</span>
          <span className={styles.rowMeta}>1.0.0</span>
        </div>
      </div>

      {/* Logout */}
      <button className={styles.logoutButton} onClick={handleLogout}>
        Sair da conta
      </button>
    </div>
  );
}
