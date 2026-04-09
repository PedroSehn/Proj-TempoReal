# Skill: Store (Zustand)

Estado global do app com Zustand. Dois stores: auth e finance.

## Padrão de store

```js
import { create } from 'zustand';

const useXStore = create((set, get) => ({
  // estado
  data: null,
  loading: false,
  error: null,

  // ações
  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await someService.get();
      set({ data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
```

## auth.store.js

```js
// src/store/auth.store.js
import { create } from 'zustand';
import { authService } from '../services/auth.service';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('financa_token') || null,
  isAuthenticated: !!localStorage.getItem('financa_token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authService.login(email, password);
      localStorage.setItem('financa_token', data.token);
      set({ user: data.user, token: data.token, isAuthenticated: true, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('financa_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
```

## finance.store.js

```js
// src/store/finance.store.js
import { create } from 'zustand';
import { expensesService } from '../services/expenses.service';
import { incomesService } from '../services/incomes.service';
import { cardsService } from '../services/cards.service';

const useFinanceStore = create((set, get) => ({
  // mês atual selecionado
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth() + 1, // 1-12

  // dados
  incomes: [],
  expenses: [],
  cards: [],
  loading: false,
  error: null,

  // navegação de mês
  setMonth: (year, month) => {
    set({ currentYear: year, currentMonth: month });
    get().fetchDashboard();
  },

  prevMonth: () => {
    const { currentYear, currentMonth } = get();
    const date = new Date(currentYear, currentMonth - 2); // -2 porque month é 1-indexed
    get().setMonth(date.getFullYear(), date.getMonth() + 1);
  },

  nextMonth: () => {
    const { currentYear, currentMonth } = get();
    const date = new Date(currentYear, currentMonth); // sem -1 avança um mês
    get().setMonth(date.getFullYear(), date.getMonth() + 1);
  },

  // busca tudo do mês atual
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

  // seletores computados
  totalIncomes: () => get().incomes.reduce((sum, i) => sum + i.value, 0),
  totalExpenses: () => get().expenses.reduce((sum, e) => sum + e.value, 0),
  totalCards: () => get().cards.reduce((sum, c) => sum + Number(c.total), 0),
  balance: () => get().totalIncomes() - get().totalExpenses() - get().totalCards(),
}));

export default useFinanceStore;
```

## Como usar nos componentes

```jsx
// Leitura de estado
const { incomes, loading } = useFinanceStore();

// Ações
const { fetchDashboard, prevMonth, nextMonth } = useFinanceStore();

// Seletores computados (chamar como função)
const { balance, totalIncomes } = useFinanceStore();
const saldo = balance(); // chamar como função

// Auth
const { isAuthenticated, login, logout } = useAuthStore();
```

## Regras
- NUNCA buscar dados diretamente nos componentes — sempre via store
- SEMPRE tratar loading e error nos componentes que usam dados assíncronos
- Seletores computados (balance, totalIncomes) são funções — chamar com `()`
- `currentMonth` é 1-indexed (1 = janeiro, 12 = dezembro)
