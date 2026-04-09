# Skill: Pages

Padrão de estrutura e referência visual de cada página do app.
Todo componente de página usa CSS Modules (`.module.scss`) e segue Apple HIG.

## Estrutura padrão de página

```jsx
// src/pages/NomePagina/NomePagina.jsx
import styles from './NomePagina.module.scss';
import useFinanceStore from '../../store/finance.store';

export function NomePagina() {
  const { dados, loading, error } = useFinanceStore();

  if (loading) return <div className={styles.loading}>Carregando...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.page}>
      {/* conteúdo */}
    </div>
  );
}
```

```scss
// src/pages/NomePagina/NomePagina.module.scss
.page {
  max-width: $max-width;
  margin: 0 auto;
  padding: $page-padding-top $page-padding;
  padding-bottom: calc($bottom-bar-height + 16px);
}
```

---

## Login

**Rota:** `/login` | **Pública**

**Elementos:**
- Emoji 💰 + título "Finança" + subtítulo centralizado no topo
- Input de email
- Input de senha com toggle mostrar/ocultar (lucide: Eye / EyeOff)
- Link "Esqueceu a senha?" alinhado à direita
- Botão "Entrar" (full width, primário)
- Link "Cadastre-se" centralizado abaixo
- Card amarelo de demo no rodapé: "💡 Demo — Use qualquer e-mail e senha para entrar"

**Comportamento:**
- Ao submeter: chama `authStore.login(email, password)`
- Se autenticado, redireciona para `/`
- Botão mostra "Entrando..." durante loading

---

## Dashboard

**Rota:** `/` | **Autenticada**

**Elementos:**
- Seletor de mês no topo: `< Abril 2026 >` (chevrons lucide)
- Card de saldo: label "Saldo" + valor grande em verde (positivo) ou vermelho (negativo)
- Seção "Ganhos": lista de incomes do mês + total em verde
- Seção "Gastos": lista de expenses + cartões (com ponto colorido) + total em vermelho
- FAB `+` azul fixo no canto inferior direito (acima da tab bar)
- Bottom sheet ao clicar no FAB: form para adicionar gasto

**Cartão na lista de gastos:**
- Ponto colorido (cor do cartão) ao invés de emoji
- Valor = total da fatura do mês
- Toque navega para `/card/:id`

**Bottom sheet de adicionar gasto:**
- Campos: Descrição, Emoji, Valor, Duração (meses), Mês/Ano de início
- Botão "Adicionar"

**Dados:** `useFinanceStore()` → `fetchDashboard()` ao montar e ao trocar mês

---

## Cards

**Rota:** `/cards` | **Autenticada**

**Elementos:**
- Título "Cartões" (h1 34px)
- Card de total: "Total em Cartões" + valor em vermelho
- Lista de cartões: cada um tem visual de cartão físico (gradiente) + info de fatura abaixo
- Cartão físico: nome, últimos 4 dígitos, "•••• •••• •••• XXXX", gradiente com a cor do cartão
- Info abaixo do cartão: "Fatura Atual" + valor + chevron direito
- Botão "Adicionar Cartão" dashed no rodapé

**Dados:** `cardsService.getWithTotal(year, month)`

---

## CardDetail

**Rota:** `/card/:cardId` | **Autenticada**

**Elementos:**
- Header: botão voltar (ChevronLeft) + nome do cartão
- Card de fatura do mês: borda esquerda colorida com a cor do cartão + total em vermelho
- Lista de transações: descrição, data, valor em vermelho, badge de parcela (`2/10`) se parcelado
- FAB `+` para adicionar transação
- Bottom sheet: form com Descrição, Emoji, Valor, Data, Parcelas (X de Y)

**Dados:** `cardsService.getTransactions(cardId, year, month)`

---

## Simulation

**Rota:** `/simulation` | **Autenticada**

**Elementos:**
- Banner amarelo fixo no topo: "⚠️ Modo Simulação — Alterações não serão salvas"
- Seletor de mês igual ao dashboard
- Card de saldo (verde/vermelho conforme positivo/negativo) — atualiza em tempo real
- Seção Ganhos: mesma lista mas com inputs editáveis inline
- Seção Gastos: mesma lista mas com inputs editáveis inline
- Botão "Resetar Simulação" vermelho no rodapé

**Comportamento:**
- Carrega dados reais do mês selecionado como ponto de partida
- Edições são locais (estado do componente) — nunca chamam a API de escrita
- Reset restaura os valores originais da API
- Saldo recalcula a cada mudança de input

**Dados:** lê do `financeStore` mas mantém cópia local para edição

---

## Settings

**Rota:** `/setup` | **Autenticada**

**Elementos:**
- Título "Configurações" (h1 34px)
- Seção "Perfil": Editar Perfil, Alterar Senha (lista estilo iOS com chevron)
- Seção "Preferências": toggle Notificações, toggle Modo Escuro
- Seção "Sobre": Termos de Uso, Política de Privacidade, Versão (1.0.0)
- Botão "Sair" vermelho full-width no rodapé

**Comportamento:**
- "Sair" chama `authStore.logout()` e redireciona para `/login`

---

## Layout (componente compartilhado)

Bottom tab bar fixa com 4 abas:

| Aba | Ícone | Rota |
|---|---|---|
| Dashboard | Home | `/` |
| Cartões | CreditCard | `/cards` |
| Simulação | TrendingUp | `/simulation` |
| Configurações | Settings | `/setup` |

Tab de Cartões fica ativa também em `/card/:id`.

---

## BottomSheet (componente compartilhado)

```jsx
<BottomSheet isOpen={boolean} onClose={fn}>
  {/* conteúdo do form */}
</BottomSheet>
```

- Slide up do rodapé com overlay escuro
- Fecha ao clicar no overlay ou no botão X
- Scroll interno se conteúdo ultrapassar a altura
- Padding bottom para safe area (iPhone com notch)

---

## ProtectedRoute

Redireciona para `/login` se não autenticado.

```jsx
// src/components/ProtectedRoute/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/auth.store';

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
```
