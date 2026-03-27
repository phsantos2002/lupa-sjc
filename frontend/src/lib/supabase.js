import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || 'https://krruptyxkrvdxneezqnu.supabase.co'
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ze-O1sOaOWm-3h3gjjjNHQ_H6CkyJAx'

export const supabase = createClient(url, key)
