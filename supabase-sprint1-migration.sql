-- ===========================================
-- Sprint 1: Perfil Rico da Loja
-- Rodar no SQL Editor do Supabase
-- ===========================================

-- ===== NOVOS CAMPOS NA TABELA ESTABELECIMENTOS =====
ALTER TABLE estabelecimentos ADD COLUMN IF NOT EXISTS subcategoria varchar;
ALTER TABLE estabelecimentos ADD COLUMN IF NOT EXISTS tipo_negocio varchar DEFAULT 'product' CHECK (tipo_negocio IN ('product', 'service', 'food', 'pharmacy'));
ALTER TABLE estabelecimentos ADD COLUMN IF NOT EXISTS descricao_completa text;
ALTER TABLE estabelecimentos ADD COLUMN IF NOT EXISTS andar int DEFAULT 0;
ALTER TABLE estabelecimentos ADD COLUMN IF NOT EXISTS andar_detalhe varchar;
ALTER TABLE estabelecimentos ADD COLUMN IF NOT EXISTS website varchar;
ALTER TABLE estabelecimentos ADD COLUMN IF NOT EXISTS banner_url varchar;
ALTER TABLE estabelecimentos ADD COLUMN IF NOT EXISTS verificado boolean DEFAULT false;

-- ===== HORÁRIOS DE FUNCIONAMENTO =====
CREATE TABLE IF NOT EXISTS horarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  estabelecimento_id uuid NOT NULL REFERENCES estabelecimentos(id) ON DELETE CASCADE,
  dia_semana int NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
  hora_abre time,
  hora_fecha time,
  fechado boolean DEFAULT false,
  UNIQUE(estabelecimento_id, dia_semana)
);

-- ===== FOTOS DA LOJA =====
CREATE TABLE IF NOT EXISTS fotos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  estabelecimento_id uuid NOT NULL REFERENCES estabelecimentos(id) ON DELETE CASCADE,
  url varchar NOT NULL,
  legenda varchar,
  ordem int DEFAULT 0,
  criado_em timestamp with time zone DEFAULT now()
);

-- ===== PRODUTOS (tipo_negocio = 'product') =====
CREATE TABLE IF NOT EXISTS produtos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  estabelecimento_id uuid NOT NULL REFERENCES estabelecimentos(id) ON DELETE CASCADE,
  nome varchar NOT NULL,
  descricao varchar(300),
  preco decimal(10,2),
  preco_promocional decimal(10,2),
  imagem_url varchar,
  categoria varchar,
  novo boolean DEFAULT false,
  destaque boolean DEFAULT false,
  ativo boolean DEFAULT true,
  ordem int DEFAULT 0,
  criado_em timestamp with time zone DEFAULT now()
);

-- ===== SERVIÇOS (tipo_negocio = 'service') =====
CREATE TABLE IF NOT EXISTS servicos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  estabelecimento_id uuid NOT NULL REFERENCES estabelecimentos(id) ON DELETE CASCADE,
  nome varchar NOT NULL,
  descricao varchar(300),
  preco decimal(10,2),
  preco_label varchar,
  duracao_minutos int,
  imagem_url varchar,
  ativo boolean DEFAULT true,
  ordem int DEFAULT 0,
  criado_em timestamp with time zone DEFAULT now()
);

-- ===== CARDÁPIO (tipo_negocio = 'food') =====
CREATE TABLE IF NOT EXISTS cardapio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  estabelecimento_id uuid NOT NULL REFERENCES estabelecimentos(id) ON DELETE CASCADE,
  secao varchar NOT NULL,
  nome varchar NOT NULL,
  descricao varchar(300),
  preco decimal(10,2),
  imagem_url varchar,
  popular boolean DEFAULT false,
  novo boolean DEFAULT false,
  ativo boolean DEFAULT true,
  ordem int DEFAULT 0,
  criado_em timestamp with time zone DEFAULT now()
);

-- ===== ÍNDICES =====
CREATE INDEX IF NOT EXISTS idx_horarios_estab ON horarios(estabelecimento_id);
CREATE INDEX IF NOT EXISTS idx_fotos_estab ON fotos(estabelecimento_id);
CREATE INDEX IF NOT EXISTS idx_produtos_estab ON produtos(estabelecimento_id);
CREATE INDEX IF NOT EXISTS idx_servicos_estab ON servicos(estabelecimento_id);
CREATE INDEX IF NOT EXISTS idx_cardapio_estab ON cardapio(estabelecimento_id);

-- ===== RLS =====
ALTER TABLE horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardapio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON horarios FOR SELECT USING (true);
CREATE POLICY "Service full access" ON horarios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read" ON fotos FOR SELECT USING (true);
CREATE POLICY "Service full access" ON fotos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read" ON produtos FOR SELECT USING (true);
CREATE POLICY "Service full access" ON produtos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read" ON servicos FOR SELECT USING (true);
CREATE POLICY "Service full access" ON servicos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read" ON cardapio FOR SELECT USING (true);
CREATE POLICY "Service full access" ON cardapio FOR ALL USING (true) WITH CHECK (true);

