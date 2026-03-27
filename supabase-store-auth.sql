-- Add password field for store login
ALTER TABLE estabelecimentos ADD COLUMN IF NOT EXISTS senha varchar;

-- Set default passwords (store slug as initial password)
UPDATE estabelecimentos SET senha = slug WHERE senha IS NULL;
