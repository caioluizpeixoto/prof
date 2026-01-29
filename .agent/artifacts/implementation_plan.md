# Plano de Implementação - AtividadePronta MVP

## 📋 Visão Geral do Projeto

**Nome**: AtividadePronta
**Tipo**: Micro SaaS - Gerador de Atividades Escolares
**Público-alvo**: Professores brasileiros
**Stack**: Next.js (App Router) + Supabase + API LLM

---

## 🎯 Funcionalidades Core

### 1. Landing Page
- Headline impactante
- Proposta de valor clara
- CTA "Começar grátis"
- Design educativo e profissional

### 2. Gerador de Atividades
- Formulário com 6 campos obrigatórios
- Integração com LLM via API
- Geração de atividade + gabarito + BNCC
- Download em PDF A4

### 3. Autenticação
- Login/Registro via Supabase Auth
- Email + senha
- Proteção de rotas

### 4. Sistema de Limites
- Sem login: 3 gerações/dia (por IP)
- Com login: 10 gerações/dia (por usuário)
- Contador visual de gerações restantes

### 5. Histórico
- Últimas 10 atividades do usuário
- Possibilidade de re-download

---

## 🏗️ Arquitetura do Sistema

```
atividadepronta/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── app/
│   │   ├── page.tsx                # Formulário gerador
│   │   ├── resultado/page.tsx      # Tela de resultado
│   │   └── historico/page.tsx      # Histórico de atividades
│   ├── login/page.tsx              # Tela de login
│   ├── registro/page.tsx           # Tela de registro
│   ├── api/
│   │   ├── generate-activity/route.ts
│   │   ├── check-limit/route.ts
│   │   └── generate-pdf/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── CTA.tsx
│   ├── app/
│   │   ├── ActivityForm.tsx
│   │   ├── ResultDisplay.tsx
│   │   ├── LimitCounter.tsx
│   │   └── HistoryList.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   └── shared/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── PDFTemplate.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── ai/
│   │   └── llm-client.ts
│   ├── pdf/
│   │   └── generator.ts
│   ├── rate-limit/
│   │   └── limiter.ts
│   └── utils/
│       ├── prompts.ts
│       └── validators.ts
├── types/
│   └── index.ts
├── public/
│   └── images/
├── .env.local.example
├── .env.local
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📊 Modelo de Dados (Supabase)

### Tabela: `users`
- Gerenciada automaticamente pelo Supabase Auth

### Tabela: `activities`
```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  ip_address TEXT,
  serie TEXT NOT NULL,
  disciplina TEXT NOT NULL,
  tema TEXT NOT NULL,
  quantidade_questoes INTEGER NOT NULL,
  dificuldade TEXT NOT NULL,
  tipo_questao TEXT NOT NULL,
  atividade_content TEXT NOT NULL,
  gabarito_content TEXT NOT NULL,
  bncc_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_ip_address ON activities(ip_address);
CREATE INDEX idx_activities_created_at ON activities(created_at);
```

### Tabela: `rate_limits`
```sql
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier TEXT NOT NULL, -- user_id ou IP
  type TEXT NOT NULL, -- 'user' ou 'ip'
  count INTEGER DEFAULT 0,
  reset_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(identifier, type)
);

