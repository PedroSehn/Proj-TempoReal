import { useParams } from 'react-router-dom';
import styles from './CardDetail.module.scss';

export function CardDetail() {
  const { cardId } = useParams();

  return (
    <div className={styles.page}>
      <h1>Cartão {cardId}</h1>
    </div>
  );
}
