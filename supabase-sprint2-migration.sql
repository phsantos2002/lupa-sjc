-- ===========================================
-- Sprint 2: Sistema de Promoções e Cupons
-- ===========================================

-- ===== PROMOÇÕES (refatorar tabela existente) =====
ALTER TABLE promocoes ADD COLUMN IF NOT EXISTS imagem_url varchar;
ALTER TABLE promocoes ADD COLUMN IF NOT EXISTS tipo_promo varchar DEFAULT 'percentage' CHECK (tipo_promo IN ('percentage', 'fixed_value', 'buy_x_get_y', 'gift', 'free_shipping', 'special_price'));
ALTER TABLE promocoes ADD COLUMN IF NOT EXISTS valor_desconto decimal(10,2);
ALTER TABLE promocoes ADD COLUMN IF NOT EXISTS condicoes text;
ALTER TABLE promocoes ADD COLUMN IF NOT EXISTS tipo_resgate varchar DEFAULT 'both' CHECK (tipo_resgate IN ('local_coupon', 'whatsapp', 'both'));
ALTER TABLE promocoes ADD COLUMN IF NOT EXISTS max_resgates int;
ALTER TABLE promocoes ADD COLUMN IF NOT EXISTS resgates_atuais int DEFAULT 0;
ALTER TABLE promocoes ADD COLUMN IF NOT EXISTS destaque_home boolean DEFAULT false;

-- ===== CUPONS =====
CREATE TABLE IF NOT EXISTS cupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promocao_id uuid NOT NULL REFERENCES promocoes(id) ON DELETE CASCADE,
  codigo varchar(8) NOT NULL UNIQUE,
  telefone_consumidor varchar,
  nome_consumidor varchar,
  status varchar DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired')),
  resgatado_em timestamp with time zone,
  resgatado_por uuid REFERENCES estabelecimentos(id),
  criado_em timestamp with time zone DEFAULT now(),
  expira_em timestamp with time zone
);

-- ===== TEMPLATES DE PROMOÇÃO =====
CREATE TABLE IF NOT EXISTS templates_promo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome varchar NOT NULL,
  titulo_template varchar,
  descricao_template text,
  imagem_url varchar,
  tipo varchar DEFAULT 'percentage',
  icone varchar DEFAULT '🏷️'
);

-- ===== ÍNDICES =====
CREATE INDEX IF NOT EXISTS idx_cupons_promocao ON cupons(promocao_id);
CREATE INDEX IF NOT EXISTS idx_cupons_codigo ON cupons(codigo);
CREATE INDEX IF NOT EXISTS idx_cupons_status ON cupons(status);
CREATE INDEX IF NOT EXISTS idx_promocoes_destaque ON promocoes(destaque_home);

-- ===== RLS =====
ALTER TABLE cupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates_promo ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON cupons FOR SELECT USING (true);
CREATE POLICY "Service full access" ON cupons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read" ON templates_promo FOR SELECT USING (true);
CREATE POLICY "Service full access" ON templates_promo FOR ALL USING (true) WITH CHECK (true);

-- ===== TEMPLATES PADRÃO =====
INSERT INTO templates_promo (nome, titulo_template, descricao_template, tipo, icone) VALUES
  ('Desconto Percentual', '{desconto}% OFF em tudo!', 'Aproveite {desconto}% de desconto em todos os produtos/serviços.', 'percentage', '📊'),
  ('Desconto em Reais', 'R${valor} OFF na sua compra!', 'Ganhe R${valor} de desconto em compras acima de R${minimo}.', 'fixed_value', '💰'),
  ('Compre e Ganhe', 'Compre {x} e Leve {y}!', 'Na compra de {x} unidades, você leva {y}. Oferta por tempo limitado!', 'buy_x_get_y', '🎁'),
  ('Brinde', 'Ganhe um brinde especial!', 'Na compra acima de R${valor}, ganhe um brinde exclusivo.', 'gift', '🎀'),
  ('Preço Especial', 'Preço especial: R${preco}!', 'De R${de} por apenas R${por}. Corra que é por tempo limitado!', 'special_price', '⭐'),
  ('Inauguração', 'Promoção de Inauguração!', 'Celebre nossa inauguração com ofertas imperdíveis.', 'percentage', '🎉'),
  ('Dia das Mães', 'Especial Dia das Mães!', 'Presenteie com amor. Ofertas especiais para o Dia das Mães.', 'percentage', '💐'),
  ('Black Friday', 'BLACK FRIDAY — Até {desconto}% OFF!', 'As maiores ofertas do ano. Só na Black Friday do Lupa!', 'percentage', '🖤');

-- ===== PROMOÇÕES DE EXEMPLO =====
INSERT INTO promocoes (estabelecimento_id, titulo, descricao, tipo, ativo, tipo_promo, valor_desconto, destaque_home, data_fim)
SELECT id, '20% OFF em cortes masculinos', 'Válido de segunda a quarta. Apresente o cupom na loja.', 'oferta', true, 'percentage', 20, true, (CURRENT_DATE + interval '30 days')::date
FROM estabelecimentos WHERE slug = 'barbaresco';

INSERT INTO promocoes (estabelecimento_id, titulo, descricao, tipo, ativo, tipo_promo, valor_desconto, destaque_home, data_fim)
SELECT id, 'Açaí 500ml por R$15,90', 'Açaí natural com até 3 acompanhamentos.', 'oferta', true, 'special_price', 15.90, true, (CURRENT_DATE + interval '15 days')::date
FROM estabelecimentos WHERE slug = 'suki-sucos';

INSERT INTO promocoes (estabelecimento_id, titulo, descricao, tipo, ativo, tipo_promo, valor_desconto, destaque_home, data_fim, preco_de, preco_por)
SELECT id, 'Combo Donuts + Café', 'Leve 2 donuts + 1 café por um preço especial.', 'oferta', true, 'special_price', 19.90, true, (CURRENT_DATE + interval '20 days')::date, 28.00, 19.90
FROM estabelecimentos WHERE slug = 'donuts-tauste';

INSERT INTO promocoes (estabelecimento_id, titulo, descricao, tipo, ativo, tipo_promo, valor_desconto, destaque_home, data_fim)
SELECT id, '15% OFF em óculos de sol', 'Toda a linha de óculos de sol com 15% de desconto.', 'oferta', true, 'percentage', 15, true, (CURRENT_DATE + interval '25 days')::date
FROM estabelecimentos WHERE slug = 'opt';

INSERT INTO promocoes (estabelecimento_id, titulo, descricao, tipo, ativo, tipo_promo, valor_desconto, destaque_home, data_fim)
SELECT id, 'Caixa de bombons por R$29,90', 'Caixa especial com 12 bombons sortidos.', 'oferta', true, 'special_price', 29.90, true, (CURRENT_DATE + interval '10 days')::date
FROM estabelecimentos WHERE slug = 'cacau-show';

INSERT INTO promocoes (estabelecimento_id, titulo, descricao, tipo, ativo, tipo_promo, valor_desconto, destaque_home, data_fim)
SELECT id, 'Depilação a laser com 30% OFF', 'Primeira sessão com desconto especial. Agende já!', 'oferta', true, 'percentage', 30, true, (CURRENT_DATE + interval '30 days')::date
FROM estabelecimentos WHERE slug = 'mais-laser';
