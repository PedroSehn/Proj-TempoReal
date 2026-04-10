import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import useFinanceStore from '../../store/finance.store';
import { cardsService } from '../../services/cards.service';
import { BottomSheet } from '../../components/BottomSheet/BottomSheet';
import styles from './Cards.module.scss';

const MONTHS = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

const CARD_COLORS = [
  '#007AFF', '#8B5CF6', '#FF3B30', '#34C759',
  '#FF9500', '#1C1C1E', '#5856D6', '#FF2D55',
];

const fmt = (value) =>
  Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function Cards() {
  const navigate = useNavigate();
  const {
    currentYear, currentMonth,
    cards, loading, error,
    fetchDashboard, invalidateCurrentMonth,
    prevMonth, nextMonth,
  } = useFinanceStore();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState({ name: '', emoji: '', color: CARD_COLORS[0] });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => { fetchDashboard(); }, []);

  const totalCards = cards.reduce((sum, c) => sum + Number(c.total || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await cardsService.create({
        name: form.name,
        emoji: form.emoji || null,
        color: form.color,
      });
      setSheetOpen(false);
      setForm({ name: '', emoji: '', color: CARD_COLORS[0] });
      invalidateCurrentMonth();
      fetchDashboard();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Seletor de mês */}
      <div className={styles.monthSelector}>
        <button className={styles.chevron} onClick={prevMonth}>
          <ChevronLeft size={22} />
        </button>
        <span className={styles.monthLabel}>
          {MONTHS[currentMonth - 1]} {currentYear}
        </span>
        <button className={styles.chevron} onClick={nextMonth}>
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Card de total */}
      <div className={styles.totalCard}>
        <p className={styles.totalLabel}>Total em Cartões</p>
        <p className={styles.totalValue}>R$ {fmt(totalCards)}</p>
      </div>

      {loading ? (
        <p className={styles.loading}>Carregando...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <>
          <div className={styles.cardsList}>
            {cards.length === 0 && (
              <p className={styles.empty}>Nenhum cartão cadastrado</p>
            )}
            {cards.map((card) => (
              <div key={card.id} className={styles.cardItem}>
                {/* Visual físico do cartão */}
                <div
                  className={styles.physicalCard}
                  style={{ background: `linear-gradient(135deg, ${card.color}, ${card.color}AA)` }}
                >
                  <div className={styles.cardTop}>
                    {card.emoji && <span className={styles.cardEmoji}>{card.emoji}</span>}
                    <span className={styles.cardName}>{card.name}</span>
                  </div>
                  <p className={styles.cardNumber}>•••• •••• •••• ••••</p>
                </div>

                {/* Info de fatura */}
                <div className={styles.cardInfo} onClick={() => navigate(`/card/${card.id}`)}>
                  <span className={styles.cardInfoLabel}>Fatura Atual</span>
                  <span className={styles.cardInfoValue}>R$ {fmt(Number(card.total || 0))}</span>
                  <ChevronRight size={18} color="#8E8E93" />
                </div>
              </div>
            ))}
          </div>

          <button className={styles.addButton} onClick={() => setSheetOpen(true)}>
            <Plus size={20} />
            Adicionar Cartão
          </button>
        </>
      )}

      {/* Bottom Sheet — Adicionar Cartão */}
      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3 className={styles.formTitle}>Adicionar Cartão</h3>

          <div className={styles.formRow}>
            <input
              className={styles.inputEmoji}
              placeholder="💳"
              value={form.emoji}
              onChange={(e) => setForm({ ...form, emoji: e.target.value })}
              maxLength={2}
            />
            <input
              className={`${styles.input} ${styles.flex1}`}
              placeholder="Nome do cartão"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className={styles.colorGroup}>
            <label className={styles.colorLabel}>Cor</label>
            <div className={styles.colorPicker}>
              {CARD_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`${styles.colorOption} ${form.color === color ? styles.colorSelected : ''}`}
                  style={{ background: color }}
                  onClick={() => setForm({ ...form, color })}
                />
              ))}
            </div>
          </div>

          {formError && <p className={styles.formError}>{formError}</p>}

          <button type="submit" className={styles.buttonPrimary} disabled={submitting}>
            {submitting ? 'Adicionando...' : 'Adicionar'}
          </button>
        </form>
      </BottomSheet>
    </div>
  );
}
