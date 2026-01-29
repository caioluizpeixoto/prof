# Relatório de Correção - ThemeProvider

## 🔍 Problema
Erro de build no Vercel (Linux) devido a um caminho de importação inválido para as tipagens do `next-themes`. O import apontava para `next-themes/dist/types`, que pode não estar disponível ou ser inacessível em certos ambientes de execução/build.

- **Arquivo afetado**: `components/shared/ThemeProvider.tsx`
- **Erro**: `Cannot find module next-themes/dist/types`

## 🛠️ Correção Aplicada
O import foi simplificado para utilizar o pacote principal, que exporta corretamente as tipagens necessárias.

### Mudanças no Código:
**Antes:**
```typescript
import { type ThemeProviderProps } from 'next-themes/dist/types'
```

**Depois:**
```typescript
import type { ThemeProviderProps } from 'next-themes'
```

## ✅ Validação
- O pacote `next-themes` (v0.4.6) está configurado corretamente nas dependências do `package.json`.
- A tipagem `ThemeProviderProps` agora é importada diretamente da raiz do pacote, garantindo compatibilidade com o ambiente Vercel.
