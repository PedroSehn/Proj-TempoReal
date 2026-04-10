import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import useFinanceStore from '../../store/finance.store';
import { expensesService } from '../../services/expenses.service';
import { BottomSheet } from '../../components/BottomSheet/BottomSheet';
import styles from './Dashboard.module.scss';

const MONTHS = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

const fmt = (value) =>
  Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const DURATION_OPTIONS = [
  { label: 'Pontual',    value: '1'   },
  { label: 'Recorrente', value: '999' },
  { label: 'Parcelado',  value: 'custom' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const {
    currentYear, currentMonth,
    incomes, expenses, cards,
    loading, error,
    fetchDashboard, invalidateCurrentMonth, prevMonth, nextMonth,
    totalIncomes, totalExpenses, totalCards, balance,
  } = useFinanceStore();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState(defaultForm(currentMonth, currentYear));
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => { fetchDashboard(); }, []);

  function defaultForm(month, year) {
    return { label: '', emoji: '', value: '', duration_months: '999', start_month: month, start_year: year };
  }

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
      await expensesService.create({
        label: form.label,
        emoji: form.emoji || null,
        value: parseFloat(form.value),
        duration_months: parseInt(form.duration_months),
        start_month: parseInt(form.start_month),
        start_year: parseInt(form.start_year),
      });
      setSheetOpen(false);
      setForm(defaultForm(currentMonth, currentYear));
      invalidateCurrentMonth();
      fetchDashboard();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const saldo = balance();
  const totalGastos = totalExpenses() + totalCards();

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

      {/* Card de saldo */}
      <div className={styles.balanceCard}>
        <p className={styles.balanceLabel}>Saldo</p>
        <p className={`${styles.balanceValue} ${saldo >= 0 ? styles.positive : styles.negative}`}>
          R$ {fmt(saldo)}
        </p>
      </div>

      {loading ? (
        <p className={styles.loading}>Carregando...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <>
          {/* Seção Ganhos */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Ganhos</h2>
            <div className={styles.card}>
              {incomes.length === 0 && (
                <p className={styles.empty}>Nenhum ganho neste mês</p>
              )}
              {incomes.map((income, i) => (
                <div key={income.id} className={styles.listItem} data-last={i === incomes.length - 1}>
                  <span className={styles.itemEmoji}>{income.emoji}</span>
                  <span className={styles.itemLabel}>{income.label}</span>
                  <span className={`${styles.itemValue} ${styles.green}`}>R$ {fmt(income.value)}</span>
                </div>
              ))}
              <div className={`${styles.listItem} ${styles.totalRow}`}>
                <span className={styles.totalLabel}>Total</span>
                <span className={`${styles.itemValue} ${styles.green}`}>R$ {fmt(totalIncomes())}</span>
              </div>
            </div>
          </section>

          {/* Seção Gastos */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Gastos</h2>
            <div className={styles.card}>
              {expenses.length === 0 && cards.length === 0 && (
                <p className={styles.empty}>Nenhum gasto neste mês</p>
              )}
              {expenses.map((expense) => (
                <div key={expense.id} className={styles.listItem}>
                  <span className={styles.itemEmoji}>{expense.emoji}</span>
                  <span className={styles.itemLabel}>{expense.label}</span>
                  <span className={`${styles.itemValue} ${styles.red}`}>R$ {fmt(expense.value)}</span>
                </div>
              ))}
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`${styles.listItem} ${styles.clickable}`}
                  onClick={() => navigate(`/card/${card.id}`)}
                >
                  <span className={styles.cardDot} style={{ background: card.color }} />
                  <span className={styles.itemLabel}>{card.name}</span>
                  <span className={`${styles.itemValue} ${styles.red}`}>R$ {fmt(Number(card.total || 0))}</span>
                </div>
              ))}
              <div className={`${styles.listItem} ${styles.totalRow}`}>
                <span className={styles.totalLabel}>Total</span>
                <span className={`${styles.itemValue} ${styles.red}`}>R$ {fmt(totalGastos)}</span>
              </div>
            </div>
          </section>
        </>
      )}

      {/* FAB */}
      <button className={styles.fab} onClick={() => setSheetOpen(true)} aria-label="Adicionar gasto">
        <Plus size={28} color="white" />
      </button>

      {/* Bottom Sheet — Adicionar Gasto */}
      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3 className={styles.formTitle}>Adicionar Gasto</h3>

          <div className={styles.formRow}>
            <input
              className={styles.inputEmoji}
              placeholder="😀"
              value={form.emoji}
              onChange={(e) => setForm({ ...form, emoji: e.target.value })}
              maxLength={2}
            />
            <input
              className={`${styles.input} ${styles.flex1}`}
              placeholder="Descrição"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              required
            />
          </div>

          <input
            className={styles.input}
            type="number"
            placeholder="Valor (R$)"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            min="0.01"
            step="0.01"
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
