-- ===========================================
-- Sprint 5: Analytics Events
-- ===========================================

CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  estabelecimento_id uuid REFERENCES estabelecimentos(id) ON DELETE CASCADE,
  evento varchar NOT NULL,
  promocao_id uuid REFERENCES promocoes(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}',
  criado_em timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_estab ON analytics(estabelecimento_id);
CREATE INDEX IF NOT EXISTS idx_analytics_evento ON analytics(evento);
CREATE INDEX IF NOT EXISTS idx_analytics_data ON analytics(criado_em);

ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert" ON analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Service full access" ON analytics FOR ALL USING (true) WITH CHECK (true);
