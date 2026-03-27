import { Router } from 'express'
import supabase from '../lib/supabase.js'

const router = Router()

// Track event
router.post('/track', async (req, res) => {
  const { estabelecimento_id, evento, promocao_id, metadata } = req.body
  if (!estabelecimento_id || !evento) return res.status(400).json({ error: 'estabelecimento_id e evento obrigatórios' })

  const { error } = await supabase.from('analytics').insert({ estabelecimento_id, evento, promocao_id, metadata })
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json({ ok: true })
})

// Dashboard metrics for a store (last 30 days)
router.get('/dashboard/:storeId', async (req, res) => {
  const { storeId } = req.params
  const since = new Date(Date.now() - 30 * 86400000).toISOString()

  const { data: events } = await supabase
    .from('analytics')
    .select('evento, criado_em')
    .eq('estabelecimento_id', storeId)
    .gte('criado_em', since)

  const all = events || []
  const metrics = {
    visualizacoes: all.filter(e => e.evento === 'profile_view').length,
    whatsapp_clicks: all.filter(e => e.evento === 'whatsapp_click').length,
    phone_clicks: all.filter(e => e.evento === 'phone_click').length,
    cupons_gerados: all.filter(e => e.evento === 'coupon_generated').length,
    cupons_resgatados: all.filter(e => e.evento === 'coupon_redeemed').length,
    favoritos: all.filter(e => e.evento === 'favorite_added').length,
    compartilhamentos: all.filter(e => e.evento === 'share_click').length,
    total_eventos: all.length,
  }

  // Daily chart data (last 7 days)
  const daily = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const dateStr = d.toISOString().split('T')[0]
    const dayEvents = all.filter(e => e.criado_em?.startsWith(dateStr))
    daily.push({ date: dateStr, views: dayEvents.filter(e => e.evento === 'profile_view').length, clicks: dayEvents.filter(e => ['whatsapp_click', 'phone_click'].includes(e.evento)).length })
  }

  res.json({ metrics, daily })
})

export default router
