import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getHome } from '../lib/api'
import EstabelecimentoCard from '../components/EstabelecimentoCard'

const defaultPromos = [
  { id: 1, titulo: 'Super Ofertas', descricao: 'Até 50% OFF em lojas selecionadas', badge: 'Destaque', link: '/ofertas' },
  { id: 2, titulo: 'Novos Parceiros', descricao: 'Confira quem chegou esta semana', badge: 'Novo', link: '/categorias' },
  { id: 3, titulo: 'Seja Premium', descricao: 'Destaque sua loja no Lupa', badge: 'VIP', link: '/parceiro' },
]

const floors = [
  { name: 'Térreo', tag: 'Térreo', icon: 'T', gradient: 'from-lupa-gold to-amber-600' },
  { name: '1º Andar', tag: '1º Andar', icon: '1', gradient: 'from-lupa-black to-gray-700' },
  { name: '2º Andar', tag: '2º Andar', icon: '2', gradient: 'from-amber-800 to-lupa-gold-dark' },
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
      <div className="w-10 h-10 rounded-full border-[3px] border-lupa-gold/30 border-t-lupa-gold animate-spin" />
    </div>
  )

  if (!data) return <p className="text-center py-10 text-gray-400">Erro ao carregar</p>

  const promos = data.promocoes?.length > 0 ? data.promocoes : defaultPromos
  const allStores = data.todasLojas || []

  const getStoresByFloor = (tag) => allStores.filter(est => est.tags?.includes(tag))

  const scrollPromo = (dir) => {
    if (!promoRef.current) return
    promoRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Hero */}
      <div className="hero-gradient text-white px-4 py-10 pb-14 relative overflow-hidden">
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
          <p className="text-white/40 mt-3 text-sm">
            {allStores.length} lojas em 3 andares para você explorar
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-7 space-y-10 pb-8">

        {/* Promoções */}
        <section>
          <div className="relative">
            <button onClick={() => scrollPromo(-1)} className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-lg rounded-full items-center justify-center text-lupa-gold hidden sm:flex border border-gray-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div ref={promoRef} className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory">
              {promos.map((promo, i) => (
                <Link
                  key={promo.id}
                  to={promo.link || '/ofertas'}
                  className="min-w-[240px] sm:min-w-[280px] flex-shrink-0 rounded-2xl p-5 text-white relative overflow-hidden snap-start"
                  style={{
                    background: i === 0
                      ? 'linear-gradient(135deg, #1A1A1A 0%, #C9A84C 100%)'
                      : i === 1
                        ? 'linear-gradient(135deg, #2D2D2D 0%, #4A3B19 100%)'
                        : 'linear-gradient(135deg, #C9A84C 0%, #A6832A 100%)',
                  }}
                >
                  {promo.badge && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-white/15 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {promo.badge}
                    </span>
                  )}
                  <h3 className="font-display text-lg mt-1">{promo.titulo}</h3>
                  <p className="text-white/60 text-xs mt-1">{promo.descricao}</p>
                  <span className="inline-block mt-3 px-3 py-1 bg-white/15 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Ver mais
                  </span>
                </Link>
              ))}
            </div>
            <button onClick={() => scrollPromo(1)} className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-lg rounded-full items-center justify-center text-lupa-gold hidden sm:flex border border-gray-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </section>

        {/* Pisos — TODAS as 27 lojas */}
        {floors.map(({ name, tag, icon, gradient }) => {
          const stores = getStoresByFloor(tag)
          if (stores.length === 0) return null

          return (
            <section key={name}>
              {/* Floor header */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                  {icon}
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-xl text-lupa-black">{name}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{stores.length} {stores.length === 1 ? 'loja' : 'lojas'}</p>
                </div>
              </div>

              {/* Stores grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
            <Link
              to="/parceiro"
              className="inline-block mt-5 px-6 py-2.5 bg-lupa-gold text-lupa-black font-bold rounded-full hover:bg-lupa-gold-light transition text-sm"
            >
              Seja Parceiro
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
