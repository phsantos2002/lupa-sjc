import { Router } from 'express'
import supabase from '../lib/supabase.js'

const router = Router()

// Destaque da semana atual
router.get('/semana', async (req, res) => {
  const hoje = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('destaques_semana')
    .select('*, estabelecimentos(*, categorias(nome, slug, icone))')
    .eq('ativo', true)
    .lte('semana_inicio', hoje)
    .gte('semana_fim', hoje)
    .order('numero', { ascending: false })
    .limit(1)
    .single()

  if (error) return res.json(null)
  res.json(data)
})

// CRUD destaques
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('destaques_semana')
    .select('*, estabelecimentos(nome, slug)')
    .order('criado_em', { ascending: false })
    .limit(20)

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.post('/', async (req, res) => {
  const { data, error } = await supabase
    .from('destaques_semana')
    .insert(req.body)
    .select('*, estabelecimentos(nome)')
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

export default router
