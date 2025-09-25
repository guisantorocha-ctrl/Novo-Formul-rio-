/*
  # Criar tabela de orçamentos

  1. Nova Tabela
    - `quotes`
      - `id` (uuid, chave primária)
      - `store_id` (bigint, referência para stores)
      - `client_name` (text, nome do cliente)
      - `client_phone` (text, telefone do cliente)
      - `client_email` (text, email do cliente)
      - `scaffold_type` (text, tipo de andaime)
      - `scaffold_height` (text, altura do andaime)
      - `tower_quantity` (integer, quantidade de torres)
      - `items` (jsonb, itens do orçamento)
      - `status` (text, status do orçamento)
      - `created_at` (timestamptz, data de criação)
      - `updated_at` (timestamptz, data de atualização)

  2. Segurança
    - Habilitar RLS na tabela `quotes`
    - Política para lojas verem apenas seus orçamentos
    - Política para inserção pública (formulário)
    - Política para atualização apenas pela loja dona

  3. Índices
    - Índice em store_id para performance
    - Índice em status para filtros
    - Índice em created_at para ordenação
*/

-- Criar tabela de orçamentos
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id BIGINT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT NOT NULL,
  scaffold_type TEXT NOT NULL,
  scaffold_height TEXT NOT NULL,
  tower_quantity INTEGER NOT NULL DEFAULT 1 CHECK (tower_quantity > 0),
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_quotes_store_id ON quotes(store_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_client_name ON quotes(client_name);

-- Habilitar Row Level Security
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Política para leitura: lojas podem ver apenas seus próprios orçamentos
CREATE POLICY "Stores can read own quotes" ON quotes
  FOR SELECT
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

-- Política para inserção: qualquer pessoa pode inserir orçamentos (formulário público)
CREATE POLICY "Anyone can insert quotes" ON quotes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Política para atualização: apenas a loja dona pode atualizar
CREATE POLICY "Stores can update own quotes" ON quotes
  FOR UPDATE
  TO authenticated
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

-- Trigger para atualizar updated_at na tabela quotes
CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para validar estrutura dos items JSONB
CREATE OR REPLACE FUNCTION validate_quote_items(items JSONB)
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar se é um array
  IF jsonb_typeof(items) != 'array' THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar estrutura de cada item
  IF EXISTS (
    SELECT 1 FROM jsonb_array_elements(items) AS item
    WHERE NOT (
      item ? 'id' AND
      item ? 'name' AND
      item ? 'quantity' AND
      item ? 'category' AND
      jsonb_typeof(item->'id') = 'string' AND
      jsonb_typeof(item->'name') = 'string' AND
      jsonb_typeof(item->'quantity') = 'number' AND
      jsonb_typeof(item->'category') = 'string'
    )
  ) THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Constraint para validar estrutura dos items
ALTER TABLE quotes ADD CONSTRAINT valid_items_structure 
  CHECK (validate_quote_items(items));