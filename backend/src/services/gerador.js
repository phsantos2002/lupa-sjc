import supabase from '../lib/supabase.js'

const CATEGORIAS = {
  chopp: { emoji: '🍺', label: 'Chopp & Cerveja', cor: '#F5A623', bg: '#5C3800', bgDark: '#2B1A00', badgeEnd: '#E8860A' },
  lanche: { emoji: '🍔', label: 'Lanches', cor: '#FF6B4A', bg: '#6B1A0A', bgDark: '#2E0800', badgeEnd: '#E8401C' },
  pizza: { emoji: '🍕', label: 'Pizza', cor: '#FF8C4A', bg: '#6B3010', bgDark: '#301400', badgeEnd: '#E86A1C' },
  porcao: { emoji: '🍗', label: 'Porções', cor: '#6FD96F', bg: '#0D4020', bgDark: '#04180A', badgeEnd: '#3DAD3D' },
}

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarData(date) {
  const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
  const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
  return `${dias[date.getDay()]}, ${date.getDate()} de ${meses[date.getMonth()]} de ${date.getFullYear()}`
}

function gerarCardHTML(promo, estab) {
  const cat = CATEGORIAS[estab.categoria] || CATEGORIAS.chopp
  const whatsappMsg = encodeURIComponent(`Olá! Vi a promoção de ${cat.label} no Jornal Lupa 🎉`)
  const whatsappLink = `https://wa.me/55${estab.whatsapp.replace(/\D/g, '')}?text=${whatsappMsg}`
  const seloFundador = estab.fundador ? '<div style="position:absolute;top:8px;right:8px;background:linear-gradient(135deg,#C9A84C,#A6832A);color:#fff;font-size:10px;padding:2px 8px;border-radius:10px;font-family:\'Barlow Condensed\',sans-serif;font-weight:600;">🏅 Parceiro Fundador</div>' : ''

  return `
    <div style="background:#fff;border-radius:12px;overflow:hidden;border-left:3px solid #C9A84C;box-shadow:0 2px 8px rgba(0,0,0,0.08);display:flex;flex-direction:column;">
      <div style="position:relative;background:linear-gradient(135deg,${cat.bg},${cat.bgDark});padding:20px;text-align:center;min-height:100px;display:flex;flex-direction:column;align-items:center;justify-content:center;">
        ${seloFundador}
        <div style="font-size:40px;margin-bottom:4px;">${promo.emoji || cat.emoji}</div>
        <div style="display:inline-block;background:linear-gradient(135deg,${cat.cor},${cat.badgeEnd});color:#fff;font-size:10px;padding:2px 10px;border-radius:10px;font-family:'Barlow Condensed',sans-serif;text-transform:uppercase;font-weight:600;letter-spacing:0.5px;">${cat.label}</div>
        <div style="position:absolute;bottom:8px;right:10px;background:rgba(0,0,0,0.5);color:#fff;padding:2px 8px;border-radius:6px;font-size:11px;font-family:'Barlow Condensed',sans-serif;">${estab.bairro}</div>
        <div style="position:absolute;bottom:8px;left:10px;color:#fff;font-weight:700;font-size:18px;font-family:'Barlow Condensed',sans-serif;">
          ${promo.preco_de ? `<span style="text-decoration:line-through;opacity:0.6;font-size:13px;margin-right:4px;">${formatarPreco(promo.preco_de)}</span>` : ''}
          ${formatarPreco(promo.preco_por)}
        </div>
      </div>
      <div style="padding:12px 14px;flex:1;display:flex;flex-direction:column;">
        <div style="font-weight:700;font-size:14px;color:#1A1A1A;margin-bottom:4px;font-family:'Barlow Condensed',sans-serif;">${estab.nome}</div>
        <div style="font-size:13px;color:#444;margin-bottom:4px;">${promo.descricao}</div>
        ${promo.validade ? `<div style="font-size:11px;color:#888;margin-bottom:8px;">📅 ${promo.validade}</div>` : ''}
        <div style="margin-top:auto;">
          <a href="${whatsappLink}" target="_blank" style="display:block;text-align:center;background:#25D366;color:#fff;text-decoration:none;padding:8px;border-radius:8px;font-size:13px;font-weight:600;font-family:'Barlow Condensed',sans-serif;">💬 Chamar no WhatsApp</a>
        </div>
      </div>
    </div>`
}

function gerarSecaoCategoria(categoria, promocoes) {
  const cat = CATEGORIAS[categoria]
  if (!cat || promocoes.length === 0) return ''

  const cards = promocoes.map(p => gerarCardHTML(p.promocao, p.estabelecimento)).join('')

  return `
    <div id="${categoria}" style="margin-bottom:32px;">
      <div style="position:sticky;top:120px;z-index:8;background:#FAFAFA;padding:10px 0 6px;">
        <div style="display:flex;align-items:center;gap:8px;border-bottom:2px solid #C9A84C;padding-bottom:6px;">
          <span style="font-size:22px;">${cat.emoji}</span>
          <span style="font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;color:#1A1A1A;text-transform:uppercase;letter-spacing:1px;">${cat.label}</span>
          <span style="background:linear-gradient(135deg,#C9A84C,#A6832A);color:#fff;font-size:11px;padding:1px 8px;border-radius:10px;font-family:'Barlow Condensed',sans-serif;font-weight:600;">${promocoes.length}</span>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:10px;">
        ${cards}
      </div>
    </div>`
}

