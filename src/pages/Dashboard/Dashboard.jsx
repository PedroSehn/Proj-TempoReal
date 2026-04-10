import { useEffect } from 'react';
import styles from './Dashboard.module.scss';

export function Dashboard() {
  useEffect(() => {
    // fetchDashboard será implementado
  }, []);

  return (
    <div className={styles.page}>
      <h1>Dashboard</h1>
    </div>
  );
}
