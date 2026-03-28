-- ===========================================
-- Categorias padrão de comércio + atualizar lojas
-- ===========================================

-- Limpar categorias antigas
DELETE FROM categorias;

-- Categorias padrão de comércio
INSERT INTO categorias (nome, slug, icone, cor, ordem, ativo) VALUES
  ('Alimentação', 'alimentacao', '🍽️', '#EF4444', 1, true),
  ('Beleza e Estética', 'beleza-estetica', '✂️', '#EC4899', 2, true),
  ('Moda e Acessórios', 'moda-acessorios', '👗', '#8B5CF6', 3, true),
  ('Saúde e Bem-estar', 'saude-bem-estar', '💊', '#10B981', 4, true),
  ('Tecnologia e Games', 'tecnologia-games', '🎮', '#3B82F6', 5, true),
  ('Casa e Decoração', 'casa-decoracao', '🏠', '#F59E0B', 6, true),
  ('Serviços', 'servicos', '🔧', '#6366F1', 7, true),
  ('Pet Shop', 'pet-shop', '🐾', '#D97706', 8, true),
  ('Presentes e Papelaria', 'presentes-papelaria', '🎁', '#F472B6', 9, true),
  ('Ótica', 'otica', '👓', '#0EA5E9', 10, true),
  ('Perfumaria e Cosméticos', 'perfumaria-cosmeticos', '💄', '#A855F7', 11, true),
  ('Viagens e Turismo', 'viagens-turismo', '✈️', '#14B8A6', 12, true),
  ('Chocolates e Doces', 'chocolates-doces', '🍫', '#92400E', 13, true);

-- Atualizar categorias das lojas
UPDATE estabelecimentos SET categoria_id = (SELECT id FROM categorias WHERE slug = 'servicos') WHERE slug IN ('vip-lub', 'mais-laser', 'chaveiro-tauste', 'dry-clean', 'senhor-smart');
UPDATE estabelecimentos SET categoria_id = (SELECT id FROM categorias WHERE slug = 'beleza-estetica') WHERE slug IN ('artstilo', 'barbaresco');
UPDATE estabelecimentos SET categoria_id = (SELECT id FROM categorias WHERE slug = 'alimentacao') WHERE slug IN ('suki-sucos', 'sapore', 'donuts-tauste', 'chicken-beer', 'natural-vale');
UPDATE estabelecimentos SET categoria_id = (SELECT id FROM categorias WHERE slug = 'saude-bem-estar') WHERE slug = 'farmacia-tauste';
UPDATE estabelecimentos SET categoria_id = (SELECT id FROM categorias WHERE slug = 'pet-shop') WHERE slug = 'popular-pet';
UPDATE estabelecimentos SET categoria_id = (SELECT id FROM categorias WHERE slug = 'tecnologia-games') WHERE slug IN ('gold-game', 'itx');
UPDATE estabelecimentos SET categoria_id = (SELECT id FROM categorias WHERE slug = 'moda-acessorios') WHERE slug IN ('malwee', 'ewerlu', 'dauns', 'lanuni');
UPDATE estabelecimentos SET categoria_id = (SELECT id FROM categorias WHERE slug = 'casa-decoracao') WHERE slug IN ('ortobom', 'boutique-tauste');
UPDATE estabelecimentos SET categoria_id = (SELECT id FROM categorias WHERE slug = 'presentes-papelaria') WHERE slug = 'gift-mix';
UPDATE estabelecimentos SET categoria_id = (SELECT id FROM categorias WHERE slug = 'perfumaria-cosmeticos') WHERE slug = 'o-boticario';
UPDATE estabelecimentos SET categoria_id = (SELECT id FROM categorias WHERE slug = 'otica') WHERE slug = 'opt';
UPDATE estabelecimentos SET categoria_id = (SELECT id FROM categorias WHERE slug = 'chocolates-doces') WHERE slug = 'cacau-show';
UPDATE estabelecimentos SET categoria_id = (SELECT id FROM categorias WHERE slug = 'viagens-turismo') WHERE slug = 'be-fly';
