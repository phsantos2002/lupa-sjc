import { Router } from 'express'
import supabase from '../lib/supabase.js'
import { gerarEdicaoDoDia } from '../services/gerador.js'

const router = Router()

// Listar edições
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('edicoes')
    .select('id, data, total_promocoes, criado_em')
    .order('data', { ascending: false })
    .limit(30)

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// Buscar edição por data
router.get('/:data', async (req, res) => {
  const { data, error } = await supabase
    .from('edicoes')
    .select('*')
    .eq('data', req.params.data)
    .single()

  if (error) return res.status(404).json({ error: 'Edição não encontrada para esta data' })
  res.json(data)
})

// Download do HTML da edição por data (acesso público, sem CORS)
router.get('/:data/html', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
}, async (req, res) => {
  const { data, error } = await supabase
    .from('edicoes')
    .select('html_gerado, data')
    .eq('data', req.params.data)
    .single()

  if (error || !data?.html_gerado) {
    return res.status(404).json({ error: 'Edição não encontrada' })
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Content-Disposition', `inline; filename="lupa-sjc-${data.data}.html"`)
  res.send(data.html_gerado)
})

// Gerar edição manualmente
router.post('/gerar', async (req, res) => {
  try {
    const resultado = await gerarEdicaoDoDia()
    res.json(resultado)
  } catch (err) {
    console.error('Erro ao gerar edição:', err)
    res.status(500).json({ error: err.message })
  }
})

export default router
