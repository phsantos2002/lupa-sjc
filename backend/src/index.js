if (!process.env.VERCEL) {
  const dotenv = await import('dotenv')
  dotenv.config()
}
import express from 'express'
import cors from 'cors'
import estabelecimentosRouter from './routes/estabelecimentos.js'
import promocoesRouter from './routes/promocoes.js'
import edicoesRouter from './routes/edicoes.js'
import categoriasRouter from './routes/categorias.js'
import destaquesRouter from './routes/destaques.js'
import patrocinadoresRouter from './routes/patrocinadores.js'
import buscaRouter from './routes/busca.js'
import homeRouter from './routes/home.js'
let iniciarCron = () => {}

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors({
  origin: process.env.VERCEL ? true : (process.env.FRONTEND_URL || 'http://localhost:5173'),
  credentials: true,
}))
app.use(express.json())

// Rotas públicas (consumer)
app.use('/api/home', homeRouter)
app.use('/api/categorias', categoriasRouter)
app.use('/api/busca', buscaRouter)
app.use('/api/destaques', destaquesRouter)
app.use('/api/patrocinadores', patrocinadoresRouter)

// Rotas CRUD (admin)
app.use('/api/estabelecimentos', estabelecimentosRouter)
app.use('/api/promocoes', promocoesRouter)
app.use('/api/edicoes', edicoesRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Gerar edição manualmente
app.post('/api/gerar-edicao', async (req, res) => {
  const { gerarEdicaoDoDia } = await import('./services/gerador.js')
  try {
    const resultado = await gerarEdicaoDoDia()
    res.json(resultado)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Export para Vercel serverless
export default app

// Só roda o servidor se não for Vercel
if (!process.env.VERCEL) {
  import('./services/cron.js').then(m => { iniciarCron = m.iniciarCron })
  app.listen(PORT, () => {
    console.log(`🔍 Lupa SJC — Backend rodando na porta ${PORT}`)
    iniciarCron()
  })
}
