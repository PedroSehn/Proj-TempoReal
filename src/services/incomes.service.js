import { demoService } from './demo.service';
import { monthFilter } from '../utils/monthFilter';
import api from './api';

export const incomesService = {
  getByMonth: async (year, month) => {
    if (demoService.isDemo()) {
      const all = JSON.parse(localStorage.getItem('financa_incomes') || '[]');
      return { data: all.filter((i) => monthFilter(i, year, month)) };
    }
    return api(`/incomes?year=${year}&month=${month}`);
  },

  create: async (data) => {
    if (demoService.isDemo()) {
      const all = JSON.parse(localStorage.getItem('financa_incomes') || '[]');
      const newItem = { id: `demo_${Date.now()}`, ...data };
      localStorage.setItem('financa_incomes', JSON.stringify([...all, newItem]));
      return { data: newItem };
    }
    return api('/incomes', { method: 'POST', body: JSON.stringify(data) });
  },

  update: async (id, data) => {
    if (demoService.isDemo()) {
      const all = JSON.parse(localStorage.getItem('financa_incomes') || '[]');
      const updated = all.map((i) => (i.id === id ? { ...i, ...data } : i));
      localStorage.setItem('financa_incomes', JSON.stringify(updated));
      return { data: updated.find((i) => i.id === id) };
    }
    return api(`/incomes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  delete: async (id) => {
    if (demoService.isDemo()) {
      const all = JSON.parse(localStorage.getItem('financa_incomes') || '[]');
      localStorage.setItem('financa_incomes', JSON.stringify(all.filter((i) => i.id !== id)));
      return { message: 'Removido com sucesso.' };
    }
    return api(`/incomes/${id}`, { method: 'DELETE' });
  },
};
