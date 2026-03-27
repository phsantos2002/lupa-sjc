import { Router } from 'express'
import supabase from '../lib/supabase.js'

const router = Router()

// Endpoint que retorna todos os dados da home page de uma vez
router.get('/', async (req, res) => {
  const hoje = new Date().toISOString().split('T')[0]

  const [categorias, destaqueLojas, promocoes, destaqueSemana, patrocinadores, populares, todasLojas] = await Promise.all([
    // Categorias
    supabase.from('categorias').select('*').eq('ativo', true).order('ordem'),

    // Lojas em destaque (premium)
    supabase.from('estabelecimentos')
      .select('*, categorias(nome, slug, icone, cor)')
      .eq('ativo', true)
      .eq('destaque', true)
      .order('ordem')
      .limit(8),

    // Promoções especiais
    supabase.from('promocoes')
      .select('*, estabelecimentos(nome, slug, bairro)')
      .eq('ativo', true)
      .in('tipo', ['super_oferta', 'destaque_semana'])
      .order('criado_em', { ascending: false })
      .limit(4),

    // Destaque da semana
    supabase.from('destaques_semana')
      .select('*, estabelecimentos(*, categorias(nome, slug, icone))')
      .eq('ativo', true)
      .lte('semana_inicio', hoje)
      .gte('semana_fim', hoje)
      .order('numero', { ascending: false })
      .limit(1)
      .maybeSingle(),

    // Patrocinadores
    supabase.from('patrocinadores')
      .select('*')
      .eq('ativo', true)
      .order('ordem')
      .limit(8),

    // Populares (mais recentes com foto)
    supabase.from('estabelecimentos')
      .select('*, categorias(nome, slug, icone, cor)')
      .eq('ativo', true)
      .order('criado_em', { ascending: false })
      .limit(8),

    // TODAS as lojas (para exibir por piso)
    supabase.from('estabelecimentos')
      .select('*, categorias(nome, slug, icone, cor)')
      .eq('ativo', true)
      .order('nome'),
  ])

  res.json({
    categorias: categorias.data || [],
    destaqueLojas: destaqueLojas.data || [],
    promocoes: promocoes.data || [],
    destaqueSemana: destaqueSemana.data || null,
    patrocinadores: patrocinadores.data || [],
    populares: populares.data || [],
    todasLojas: todasLojas.data || [],
  })
})

export default router
