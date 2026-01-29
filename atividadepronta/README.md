# 🎓 AtividadePronta - Gerador de Atividades Escolares

**AtividadePronta** é um micro SaaS que permite professores brasileiros criarem atividades escolares completas com gabarito em minutos, usando inteligência artificial.

## 🚀 Funcionalidades

- ✨ **Geração automática** de atividades com IA
- 📝 **Gabarito incluído** em todas as atividades
- 🎯 **Sugestão de habilidades BNCC**
- 📄 **Download em PDF A4** pronto para imprimir
- 🔒 **Sistema de autenticação** com Supabase
- ⏱️ **Rate limiting** (3 gerações/dia sem login, 10/dia com login)
- 📚 **Histórico** das últimas 10 atividades
- 🎨 **Design moderno** e responsivo

## 🛠️ Stack Técnica

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Estilização**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **IA**: API LLM configurável (OpenAI, Anthropic, etc)
- **Validação**: Zod
- **PDF**: jsPDF + html2canvas

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- Chave de API de um provedor LLM (OpenAI, Anthropic, etc)

## 🔧 Configuração

### 1. Clone o repositório

```bash
cd atividadepronta
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Vá em **Settings > API** e copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

3. No **SQL Editor** do Supabase, execute o seguinte script:

```sql
-- Criar tabela de atividades
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Criar índices
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_ip_address ON activities(ip_address);
CREATE INDEX idx_activities_created_at ON activities(created_at DESC);

-- Criar tabela de rate limits
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier TEXT NOT NULL,
  type TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  reset_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(identifier, type)
);

-- Criar índice
CREATE INDEX idx_rate_limits_identifier ON rate_limits(identifier, type);

-- Habilitar Row Level Security (RLS)
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para activities
CREATE POLICY "Usuários podem ver suas próprias atividades"
  ON activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias atividades"
  ON activities FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Políticas RLS para rate_limits (apenas admin pode acessar)
CREATE POLICY "Service role pode gerenciar rate limits"
  ON rate_limits FOR ALL
  USING (auth.role() = 'service_role');
```

4. Habilite autenticação por email em **Authentication > Providers > Email**

### 4. Configure a API LLM

#### Opção A: OpenAI

1. Acesse [platform.openai.com](https://platform.openai.com)
2. Crie uma API key
3. Configure no `.env.local`:

```env
LLM_API_KEY=sk-...
LLM_API_URL=https://api.openai.com/v1/chat/completions
LLM_MODEL=gpt-4o-mini
```

#### Opção B: Anthropic Claude

```env
LLM_API_KEY=sk-ant-...
LLM_API_URL=https://api.anthropic.com/v1/messages
LLM_MODEL=claude-3-haiku-20240307
```

### 5. Crie o arquivo `.env.local`

Copie o `.env.local.example` e preencha com suas credenciais:

```bash
cp .env.local.example .env.local
```

Edite o `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

# LLM API
LLM_API_KEY=sua_api_key_aqui
LLM_API_URL=https://api.openai.com/v1/chat/completions
LLM_MODEL=gpt-4o-mini

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 Rodando Localmente

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📦 Build para Produção

```bash
npm run build
npm start
```

## 🌐 Deploy na Vercel

1. Faça push do código para o GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Importe o repositório
4. Configure as variáveis de ambiente (mesmas do `.env.local`)
5. Deploy!

## 📖 Como Usar

### Sem Login (3 gerações/dia)

1. Acesse a landing page
2. Clique em "Começar grátis"
3. Preencha o formulário:
   - Série/ano
   - Disciplina
   - Tema
   - Quantidade de questões
   - Dificuldade
   - Tipo de questão
4. Clique em "Gerar Atividade"
5. Aguarde alguns segundos
6. Baixe o PDF ou gere nova atividade

### Com Login (10 gerações/dia)

1. Crie uma conta em `/registro`
2. Faça login em `/login`
3. Siga os mesmos passos acima
4. Acesse seu histórico em `/app/historico`

## 🗂️ Estrutura do Projeto

```
atividadepronta/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── generate-activity/    # Endpoint de geração
│   ├── app/                      # Páginas do app
│   │   ├── page.tsx              # Formulário
│   │   ├── resultado/            # Página de resultado
│   │   └── historico/            # Histórico (TODO)
│   ├── login/                    # Página de login (TODO)
│   ├── registro/                 # Página de registro (TODO)
│   ├── layout.tsx                # Layout raiz
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Estilos globais
├── components/                   # Componentes React
│   ├── landing/                  # Componentes da landing
│   ├── app/                      # Componentes do app
│   └── shared/                   # Componentes compartilhados
├── lib/                          # Bibliotecas e utilitários
│   ├── ai/                       # Cliente LLM
│   ├── supabase/                 # Clientes Supabase
│   ├── rate-limit/               # Sistema de rate limiting
│   └── utils/                    # Utilitários diversos
├── types/                        # Tipos TypeScript
└── public/                       # Arquivos estáticos
```

## 🔒 Segurança

- ✅ Autenticação via Supabase Auth
- ✅ Row Level Security (RLS) no banco
- ✅ Rate limiting por IP e usuário
- ✅ Validação com Zod em frontend e backend
- ✅ Variáveis de ambiente protegidas
- ✅ CORS configurado
- ✅ SQL injection prevenido pelo Supabase

## 🐛 Troubleshooting

### Erro: "Missing Supabase environment variables"

- Verifique se o `.env.local` existe e está preenchido
- Reinicie o servidor de desenvolvimento

### Erro: "LLM_API_KEY não configurada"

- Configure a chave da API LLM no `.env.local`
- Verifique se a chave está válida

### Erro: "Limite de gerações atingido"

- Aguarde o reset diário (meia-noite)
- Ou faça login para ter mais gerações

### PDF não está sendo gerado

- Funcionalidade em desenvolvimento
- Será implementada na próxima versão

## 📝 TODO

- [ ] Implementar geração de PDF
- [ ] Criar páginas de login e registro
- [ ] Implementar histórico de atividades
- [ ] Adicionar testes automatizados
- [ ] Implementar sistema de pagamento
- [ ] Adicionar templates personalizáveis
- [ ] Suporte a exportação para Word

## 📄 Licença

MIT

## 🤝 Contribuindo

Contribuições são bem-vindas! Abra uma issue ou pull request.

## 📧 Contato

Para dúvidas ou sugestões: contato@atividadepronta.com

---

**Feito com ❤️ para professores brasileiros**
