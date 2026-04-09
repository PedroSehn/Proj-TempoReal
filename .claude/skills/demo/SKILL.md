# Skill: Demo Mode

O modo demo simula o sistema completo sem nenhuma chamada à API.
Todos os dados vivem no localStorage e são manipulados diretamente no frontend.

## Fluxo de entrada no demo

1. Usuário clica em "Entrar como Demo" na tela de Login
2. `authStore.loginDemo()` é chamado — sem fetch, sem API
3. Dados fictícios são populados no localStorage via `demoService.seed()`
4. Flag `financa_demo: true` é salva no localStorage
5. Usuário é redirecionado para `/` normalmente

## Fluxo de saída do demo

1. Usuário clica em "Sair" nas configurações
2. `authStore.logout()` detecta `financa_demo: true`
3. Todo o localStorage do demo é limpo (`demoService.clear()`)
4. Usuário é redirecionado para `/login`

---

## Chaves do localStorage

```js
financa_token     // "demo-token" (string fixa, sem JWT real)
financa_demo      // "true"
financa_user      // JSON do usuário demo
financa_incomes   // JSON array de ganhos
financa_expenses  // JSON array de despesas
financa_cards     // JSON array de cartões
financa_card_transactions_:cardId  // JSON array de transações por cartão
financa_salary    // JSON da configuração de salário
```

---

## demoService.js

```js
// src/services/demo.service.js

const DEMO_USER = {
  id: 'demo',
  name: 'Pedro Demo',
  email: 'demo@financa.app',
  is_demo: true,
};

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1;

// Gera id único para itens do demo
const demoId = () => `demo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const SEED_DATA = {
  salary: {
    gross_salary: 5500,
    has_inss: true,
    has_irrf: true,
    vt_percentage: 6,
    health_plan: 0,
    other_discounts: [],
    net_salary: 3800,
  },

  incomes: [
    {
      id: demoId(),
      label: 'Salário Líquido',
      emoji: '💼',
      value: 3800,
      type: 'salary',
      start_month: 1,
      start_year: CURRENT_YEAR,
      duration_months: 999,
    },
    {
      id: demoId(),
      label: 'Vale Refeição',
      emoji: '🍽️',
      value: 792,
      type: 'vr',
      start_month: 1,
      start_year: CURRENT_YEAR,
      duration_months: 999,
    },
    {
      id: demoId(),
      label: 'Freela Design',
      emoji: '🎨',
      value: 500,
      type: 'extra',
      start_month: CURRENT_MONTH,
      start_year: CURRENT_YEAR,
      duration_months: 1,
    },
  ],

  expenses: [
    {
      id: demoId(),
      label: 'Aluguel',
      emoji: '🏠',
      value: 1100,
      category: 'moradia',
      start_month: 1,
      start_year: CURRENT_YEAR,
      duration_months: 999,
    },
    {
      id: demoId(),
      label: 'Internet',
      emoji: '📡',
      value: 119,
      category: 'moradia',
      start_month: 1,
      start_year: CURRENT_YEAR,
      duration_months: 999,
    },
    {
      id: demoId(),
      label: 'Celular',
      emoji: '📱',
      value: 60,
      category: 'moradia',
      start_month: 1,
      start_year: CURRENT_YEAR,
      duration_months: 999,
    },
    {
      id: demoId(),
      label: 'Psicóloga',
      emoji: '🧠',
      value: 400,
      category: 'saúde',
      start_month: 1,
      start_year: CURRENT_YEAR,
      duration_months: 999,
    },
    {
      id: demoId(),
      label: 'Remédios',
      emoji: '💊',
      value: 150,
      category: 'saúde',
      start_month: 1,
      start_year: CURRENT_YEAR,
      duration_months: 999,
    },
    {
      id: demoId(),
      label: 'Academia',
      emoji: '💪',
      value: 110,
      category: 'saúde',
      start_month: 1,
      start_year: CURRENT_YEAR,
      duration_months: 999,
    },
    {
      id: demoId(),
      label: 'RTX 5060',
      emoji: '🖥️',
      value: 212,
      category: 'tecnologia',
      start_month: 2,
      start_year: CURRENT_YEAR,
      duration_months: 10,
    },
  ],

  cards: [
    {
      id: 'demo_nubank',
      name: 'Nubank',
      emoji: '💳',
      color: '#8B10AE',
    },
    {
      id: 'demo_inter',
      name: 'Inter',
      emoji: '💳',
      color: '#FF7A00',
    },
  ],

  card_transactions: {
    demo_nubank: [
      {
        id: demoId(),
        description: 'Spotify',
        emoji: '🎵',
        value: 21.90,
        date: `${CURRENT_YEAR}-${String(CURRENT_MONTH).padStart(2, '0')}-05`,
        start_month: CURRENT_MONTH,
        start_year: CURRENT_YEAR,
        duration_months: 1,
      },
      {
        id: demoId(),
        description: 'iCloud 50GB',
        emoji: '☁️',
        value: 4.90,
        date: `${CURRENT_YEAR}-${String(CURRENT_MONTH).padStart(2, '0')}-10`,
        start_month: CURRENT_MONTH,
        start_year: CURRENT_YEAR,
        duration_months: 1,
      },
      {
        id: demoId(),
        description: 'Tênis Nike',
        emoji: '👟',
        value: 299.99,
        date: `${CURRENT_YEAR}-${String(CURRENT_MONTH).padStart(2, '0')}-12`,
        start_month: CURRENT_MONTH - 2 > 0 ? CURRENT_MONTH - 2 : 1,
        start_year: CURRENT_YEAR,
        duration_months: 6,
      },
      {
        id: demoId(),
        description: 'Mercado',
        emoji: '🛒',
        value: 387.50,
        date: `${CURRENT_YEAR}-${String(CURRENT_MONTH).padStart(2, '0')}-18`,
        start_month: CURRENT_MONTH,
        start_year: CURRENT_YEAR,
        duration_months: 1,
      },
    ],
    demo_inter: [
      {
        id: demoId(),
        description: 'Netflix',
        emoji: '🎬',
        value: 44.90,
        date: `${CURRENT_YEAR}-${String(CURRENT_MONTH).padStart(2, '0')}-01`,
        start_month: CURRENT_MONTH,
        start_year: CURRENT_YEAR,
        duration_months: 1,
      },
      {
        id: demoId(),
        description: 'Curso React',
        emoji: '📚',
        value: 97.00,
        date: `${CURRENT_YEAR}-${String(CURRENT_MONTH).padStart(2, '0')}-15`,
        start_month: CURRENT_MONTH - 1 > 0 ? CURRENT_MONTH - 1 : 1,
        start_year: CURRENT_YEAR,
        duration_months: 10,
      },
    ],
  },
};

