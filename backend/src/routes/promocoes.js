import { Router } from 'express'
import supabase from '../lib/supabase.js'

const router = Router()

// Listar promoções (com filtros)
router.get('/', async (req, res) => {
  const { tipo, ativo, floor, featured, store_id } = req.query

  let query = supabase
    .from('promocoes')
    .select('*, estabelecimentos(nome, slug, bairro, foto_url, logo_url, andar, tags)')
    .order('criado_em', { ascending: false })

  if (tipo) query = query.eq('tipo', tipo)
  if (store_id) query = query.eq('estabelecimento_id', store_id)
  if (featured === 'true') query = query.eq('destaque_home', true)
  if (ativo !== undefined) query = query.eq('ativo', ativo === 'true')
  else query = query.eq('ativo', true)

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })

  // Filter by floor if needed
  let result = data || []
  if (floor !== undefined) {
    result = result.filter(p => p.estabelecimentos?.andar === Number(floor))
  }

  // Add days remaining
  result = result.map(p => ({
    ...p,
    dias_restantes: p.data_fim ? Math.max(0, Math.ceil((new Date(p.data_fim) - new Date()) / 86400000)) : null,
    esgotado: p.max_resgates ? p.resgates_atuais >= p.max_resgates : false,
  }))

  res.json(result)
})

// Promoção por ID
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('promocoes')
    .select('*, estabelecimentos(nome, slug, bairro, foto_url, logo_url, whatsapp, andar, tags)')
    .eq('id', req.params.id)
    .single()

  if (error) return res.status(404).json({ error: 'Promoção não encontrada' })
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

// Pausar/Ativar/Encerrar
router.patch('/:id/status', async (req, res) => {
  const { ativo } = req.body
  const { data, error } = await supabase
    .from('promocoes')
    .update({ ativo })
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

// ===== CUPONS =====

// Gerar cupom
router.post('/cupons', async (req, res) => {
  const { promocao_id, nome, telefone } = req.body
  if (!promocao_id) return res.status(400).json({ error: 'promocao_id obrigatório' })

  // Verificar promoção
  const { data: promo } = await supabase.from('promocoes').select('*').eq('id', promocao_id).single()
  if (!promo || !promo.ativo) return res.status(400).json({ error: 'Promoção não disponível' })
  if (promo.max_resgates && promo.resgates_atuais >= promo.max_resgates) return res.status(400).json({ error: 'Cupons esgotados' })

  // Gerar código único
  const codigo = 'LUPA' + Math.random().toString(36).substring(2, 6).toUpperCase()

  const { data, error } = await supabase
    .from('cupons')
    .insert({
      promocao_id,
      codigo,
      nome_consumidor: nome || null,
      telefone_consumidor: telefone || null,
      expira_em: promo.data_fim ? new Date(promo.data_fim + 'T23:59:59').toISOString() : null,
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  // Incrementar resgates
  await supabase.from('promocoes').update({ resgates_atuais: (promo.resgates_atuais || 0) + 1 }).eq('id', promocao_id)

  res.status(201).json(data)
})

// Buscar cupom por código
router.get('/cupons/:code', async (req, res) => {
  const { data, error } = await supabase
    .from('cupons')
    .select('*, promocoes(*, estabelecimentos(nome, slug, logo_url, andar))')
    .eq('codigo', req.params.code.toUpperCase())
    .single()

  if (error) return res.status(404).json({ error: 'Cupom não encontrado' })
  res.json(data)
})

// Resgatar cupom
router.patch('/cupons/:code/redeem', async (req, res) => {
  const { data: cupom } = await supabase
    .from('cupons')
    .select('*')
    .eq('codigo', req.params.code.toUpperCase())
    .single()

  if (!cupom) return res.status(404).json({ error: 'Cupom não encontrado' })
  if (cupom.status === 'redeemed') return res.status(400).json({ error: 'Cupom já utilizado' })
  if (cupom.status === 'expired') return res.status(400).json({ error: 'Cupom expirado' })

  const { data, error } = await supabase
    .from('cupons')
    .update({ status: 'redeemed', resgatado_em: new Date().toISOString() })
    .eq('id', cupom.id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// Templates
router.get('/templates/list', async (req, res) => {
  const { data, error } = await supabase.from('templates_promo').select('*')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

export default router
