import { Router } from 'express'
import supabase from '../lib/supabase.js'

const router = Router()

// Listar todos (com categoria)
router.get('/', async (req, res) => {
  const { categoria, destaque, ativo, whatsapp } = req.query

  let query = supabase
    .from('estabelecimentos')
    .select('*, categorias(nome, slug, icone, cor)')
    .order('destaque', { ascending: false })
    .order('nome')

  if (whatsapp) query = query.eq('whatsapp', whatsapp)
  if (categoria) query = query.eq('categoria_id', categoria)
  if (destaque === 'true') query = query.eq('destaque', true)
  if (ativo !== undefined) query = query.eq('ativo', ativo === 'true')
  else query = query.eq('ativo', true)

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// Login da loja (MUST be before /:idOrSlug)
router.post('/login', async (req, res) => {
  const { slug, senha } = req.body
  if (!slug || !senha) return res.status(400).json({ error: 'slug e senha obrigatórios' })

  const { data, error } = await supabase
    .from('estabelecimentos')
    .select('id, slug, nome, logo_url, senha')
    .eq('slug', slug)
    .single()

  if (error || !data) return res.status(401).json({ error: 'Loja não encontrada' })
  if (data.senha !== senha) return res.status(401).json({ error: 'Senha incorreta' })

  res.json({ id: data.id, slug: data.slug, nome: data.nome, logo_url: data.logo_url })
})

// Upload de arquivo para Supabase Storage
router.post('/upload', async (req, res) => {
  const { fileName, fileBase64, bucket } = req.body
  if (!fileName || !fileBase64) return res.status(400).json({ error: 'fileName e fileBase64 obrigatórios' })

  const bucketName = bucket || 'logos'
  const buffer = Buffer.from(fileBase64, 'base64')
  const filePath = `uploads/${Date.now()}-${fileName}`

  const { error } = await supabase.storage.from(bucketName).upload(filePath, buffer, {
    contentType: fileName.endsWith('.mp4') ? 'video/mp4' : fileName.endsWith('.png') ? 'image/png' : fileName.endsWith('.webp') ? 'image/webp' : 'image/jpeg',
    upsert: true,
  })

  if (error) return res.status(500).json({ error: error.message })

  const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath)
  res.json({ url: urlData.publicUrl })
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

  // Buscar todos os dados relacionados em paralelo
  const [promocoes, horarios, fotos, produtos, servicos, cardapio] = await Promise.all([
    supabase.from('promocoes').select('*').eq('estabelecimento_id', data.id).eq('ativo', true).order('criado_em', { ascending: false }),
    supabase.from('horarios').select('*').eq('estabelecimento_id', data.id).order('dia_semana'),
    supabase.from('fotos').select('*').eq('estabelecimento_id', data.id).order('ordem'),
    supabase.from('produtos').select('*').eq('estabelecimento_id', data.id).eq('ativo', true).order('ordem'),
    supabase.from('servicos').select('*').eq('estabelecimento_id', data.id).eq('ativo', true).order('ordem'),
    supabase.from('cardapio').select('*').eq('estabelecimento_id', data.id).eq('ativo', true).order('secao').order('ordem'),
  ])

  res.json({
    ...data,
    promocoes: promocoes.data || [],
    horarios: horarios.data || [],
    fotos: fotos.data || [],
    produtos: produtos.data || [],
    servicos: servicos.data || [],
    cardapio: cardapio.data || [],
  })
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