export const demoService = {
  // Popula o localStorage com dados fictícios
  seed: () => {
    localStorage.setItem('financa_demo', 'true');
    localStorage.setItem('financa_token', 'demo-token');
    localStorage.setItem('financa_user', JSON.stringify(DEMO_USER));
    localStorage.setItem('financa_salary', JSON.stringify(SEED_DATA.salary));
    localStorage.setItem('financa_incomes', JSON.stringify(SEED_DATA.incomes));
    localStorage.setItem('financa_expenses', JSON.stringify(SEED_DATA.expenses));
    localStorage.setItem('financa_cards', JSON.stringify(SEED_DATA.cards));

    SEED_DATA.cards.forEach((card) => {
      const transactions = SEED_DATA.card_transactions[card.id] || [];
      localStorage.setItem(`financa_card_transactions_${card.id}`, JSON.stringify(transactions));
    });
  },

  // Limpa todo o localStorage do demo
  clear: () => {
    const cards = JSON.parse(localStorage.getItem('financa_cards') || '[]');
    cards.forEach((card) => {
      localStorage.removeItem(`financa_card_transactions_${card.id}`);
    });
    localStorage.removeItem('financa_demo');
    localStorage.removeItem('financa_token');
    localStorage.removeItem('financa_user');
    localStorage.removeItem('financa_salary');
    localStorage.removeItem('financa_incomes');
    localStorage.removeItem('financa_expenses');
    localStorage.removeItem('financa_cards');
  },

  isDemo: () => localStorage.getItem('financa_demo') === 'true',
};
```

---

## Como os services detectam o modo demo

Cada service verifica `demoService.isDemo()` antes de fazer fetch.
Se for demo, lê e escreve no localStorage diretamente.

### Padrão de service com suporte a demo

```js
// src/services/expenses.service.js
import { demoService } from './demo.service';
import { monthFilter } from '../utils/monthFilter';
import api from './api';

