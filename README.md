# Finança — Frontend

Interface web do app de controle financeiro pessoal. Construído do zero com foco em aprendizado e portfólio.

## Stack

- **React + Vite** — SPA sem SSR
- **JavaScript** — sem TypeScript por ora
- **SASS (módulos)** — CSS Modules com `.module.scss` por componente
- **Zustand** — estado global (auth + dados financeiros)
- **Fetch nativo** — chamadas à API sem libs externas
- **react-router-dom** — roteamento client-side

## Design

Segue Apple Human Interface Guidelines. Design de referência gerado no Figma Make.
Tokens de design documentados em `.claude/skills/design/SKILL.md`.

## Estrutura de pastas

```
src/
├── assets/
├── components/              ← componentes reutilizáveis
│   ├── BottomSheet/
│   │   ├── BottomSheet.jsx
│   │   └── BottomSheet.module.scss
│   ├── Layout/
│   │   ├── Layout.jsx
│   │   └── Layout.module.scss
│   └── ProtectedRoute/
│       └── ProtectedRoute.jsx
├── pages/                   ← uma pasta por tela
│   ├── Login/
│   ├── Dashboard/
│   ├── Cards/
│   ├── CardDetail/
│   ├── Simulation/
│   └── Settings/
├── services/                ← chamadas à API
│   ├── api.js               ← fetch base com token
│   ├── auth.service.js
│   ├── expenses.service.js
│   ├── incomes.service.js
│   ├── cards.service.js
│   └── simulation.service.js
├── store/                   ← zustand
│   ├── auth.store.js
│   └── finance.store.js
├── styles/                  ← sass global
│   ├── _variables.scss
│   ├── _reset.scss
│   ├── _typography.scss
│   └── main.scss
├── router.jsx
└── main.jsx
```

## Rotas

| Rota | Componente | Proteção |
|---|---|---|
| `/login` | Login | Pública |
| `/` | Dashboard | Autenticada |
| `/cards` | Cards | Autenticada |
| `/card/:cardId` | CardDetail | Autenticada |
| `/simulation` | Simulation | Autenticada |
| `/setup` | Settings | Autenticada |
| `*` | → /login | — |

## Setup local

```bash
npm create vite@latest financa-app -- --template react
cd financa-app
npm install react-router-dom zustand sass lucide-react
npm run dev
```

## Variáveis de ambiente

```env
VITE_API_URL=https://sua-url.up.railway.app
```

## Deploy

Frontend hospedado no **Vercel**. Deploy automático a cada push na branch `main`.
Backend documentado no repositório `financa-api`.

## Referências

- Design tokens: `.claude/skills/design/SKILL.md`
- Chamadas à API: `.claude/skills/api/SKILL.md`
- Estado global: `.claude/skills/store/SKILL.md`
- Padrão de páginas: `.claude/skills/pages/SKILL.md`
