# Relatório de Diagnóstico - Erro 404 Vercel

## 🔍 Problema
A rota `/api/generate-activity` funciona perfeitamente no ambiente local (Windows), mas retorna **404 NOT FOUND** quando acessada no ambiente de produção (Vercel).

## 💡 Causa Provável
1. **Case-Sensitivity (Sensibilidade a Maiúsculas/Minúsculas)**: O Windows é insensível ao caso, mas o Linux (Vercel) é sensível. É comum que pastas renomeadas de `Generate-Activity` para `generate-activity` não sejam atualizadas corretamente no histórico do Git, fazendo com que o Vercel não encontre o caminho exato.
2. **Inconsistência de Build**: O cache do Vercel pode estar travado em uma versão anterior à criação da rota.
3. **Erros de Inicialização**: Erros que ocorrem durante o carregamento do módulo (fora da função `POST`) podem, em casos raros, fazer com que o Next.js não registre a rota corretamente.

## 🛠️ Modificações Realizadas

### 1. Rota de Diagnóstico
- Criada a rota `app/api/test/route.ts` que responde a um `GET`.
- **Objetivo**: Validar se o motor de rotas da API do Next.js está operacional no Vercel. Se `/api/test` funcionar e `/api/generate-activity` não, o problema é específico da pasta ou do código da rota de atividade.

### 2. Padronização de Nomes e Estrutura
- Verificada e garantida a nomenclatura `app/api/generate-activity/route.ts` (tudo em minúsculo).
- Garantido que a função exportada é `export async function POST(request: NextRequest)`.

### 3. Verificação de Variáveis de Ambiente
- Identificado que o projeto depende das seguintes variáveis:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `LLM_API_KEY`
- Se estas não estiverem no painel do Vercel, o `lib/supabase/server.ts` lançará um erro logo no `import`, o que pode "matar" a rota antes mesmo de ela atender o pedido.

## 🚀 Próximos Passos
1. **Deploy**: O usuário deve realizar o push das alterações.
2. **Vercel Dashboard**: Acessar `Project Settings -> Environment Variables` e garantir que as 4 chaves acima estejam configuradas.
3. **Redeploy sem Cache**: Se o 404 persistir, realizar um "Redeploy" marcando a opção "Reset Build Cache".
4. **Teste de URL**: Acessar manualmente `seu-site.vercel.app/api/test` para confirmar o funcionamento geral das APIs.