CREATE INDEX idx_rate_limits_identifier ON rate_limits(identifier);
```

---

## 🔧 Configuração de Variáveis de Ambiente

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# LLM API (configurável)
LLM_API_KEY=your_llm_api_key
LLM_API_URL=https://api.openai.com/v1/chat/completions
LLM_MODEL=gpt-4o-mini

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 Fases de Implementação

### **FASE 1: Setup Inicial** ✅
1. Criar projeto Next.js com TypeScript
2. Configurar Supabase
3. Configurar variáveis de ambiente
4. Instalar dependências necessárias
5. Estrutura de pastas base

**Dependências**:
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/auth-helpers-nextjs": "^0.8.0",
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

### **FASE 2: Configuração do Supabase** ✅
1. Criar projeto no Supabase
2. Configurar autenticação por email
3. Criar tabelas no banco de dados
4. Configurar Row Level Security (RLS)
5. Testar conexão

**Scripts SQL**:
- Criar tabelas `activities` e `rate_limits`
- Configurar políticas RLS
- Criar funções auxiliares

---

### **FASE 3: Sistema de Autenticação** ✅
1. Criar componentes de Login e Registro
2. Implementar middleware de autenticação
3. Criar helpers do Supabase (client/server)
4. Proteger rotas do app
5. Implementar logout

**Arquivos**:
- `components/auth/LoginForm.tsx`
- `components/auth/RegisterForm.tsx`
- `app/login/page.tsx`
- `app/registro/page.tsx`
- `lib/supabase/middleware.ts`

---

### **FASE 4: Landing Page** ✅
1. Criar Hero section
2. Criar Features section
3. Criar CTA section
4. Design responsivo
5. Animações sutis

**Componentes**:
- `components/landing/Hero.tsx`
- `components/landing/Features.tsx`
- `components/landing/CTA.tsx`
- `app/page.tsx`

**Design**:
- Cores educativas (azul, verde, laranja)
- Tipografia profissional (Inter, Poppins)
- Ícones ilustrativos
- Mobile-first

---

### **FASE 5: Integração com LLM** ✅
1. Criar cliente LLM configurável
2. Implementar prompt base
3. Criar função de geração
4. Tratamento de erros
5. Parsing da resposta

**Arquivos**:
- `lib/ai/llm-client.ts`
- `lib/utils/prompts.ts`

**Prompt Template**:
```typescript
const ACTIVITY_PROMPT = `Você é um pedagogo especialista em criar atividades escolares no padrão brasileiro.
Gere uma atividade para a série {SERIE}, disciplina {DISCIPLINA}, tema {TEMA}, com {QTD} questões, nível {DIFICULDADE} e tipo {TIPO}.

Entregue sempre em 2 blocos:
1. ATIVIDADE (questões numeradas)
2. GABARITO

Inclua linguagem adequada à série, evite ambiguidades e, se possível, cite 1 habilidade da BNCC relacionada.

Formato de resposta:
---ATIVIDADE---
[conteúdo da atividade]

---GABARITO---
[gabarito completo]

---BNCC---
[habilidade da BNCC, se aplicável]
`;
```

---

### **FASE 6: Sistema de Rate Limiting** ✅
1. Criar função de verificação de limite
2. Implementar contador por IP
3. Implementar contador por usuário
4. Reset automático diário
5. Exibir contador visual

**Arquivos**:
- `lib/rate-limit/limiter.ts`
- `app/api/check-limit/route.ts`
- `components/app/LimitCounter.tsx`

**Lógica**:
- Sem login: 3 gerações/dia (por IP)
- Com login: 10 gerações/dia (por user_id)
- Reset às 00:00 (horário de Brasília)

---

### **FASE 7: Formulário de Geração** ✅
1. Criar componente de formulário
2. Validação com Zod
3. Estados de loading
4. Feedback de erros
5. UX otimizada

**Arquivos**:
- `components/app/ActivityForm.tsx`
- `app/app/page.tsx`
- `lib/utils/validators.ts`

**Campos**:
- Série/ano (select)
- Disciplina (select)
- Tema (text input)
- Quantidade de questões (number)
- Dificuldade (radio)
- Tipo de questão (radio)

---

### **FASE 8: API de Geração** ✅
1. Criar rota `/api/generate-activity`
2. Verificar rate limit
3. Chamar LLM
4. Salvar no banco
5. Retornar resultado

**Arquivos**:
- `app/api/generate-activity/route.ts`

**Fluxo**:
1. Receber dados do formulário
2. Verificar autenticação (opcional)
3. Verificar rate limit
4. Gerar atividade via LLM
5. Parsear resposta
6. Salvar no banco
7. Retornar JSON

---

### **FASE 9: Tela de Resultado** ✅
1. Criar componente de exibição
2. Separar atividade/gabarito/BNCC
3. Botão de nova geração
4. Botão de download PDF
5. Design para impressão

**Arquivos**:
- `components/app/ResultDisplay.tsx`
- `app/app/resultado/page.tsx`

**Layout**:
- Atividade em destaque
- Gabarito em seção separada
- BNCC em card destacado
- Botões de ação visíveis

---

### **FASE 10: Geração de PDF** ✅
1. Criar template PDF
2. Implementar cabeçalho A4
3. Formatar atividade
4. Formatar gabarito
5. Download automático

**Arquivos**:
- `lib/pdf/generator.ts`
- `components/shared/PDFTemplate.tsx`
- `app/api/generate-pdf/route.ts`

**Estrutura PDF**:
```
┌─────────────────────────────────┐
│ ATIVIDADE ESCOLAR               │
│ Escola: _____ Professor: ___    │
│ Turma: _____ Data: ___/___/___  │
├─────────────────────────────────┤
│                                 │
│ [CONTEÚDO DA ATIVIDADE]         │
│                                 │
├─────────────────────────────────┤
│ GABARITO                        │
│ [CONTEÚDO DO GABARITO]          │
└─────────────────────────────────┘
```

---

### **FASE 11: Histórico de Atividades** ✅
1. Criar query de histórico
2. Componente de lista
3. Paginação (últimas 10)
4. Re-download de PDFs
5. Filtros básicos

**Arquivos**:
- `components/app/HistoryList.tsx`
- `app/app/historico/page.tsx`

**Features**:
- Listar últimas 10 atividades
- Mostrar data, tema, disciplina
- Botão para re-visualizar
- Botão para re-baixar PDF

---

### **FASE 12: Componentes Compartilhados** ✅
1. Header com navegação
2. Footer
3. Loading states
4. Error boundaries
5. Toast notifications

**Arquivos**:
- `components/shared/Header.tsx`
- `components/shared/Footer.tsx`
- `components/shared/Loading.tsx`
- `components/shared/Toast.tsx`

---

### **FASE 13: Estilização e UX** ✅
1. Design system (cores, tipografia)
2. Responsividade completa
3. Animações sutis
4. Estados de hover/focus
5. Acessibilidade básica

**Tecnologias**:
- Tailwind CSS
- CSS Modules (se necessário)
- Framer Motion (opcional)

**Paleta de Cores**:
- Primary: #3B82F6 (azul educativo)
- Secondary: #10B981 (verde sucesso)
- Accent: #F59E0B (laranja destaque)
- Neutral: #6B7280 (cinza texto)
- Background: #F9FAFB

---

### **FASE 14: Testes e Validações** ✅
1. Testar fluxo completo sem login
2. Testar fluxo completo com login
3. Testar rate limiting
4. Testar geração de PDF
5. Testar responsividade

**Checklist**:
- [ ] Landing page carrega corretamente
- [ ] Registro de usuário funciona
- [ ] Login funciona
- [ ] Formulário valida campos
- [ ] LLM gera atividade
- [ ] Rate limit funciona (IP e user)
- [ ] PDF é gerado corretamente
- [ ] Histórico exibe atividades
- [ ] Logout funciona
- [ ] Mobile responsivo

---

### **FASE 15: Documentação e Deploy** ✅
1. Criar README.md completo
2. Documentar variáveis de ambiente
3. Criar .env.local.example
4. Instruções de setup
5. Deploy na Vercel

**README.md deve incluir**:
- Descrição do projeto
- Stack técnica
- Como rodar localmente
- Como configurar Supabase
- Como configurar LLM API
- Como fazer deploy
- Troubleshooting

---

## 🎨 Design Guidelines

### Cores
- **Primary**: Azul educativo (#3B82F6)
- **Secondary**: Verde (#10B981)
- **Accent**: Laranja (#F59E0B)
- **Text**: Cinza escuro (#1F2937)
- **Background**: Branco/Cinza claro

### Tipografia
- **Headings**: Poppins (bold)
- **Body**: Inter (regular)
- **Monospace**: JetBrains Mono (código)

### Componentes
- Botões com bordas arredondadas (8px)
- Cards com sombra sutil
- Inputs com foco destacado
- Feedback visual em todas as ações

---

## 🔒 Segurança

1. **Autenticação**: Supabase Auth (seguro por padrão)
2. **Rate Limiting**: Por IP e por usuário
3. **Validação**: Zod em frontend e backend
4. **SQL Injection**: Prevenido pelo Supabase
5. **XSS**: React escapa por padrão
6. **CORS**: Configurado no Next.js
7. **Env Variables**: Nunca expor chaves no frontend

---

## 📈 Métricas de Sucesso

- [ ] Tempo de geração < 10 segundos
- [ ] PDF gerado corretamente em 100% dos casos
- [ ] Rate limiting funciona sem falhas
- [ ] Mobile responsivo em todos os dispositivos
- [ ] Zero erros no console
- [ ] Lighthouse score > 90

---

## 🚀 Próximos Passos (Pós-MVP)

1. Sistema de pagamento (Stripe)
2. Planos premium (gerações ilimitadas)
3. Exportar para Word/Google Docs
4. Templates personalizáveis
5. Banco de questões reutilizáveis
6. Compartilhamento de atividades
7. Analytics de uso
8. Suporte a múltiplos idiomas

---

## 📝 Notas Importantes

- **Foco no MVP**: Não adicionar features extras antes de completar o core
- **Código limpo**: Comentários em português, código em inglês
- **Performance**: Otimizar imagens e lazy loading
- **SEO**: Meta tags básicas na landing page
- **Acessibilidade**: ARIA labels e navegação por teclado

---

## ✅ Critérios de Conclusão

O MVP estará completo quando:

1. ✅ Landing page está no ar
2. ✅ Usuário consegue se registrar e fazer login
3. ✅ Usuário consegue gerar atividade (com e sem login)
4. ✅ Rate limiting funciona corretamente
5. ✅ PDF é gerado e baixado
6. ✅ Histórico exibe últimas atividades
7. ✅ App está deployado na Vercel
8. ✅ README com instruções completas
9. ✅ Código está no GitHub
10. ✅ Variáveis de ambiente documentadas

---

**Tempo estimado de desenvolvimento**: 2-3 dias
**Complexidade**: Média
**Prioridade**: Alta

---

*Plano criado em: 28/01/2026*
*Versão: 1.0*
