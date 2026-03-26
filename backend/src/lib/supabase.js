import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_KEY

let supabase = null

if (url && key) {
  supabase = createClient(url, key)
} else {
  console.warn('⚠️  SUPABASE_URL e SUPABASE_SERVICE_KEY não configurados. Preencha o .env para conectar ao banco.')
}

export default supabase
