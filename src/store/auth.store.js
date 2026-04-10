import { create } from 'zustand';
import { authService } from '../services/auth.service';
import { demoService } from '../services/demo.service';

// Token de demo órfão (sessão anterior não foi encerrada corretamente)
const storedToken = localStorage.getItem('financa_token');
if (storedToken === 'demo-token' && !demoService.isDemo()) {
  localStorage.removeItem('financa_token');
  localStorage.removeItem('financa_user');
}

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('financa_user') || 'null'),
  token: localStorage.getItem('financa_token') || null,
  isAuthenticated: !!localStorage.getItem('financa_token'),
  isDemo: demoService.isDemo(),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authService.login(email, password);
      localStorage.setItem('financa_token', data.token);
      localStorage.setItem('financa_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isAuthenticated: true, isDemo: false, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

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
      localStorage.removeItem('financa_user');
    }
    set({ user: null, token: null, isAuthenticated: false, isDemo: false });
  },
}));

export default useAuthStore;
