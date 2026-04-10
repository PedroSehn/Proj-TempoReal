import { NavLink, Outlet } from 'react-router-dom';
import { Home, CreditCard, TrendingUp, Settings } from 'lucide-react';
import styles from './Layout.module.scss';

const tabs = [
  { to: '/',           icon: Home,        label: 'Dashboard' },
  { to: '/cards',      icon: CreditCard,  label: 'Cartões'   },
  { to: '/simulation', icon: TrendingUp,  label: 'Simulação' },
  { to: '/setup',      icon: Settings,    label: 'Config.'   },
];

export function Layout() {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <Outlet />
      </main>

      <nav className={styles.tabBar}>
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `${styles.tab} ${isActive ? styles.active : ''}`
            }
          >
            <Icon size={24} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
