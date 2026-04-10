import { demoService } from './demo.service';
import { monthFilter } from '../utils/monthFilter';
import api from './api';

export const dashboardService = {
  getByMonth: async (year, month) => {
    if (demoService.isDemo()) {
      const incomes = JSON.parse(localStorage.getItem('financa_incomes') || '[]')
        .filter((i) => monthFilter(i, year, month));

      const expenses = JSON.parse(localStorage.getItem('financa_expenses') || '[]')
        .filter((e) => monthFilter(e, year, month));

      const cards = JSON.parse(localStorage.getItem('financa_cards') || '[]').map((card) => {
        const allTx = JSON.parse(localStorage.getItem(`financa_card_transactions_${card.id}`) || '[]');
        const total = allTx
          .filter((tx) => monthFilter(tx, year, month))
          .reduce((sum, tx) => sum + Number(tx.value || 0), 0);
        return { ...card, total };
      });

      return { incomes, expenses, cards };
    }

    const { data } = await api(`/dashboard?year=${year}&month=${month}`);

    return {
      incomes: data.incomes,
      expenses: data.expenses,
      // normaliza month_total → total para manter o mesmo contrato no store
      cards: data.credit_cards.map((c) => ({ ...c, total: Number(c.month_total) || 0 })),
    };
  },
};
