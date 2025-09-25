/*
  # Criar tabela de lojas

  1. Nova Tabela
    - `stores`
      - `id` (bigint, primary key, auto increment)
      - `user_id` (uuid, foreign key para auth.users)
      - `name` (text, nome da loja)
      - `email` (text, email da loja)
      - `phone` (text, telefone opcional)
      - `whatsapp_number` (text, WhatsApp obrigatório)
      - `subscription_status` (text, status da assinatura)
      - `subscription_expires_at` (timestamp, data de expiração)
      - `created_at` (timestamp, data de criação)

  2. Segurança
    - Habilitar RLS na tabela `stores`
    - Adicionar políticas para usuários autenticados
    - Usuários só podem ver/editar suas próprias lojas

  3. Índices
    - Índice no user_id para performance
    - Índice no email para buscas
    - Índice no status da assinatura
*/

-- Criar sequência para IDs
CREATE SEQUENCE IF NOT EXISTS stores_id_seq;

-- Criar tabela stores
CREATE TABLE IF NOT EXISTS stores (
  id BIGINT PRIMARY KEY DEFAULT nextval('stores_id_seq'),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp_number TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Store select owner" ON stores
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Store insert owner" ON stores
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Store update owner" ON stores
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Store delete owner" ON stores
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_stores_user_id ON stores(user_id);
CREATE INDEX IF NOT EXISTS idx_stores_email ON stores(email);
CREATE INDEX IF NOT EXISTS idx_stores_subscription_status ON stores(subscription_status);
CREATE INDEX IF NOT EXISTS idx_stores_subscription_expires_at ON stores(subscription_expires_at);