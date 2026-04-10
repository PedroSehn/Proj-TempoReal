# Finança API — Documentação

Base URL de produção: configurar via variável de ambiente no frontend (ex: `VITE_API_URL`).

---

## Autenticação

Todas as rotas protegidas exigem o header:

```
Authorization: Bearer <token>
```

O token é retornado no login e deve ser armazenado (localStorage, contexto, etc.).

**Usuário demo** (`is_demo: true`): pode fazer GET em qualquer rota, mas qualquer tentativa de POST / PUT / PATCH / DELETE retorna `403`.

---

## Formato de resposta

| Situação | Formato |
|---|---|
| Sucesso com dados | `{ "data": ... }` |
| Sucesso sem retorno | `{ "message": "..." }` |
| Erro | `{ "message": "..." }` |

---

## Rotas

### Health Check

```
GET /health
```

Sem autenticação. Verifica conectividade com o banco.

**Resposta 200:** `OK`
**Resposta 503:** banco indisponível

---

### Auth

#### Login

```
POST /auth/login
```

**Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Resposta 200:**

```json
{
  "data": {
    "token": "jwt-string",
    "user": {
      "id": 1,
      "name": "Pedro",
      "email": "pedro@email.com",
      "is_demo": false
    }
  }
}
```

**Erros:** `400` campos ausentes · `401` credenciais inválidas

---

### Salary

> Rotas de escrita bloqueadas para usuário demo.

#### Buscar configuração de salário

```
GET /salary
```

**Resposta 200:**

```json
{
  "data": {
    "id": 1,
    "user_id": 1,
    "gross_salary": 5000,
    "has_inss": true,
    "has_irrf": true,
    "vt_percentage": 6,
    "health_plan": 150,
    "other_discounts": [{ "label": "Seguro de vida", "value": 30 }],
    "updated_at": "2026-04-01T00:00:00Z",
    "calculated": {
      "inss": 450,
      "irrf": 180,
      "vt": 300,
      "health_plan": 150,
      "other_discounts_total": 30,
      "total_discounts": 1110,
      "net": 3890
    }
  }
}
```

**Erros:** `404` configuração não encontrada

---

#### Criar configuração de salário

```
POST /salary
```

**Body:**

```json
{
  "gross_salary": 5000,
  "has_inss": true,
  "has_irrf": true,
  "vt_percentage": 6,
  "health_plan": 150,
  "other_discounts": [{ "label": "Seguro de vida", "value": 30 }]
}
```

| Campo | Tipo | Obrigatório | Padrão |
|---|---|---|---|
| `gross_salary` | number | sim | — |
| `has_inss` | boolean | não | `true` |
| `has_irrf` | boolean | não | `true` |
| `vt_percentage` | number | não | `0` |
| `health_plan` | number | não | `0` |
| `other_discounts` | array | não | `[]` |

**Resposta 201:** mesmo formato do GET

**Erros:** `400` `gross_salary` ausente · `409` configuração já existe

---

#### Atualizar configuração de salário

```
PUT /salary
```

**Body:** mesmo do POST

**Resposta 200:** mesmo formato do GET

**Erros:** `404` configuração não encontrada

---

### Incomes (Ganhos)

> Rotas de escrita bloqueadas para usuário demo.

#### Listar ganhos do mês

```
GET /incomes?year=2026&month=4
```

| Query | Tipo | Obrigatório |
|---|---|---|
| `year` | number | sim |
| `month` | number (1-12) | sim |

**Resposta 200:**

```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "label": "Salário",
      "emoji": "💰",
      "value": 3890,
      "type": "salary",
      "start_month": 1,
      "start_year": 2026,
      "duration_months": 999,
      "created_at": "2026-01-01T00:00:00Z"
    }
  ]
}
```

**Valores válidos para `type`:** `"salary"` · `"vr"` · `"extra"`

**Erros:** `400` `year` ou `month` ausentes

---

#### Criar ganho

```
POST /incomes
```

**Body:**

```json
{
  "label": "Freelance",
  "emoji": "💻",
  "value": 800,
  "type": "extra",
  "start_month": 4,
  "start_year": 2026,
  "duration_months": 3
}
```

