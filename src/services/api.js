const BASE_URL = import.meta.env.VITE_API_URL;

const forceLogout = () => {
  localStorage.removeItem('financa_token');
  localStorage.removeItem('financa_user');
  window.location.replace('/login');
};

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('financa_token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, config);
  } catch {
    throw new Error('Sem conexão com o servidor');
  }

  // Checar status ANTES de tentar ler o body (CORS pode bloquear o body)
  if (response.status === 401) {
    forceLogout();
    throw new Error('Sessão expirada');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Resposta inválida do servidor');
  }

  if (!response.ok) {
    throw new Error(data.message || 'Erro na requisição');
  }

  return data;
};

export default api;
