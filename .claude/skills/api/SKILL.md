# Skill: API

Padrão de chamadas à API do Finança. Usa fetch nativo — sem axios ou libs externas.

## Base URL

```js
// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL;
```

## Função base de fetch

```js
// src/services/api.js
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
```

## Padrão de service

Cada módulo tem seu próprio service em `src/services/`.
Services NUNCA são chamados diretamente nos componentes — sempre via store ou hook.

```js
// src/services/expenses.service.js
import api from './api';

export const expensesService = {
  getByMonth: (year, month) =>
    api(`/expenses?year=${year}&month=${month}`),

  create: (data) =>
    api('/expenses', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    api(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) =>
    api(`/expenses/${id}`, { method: 'DELETE' }),
};
```

## Services disponíveis

### auth.service.js
```js
login(email, password)   → POST /auth/login → { data: { token, user } }
```

### expenses.service.js
```js
getByMonth(year, month)  → GET  /expenses?year=&month=   → { data: [...] }
create(data)             → POST /expenses                → { data: expense }
update(id, data)         → PUT  /expenses/:id            → { data: expense }
delete(id)               → DELETE /expenses/:id          → { message }
```

### incomes.service.js
```js
getByMonth(year, month)  → GET  /incomes?year=&month=    → { data: [...] }
create(data)             → POST /incomes                 → { data: income }
update(id, data)         → PUT  /incomes/:id             → { data: income }
delete(id)               → DELETE /incomes/:id           → { message }
```

### cards.service.js
```js
getAll()                 → GET  /credit-cards            → { data: [...] }
getWithTotal(year, month)→ GET  /credit-cards?year=&month= → { data: [...] }
create(data)             → POST /credit-cards            → { data: card }
getTransactions(cardId, year, month) → GET /credit-cards/:id/transactions?year=&month=
createTransaction(cardId, data)      → POST /credit-cards/:id/transactions
deleteTransaction(cardId, txId)      → DELETE /credit-cards/:id/transactions/:txId
```

### simulation.service.js
```js
run(payload)             → POST /simulation → { data: [{ year, month, totalIncomes, totalExpenses, scenarioImpact, balance, isNegative }] }

// payload:
{
  startYear: 2025,
  startMonth: 4,
  months: 12,
  scenario: {
    description: 'MacBook Pro',
    value: 1500,
    durationMonths: 12
  }
}
```

## Tratamento de erros

```js
// Padrão em componentes/stores
try {
  const { data } = await expensesService.create(payload);
  // sucesso
} catch (error) {
  // error.message vem do backend: { message: '...' }
  console.error(error.message);
  // exibir para o usuário
}
```

## Campos de lançamento (expenses e incomes)

```js
// Campos obrigatórios ao criar
{
  label: 'Internet',         // string
  emoji: '📡',              // string (1 emoji)
  value: 119.00,             // number
  category: 'fixo',          // string (opcional)
  start_month: 1,            // 1-12
  start_year: 2025,          // YYYY
  duration_months: 12        // 1 = pontual, 999 = recorrente eterno
}

// duration_months:
// 1   → aparece só no mês de início (pontual)
// 6   → parcelado em 6 meses
// 999 → recorrente indefinidamente (internet, aluguel)
```

## Token JWT

Salvo em: `localStorage.getItem('financa_token')`
Inserido automaticamente pelo `api.js` base em toda requisição autenticada.
NUNCA enviar `user_id` no body — o backend extrai do token.
