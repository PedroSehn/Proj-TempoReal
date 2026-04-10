import { demoService } from './demo.service';
import { monthFilter } from '../utils/monthFilter';
import api from './api';

export const expensesService = {
  getByMonth: async (year, month) => {
    if (demoService.isDemo()) {
      const all = JSON.parse(localStorage.getItem('financa_expenses') || '[]');
      return { data: all.filter((e) => monthFilter(e, year, month)) };
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
