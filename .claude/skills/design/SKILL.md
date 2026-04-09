# Skill: Design

Design system do app Finança. Segue Apple Human Interface Guidelines.
Todos os tokens abaixo estão disponíveis globalmente via `_variables.scss`.

## Cores

```scss
$color-primary:     #007AFF;   // azul iOS — botões, links, ativo
$color-success:     #34C759;   // verde — ganhos, saldo positivo
$color-danger:      #FF3B30;   // vermelho — gastos, saldo negativo, logout
$color-warning:     #FFCC00;   // amarelo — banner de simulação
$color-background:  #F2F2F7;   // cinza claro — fundo da página
$color-card:        #FFFFFF;   // branco — cards, listas
$color-border:      #D1D1D6;   // cinza — divisores, bordas
$color-text:        #000000;   // preto — texto principal
$color-text-muted:  #8E8E93;   // cinza — texto secundário, labels, placeholders
```

## Tipografia

```scss
$font-display: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif;
$font-text:    -apple-system, BlinkMacSystemFont, "SF Pro Text",    "Inter", sans-serif;

// Tamanhos usados no design
$font-size-xs:   11px;   // badges de parcela
$font-size-sm:   13px;   // datas, legendas secundárias
$font-size-md:   15px;   // labels de input, subtítulos
$font-size-lg:   17px;   // texto de lista, inputs, botões
$font-size-xl:   20px;   // títulos de seção, selector de mês
$font-size-2xl:  22px;   // títulos de seção (Ganhos, Gastos)
$font-size-3xl:  34px;   // títulos de página (h1)
$font-size-hero: 44px;   // saldo principal no dashboard
$font-size-big:  40px;   // totais de cartão, saldo em outras telas
```

## Bordas e sombras

```scss
$radius-sm:   8px;
$radius-md:   12px;
$radius-lg:   16px;    // cards principais
$radius-xl:   20px;    // cards de cartão
$radius-full: 999px;   // badges, pills, FAB

$shadow-card: 0 1px 3px rgba(0, 0, 0, 0.08);   // sombra padrão de cards
$shadow-fab:  0 4px 12px rgba(0, 122, 255, 0.4); // sombra do botão flutuante
$shadow-card-hover: 0 8px 16px rgba(0, 0, 0, 0.15); // cards de cartão
```

## Espaçamentos

```scss
$spacing-xs:  4px;
$spacing-sm:  8px;
$spacing-md:  16px;
$spacing-lg:  24px;
$spacing-xl:  32px;

$max-width:         600px;  // largura máxima do conteúdo
$bottom-bar-height: 80px;   // altura da tab bar fixa
$page-padding:      16px;   // padding horizontal das páginas
$page-padding-top:  24px;   // padding topo das páginas
```

## Padrões de componente

### Card padrão
```scss
background: $color-card;
border-radius: $radius-lg;
box-shadow: $shadow-card;
padding: 24px;
```

### Divisor de lista
```scss
height: 0.5px;
background: $color-border;
margin-left: 16px; // nunca full-width
```

### Input
```scss
background: $color-background;
border: 1px solid $color-border;
border-radius: $radius-md;
padding: 12px 16px;
font-size: $font-size-lg;

&:focus {
  border-color: $color-primary;
  outline: none;
}
```

### Botão primário
```scss
background: $color-primary;
color: white;
border-radius: $radius-md;
padding: 16px;
font-size: $font-size-lg;
font-weight: 600;
width: 100%;

&:active {
  background: #0051D5;
}
```

### FAB (botão flutuante)
```scss
position: fixed;
bottom: calc($bottom-bar-height + 16px);
right: 24px;
width: 56px;
height: 56px;
border-radius: $radius-full;
background: $color-primary;
box-shadow: $shadow-fab;

&:active {
  transform: scale(0.95);
}
```

### Badge de parcela
```scss
background: $color-primary;
color: white;
border-radius: $radius-full;
padding: 2px 8px;
font-size: $font-size-xs;
font-weight: 500;
```

### Toggle (iOS style)
```scss
// Track: 51x31px
// Thumb: 27x27px, offset 2px
// Off: background #E5E5EA
// On: background $color-success
// Thumb move: translateX(20px)
```

## Bottom Tab Bar

4 abas fixas no rodapé: Dashboard, Cartões, Simulação, Configurações.
Ícones lucide-react: Home, CreditCard, TrendingUp, Settings.
Ícone ativo: `$color-primary`. Inativo: `$color-text-muted`.
Label ativo: font-weight 500. Inativo: 400.

## Animações

Usar sparingly — só onde agrega percepção de qualidade:
- Entrada de cards: `opacity 0→1, translateY 20px→0`
- Saldo atualizado: `scale 0.98→1` com duration 150-200ms
- Botões: `transform: scale(0.95)` no active
- Bottom sheet: slide up do rodapé

## Formatação de moeda

Sempre usar:
```js
value.toLocaleString('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})
// resultado: "1.247,00"
// exibir como: R$ 1.247,00
```