| Campo | Tipo | Obrigatório | Padrão |
|---|---|---|---|
| `label` | string | sim | — |
| `value` | number | sim | — |
| `type` | string | sim | — |
| `start_month` | number | sim | — |
| `start_year` | number | sim | — |
| `emoji` | string | não | `null` |
| `duration_months` | number | não | `1` |

**Resposta 201:** objeto do ganho criado

**Erros:** `400` campos obrigatórios ausentes ou `type` inválido

---

#### Atualizar ganho

```
PUT /incomes/:id
```

**Body:** mesmo do POST

**Resposta 200:** objeto atualizado

**Erros:** `404` ganho não encontrado

---

#### Deletar ganho

```
DELETE /incomes/:id
```

**Resposta 200:** `{ "message": "Ganho removido com sucesso" }`

**Erros:** `404` ganho não encontrado

---

### Expenses (Despesas)

> Rotas de escrita bloqueadas para usuário demo.

#### Listar despesas do mês

```
GET /expenses?year=2026&month=4
```

| Query | Tipo | Obrigatório |
|---|---|---|
| `year` | number | sim |
| `month` | number (1-12) | sim |

**Resposta 200:**

```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "label": "Aluguel",
      "emoji": "🏠",
      "value": 1200,
      "category": "moradia",
      "start_month": 1,
      "start_year": 2026,
      "duration_months": 999,
      "created_at": "2026-01-01T00:00:00Z"
    }
  ]
}
```

**Erros:** `400` `year` ou `month` ausentes

---

#### Criar despesa

```
POST /expenses
```

**Body:**

```json
{
  "label": "Netflix",
  "emoji": "📺",
  "value": 40,
  "category": "lazer",
  "start_month": 4,
  "start_year": 2026,
  "duration_months": 999
}
```

| Campo | Tipo | Obrigatório | Padrão |
|---|---|---|---|
| `label` | string | sim | — |
| `value` | number | sim | — |
| `start_month` | number | sim | — |
| `start_year` | number | sim | — |
| `emoji` | string | não | `null` |
| `category` | string | não | `null` |
| `duration_months` | number | não | `1` |

**Resposta 201:** objeto da despesa criada

**Erros:** `400` campos obrigatórios ausentes

---

#### Atualizar despesa

```
PUT /expenses/:id
```

**Body:** mesmo do POST

**Resposta 200:** objeto atualizado

**Erros:** `404` despesa não encontrada

---

#### Deletar despesa

```
DELETE /expenses/:id
```

**Resposta 200:** `{ "message": "Despesa removida com sucesso" }`

**Erros:** `404` despesa não encontrada

---

### Credit Cards (Cartões de Crédito)

> Rotas de escrita bloqueadas para usuário demo.

#### Listar cartões

```
GET /credit-cards
```

**Resposta 200:**

```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "name": "Nubank",
      "emoji": "💜",
      "color": "#8B5CF6",
      "created_at": "2026-01-01T00:00:00Z"
    }
  ]
}
```

---

#### Criar cartão

```
POST /credit-cards
```

**Body:**

```json
{
  "name": "Nubank",
  "emoji": "💜",
  "color": "#8B5CF6"
}
```

| Campo | Tipo | Obrigatório |
|---|---|---|
| `name` | string | sim |
| `emoji` | string | não |
| `color` | string | não |

**Resposta 201:** objeto do cartão criado

**Erros:** `400` `name` ausente

---

#### Atualizar cartão

```
PUT /credit-cards/:id
```

**Body:** mesmo do POST

**Resposta 200:** objeto atualizado

**Erros:** `404` cartão não encontrado

---

#### Deletar cartão

```
DELETE /credit-cards/:id
```

**Resposta 200:** `{ "message": "Cartão removido com sucesso" }`

**Erros:** `404` cartão não encontrado

---

#### Listar transações do cartão no mês

```
GET /credit-cards/:cardId/transactions?year=2026&month=4
```

| Query | Tipo | Obrigatório |
|---|---|---|
| `year` | number | sim |
| `month` | number (1-12) | sim |

