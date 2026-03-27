import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getHome, getPromocoes } from '../lib/api'
import EstabelecimentoCard from '../components/EstabelecimentoCard'

const floors = [
  { name: 'Térreo', tag: 'Térreo', icon: 'T', gradient: 'from-lupa-gold to-amber-600' },
  { name: '1º Andar', tag: '1º Andar', icon: '1', gradient: 'from-lupa-black to-gray-700' },
  { name: '2º Andar', tag: '2º Andar', icon: '2', gradient: 'from-amber-800 to-lupa-gold-dark' },
]

export default function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ofertas, setOfertas] = useState([])
  const [catFilter, setCatFilter] = useState('all')
  const [openOnly, setOpenOnly] = useState(false)
  const ofertasRef = useRef(null)

  useEffect(() => {
    getHome().then(setData).catch(console.error).finally(() => setLoading(false))
    getPromocoes({ featured: true }).then(setOfertas).catch(() => {})
  }, [])

  // Auto-scroll ofertas carousel
  useEffect(() => {
    if (!ofertasRef.current || ofertas.length === 0) return
    const el = ofertasRef.current
    let scrollPos = 0
    const interval = setInterval(() => {
      scrollPos += 1
      if (scrollPos >= el.scrollWidth - el.clientWidth) scrollPos = 0
      el.scrollTo({ left: scrollPos, behavior: 'smooth' })
    }, 30)
    return () => clearInterval(interval)
  }, [ofertas])

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-10 h-10 rounded-full border-[3px] border-lupa-gold/30 border-t-lupa-gold animate-spin" />
    </div>
  )

  if (!data) return <p className="text-center py-10 text-gray-400">Erro ao carregar</p>

  const allStores = data.todasLojas || []
  const subcats = [...new Set(allStores.map(s => s.subcategoria).filter(Boolean))].sort()
  const openCount = allStores.filter(s => s.aberto_agora).length

  const getStoresByFloor = (tag) => {
    let stores = allStores.filter(est => est.tags?.includes(tag))
    if (catFilter !== 'all') stores = stores.filter(s => s.subcategoria === catFilter)
    if (openOnly) stores = stores.filter(s => s.aberto_agora)
    return stores
  }

  return (
    <div>
      {/* Hero */}
      <div className="hero-gradient text-white px-4 py-8 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(201,168,76,0.4) 0%, transparent 50%)' }} />
        <div className="max-w-5xl mx-auto relative">
          <div className="flex items-center gap-1.5 text-lupa-gold/70 text-[11px] uppercase tracking-[0.2em] mb-3">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            Supermercado Tauste SJC
          </div>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight">
            Tudo do Tauste<br />
            <span className="gold-shimmer">na palma da sua mão</span>
          </h1>
          <p className="text-white/40 mt-2 text-sm">
            {allStores.length} lojas em 3 andares
          </p>

          {/* Floor map — horizontal */}
          <div className="mt-6 flex gap-2 justify-center">
            {floors.map(f => {
              const count = allStores.filter(s => s.tags?.includes(f.tag)).length
              return (
                <button key={f.name} onClick={() => document.getElementById(f.tag.replace(/[º\s]/g, ''))?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="flex-1 max-w-[160px] flex items-center gap-2 px-3 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl transition text-left">
                  <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white text-xs font-bold shrink-0`}>{f.icon}</span>
                  <div>
                    <span className="text-white text-xs font-medium block">{f.name}</span>
                    <span className="text-white/40 text-[10px]">{count} lojas</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-5 space-y-8 pb-8">

        {/* Filters */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpenOnly(!openOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-full transition ${openOnly ? 'bg-green-500 text-white' : 'bg-lupa-cream text-gray-500'}`}
            >
              <span className={`w-2 h-2 rounded-full ${openOnly ? 'bg-white' : 'bg-green-500'}`} />
              Aberto agora {openCount > 0 && `(${openCount})`}
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <button onClick={() => setCatFilter('all')} className={`px-3 py-1.5 text-[11px] font-bold rounded-full whitespace-nowrap transition ${catFilter === 'all' ? 'bg-lupa-black text-white' : 'bg-lupa-cream text-gray-500'}`}>Todas</button>
            {subcats.map(c => (
              <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 text-[11px] font-bold rounded-full whitespace-nowrap transition ${catFilter === c ? 'bg-lupa-black text-white' : 'bg-lupa-cream text-gray-500'}`}>{c}</button>
            ))}
          </div>
        </section>

        {/* Ofertas da Semana — auto-rotating */}
        {ofertas.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg text-lupa-black flex items-center gap-2">
                <span className="w-6 h-6 bg-red-50 rounded-lg flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /></svg>
                </span>
                Ofertas da Semana
              </h2>
              <Link to="/ofertas" className="text-xs text-lupa-gold font-bold">Ver todas →</Link>
            </div>
            <div ref={ofertasRef} className="flex gap-3 overflow-x-auto no-scrollbar" onMouseEnter={() => ofertasRef.current?.style.setProperty('scroll-behavior', 'auto')} onMouseLeave={() => ofertasRef.current?.style.removeProperty('scroll-behavior')}>
              {/* Duplicate for infinite loop effect */}
              {[...ofertas, ...ofertas].map((o, idx) => {
                const est = o.estabelecimentos || {}
                const whatsMsg = encodeURIComponent(`Olá! Vi a promoção *${o.titulo}* no Jornal Lupa e gostaria de saber mais! 🔍`)
                const whatsLink = est.whatsapp ? `https://wa.me/55${est.whatsapp?.replace(/\D/g, '')}?text=${whatsMsg}` : null
                return (
                  <div key={`${o.id}-${idx}`} className="min-w-[260px] max-w-[280px] bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover shrink-0">
                    {/* Product image area */}
                    {o.imagem_url ? (
                      <img src={o.imagem_url} alt="" className="w-full h-32 object-cover" />
                    ) : (
                      <div className="w-full h-24 bg-gradient-to-br from-lupa-black to-lupa-gold/30 flex items-center justify-center">
                        {est.logo_url && <img src={est.logo_url} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white/20" />}
                      </div>
                    )}
                    <div className="p-3.5">
                      <div className="flex items-center gap-2 mb-2">
                        {est.logo_url && <img src={est.logo_url} alt="" className="w-5 h-5 rounded-full object-cover" />}
                        <span className="text-[10px] text-gray-400 truncate">{est.nome}</span>
                        {o.valor_desconto && o.tipo_promo === 'percentage' && (
                          <span className="ml-auto px-2 py-0.5 bg-red-50 text-red-500 text-[10px] font-bold rounded">-{o.valor_desconto}%</span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-lupa-black line-clamp-2">{o.titulo}</h4>
                      {o.descricao && <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{o.descricao}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        {o.preco_de && <span className="text-[10px] text-gray-400 line-through">R$ {Number(o.preco_de).toFixed(2)}</span>}
                        {o.preco_por && <span className="text-sm font-bold text-lupa-gold">R$ {Number(o.preco_por).toFixed(2)}</span>}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[10px] text-gray-400">{o.dias_restantes === 0 ? 'Expira hoje!' : o.dias_restantes ? `${o.dias_restantes}d` : ''}</span>
                        <div className="flex gap-1.5">
                          <Link to="/ofertas" className="px-2.5 py-1 bg-lupa-gold text-lupa-black text-[10px] font-bold rounded-lg">Pegar cupom</Link>
                          {whatsLink && (
                            <a href={whatsLink} target="_blank" rel="noopener" className="px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded-lg flex items-center gap-0.5">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Pisos — TODAS as 27 lojas */}
        {floors.map(({ name, tag, icon, gradient }) => {
          const stores = getStoresByFloor(tag)
          if (stores.length === 0) return null

          return (
            <section key={name} id={tag.replace(/[º\s]/g, '')}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                  {icon}
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-xl text-lupa-black">{name}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{stores.length} {stores.length === 1 ? 'loja' : 'lojas'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stores.map(est => (
                  <EstabelecimentoCard key={est.id} est={est} />
                ))}
              </div>
            </section>
          )
        })}

        {/* CTA */}
        <section className="bg-lupa-black rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(201,168,76,0.5) 0%, transparent 70%)' }} />
          <div className="relative">
            <h2 className="font-display text-xl text-white">Tem uma loja no Tauste?</h2>
            <p className="text-white/40 text-sm mt-2">Cadastre seu negócio e apareça para todos os clientes</p>
            <Link to="/parceiro" className="inline-block mt-5 px-6 py-2.5 bg-lupa-gold text-lupa-black font-bold rounded-full hover:bg-lupa-gold-light transition text-sm">
              Seja Parceiro
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
