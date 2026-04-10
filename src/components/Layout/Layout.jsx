import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, CreditCard, TrendingUp, Settings } from 'lucide-react';
import styles from './Layout.module.scss';

const tabs = [
  { to: '/',           icon: Home,        label: 'Dashboard' },
  { to: '/cards',      icon: CreditCard,  label: 'Cartões'   },
  { to: '/simulation', icon: TrendingUp,  label: 'Simulação' },
  { to: '/setup',      icon: Settings,    label: 'Config.'   },
];

export function Layout() {
  const { pathname } = useLocation();

  const isActive = (to) => {
    if (to === '/') return pathname === '/';
    if (to === '/cards') return pathname === '/cards' || pathname.startsWith('/card/');
    return pathname.startsWith(to);
  };

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
            className={`${styles.tab} ${isActive(to) ? styles.active : ''}`}
          >
            <Icon size={24} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