function gerarHTMLCompleto(promocoesPorCategoria, totalPromos, dataFormatada) {
  const categoriasComPromos = Object.keys(promocoesPorCategoria).filter(c => promocoesPorCategoria[c].length > 0)

  const abas = categoriasComPromos.map(c => {
    const cat = CATEGORIAS[c]
    return `<a href="#${c}" style="text-decoration:none;color:#1A1A1A;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:600;padding:6px 14px;border-radius:20px;background:#f0f0f0;white-space:nowrap;transition:all 0.2s;">${cat.emoji} ${cat.label}</a>`
  }).join('')

  const secoes = categoriasComPromos.map(c => gerarSecaoCategoria(c, promocoesPorCategoria[c])).join('')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Jornal Lupa SJC — Promoções de Hoje</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #FAFAFA; color: #1A1A1A; font-family: Georgia, 'Times New Roman', serif; }
  a { color: inherit; }
  @media (max-width: 500px) {
    .grid-cards { grid-template-columns: 1fr !important; }
  }
</style>
</head>
<body>

<!-- Banner superior -->
<div style="background:#1A1A1A;color:#C9A84C;text-align:center;padding:8px 16px;font-family:'Barlow Condensed',Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.5px;">
  🔍 Jornal Lupa SJC — Promoções de Bares e Restaurantes · Todo dia às 8h
</div>

<!-- Header sticky -->
<div style="position:sticky;top:0;z-index:10;background:#FAFAFA;border-bottom:2px solid #C9A84C;padding:12px 16px;">
  <div style="text-align:center;">
    <div style="font-family:'Barlow Condensed',Arial,sans-serif;font-size:11px;color:#A6832A;text-transform:uppercase;letter-spacing:2px;font-weight:600;">São José dos Campos</div>
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:400;color:#1A1A1A;margin:2px 0;">Jornal <em>Lupa</em></div>
    <div style="font-size:12px;color:#888;">📅 ${dataFormatada}</div>
    <div style="display:inline-block;background:linear-gradient(135deg,#C9A84C,#A6832A);color:#fff;font-size:12px;padding:3px 14px;border-radius:12px;margin-top:6px;font-family:'Barlow Condensed',Arial,sans-serif;font-weight:700;letter-spacing:0.5px;">🔥 ${totalPromos} OFERTAS HOJE!</div>
  </div>
  <!-- Abas de navegação -->
  <div style="display:flex;gap:8px;margin-top:10px;overflow-x:auto;padding-bottom:4px;justify-content:center;flex-wrap:wrap;">
    ${abas}
  </div>
</div>

<!-- Conteúdo -->
<div style="max-width:700px;margin:0 auto;padding:16px;">
  ${secoes}
</div>

<!-- Rodapé -->
<div style="background:#1A1A1A;color:#C9A84C;text-align:center;padding:20px 16px;margin-top:20px;">
  <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;margin-bottom:4px;">Jornal <em>Lupa</em></div>
  <div style="font-family:'Barlow Condensed',Arial,sans-serif;font-size:12px;color:#888;">@lupa.sjc · São José dos Campos</div>
  <div style="font-size:10px;color:#666;margin-top:8px;">Promoções sujeitas à disponibilidade. Confirme com o estabelecimento.</div>
</div>

</body>
</html>`
}

export async function gerarEdicaoDoDia() {
  const hoje = new Date()
  const dataISO = hoje.toISOString().split('T')[0] // YYYY-MM-DD
  const dataFormatada = formatarData(hoje)

  // Buscar promoções ativas com dados do estabelecimento
  const { data: promocoes, error } = await supabase
    .from('promocoes')
    .select('*, estabelecimentos(id, nome, whatsapp, bairro, categoria, fundador, ativo)')
    .eq('ativo', true)

  if (error) throw new Error(`Erro ao buscar promoções: ${error.message}`)

  // Filtrar apenas estabelecimentos ativos
  const promocoesAtivas = (promocoes || []).filter(p => p.estabelecimentos?.ativo)

  // Agrupar por categoria, fundadores primeiro
  const porCategoria = {}
  for (const cat of Object.keys(CATEGORIAS)) {
    const promosCategoria = promocoesAtivas
      .filter(p => p.estabelecimentos.categoria === cat)
      .map(p => ({ promocao: p, estabelecimento: p.estabelecimentos }))
      .sort((a, b) => {
        if (a.estabelecimento.fundador && !b.estabelecimento.fundador) return -1
        if (!a.estabelecimento.fundador && b.estabelecimento.fundador) return 1
        return 0
      })
    porCategoria[cat] = promosCategoria
  }

  const totalPromos = promocoesAtivas.length
  const html = gerarHTMLCompleto(porCategoria, totalPromos, dataFormatada)

  // Upsert na tabela edicoes
  const { error: upsertError } = await supabase
    .from('edicoes')
    .upsert({
      data: dataISO,
      total_promocoes: totalPromos,
      html_gerado: html,
    }, { onConflict: 'data' })

  if (upsertError) throw new Error(`Erro ao salvar edição: ${upsertError.message}`)

  // Upload para Supabase Storage (Buffer UTF-8 para preservar acentos)
  const fileName = `jornal-${dataISO}.html`
  const htmlBuffer = Buffer.from(html, 'utf-8')
  const { error: uploadError } = await supabase.storage
    .from('edicoes')
    .upload(fileName, htmlBuffer, {
      contentType: 'text/html; charset=utf-8',
      upsert: true,
    })

  if (uploadError) {
    console.warn('Aviso: erro no upload para Storage (continuando):', uploadError.message)
  }

  const { data: urlData } = supabase.storage.from('edicoes').getPublicUrl(fileName)

  console.log(`✅ Edição gerada: ${dataISO} | ${totalPromos} promoções`)

  return {
    data: dataISO,
    total_promocoes: totalPromos,
    url_publica: urlData?.publicUrl || null,
  }
}