export const expensesService = {
  getByMonth: async (year, month) => {
    if (demoService.isDemo()) {
      const all = JSON.parse(localStorage.getItem('financa_expenses') || '[]');
      const filtered = all.filter((e) => monthFilter(e, year, month));
      return { data: filtered };
    }
    return api(`/expenses?year=${year}&month=${month}`);
  },

  create: async (data) => {
    if (demoService.isDemo()) {
      const all = JSON.parse(localStorage.getItem('financa_expenses') || '[]');
      const newItem = { id: `demo_${Date.now()}`, ...data };
      localStorage.setItem('financa_expenses', JSON.stringify([...all, newItem]));
      return { data: newItem };
    }
    return api('/expenses', { method: 'POST', body: JSON.stringify(data) });
  },

  update: async (id, data) => {
    if (demoService.isDemo()) {
      const all = JSON.parse(localStorage.getItem('financa_expenses') || '[]');
      const updated = all.map((e) => (e.id === id ? { ...e, ...data } : e));
      localStorage.setItem('financa_expenses', JSON.stringify(updated));
      return { data: updated.find((e) => e.id === id) };
    }
    return api(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  delete: async (id) => {
    if (demoService.isDemo()) {
      const all = JSON.parse(localStorage.getItem('financa_expenses') || '[]');
      localStorage.setItem('financa_expenses', JSON.stringify(all.filter((e) => e.id !== id)));
      return { message: 'Removido com sucesso.' };
    }
    return api(`/expenses/${id}`, { method: 'DELETE' });
  },
};
```

O mesmo padrão se aplica a `incomes.service.js`, `cards.service.js` e `salary.service.js`.

---

## monthFilter utility (frontend)

Mesma lógica do backend, rodando no frontend para filtrar dados do localStorage.

```js
// src/utils/monthFilter.js

// Retorna true se o lançamento está ativo no mês/ano informado
export const monthFilter = (item, year, month) => {
  const startTotal = item.start_year * 12 + item.start_month;
  const endTotal = startTotal + item.duration_months - 1;
  const targetTotal = year * 12 + month;
  return startTotal <= targetTotal && endTotal >= targetTotal;
};
```

---

## authStore com suporte a demo

```js
// Adições ao auth.store.js

loginDemo: () => {
  demoService.seed();
  const user = JSON.parse(localStorage.getItem('financa_user'));
  set({ user, token: 'demo-token', isAuthenticated: true, isDemo: true });
},

logout: () => {
  const isDemo = get().isDemo;
  if (isDemo) {
    demoService.clear();
  } else {
    localStorage.removeItem('financa_token');
  }
  set({ user: null, token: null, isAuthenticated: false, isDemo: false });
},
```

---

## Botão de demo no Login

```jsx
<button
  type="button"
  onClick={() => {
    authStore.loginDemo();
    navigate('/', { replace: true });
  }}
  className={styles.demoButton}
>
  Entrar como Demo
</button>
```

---

## Regras

- NUNCA fazer fetch quando `demoService.isDemo()` for true
- SEMPRE usar o mesmo contrato de retorno `{ data }` no localStorage para que os stores não percebam diferença
- Alterações no demo persistem no localStorage durante a sessão inteira
- Ao fazer logout do demo, `demoService.clear()` remove TODAS as chaves do demo
- O `monthFilter` do frontend deve ser idêntico à lógica do backend
- Dados de seed devem ser realistas e variados o suficiente para demonstrar todas as funcionalidades: ganhos fixos e extras, despesas recorrentes e parceladas, dois cartões com transações parceladas
