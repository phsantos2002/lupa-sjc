-- ===========================================
-- Lupa SJC v2 — Diretório Local Completo
-- Rodar no SQL Editor do Supabase
-- ===========================================

-- Dropar tabelas antigas (se existirem)
DROP TABLE IF EXISTS edicoes CASCADE;
DROP TABLE IF EXISTS promocoes CASCADE;
DROP TABLE IF EXISTS estabelecimentos CASCADE;

-- ===== CATEGORIAS =====
CREATE TABLE categorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome varchar NOT NULL UNIQUE,
  slug varchar NOT NULL UNIQUE,
  icone varchar DEFAULT '🏪',
  cor varchar DEFAULT '#3B82F6',
  ordem int DEFAULT 0,
  ativo boolean DEFAULT true
);

-- ===== ESTABELECIMENTOS =====
CREATE TABLE estabelecimentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome varchar NOT NULL,
  slug varchar NOT NULL UNIQUE,
  descricao text,
  categoria_id uuid REFERENCES categorias(id),
  telefone varchar,
  whatsapp varchar,
  instagram varchar,
  endereco varchar,
  bairro varchar NOT NULL DEFAULT 'São José dos Campos',
  cidade varchar NOT NULL DEFAULT 'São José dos Campos',
  cep varchar,
  latitude decimal,
  longitude decimal,
  foto_url varchar,
  logo_url varchar,
  horario_funcionamento jsonb DEFAULT '{}',
  tags text[] DEFAULT '{}',
  plano varchar DEFAULT 'basico' CHECK (plano IN ('basico', 'premium', 'destaque')),
  fundador boolean DEFAULT false,
  destaque boolean DEFAULT false,
  patrocinador boolean DEFAULT false,
  ativo boolean DEFAULT true,
  aberto_agora boolean DEFAULT false,
  ordem int DEFAULT 0,
  criado_em timestamp with time zone DEFAULT now(),
  atualizado_em timestamp with time zone DEFAULT now()
);

-- ===== PROMOÇÕES =====
CREATE TABLE promocoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  estabelecimento_id uuid NOT NULL REFERENCES estabelecimentos(id) ON DELETE CASCADE,
  titulo varchar NOT NULL,
  descricao text,
  preco_de decimal,
  preco_por decimal,
  desconto_percentual int,
  badge varchar,
  imagem_url varchar,
  tipo varchar DEFAULT 'oferta' CHECK (tipo IN ('oferta', 'cupom', 'destaque_semana', 'super_oferta')),
  ativo boolean DEFAULT true,
  data_inicio date DEFAULT CURRENT_DATE,
  data_fim date,
  criado_em timestamp with time zone DEFAULT now()
);

-- ===== DESTAQUE DA SEMANA =====
CREATE TABLE destaques_semana (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  estabelecimento_id uuid NOT NULL REFERENCES estabelecimentos(id) ON DELETE CASCADE,
  numero int NOT NULL,
  semana_inicio date NOT NULL,
  semana_fim date NOT NULL,
  ativo boolean DEFAULT true,
  criado_em timestamp with time zone DEFAULT now()
);

-- ===== PATROCINADORES (banner carousel) =====
CREATE TABLE patrocinadores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  estabelecimento_id uuid REFERENCES estabelecimentos(id) ON DELETE SET NULL,
  nome varchar NOT NULL,
  slogan varchar,
  telefone varchar,
  instagram varchar,
  logo_url varchar,
  ordem int DEFAULT 0,
  ativo boolean DEFAULT true,
  criado_em timestamp with time zone DEFAULT now()
);

-- ===== EDIÇÕES DO JORNAL (mantém compatibilidade) =====
CREATE TABLE edicoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data date NOT NULL UNIQUE,
  total_promocoes int DEFAULT 0,
  html_gerado text,
  criado_em timestamp with time zone DEFAULT now()
);

-- ===== ÍNDICES =====
CREATE INDEX idx_estabelecimentos_categoria ON estabelecimentos(categoria_id);
CREATE INDEX idx_estabelecimentos_ativo ON estabelecimentos(ativo);
CREATE INDEX idx_estabelecimentos_destaque ON estabelecimentos(destaque);
CREATE INDEX idx_estabelecimentos_slug ON estabelecimentos(slug);
CREATE INDEX idx_estabelecimentos_bairro ON estabelecimentos(bairro);
CREATE INDEX idx_promocoes_estabelecimento ON promocoes(estabelecimento_id);
CREATE INDEX idx_promocoes_ativo ON promocoes(ativo);
CREATE INDEX idx_promocoes_tipo ON promocoes(tipo);
CREATE INDEX idx_categorias_slug ON categorias(slug);

-- ===== RLS =====
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE estabelecimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE promocoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE destaques_semana ENABLE ROW LEVEL SECURITY;
ALTER TABLE patrocinadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE edicoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON categorias FOR SELECT USING (true);
CREATE POLICY "Service full access" ON categorias FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read" ON estabelecimentos FOR SELECT USING (true);
CREATE POLICY "Service full access" ON estabelecimentos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read" ON promocoes FOR SELECT USING (true);
CREATE POLICY "Service full access" ON promocoes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read" ON destaques_semana FOR SELECT USING (true);
CREATE POLICY "Service full access" ON destaques_semana FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read" ON patrocinadores FOR SELECT USING (true);
CREATE POLICY "Service full access" ON patrocinadores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access" ON edicoes FOR ALL USING (true) WITH CHECK (true);

-- ===== CATEGORIAS PADRÃO =====
INSERT INTO categorias (nome, slug, icone, cor, ordem) VALUES
  ('Abertos 24h', 'abertos-24h', '🕐', '#10B981', 1),
  ('Restaurantes', 'restaurantes', '🍽️', '#EF4444', 2),
  ('Mercados', 'mercados', '🛒', '#3B82F6', 3),
  ('Farmácias', 'farmacias', '💊', '#EC4899', 4),
  ('Pet Shops', 'pet-shops', '🐾', '#F59E0B', 5),
  ('Padarias', 'padarias', '🥖', '#D97706', 6),
  ('Barbearias', 'barbearias', '💈', '#6366F1', 7),
  ('Academias', 'academias', '🏋️', '#8B5CF6', 8),
  ('Cafés', 'cafes', '☕', '#92400E', 9),
  ('Bares', 'bares', '🍺', '#F5A623', 10),
  ('Pizzarias', 'pizzarias', '🍕', '#FF8C4A', 11),
  ('Hamburguerias', 'hamburguerias', '🍔', '#FF6B4A', 12),
  ('Docerias', 'docerias', '🧁', '#F472B6', 13),
  ('Lojas', 'lojas', '🏬', '#64748B', 14),
  ('Serviços', 'servicos', '🔧', '#0EA5E9', 15);

-- ===== DADOS DE EXEMPLO =====
-- (serão inseridos via backend/admin)
