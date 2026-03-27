import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getHome, getPromocoes } from '../lib/api'
import EstabelecimentoCard from '../components/EstabelecimentoCard'

const HERO_IMG = 'https://krruptyxkrvdxneezqnu.supabase.co/storage/v1/object/public/logos/tauste-hero.jpg'

const floors = [
  { name: 'Piso Térreo', tag: 'Térreo', icon: 'T', color: 'bg-tauste-orange' },
  { name: '1º Andar', tag: '1º Andar', icon: '1', color: 'bg-tauste-blue' },
  { name: '2º Andar', tag: '2º Andar', icon: '2', color: 'bg-lupa-gold' },
]

export default function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ofertas, setOfertas] = useState([])
  const [catFilter, setCatFilter] = useState('all')
  const ofertasRef = useRef(null)

  useEffect(() => {
    getHome().then(setData).catch(console.error).finally(() => setLoading(false))
    getPromocoes({ featured: true }).then(setOfertas).catch(() => {})
  }, [])

  // Auto-scroll ofertas
  useEffect(() => {
    if (!ofertasRef.current || ofertas.length === 0) return
    const el = ofertasRef.current
    let pos = 0
    const iv = setInterval(() => {
      pos += 1
      if (pos >= el.scrollWidth - el.clientWidth) pos = 0
      el.scrollTo({ left: pos })
    }, 30)
    return () => clearInterval(iv)
  }, [ofertas])

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 rounded-full border-[3px] border-tauste-blue/30 border-t-tauste-blue animate-spin" /></div>
  if (!data) return <p className="text-center py-10 text-gray-400">Erro ao carregar</p>

  const allStores = data.todasLojas || []
  const subcats = [...new Set(allStores.map(s => s.subcategoria).filter(Boolean))].sort()

  const getStoresByFloor = (tag) => {
    let stores = allStores.filter(est => est.tags?.includes(tag))
    if (catFilter !== 'all') stores = stores.filter(s => s.subcategoria === catFilter)
    return stores
  }

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden bg-tauste-blue" style={{ minHeight: '180px' }}>
        <img src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" onError={e => { e.target.style.display = 'none' }} />
        <div className="relative max-w-5xl mx-auto px-4 py-7 pb-8">
          <h1 className="text-white text-xl sm:text-3xl font-bold leading-tight">
            Descubra as lojas do<br />
            <span className="text-tauste-orange">Tauste São José</span>
          </h1>
          <p className="text-white/50 text-xs mt-1.5">{allStores.length} lojas em 3 andares</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 space-y-6 pb-8">

        {/* Category chips */}
        <section className="-mt-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <button onClick={() => setCatFilter('all')} className={`px-3 py-1.5 text-[11px] font-bold rounded-full whitespace-nowrap transition ${catFilter === 'all' ? 'bg-tauste-blue text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>Todas</button>
            {subcats.map(c => (
              <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 text-[11px] font-bold rounded-full whitespace-nowrap transition ${catFilter === c ? 'bg-tauste-blue text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>{c}</button>
            ))}
          </div>
        </section>

        {/* Ofertas da Semana */}
        {ofertas.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-lupa-black flex items-center gap-2">
                <span className="w-7 h-7 bg-tauste-orange/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-tauste-orange" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /></svg>
                </span>
                Ofertas da Semana
              </h2>
              <Link to="/ofertas" className="text-xs text-tauste-orange font-bold">Ver todas →</Link>
            </div>
            <div ref={ofertasRef} className="flex gap-3 overflow-x-auto no-scrollbar">
              {[...ofertas, ...ofertas].map((o, idx) => {
                const est = o.estabelecimentos || {}
                const whatsMsg = encodeURIComponent(`Olá! 👋\nVi no *Jornal Lupa SJC* a oferta:\n\n🏷️ *${o.titulo}*\n\nGostaria de aproveitar!`)
                const whatsLink = est.whatsapp ? `https://wa.me/55${est.whatsapp?.replace(/\D/g, '')}?text=${whatsMsg}` : null
                return (
                  <div key={`${o.id}-${idx}`} className="min-w-[240px] max-w-[260px] bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover shrink-0 shadow-sm">
                    {o.imagem_url ? (
                      <img src={o.imagem_url} alt="" className="w-full h-28 object-cover" />
                    ) : (
                      <div className="w-full h-20 bg-gradient-to-br from-tauste-blue to-tauste-blue-light flex items-center justify-center">
                        {est.logo_url && <img src={est.logo_url} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white/20" />}
                      </div>
                    )}
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        {est.logo_url && <img src={est.logo_url} alt="" className="w-5 h-5 rounded-full object-cover" />}
                        <span className="text-[10px] text-gray-400 truncate">{est.nome}</span>
                        {o.valor_desconto && o.tipo_promo === 'percentage' && (
                          <span className="ml-auto px-1.5 py-0.5 bg-tauste-orange/10 text-tauste-orange text-[10px] font-bold rounded">-{o.valor_desconto}%</span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-lupa-black line-clamp-2">{o.titulo}</h4>
                      {o.descricao && <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{o.descricao}</p>}
                      {o.preco_por && (
                        <div className="flex items-center gap-1.5 mt-1">
                          {o.preco_de && <span className="text-[10px] text-gray-400 line-through">R$ {Number(o.preco_de).toFixed(2)}</span>}
                          <span className="text-sm font-bold text-tauste-orange">R$ {Number(o.preco_por).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 mt-2.5">
                        {whatsLink ? (
                          <a href={whatsLink} target="_blank" rel="noopener" className="flex-1 py-1.5 bg-green-500 text-white text-[10px] font-bold rounded-lg text-center flex items-center justify-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                            Quero essa oferta
                          </a>
                        ) : (
                          <Link to="/ofertas" className="flex-1 py-1.5 bg-tauste-blue text-white text-[10px] font-bold rounded-lg text-center">Ver oferta</Link>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Pisos */}
        {floors.map(({ name, tag, icon, color }) => {
          const stores = getStoresByFloor(tag)
          if (stores.length === 0) return null
          return (
            <section key={name} id={tag.replace(/[º\s]/g, '')}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center text-white font-bold shadow-sm`}>{icon}</div>
                <div className="flex-1">
                  <h2 className="text-base font-bold text-lupa-black">{name}</h2>
                  <p className="text-[10px] text-gray-400">{stores.length} lojas</p>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stores.map(est => <EstabelecimentoCard key={est.id} est={est} />)}
              </div>
            </section>
          )
        })}

        {/* CTA */}
        <section className="bg-tauste-blue rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(245,132,31,0.5) 0%, transparent 70%)' }} />
          <div className="relative">
            <h2 className="text-xl font-bold text-white">Tem uma loja no Tauste?</h2>
            <p className="text-white/50 text-sm mt-2">Cadastre e apareça para todos os clientes</p>
            <Link to="/parceiro" className="inline-block mt-5 px-6 py-2.5 bg-tauste-orange text-white font-bold rounded-full hover:bg-tauste-orange-light transition text-sm">Seja Parceiro</Link>
          </div>
        </section>
      </div>
    </div>
  )
}
