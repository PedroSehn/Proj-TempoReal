import { create } from 'zustand';
import { dashboardService } from '../services/dashboard.service';

let debounceTimer = null;
let currentRequestId = 0;
const monthCache = {};

const cacheKey = (year, month) => `${year}-${month}`;

const useFinanceStore = create((set, get) => ({
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth() + 1,

  incomes: [],
  expenses: [],
  cards: [],
  loading: false,
  error: null,

  setMonth: (year, month) => {
    const cached = monthCache[cacheKey(year, month)];

    if (cached) {
      set({
        currentYear: year,
        currentMonth: month,
        incomes: cached.incomes,
        expenses: cached.expenses,
        cards: cached.cards,
        loading: false,
        error: null,
      });
      return;
    }

    set({ currentYear: year, currentMonth: month, incomes: [], expenses: [], cards: [] });
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => get().fetchDashboard(), 300);
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
    const requestId = ++currentRequestId;
    set({ loading: true, error: null });
    try {
      const { incomes, expenses, cards } = await dashboardService.getByMonth(currentYear, currentMonth);

      if (requestId !== currentRequestId) return;

      monthCache[cacheKey(currentYear, currentMonth)] = { incomes, expenses, cards };

      set({ incomes, expenses, cards, loading: false });
    } catch (error) {
      if (requestId !== currentRequestId) return;
      set({ error: error.message, loading: false });
    }
  },

  invalidateCurrentMonth: () => {
    const { currentYear, currentMonth } = get();
    delete monthCache[cacheKey(currentYear, currentMonth)];
  },

  totalIncomes: () => get().incomes.reduce((sum, i) => sum + Number(i.value || 0), 0),
  totalExpenses: () => get().expenses.reduce((sum, e) => sum + Number(e.value || 0), 0),
  totalCards: () => get().cards.reduce((sum, c) => sum + Number(c.total || 0), 0),
  balance: () => get().totalIncomes() - get().totalExpenses() - get().totalCards(),
}));

export default useFinanceStore;
