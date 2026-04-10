const BASE_URL = import.meta.env.VITE_API_URL;

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

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro na requisição');
  }

  return data;
};

export default api;
