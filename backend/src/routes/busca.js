import { Router } from 'express'
import supabase from '../lib/supabase.js'

const router = Router()

// Buscar estabelecimentos por texto
router.get('/', async (req, res) => {
  const { q, categoria } = req.query

  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: 'Busca precisa ter pelo menos 2 caracteres' })
  }

  let query = supabase
    .from('estabelecimentos')
    .select('*, categorias(nome, slug, icone, cor)')
    .eq('ativo', true)
    .or(`nome.ilike.%${q}%,descricao.ilike.%${q}%,bairro.ilike.%${q}%,tags.cs.{${q.toLowerCase()}}`)
    .order('destaque', { ascending: false })
    .order('nome')
    .limit(20)

  if (categoria) query = query.eq('categoria_id', categoria)

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

export default router
