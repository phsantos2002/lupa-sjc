-- Policies para upload público no bucket logos
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Allow public reads" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');

CREATE POLICY "Allow public updates" ON storage.objects
  FOR UPDATE USING (bucket_id = 'logos');

-- Campo principal nas promoções (se ainda não rodou)
ALTER TABLE promocoes ADD COLUMN IF NOT EXISTS principal boolean DEFAULT false;
