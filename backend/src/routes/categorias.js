import { Router } from 'express'
import supabase from '../lib/supabase.js'

const router = Router()

// Listar todas as categorias ativas
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('ativo', true)
    .order('ordem')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// Buscar categoria por slug com seus estabelecimentos
router.get('/:slug', async (req, res) => {
  const { data: categoria, error: catErr } = await supabase
    .from('categorias')
    .select('*')
    .eq('slug', req.params.slug)
    .single()

  if (catErr) return res.status(404).json({ error: 'Categoria não encontrada' })

  const { data: estabelecimentos, error: estErr } = await supabase
    .from('estabelecimentos')
    .select('*, categorias(nome, slug, icone)')
    .eq('categoria_id', categoria.id)
    .eq('ativo', true)
    .order('destaque', { ascending: false })
    .order('nome')

  if (estErr) return res.status(500).json({ error: estErr.message })

  res.json({ categoria, estabelecimentos })
})

// Criar categoria (admin)
router.post('/', async (req, res) => {
  const { nome, slug, icone, cor, ordem } = req.body
  if (!nome || !slug) return res.status(400).json({ error: 'nome e slug obrigatórios' })

  const { data, error } = await supabase
    .from('categorias')
    .insert({ nome, slug, icone, cor, ordem })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// Atualizar categoria
router.put('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('categorias')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

export default router
