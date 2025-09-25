/*
  # Criar tabela de lojas

  1. Nova Tabela
    - `stores`
      - `id` (bigint, chave primária, auto incremento)
      - `user_id` (uuid, referência para auth.users)
      - `name` (text, nome da loja)
      - `email` (text, email da loja)
      - `phone` (text, telefone opcional)
      - `whatsapp_number` (text, WhatsApp obrigatório)
      - `subscription_status` (text, status da assinatura)
      - `subscription_expires_at` (timestamptz, data de expiração)
      - `created_at` (timestamptz, data de criação)
      - `updated_at` (timestamptz, data de atualização)

  2. Segurança
    - Habilitar RLS na tabela `stores`
    - Política para usuários verem apenas suas próprias lojas
    - Política para inserção de novas lojas
    - Política para atualização de dados próprios

  3. Índices
    - Índice único em user_id para performance
    - Índice em subscription_status para consultas
*/

-- Criar tabela de lojas
CREATE TABLE IF NOT EXISTS stores (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp_number TEXT NOT NULL,
  subscription_status TEXT NOT NULL DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'expired')),
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_stores_user_id ON stores(user_id);
CREATE INDEX IF NOT EXISTS idx_stores_subscription_status ON stores(subscription_status);
CREATE INDEX IF NOT EXISTS idx_stores_created_at ON stores(created_at);

-- Habilitar Row Level Security
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Política para leitura: usuários só podem ver suas próprias lojas
CREATE POLICY "Users can read own stores" ON stores
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Política para inserção: usuários podem criar suas próprias lojas
CREATE POLICY "Users can insert own stores" ON stores
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Política para atualização: usuários podem atualizar suas próprias lojas
CREATE POLICY "Users can update own stores" ON stores
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at na tabela stores
CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();