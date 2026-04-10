import styles from './Simulation.module.scss';

export function Simulation() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <span className={styles.emoji}>🚧</span>
        <h1 className={styles.title}>Em construção</h1>
        <p className={styles.subtitle}>
          A simulação de compras parceladas está chegando em breve.
        </p>
      </div>
    </div>
  );
}
