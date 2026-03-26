import cron from 'node-cron'
import { gerarEdicaoDoDia } from './gerador.js'

export function iniciarCron() {
  // Gerar edição todos os dias às 08:00 (horário de São Paulo)
  cron.schedule('0 8 * * *', async () => {
    console.log('⏰ Cron disparado — gerando edição do dia...')
    try {
      const resultado = await gerarEdicaoDoDia()
      console.log(`✅ Edição gerada com sucesso: ${resultado.data} (${resultado.total_promocoes} promoções)`)
    } catch (err) {
      console.error('❌ Erro ao gerar edição via cron:', err.message)
    }
  }, {
    timezone: 'America/Sao_Paulo',
  })

  console.log('🕐 Cron agendado: geração diária às 08:00 (America/Sao_Paulo)')
}