-- ===== ATUALIZAR TIPO DE NEGÓCIO DAS LOJAS EXISTENTES =====
-- Serviços
UPDATE estabelecimentos SET tipo_negocio = 'service', subcategoria = 'Troca de Óleo' WHERE slug = 'vip-lub';
UPDATE estabelecimentos SET tipo_negocio = 'service', subcategoria = 'Depilação a Laser' WHERE slug = 'mais-laser';
UPDATE estabelecimentos SET tipo_negocio = 'service', subcategoria = 'Chaveiro' WHERE slug = 'chaveiro-tauste';
UPDATE estabelecimentos SET tipo_negocio = 'service', subcategoria = 'Salão de Beleza' WHERE slug = 'artstilo';
UPDATE estabelecimentos SET tipo_negocio = 'service', subcategoria = 'Lavanderia' WHERE slug = 'dry-clean';
UPDATE estabelecimentos SET tipo_negocio = 'service', subcategoria = 'Assistência Técnica' WHERE slug = 'senhor-smart';
UPDATE estabelecimentos SET tipo_negocio = 'service', subcategoria = 'Barbearia' WHERE slug = 'barbaresco';

-- Food
UPDATE estabelecimentos SET tipo_negocio = 'food', subcategoria = 'Sucos e Açaí' WHERE slug = 'suki-sucos';
UPDATE estabelecimentos SET tipo_negocio = 'food', subcategoria = 'Gelato e Café' WHERE slug = 'sapore';
UPDATE estabelecimentos SET tipo_negocio = 'food', subcategoria = 'Donuts e Café' WHERE slug = 'donuts-tauste';
UPDATE estabelecimentos SET tipo_negocio = 'food', subcategoria = 'Frango e Cerveja' WHERE slug = 'chicken-beer';
UPDATE estabelecimentos SET tipo_negocio = 'food', subcategoria = 'Empório Natural' WHERE slug = 'natural-vale';

-- Pharmacy
UPDATE estabelecimentos SET tipo_negocio = 'pharmacy', subcategoria = 'Farmácia' WHERE slug = 'farmacia-tauste';

-- Product (lojas de produto)
UPDATE estabelecimentos SET tipo_negocio = 'product', subcategoria = 'Pet Shop' WHERE slug = 'popular-pet';
UPDATE estabelecimentos SET tipo_negocio = 'product', subcategoria = 'Games e Consoles' WHERE slug = 'gold-game';
UPDATE estabelecimentos SET tipo_negocio = 'product', subcategoria = 'Agência de Viagens' WHERE slug = 'be-fly';
UPDATE estabelecimentos SET tipo_negocio = 'product', subcategoria = 'Colchões' WHERE slug = 'ortobom';
UPDATE estabelecimentos SET tipo_negocio = 'product', subcategoria = 'Moda Feminina' WHERE slug = 'malwee';
UPDATE estabelecimentos SET tipo_negocio = 'product', subcategoria = 'Games e Tecnologia' WHERE slug = 'itx';
UPDATE estabelecimentos SET tipo_negocio = 'product', subcategoria = 'Calçados' WHERE slug = 'ewerlu';
UPDATE estabelecimentos SET tipo_negocio = 'product', subcategoria = 'Enxovais' WHERE slug = 'boutique-tauste';
UPDATE estabelecimentos SET tipo_negocio = 'product', subcategoria = 'Joias e Semijoias' WHERE slug = 'lanuni';
UPDATE estabelecimentos SET tipo_negocio = 'product', subcategoria = 'Presentes e Papelaria' WHERE slug = 'gift-mix';
UPDATE estabelecimentos SET tipo_negocio = 'product', subcategoria = 'Perfumaria' WHERE slug = 'o-boticario';
UPDATE estabelecimentos SET tipo_negocio = 'product', subcategoria = 'Ótica' WHERE slug = 'opt';
UPDATE estabelecimentos SET tipo_negocio = 'product', subcategoria = 'Chocolates' WHERE slug = 'cacau-show';
UPDATE estabelecimentos SET tipo_negocio = 'product', subcategoria = 'Streetwear' WHERE slug = 'dauns';

-- Atualizar andares
UPDATE estabelecimentos SET andar = 0 WHERE tags @> ARRAY['Térreo'];
UPDATE estabelecimentos SET andar = 1 WHERE tags @> ARRAY['1º Andar'];
UPDATE estabelecimentos SET andar = 2 WHERE tags @> ARRAY['2º Andar'];

-- Marcar lojas premium como verificadas
UPDATE estabelecimentos SET verificado = true WHERE destaque = true;

-- ===== HORÁRIOS PADRÃO (Seg-Sáb 09-21, Dom 10-18) =====
INSERT INTO horarios (estabelecimento_id, dia_semana, hora_abre, hora_fecha, fechado)
SELECT e.id, d.dia,
  CASE WHEN d.dia = 0 THEN '10:00'::time ELSE '09:00'::time END,
  CASE WHEN d.dia = 0 THEN '18:00'::time ELSE '21:00'::time END,
  false
FROM estabelecimentos e
CROSS JOIN (SELECT generate_series(0, 6) AS dia) d
ON CONFLICT (estabelecimento_id, dia_semana) DO NOTHING;
