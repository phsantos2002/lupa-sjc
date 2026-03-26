import { Router } from 'express'
import supabase from '../lib/supabase.js'

const router = Router()

// Listar todos (com categoria)
router.get('/', async (req, res) => {
  const { categoria, destaque, ativo } = req.query

  let query = supabase
    .from('estabelecimentos')
    .select('*, categorias(nome, slug, icone, cor)')
    .order('destaque', { ascending: false })
    .order('nome')

  if (categoria) query = query.eq('categoria_id', categoria)
  if (destaque === 'true') query = query.eq('destaque', true)
  if (ativo !== undefined) query = query.eq('ativo', ativo === 'true')
  else query = query.eq('ativo', true)

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// Buscar por ID ou slug
router.get('/:idOrSlug', async (req, res) => {
  const param = req.params.idOrSlug
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(param)

  let query = supabase
    .from('estabelecimentos')
    .select('*, categorias(nome, slug, icone, cor)')

  if (isUuid) query = query.eq('id', param)
  else query = query.eq('slug', param)

  const { data, error } = await query.single()
  if (error) return res.status(404).json({ error: 'Estabelecimento não encontrado' })

  // Buscar promoções ativas desse estabelecimento
  const { data: promocoes } = await supabase
    .from('promocoes')
    .select('*')
    .eq('estabelecimento_id', data.id)
    .eq('ativo', true)
    .order('criado_em', { ascending: false })

  res.json({ ...data, promocoes: promocoes || [] })
})

// Criar
router.post('/', async (req, res) => {
  const { nome, bairro, categoria_id } = req.body
  if (!nome || !bairro || !categoria_id) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome, bairro, categoria_id' })
  }

  // Gerar slug
  const slug = nome
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const { data, error } = await supabase
    .from('estabelecimentos')
    .insert({ ...req.body, slug })
    .select('*, categorias(nome, slug, icone, cor)')
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// Atualizar
router.put('/:id', async (req, res) => {
  const updates = { ...req.body, atualizado_em: new Date().toISOString() }

  const { data, error } = await supabase
    .from('estabelecimentos')
    .update(updates)
    .eq('id', req.params.id)
    .select('*, categorias(nome, slug, icone, cor)')
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// Deletar
router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('estabelecimentos')
    .delete()
    .eq('id', req.params.id)

  if (error) return res.status(500).json({ error: error.message })
  res.status(204).send()
})

export default router
