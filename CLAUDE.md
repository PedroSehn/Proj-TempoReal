# Finança — Frontend

App de controle financeiro pessoal. React + Vite + SASS + Zustand + Fetch nativo.

## Stack
- React com Vite, JavaScript puro (sem TypeScript)
- SASS com CSS Modules — cada componente tem `.module.scss`
- Zustand para estado global
- Fetch nativo para chamadas à API (sem axios ou libs externas)
- react-router-dom para navegação
- lucide-react para ícones

## Padrões obrigatórios
- Componentes reutilizáveis em `src/components/`, telas em `src/pages/`
- Cada página e componente tem sua própria pasta com `.jsx` e `.module.scss`
- Estilos SCSS usam variáveis de `src/styles/_variables.scss` (disponíveis globalmente via vite.config.js)
- Chamadas à API ficam em `src/services/` — nunca fetch direto nos componentes
- Estado global em `src/store/` — nunca prop drilling profundo
- Idioma: português brasileiro em toda interface e mensagens

## Regras críticas
- NUNCA usar Tailwind, styled-components ou CSS inline extensivo
- NUNCA fazer fetch direto em componentes — sempre via service
- NUNCA armazenar token JWT em lugar diferente de localStorage com chave `financa_token`
- SEMPRE usar CSS Modules (`.module.scss`) — nunca classes globais em componentes
- user_id NUNCA é enviado no body — o backend extrai do token JWT

## Design
Segue Apple Human Interface Guidelines. Tokens em `.claude/skills/design/SKILL.md`.
Referências visuais do design: `.claude/skills/pages/SKILL.md`

## Referências
- @README.md para visão geral
- @src/styles/_variables.scss para tokens de design
- @src/services/api.js para padrão de chamadas
- @src/store/auth.store.js para padrão de store
