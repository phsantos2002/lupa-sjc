import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getHome } from '../lib/api'
import EstabelecimentoCard from '../components/EstabelecimentoCard'

const defaultPromos = [
  { id: 1, titulo: 'Super Ofertas', descricao: 'Até 50% OFF em lojas selecionadas', badge: 'Destaque', link: '/ofertas' },
  { id: 2, titulo: 'Novos Parceiros', descricao: 'Confira quem chegou esta semana', badge: 'Novo', link: '/categorias' },
  { id: 3, titulo: 'Seja Premium', descricao: 'Destaque sua loja no Lupa', badge: 'VIP', link: '/parceiro' },
]

const floorConfig = [
  { floor: 'Térreo', tag: 'Térreo', icon: '0', color: 'from-lupa-gold to-amber-600' },
  { floor: '1º Andar', tag: '1º Andar', icon: '1', color: 'from-lupa-black to-gray-800' },
  { floor: '2º Andar', tag: '2º Andar', icon: '2', color: 'from-amber-800 to-lupa-gold-dark' },
]

export default function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const promoRef = useRef(null)

  useEffect(() => {
    getHome().then(setData).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-10 h-10 rounded-full border-3 border-lupa-gold/30 border-t-lupa-gold animate-spin" />
      <span className="text-xs text-gray-400 uppercase tracking-widest">Carregando</span>
    </div>
  )

  if (!data) return <p className="text-center py-10 text-gray-400">Erro ao carregar</p>

  const promos = data.promocoes?.length > 0 ? data.promocoes : defaultPromos

  // Agrupar lojas por andar usando tags
  const allStores = [...(data.populares || []), ...(data.destaqueLojas || [])]
  const uniqueStores = allStores.filter((est, i, arr) => arr.findIndex(e => e.id === est.id) === i)

  const getStoresByFloor = (tag) => {
    return uniqueStores.filter(est => est.tags?.includes(tag))
  }

  const scrollPromo = (dir) => {
    if (!promoRef.current) return
    promoRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Hero — Elegante preto e dourado */}
      <div className="hero-gradient text-white px-4 py-10 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(201,168,76,0.4) 0%, transparent 50%)' }} />
        <div className="max-w-5xl mx-auto relative">
          <div className="flex items-center gap-1.5 text-lupa-gold/80 text-xs uppercase tracking-[0.2em] mb-3">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            Supermercado Tauste SJC
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
            Tudo do Tauste<br />
            <span className="gold-shimmer">na palma da sua mão</span>
          </h1>
          <p className="text-white/50 mt-3 text-sm max-w-md">
            Descubra lojas, ofertas exclusivas e serviços em todos os andares
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-6 space-y-8 pb-8">

        {/* Promoções Especiais */}
        <section>
          <div className="relative">
            <button onClick={() => scrollPromo(-1)} className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-lg rounded-full items-center justify-center text-lupa-gold transition hidden sm:flex border border-gray-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div ref={promoRef} className="flex gap-3 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
              {promos.map((promo, i) => (
                <Link
                  key={promo.id}
                  to={promo.link || '/ofertas'}
                  className="min-w-[260px] sm:min-w-[300px] flex-shrink-0 rounded-2xl p-5 text-white relative overflow-hidden snap-start"
                  style={{
                    background: i === 0
                      ? 'linear-gradient(135deg, #1A1A1A 0%, #C9A84C 100%)'
                      : i === 1
                        ? 'linear-gradient(135deg, #2D2D2D 0%, #4A3B19 100%)'
                        : 'linear-gradient(135deg, #C9A84C 0%, #A6832A 100%)',
                  }}
                >
                  {promo.badge && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-white/15 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {promo.badge}
                    </span>
                  )}
                  <h3 className="font-display font-bold text-xl mt-1">{promo.titulo}</h3>
                  <p className="text-white/70 text-sm mt-1">{promo.descricao}</p>
                  <span className="inline-block mt-4 px-4 py-1.5 bg-white/15 backdrop-blur rounded-full text-xs font-bold uppercase tracking-wider">
                    Ver mais
                  </span>
                </Link>
              ))}
            </div>
            <button onClick={() => scrollPromo(1)} className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-lg rounded-full items-center justify-center text-lupa-gold transition hidden sm:flex border border-gray-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </section>

        {/* Pisos do Mercado */}
        {floorConfig.map(({ floor, tag, icon, color }) => {
          const stores = getStoresByFloor(tag)
          if (stores.length === 0) return null

          return (
            <section key={floor}>
              {/* Floor Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-display font-bold text-lg shadow-md`}>
                  {icon}
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-lupa-black">{floor}</h2>
                  <p className="text-[11px] text-gray-400">{stores.length} lojas</p>
                </div>
                <div className="flex-1 floor-divider ml-3" />
              </div>

              {/* Store grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stores.map(est => (
                  <EstabelecimentoCard key={est.id} est={est} />
                ))}
              </div>
            </section>
          )
        })}

        {/* Todas as lojas que não caíram em nenhum piso */}
        {(() => {
          const floorTags = floorConfig.map(f => f.tag)
          const other = uniqueStores.filter(est => !est.tags?.some(t => floorTags.includes(t)))
          if (other.length === 0) return null
          return (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 font-display font-bold text-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35" /></svg>
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-lupa-black">Outras Lojas</h2>
                  <p className="text-[11px] text-gray-400">{other.length} lojas</p>
                </div>
                <div className="flex-1 floor-divider ml-3" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {other.map(est => (
                  <EstabelecimentoCard key={est.id} est={est} />
                ))}
              </div>
            </section>
          )
        })()}

        {/* CTA Seja Parceiro */}
        <section className="bg-lupa-black rounded-2xl p-7 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(201,168,76,0.5) 0%, transparent 70%)' }} />
          <div className="relative">
            <h2 className="font-display text-xl font-bold text-white">Tem uma loja no Tauste?</h2>
            <p className="text-white/50 text-sm mt-2">Cadastre seu negócio e apareça para todos os clientes</p>
            <Link
              to="/parceiro"
              className="inline-block mt-5 px-6 py-2.5 bg-lupa-gold text-lupa-black font-bold rounded-full hover:bg-lupa-gold-light transition text-sm uppercase tracking-wider"
            >
              Seja Parceiro
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
