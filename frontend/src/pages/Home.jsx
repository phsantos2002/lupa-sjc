import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getHome, getPromocoes } from '../lib/api'
import OfferCard from '../components/OfferCard'

export default function Home() {
  const [data, setData] = useState(null)
  const [ofertas, setOfertas] = useState([])
  const [loading, setLoading] = useState(true)
  const sponsorsRef = useRef(null)

  useEffect(() => {
    getHome().then(setData).catch(console.error).finally(() => setLoading(false))
    getPromocoes({ featured: true }).then(setOfertas).catch(() => {})
  }, [])

  // Auto-scroll sponsors
  useEffect(() => {
    if (!sponsorsRef.current) return
    const el = sponsorsRef.current
    let pos = 0
    const iv = setInterval(() => {
      pos += 1
      if (pos >= el.scrollWidth - el.clientWidth) pos = 0
      el.scrollTo({ left: pos })
    }, 30)
    return () => clearInterval(iv)
  }, [data])

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 rounded-full border-[3px] border-tauste-orange/30 border-t-tauste-orange animate-spin" /></div>
  if (!data) return <p className="text-center py-10 text-gray-400">Erro ao carregar</p>

  const allStores = data.todasLojas || []
  const sponsors = allStores.filter(s => s.destaque || s.plano === 'premium' || s.plano === 'destaque')

  return (
    <div>
      {/* Hero with Tauste photo */}
      <div className="relative overflow-hidden bg-tauste-blue" style={{ minHeight: '180px' }}>
        <img src="https://krruptyxkrvdxneezqnu.supabase.co/storage/v1/object/public/logos/tauste-hero.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" onError={e => { e.target.style.display = 'none' }} />
        <div className="relative max-w-5xl mx-auto px-4 py-7 pb-8">
          <h1 className="text-white text-xl sm:text-3xl font-bold leading-tight">
            Descubra as lojas do<br />
            <span className="text-tauste-orange">Tauste São José</span>
          </h1>
          <p className="text-white/50 text-xs mt-1.5">{allStores.length} lojas em 3 andares</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 space-y-6 pb-8">

        {/* Nossos Patrocinadores — auto-scroll loop */}
        {sponsors.length > 0 && (
          <section className="mt-4">
            <h2 className="text-lg font-bold text-lupa-black mb-3">Nossos Patrocinadores</h2>
            <div ref={sponsorsRef} className="flex gap-3 overflow-x-auto no-scrollbar">
              {[...sponsors, ...sponsors].map((est, idx) => (
                <Link key={`${est.id}-${idx}`} to={`/estabelecimento/${est.slug}`} className="min-w-[160px] max-w-[180px] bg-white rounded-xl border border-gray-100 overflow-hidden card-hover shrink-0 shadow-sm">
                  <div className="h-20 bg-gradient-to-br from-tauste-blue to-tauste-blue-light flex items-center justify-center">
                    {est.logo_url ? <img src={est.logo_url} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white/20" /> : <span className="text-white/40 text-xl font-bold">{est.nome?.charAt(0)}</span>}
                  </div>
                  <div className="p-2.5 text-center">
                    <h4 className="text-xs font-bold text-lupa-black truncate">{est.nome}</h4>
                    <p className="text-[9px] text-tauste-orange">{est.subcategoria || ''}</p>
                    <span className="inline-block mt-1.5 px-2.5 py-1 bg-tauste-blue text-white text-[9px] font-bold rounded-md">Ver perfil</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Ofertas da Semana */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-lupa-black">Ofertas da Semana</h2>
            <Link to="/ofertas" className="text-xs text-tauste-orange font-bold">Ver todas →</Link>
          </div>

          {(() => {
            // 1 offer per store — prefer principal
            const seen = new Set()
            const unique = ofertas.filter(o => {
              const sid = o.estabelecimento_id
              if (seen.has(sid)) return false
              seen.add(sid)
              return true
            }).sort((a, b) => (b.principal ? 1 : 0) - (a.principal ? 1 : 0))
            if (unique.length === 0) return <p className="text-center text-gray-400 py-6 text-sm">Nenhuma oferta disponível no momento</p>
            return (
            <div className="grid grid-cols-2 gap-3">
              {unique.map(o => <OfferCard key={o.id} offer={o} />)}
            </div>
            )
          })()}
        </section>

        {/* CTA */}
        <section className="bg-tauste-blue rounded-2xl p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(245,132,31,0.5) 0%, transparent 70%)' }} />
          <div className="relative">
            <h2 className="text-lg font-bold text-white">Quer aparecer por aqui?</h2>
            <p className="text-white/50 text-xs mt-1.5">Entre em contato conosco agora mesmo</p>
            <Link to="/parceiro" className="inline-block mt-4 px-5 py-2 bg-tauste-orange text-white font-bold rounded-full hover:bg-tauste-orange-light transition text-sm">Seja Parceiro</Link>
          </div>
        </section>
      </div>
    </div>
  )
}
