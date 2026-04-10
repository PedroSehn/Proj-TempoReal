import api from './api';

export const simulationService = {
  run: (payload) =>
    api('/simulation', { method: 'POST', body: JSON.stringify(payload) }),
};
