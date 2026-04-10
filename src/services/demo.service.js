const DEMO_USER = {
  id: 'demo',
  name: 'Pedro Demo',
  email: 'demo@financa.app',
  is_demo: true,
};

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1;

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
    { id: 'demo_nubank', name: 'Nubank', emoji: '💳', color: '#8B10AE' },
    { id: 'demo_inter',  name: 'Inter',  emoji: '💳', color: '#FF7A00' },
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

  clear: () => {
    const cards = JSON.parse(localStorage.getItem('financa_cards') || '[]');
    cards.forEach((card) => {
      localStorage.removeItem(`financa_card_transactions_${card.id}`);
    });
    ['financa_demo', 'financa_token', 'financa_user', 'financa_salary',
     'financa_incomes', 'financa_expenses', 'financa_cards'].forEach((key) => {
      localStorage.removeItem(key);
    });
  },

  isDemo: () => localStorage.getItem('financa_demo') === 'true',
};
