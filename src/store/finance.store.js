import { create } from 'zustand';
import { expensesService } from '../services/expenses.service';
import { incomesService } from '../services/incomes.service';
import { cardsService } from '../services/cards.service';

const useFinanceStore = create((set, get) => ({
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth() + 1,

  incomes: [],
  expenses: [],
  cards: [],
  loading: false,
  error: null,

  setMonth: (year, month) => {
    set({ currentYear: year, currentMonth: month });
    get().fetchDashboard();
  },

  prevMonth: () => {
    const { currentYear, currentMonth } = get();
    const date = new Date(currentYear, currentMonth - 2);
    get().setMonth(date.getFullYear(), date.getMonth() + 1);
  },

  nextMonth: () => {
    const { currentYear, currentMonth } = get();
    const date = new Date(currentYear, currentMonth);
    get().setMonth(date.getFullYear(), date.getMonth() + 1);
  },

  fetchDashboard: async () => {
    const { currentYear, currentMonth } = get();
    set({ loading: true, error: null });
    try {
      const [incomesRes, expensesRes, cardsRes] = await Promise.all([
        incomesService.getByMonth(currentYear, currentMonth),
        expensesService.getByMonth(currentYear, currentMonth),
        cardsService.getWithTotal(currentYear, currentMonth),
      ]);
      set({
        incomes: incomesRes.data,
        expenses: expensesRes.data,
        cards: cardsRes.data,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  totalIncomes: () => get().incomes.reduce((sum, i) => sum + i.value, 0),
  totalExpenses: () => get().expenses.reduce((sum, e) => sum + e.value, 0),
  totalCards: () => get().cards.reduce((sum, c) => sum + Number(c.total || 0), 0),
  balance: () => get().totalIncomes() - get().totalExpenses() - get().totalCards(),
}));

export default useFinanceStore;