**Resposta 200:**

```json
{
  "data": [
    {
      "id": 1,
      "credit_card_id": 1,
      "description": "iPhone 16 - 1/12",
      "emoji": "📱",
      "value": 600,
      "date": "2026-03-15",
      "start_month": 3,
      "start_year": 2026,
      "duration_months": 12,
      "created_at": "2026-03-15T00:00:00Z"
    }
  ]
}
```

**Erros:** `400` `year` ou `month` ausentes

---

#### Totais mensais do cartão (ano inteiro)

```
GET /credit-cards/:cardId/transactions/monthly-totals?year=2026
```

Retorna o total de cada mês do ano para o cartão especificado.

| Query | Tipo | Obrigatório |
|---|---|---|
| `year` | number | sim |

**Resposta 200:**

```json
{
  "data": [
    { "month": 1, "total": 0 },
    { "month": 2, "total": 0 },
    { "month": 3, "total": 600 },
    { "month": 4, "total": 600 },
    ...
    { "month": 12, "total": 600 }
  ]
}
```

**Erros:** `400` `year` ausente · `404` cartão não encontrado

---

#### Criar transação no cartão

```
POST /credit-cards/:cardId/transactions
```

**Body:**

```json
{
  "description": "iPhone 16",
  "emoji": "📱",
  "value": 600,
  "date": "2026-03-15",
  "start_month": 3,
  "start_year": 2026,
  "duration_months": 12
}
```

| Campo | Tipo | Obrigatório | Padrão |
|---|---|---|---|
| `description` | string | sim | — |
| `value` | number | sim | — |
| `date` | string (YYYY-MM-DD) | sim | — |
| `start_month` | number | sim | — |
| `start_year` | number | sim | — |
| `emoji` | string | não | `null` |
| `duration_months` | number | não | `1` |

**Resposta 201:** objeto da transação criada

**Erros:** `400` campos obrigatórios ausentes · `404` cartão não encontrado

---

#### Atualizar transação

```
PUT /credit-cards/:cardId/transactions/:id
```

**Body:** mesmo do POST

**Resposta 200:** objeto atualizado

**Erros:** `404` transação não encontrada

---

#### Deletar transação

```
DELETE /credit-cards/:cardId/transactions/:id
```

**Resposta 200:** `{ "message": "Transação removida com sucesso" }`

**Erros:** `404` transação não encontrada

---

### Dashboard

#### Resumo mensal completo

```
GET /dashboard?year=2026&month=4
```

| Query | Tipo | Obrigatório |
|---|---|---|
| `year` | number | sim |
| `month` | number (1-12) | sim |

Agrega salário, ganhos, despesas e cartões do mês em uma única chamada.

**Resposta 200:**

```json
{
  "data": {
    "month": 4,
    "year": 2026,
    "salary": {
      "gross": 5000,
      "net": 3890,
      "total_discounts": 1110
    },
    "incomes": [
      {
        "id": 1,
        "label": "Freelance",
        "emoji": "💻",
        "value": 800,
        "type": "extra",
        "start_month": 4,
        "start_year": 2026,
        "duration_months": 3
      }
    ],
    "expenses": [
      {
        "id": 1,
        "label": "Aluguel",
        "emoji": "🏠",
        "value": 1200,
        "category": "moradia",
        "start_month": 1,
        "start_year": 2026,
        "duration_months": 999
      }
    ],
    "credit_cards": [
      {
        "id": 1,
        "name": "Nubank",
        "emoji": "💜",
        "color": "#8B5CF6",
        "transactions": [
          {
            "id": 1,
            "description": "iPhone 16",
            "emoji": "📱",
            "value": 600,
            "date": "2026-03-15",
            "start_month": 3,
            "start_year": 2026,
            "duration_months": 12
          }
        ],
        "month_total": 600
      }
    ],
    "summary": {
      "total_income": 4690,
      "total_expenses": 1200,
      "total_credit_cards": 600,
      "balance": 2890
    }
  }
}
```

> `total_income` = `salary.net` + soma dos `incomes`

