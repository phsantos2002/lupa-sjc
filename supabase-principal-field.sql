-- Adicionar campo "principal" nas promoções
ALTER TABLE promocoes ADD COLUMN IF NOT EXISTS principal boolean DEFAULT false;
