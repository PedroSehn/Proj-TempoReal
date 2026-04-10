import api from './api';

export const authService = {
  login: (email, password) =>
    api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
};