**Erros:** `400` `year` ou `month` ausentes

---

### Simulation

Simula o impacto de uma compra parcelada nos meses futuros **sem persistir nada no banco**.

#### Simular parcelas

```
POST /simulation
```

**Body:**

```json
{
  "value": 300,
  "duration_months": 6,
  "start_month": 4,
  "start_year": 2026
}
```

| Campo | Tipo | Obrigatório | Obs |
|---|---|---|---|
| `value` | number | sim | Valor da parcela mensal |
| `duration_months` | number | sim | Máximo 12 meses |
| `start_month` | number | sim | — |
| `start_year` | number | sim | — |

**Resposta 200:**

```json
{
  "data": [
    {
      "month": 4,
      "year": 2026,
      "income": 4690,
      "expenses": 1200,
      "card_total": 600,
      "balance": 2890,
      "installment": 300,
      "balance_with_simulation": 2590
    },
    {
      "month": 5,
      "year": 2026,
      "income": 4690,
      "expenses": 1200,
      "card_total": 600,
      "balance": 2890,
      "installment": 300,
      "balance_with_simulation": 2590
    }
  ]
}
```

| Campo | Descrição |
|---|---|
| `income` | Salário líquido + ganhos do mês |
| `expenses` | Total das despesas do mês |
| `card_total` | Total dos cartões de crédito do mês |
| `balance` | `income - expenses - card_total` |
| `installment` | Valor da parcela simulada |
| `balance_with_simulation` | `balance - installment` |

**Erros:** `400` campos obrigatórios ausentes

---

## Lógica de duração (`duration_months`)

Ganhos, despesas e transações de cartão aparecem em um mês se:

```
start_year * 12 + start_month  <=  ano_alvo * 12 + mês_alvo
                               <=  start_year * 12 + start_month + duration_months - 1
```

| Caso | `duration_months` |
|---|---|
| Pontual (só o mês cadastrado) | `1` |
| 10 parcelas | `10` |
| Recorrente indefinidamente | `999` |

---

## Cálculos de salário

| Desconto | Lógica |
|---|---|
| INSS | Tabela progressiva 2024 |
| IRRF | Tabela progressiva 2024 sobre base (gross - inss) |
| VT | `gross_salary * (vt_percentage / 100)` |
| Plano de saúde | Valor fixo (`health_plan`) |
| Outros | Soma dos itens em `other_discounts` |
| **Líquido** | `gross - total_discounts` |

---

## Referência rápida de endpoints

| Método | Rota | Auth | Demo |
|---|---|---|---|
| GET | `/health` | — | — |
| POST | `/auth/login` | — | — |
| GET | `/salary` | JWT | leitura |
| POST | `/salary` | JWT | bloqueado |
| PUT | `/salary` | JWT | bloqueado |
| GET | `/incomes` | JWT | leitura |
| POST | `/incomes` | JWT | bloqueado |
| PUT | `/incomes/:id` | JWT | bloqueado |
| DELETE | `/incomes/:id` | JWT | bloqueado |
| GET | `/expenses` | JWT | leitura |
| POST | `/expenses` | JWT | bloqueado |
| PUT | `/expenses/:id` | JWT | bloqueado |
| DELETE | `/expenses/:id` | JWT | bloqueado |
| GET | `/credit-cards` | JWT | leitura |
| POST | `/credit-cards` | JWT | bloqueado |
| PUT | `/credit-cards/:id` | JWT | bloqueado |
| DELETE | `/credit-cards/:id` | JWT | bloqueado |
| GET | `/credit-cards/:cardId/transactions` | JWT | leitura |
| GET | `/credit-cards/:cardId/transactions/monthly-totals` | JWT | leitura |
| POST | `/credit-cards/:cardId/transactions` | JWT | bloqueado |
| PUT | `/credit-cards/:cardId/transactions/:id` | JWT | bloqueado |
| DELETE | `/credit-cards/:cardId/transactions/:id` | JWT | bloqueado |
| GET | `/dashboard` | JWT | leitura |
| POST | `/simulation` | JWT | permitido |
