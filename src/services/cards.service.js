import { demoService } from './demo.service';
import { monthFilter } from '../utils/monthFilter';
import api from './api';

export const cardsService = {
  getAll: async () => {
    if (demoService.isDemo()) {
      return { data: JSON.parse(localStorage.getItem('financa_cards') || '[]') };
    }
    return api('/credit-cards');
  },

  getWithTotal: async (year, month) => {
    if (demoService.isDemo()) {
      const cards = JSON.parse(localStorage.getItem('financa_cards') || '[]');
      const cardsWithTotal = cards.map((card) => {
        const txKey = `financa_card_transactions_${card.id}`;
        const allTx = JSON.parse(localStorage.getItem(txKey) || '[]');
        const filtered = allTx.filter((tx) => monthFilter(tx, year, month));
        const total = filtered.reduce((sum, tx) => sum + tx.value, 0);
        return { ...card, total };
      });
      return { data: cardsWithTotal };
    }
    return api(`/credit-cards?year=${year}&month=${month}`);
  },

  create: async (data) => {
    if (demoService.isDemo()) {
      const all = JSON.parse(localStorage.getItem('financa_cards') || '[]');
      const newCard = { id: `demo_${Date.now()}`, ...data };
      localStorage.setItem('financa_cards', JSON.stringify([...all, newCard]));
      localStorage.setItem(`financa_card_transactions_${newCard.id}`, '[]');
      return { data: newCard };
    }
    return api('/credit-cards', { method: 'POST', body: JSON.stringify(data) });
  },

  update: async (id, data) => {
    if (demoService.isDemo()) {
      const all = JSON.parse(localStorage.getItem('financa_cards') || '[]');
      const updated = all.map((c) => (c.id === id ? { ...c, ...data } : c));
      localStorage.setItem('financa_cards', JSON.stringify(updated));
      return { data: updated.find((c) => c.id === id) };
    }
    return api(`/credit-cards/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  delete: async (id) => {
    if (demoService.isDemo()) {
      const all = JSON.parse(localStorage.getItem('financa_cards') || '[]');
      localStorage.setItem('financa_cards', JSON.stringify(all.filter((c) => c.id !== id)));
      localStorage.removeItem(`financa_card_transactions_${id}`);
      return { message: 'Removido com sucesso.' };
    }
    return api(`/credit-cards/${id}`, { method: 'DELETE' });
  },

  getTransactions: async (cardId, year, month) => {
    if (demoService.isDemo()) {
      const all = JSON.parse(localStorage.getItem(`financa_card_transactions_${cardId}`) || '[]');
      return { data: all.filter((tx) => monthFilter(tx, year, month)) };
    }
    return api(`/credit-cards/${cardId}/transactions?year=${year}&month=${month}`);
  },

  createTransaction: async (cardId, data) => {
    if (demoService.isDemo()) {
      const key = `financa_card_transactions_${cardId}`;
      const all = JSON.parse(localStorage.getItem(key) || '[]');
      const newTx = { id: `demo_${Date.now()}`, credit_card_id: cardId, ...data };
      localStorage.setItem(key, JSON.stringify([...all, newTx]));
      return { data: newTx };
    }
    return api(`/credit-cards/${cardId}/transactions`, { method: 'POST', body: JSON.stringify(data) });
  },

  deleteTransaction: async (cardId, txId) => {
    if (demoService.isDemo()) {
      const key = `financa_card_transactions_${cardId}`;
      const all = JSON.parse(localStorage.getItem(key) || '[]');
      localStorage.setItem(key, JSON.stringify(all.filter((tx) => tx.id !== txId)));
      return { message: 'Removido com sucesso.' };
    }
    return api(`/credit-cards/${cardId}/transactions/${txId}`, { method: 'DELETE' });
  },
};
