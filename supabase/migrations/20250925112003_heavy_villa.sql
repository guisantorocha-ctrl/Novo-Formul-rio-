/*
  # Criar tabela de orçamentos

  1. Nova Tabela
    - `quotes`
      - `id` (uuid, primary key)
      - `store_id` (bigint, foreign key para stores)
      - `client_name` (text, nome do cliente)
      - `client_phone` (text, telefone do cliente)
      - `client_email` (text, email do cliente)
      - `scaffold_type` (text, tipo de andaime)
      - `scaffold_height` (text, altura do andaime)
      - `tower_quantity` (integer, quantidade de torres)
      - `items` (jsonb, itens do orçamento)
      - `status` (text, status do orçamento)
      - `created_at` (timestamp, data de criação)
      - `updated_at` (timestamp, data de atualização)

  2. Segurança
    - Habilitar RLS na tabela `quotes`
    - Políticas para que lojas vejam apenas seus orçamentos
    - Permitir inserção pública (para formulário)

  3. Índices
    - Índice no store_id para performance
    - Índice no status para filtros
    - Índice na data de criação para ordenação
*/

-- Criar tabela quotes
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id BIGINT REFERENCES stores(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT NOT NULL,
  scaffold_type TEXT NOT NULL,
  scaffold_height TEXT NOT NULL,
  tower_quantity INTEGER NOT NULL DEFAULT 1,
  items JSONB NOT NULL DEFAULT '[]',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
-- Lojas podem ver apenas seus próprios orçamentos
CREATE POLICY "Quotes select by store owner" ON quotes
  FOR SELECT TO authenticated
  USING (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

-- Lojas podem atualizar apenas seus próprios orçamentos
CREATE POLICY "Quotes update by store owner" ON quotes
  FOR UPDATE TO authenticated
  USING (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

-- Permitir inserção pública para o formulário (sem autenticação)
CREATE POLICY "Quotes insert public" ON quotes
  FOR INSERT TO anon
  WITH CHECK (true);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_quotes_store_id ON quotes(store_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_client_name ON quotes(client_name);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();