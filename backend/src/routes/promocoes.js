import { Router } from 'express'
import supabase from '../lib/supabase.js'

const router = Router()

// Listar todas (com estabelecimento)
router.get('/', async (req, res) => {
  const { tipo, ativo } = req.query

  let query = supabase
    .from('promocoes')
    .select('*, estabelecimentos(nome, slug, bairro, foto_url, logo_url)')
    .order('criado_em', { ascending: false })

  if (tipo) query = query.eq('tipo', tipo)
  if (ativo !== undefined) query = query.eq('ativo', ativo === 'true')
  else query = query.eq('ativo', true)

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// Promoções por estabelecimento
router.get('/estabelecimento/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('promocoes')
    .select('*')
    .eq('estabelecimento_id', req.params.id)
    .eq('ativo', true)
    .order('criado_em', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// Criar
router.post('/', async (req, res) => {
  const { estabelecimento_id, titulo } = req.body
  if (!estabelecimento_id || !titulo) {
    return res.status(400).json({ error: 'Campos obrigatórios: estabelecimento_id, titulo' })
  }

  const { data, error } = await supabase
    .from('promocoes')
    .insert(req.body)
    .select('*, estabelecimentos(nome)')
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// Atualizar
router.put('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('promocoes')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// Deletar
router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('promocoes')
    .delete()
    .eq('id', req.params.id)

  if (error) return res.status(500).json({ error: error.message })
  res.status(204).send()
})

export default router
