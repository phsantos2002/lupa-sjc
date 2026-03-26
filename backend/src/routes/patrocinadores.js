import { Router } from 'express'
import supabase from '../lib/supabase.js'

const router = Router()

// Listar ativos (para carousel)
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('patrocinadores')
    .select('*')
    .eq('ativo', true)
    .order('ordem')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// CRUD
router.post('/', async (req, res) => {
  const { data, error } = await supabase
    .from('patrocinadores')
    .insert(req.body)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

router.put('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('patrocinadores')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('patrocinadores')
    .delete()
    .eq('id', req.params.id)

  if (error) return res.status(500).json({ error: error.message })
  res.status(204).send()
})

export default router
