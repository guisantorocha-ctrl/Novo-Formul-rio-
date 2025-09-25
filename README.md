# ScaffoldPro - Sistema SaaS de Orçamentos de Andaimes

Sistema inteligente para lojas de andaimes receberem orçamentos de clientes através de formulários personalizados.

## 🚀 Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Crie uma conta ou faça login
4. Clique em "New Project"
5. Escolha sua organização
6. Preencha:
   - **Name**: ScaffoldPro
   - **Database Password**: (crie uma senha forte)
   - **Region**: South America (São Paulo)
7. Clique em "Create new project"

### 2. Configurar Autenticação

1. No painel do Supabase, vá em **Authentication** > **Settings**
2. Em **Site URL**, adicione: `http://localhost:3000` (desenvolvimento)
3. Em **Redirect URLs**, adicione: `http://localhost:3000/dashboard`
4. **Desabilite** "Enable email confirmations" (para facilitar testes)
5. Clique em "Save"

### 3. Executar Migrações do Banco

1. No painel do Supabase, vá em **SQL Editor**
2. Execute os scripts das migrações na ordem:

**Primeiro - Criar tabela stores:**
```sql
-- Cole o conteúdo do arquivo: supabase/migrations/create_stores_table.sql
```

**Segundo - Criar tabela quotes:**
```sql
-- Cole o conteúdo do arquivo: supabase/migrations/create_quotes_table.sql
```

### 4. Configurar Variáveis de Ambiente

1. No painel do Supabase, vá em **Settings** > **API**
2. Copie:
   - **Project URL**
   - **anon public key**
3. Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_project_url_aqui
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

### 5. Testar a Aplicação

```bash
npm run dev
```

1. Acesse `http://localhost:3000`
2. Clique em "Cadastre-se aqui"
3. Preencha os dados da loja
4. Faça login
5. Acesse o dashboard

## 📋 Funcionalidades

### Para Lojas:
- ✅ Cadastro e login seguro
- ✅ Dashboard com estatísticas
- ✅ Link exclusivo do formulário
- ✅ Gestão de orçamentos recebidos
- ✅ Controle de assinatura
- ✅ Histórico de pagamentos

### Para Clientes:
- ✅ Formulário sem cadastro
- ✅ Presets inteligentes por altura
- ✅ Envio via WhatsApp
- ✅ Interface responsiva

## 🔒 Segurança

- **Row Level Security (RLS)** habilitado
- **Políticas de acesso** por usuário
- **Validação de assinatura** em tempo real
- **Links únicos** por loja
- **Proteção contra acesso não autorizado**

## 🛠️ Estrutura do Banco

### Tabela `stores`
- Dados das lojas cadastradas
- Controle de assinatura
- Vinculação com usuários autenticados

### Tabela `quotes`
- Orçamentos recebidos
- Dados dos clientes
- Itens do andaime
- Status do orçamento

## 📞 Suporte

Se tiver problemas na configuração:

1. Verifique se as variáveis de ambiente estão corretas
2. Confirme se as migrações foram executadas
3. Teste a conexão no console do navegador
4. Verifique se a autenticação está configurada corretamente

## 🚀 Deploy

Para fazer deploy em produção:

1. Configure as URLs de produção no Supabase
2. Atualize as variáveis de ambiente
3. Execute `npm run build`
4. Faça deploy dos arquivos da pasta `dist`