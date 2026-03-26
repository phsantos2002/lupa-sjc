-- ===========================================
-- Jornal Lupa SJC — Migrations
-- Rodar no editor SQL do Supabase
-- ===========================================

-- Tabela de estabelecimentos
CREATE TABLE IF NOT EXISTS estabelecimentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome varchar NOT NULL,
  whatsapp varchar NOT NULL,
  bairro varchar NOT NULL,
  categoria varchar NOT NULL CHECK (categoria IN ('chopp', 'lanche', 'pizza', 'porcao')),
  plano varchar DEFAULT 'basico' CHECK (plano IN ('basico', 'fundador', 'premium')),
  ativo boolean DEFAULT true,
  fundador boolean DEFAULT false,
  criado_em timestamp with time zone DEFAULT now()
);

-- Tabela de promoções
CREATE TABLE IF NOT EXISTS promocoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  estabelecimento_id uuid NOT NULL REFERENCES estabelecimentos(id) ON DELETE CASCADE,
  descricao varchar NOT NULL,
  preco_de decimal,
  preco_por decimal NOT NULL,
  validade varchar,
  emoji varchar DEFAULT '🍺',
  ativo boolean DEFAULT true,
  data_criacao timestamp with time zone DEFAULT now()
);

-- Tabela de edições do jornal
CREATE TABLE IF NOT EXISTS edicoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data date NOT NULL UNIQUE,
  total_promocoes int DEFAULT 0,
  html_gerado text,
  criado_em timestamp with time zone DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_promocoes_estabelecimento ON promocoes(estabelecimento_id);
CREATE INDEX IF NOT EXISTS idx_promocoes_ativo ON promocoes(ativo);
CREATE INDEX IF NOT EXISTS idx_estabelecimentos_ativo ON estabelecimentos(ativo);
CREATE INDEX IF NOT EXISTS idx_estabelecimentos_categoria ON estabelecimentos(categoria);
CREATE INDEX IF NOT EXISTS idx_edicoes_data ON edicoes(data);

-- RLS (Row Level Security) — desabilitado para uso com service key no backend
-- Se quiser habilitar, crie policies adequadas
ALTER TABLE estabelecimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE promocoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE edicoes ENABLE ROW LEVEL SECURITY;

-- Policies permissivas para service key (anon key não acessa)
CREATE POLICY "Service key full access" ON estabelecimentos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service key full access" ON promocoes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service key full access" ON edicoes FOR ALL USING (true) WITH CHECK (true);

-- Bucket público para as edições HTML
-- Criar manualmente no Supabase Dashboard:
-- Storage → New Bucket → Nome: "edicoes" → Public: true
