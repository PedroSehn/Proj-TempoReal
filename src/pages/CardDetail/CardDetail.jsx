import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import useFinanceStore from '../../store/finance.store';
import { cardsService } from '../../services/cards.service';
import { BottomSheet } from '../../components/BottomSheet/BottomSheet';
import styles from './CardDetail.module.scss';

const MONTHS = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

const fmt = (value) =>
  Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const todayStr = () => new Date().toISOString().split('T')[0];

const DURATION_OPTIONS = [
  { label: 'Pontual',   value: '1'      },
  { label: 'Parcelado', value: 'custom' },
];

export function CardDetail() {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const { cards, currentYear, currentMonth, fetchDashboard, invalidateCurrentMonth } = useFinanceStore();

  const card = cards.find((c) => String(c.id) === cardId);

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [form, setForm] = useState(defaultForm(currentMonth, currentYear));

  function defaultForm(m, y) {
    return {
      description: '',
      emoji: '',
      value: '',
      date: todayStr(),
      start_month: m,
      start_year: y,
      duration_months: '1',
    };
  }

  useEffect(() => {
    setLoading(true);
    cardsService
      .getTransactions(cardId, year, month)
      .then(({ data }) => setTransactions(data))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, [cardId, year, month]);

  const prevMonth = () => {
    const d = new Date(year, month - 2);
    setYear(d.getFullYear());
    setMonth(d.getMonth() + 1);
  };

  const nextMonth = () => {
    const d = new Date(year, month);
    setYear(d.getFullYear());
    setMonth(d.getMonth() + 1);
  };

  const total = transactions.reduce((sum, tx) => sum + Number(tx.value || 0), 0);

  const getInstallmentBadge = (tx) => {
    if (!tx.duration_months || tx.duration_months <= 1) return null;
    const num = (year * 12 + month) - (tx.start_year * 12 + tx.start_month) + 1;
    const den = tx.duration_months === 999 ? '∞' : tx.duration_months;
    return `${num}/${den}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  const isCustomDuration = !['1', '999'].includes(form.duration_months);

  const handleDurationOption = (val) => {
    setForm((f) => ({ ...f, duration_months: val === 'custom' ? '2' : val }));
  };

  const activeDurationOption = (val) => {
    if (val === 'custom') return isCustomDuration;
    return form.duration_months === val;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await cardsService.createTransaction(cardId, {
        description: form.description,
        emoji: form.emoji || null,
        value: parseFloat(form.value),
        date: form.date,
        start_month: parseInt(form.start_month),
        start_year: parseInt(form.start_year),
        duration_months: parseInt(form.duration_months),
      });
      const { data } = await cardsService.getTransactions(cardId, year, month);
      setTransactions(data);
      setSheetOpen(false);
      setForm(defaultForm(month, year));
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
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>
          {card?.emoji} {card?.name || 'Cartão'}
        </h1>
      </div>

      {/* Seletor de mês */}
      <div className={styles.monthSelector}>
        <button className={styles.chevron} onClick={prevMonth}>
          <ChevronLeft size={22} />
        </button>
        <span className={styles.monthLabel}>
          {MONTHS[month - 1]} {year}
        </span>
        <button className={styles.chevron} onClick={nextMonth}>
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Card de fatura */}
      <div
        className={styles.faturaCard}
        style={{ borderLeftColor: card?.color || '#007AFF' }}
      >
        <p className={styles.faturaLabel}>Fatura {MONTHS[month - 1]}</p>
        <p className={styles.faturaValue}>R$ {fmt(total)}</p>
      </div>

      {/* Transações */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Transações</h2>
        <div className={styles.card}>
          {loading ? (
            <p className={styles.loading}>Carregando...</p>
          ) : transactions.length === 0 ? (
            <p className={styles.empty}>Nenhuma transação neste mês</p>
          ) : (
            transactions.map((tx) => {
              const badge = getInstallmentBadge(tx);
              return (
                <div key={tx.id} className={styles.listItem}>
                  {tx.emoji && <span className={styles.itemEmoji}>{tx.emoji}</span>}
                  <span className={styles.itemLabel}>{tx.description}</span>
                  {badge && <span className={styles.badge}>{badge}</span>}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* FAB */}
      <button className={styles.fab} onClick={() => setSheetOpen(true)} aria-label="Adicionar transação">
        <Plus size={28} color="white" />
      </button>

      {/* Bottom Sheet — Adicionar Transação */}
      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3 className={styles.formTitle}>Adicionar Transação</h3>

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
              placeholder="Descrição"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <input
            className={styles.input}
            type="number"
            placeholder="Valor da parcela (R$)"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            min="0.01"
            step="0.01"
            required
          />

          <input
            className={styles.input}
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />

          <div className={styles.formRow}>
            <select
              className={`${styles.input} ${styles.flex1}`}
              value={form.start_month}
              onChange={(e) => setForm({ ...form, start_month: e.target.value })}
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
            <input
              className={`${styles.input} ${styles.yearInput}`}
              type="number"
              placeholder="Ano"
              value={form.start_year}
              onChange={(e) => setForm({ ...form, start_year: e.target.value })}
              required
            />
          </div>

          <div className={styles.durationGroup}>
            <label className={styles.durationLabel}>Duração</label>
            <div className={styles.durationOptions}>
              {DURATION_OPTIONS.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  className={`${styles.durationBtn} ${activeDurationOption(value) ? styles.durationActive : ''}`}
                  onClick={() => handleDurationOption(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            {isCustomDuration && (
              <input
                className={styles.input}
                type="number"
                placeholder="Número de parcelas"
                value={form.duration_months}
                onChange={(e) => setForm({ ...form, duration_months: e.target.value })}
                min="2"
                required
              />
            )}
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
