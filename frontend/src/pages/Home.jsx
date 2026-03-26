import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getHome } from '../lib/api'
import EstabelecimentoCard from '../components/EstabelecimentoCard'

// Ícones minimalistas SVG para categorias
const categoryIcons = {
  'abertos-24h': (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'restaurantes': (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m18-12.75H3" />
    </svg>
  ),
  'mercados': (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  ),
  'farmacias': (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'pet-shops': (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
    </svg>
  ),
  'padarias': (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513m-3 4.644l-1.5.75a3.354 3.354 0 01-3 0L3 16.5m18-12.75H3" />
    </svg>
  ),
  'barbearias': (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
  'academias': (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5h2.25m13.5 0H21m-18 9h2.25m13.5 0H21M6.75 7.5v9m10.5-9v9M8.25 7.5h7.5M8.25 16.5h7.5" />
    </svg>
  ),
  'cafes': (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
    </svg>
  ),
  'bares': (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5" />
    </svg>
  ),
  'pizzarias': (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  'hamburguerias': (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25H3.75" />
    </svg>
  ),
  'docerias': (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  'lojas': (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72" />
    </svg>
  ),
  'servicos': (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1a2.25 2.25 0 010-3.182l.71-.71a2.25 2.25 0 013.18 0l.71.71a2.25 2.25 0 010 3.182M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
    </svg>
  ),
}

function getIcon(slug) {
  return categoryIcons[slug] || (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35" />
    </svg>
  )
}

const defaultPromos = [
  { id: 1, titulo: 'Super Ofertas', descricao: 'Até 50% OFF em lojas selecionadas', badge: 'Destaque', link: '/ofertas' },
  { id: 2, titulo: 'Frete Grátis', descricao: 'Em pedidos acima de R$30', badge: 'Novo', link: '/ofertas' },
  { id: 3, titulo: 'Novidades', descricao: 'Confira os novos parceiros da semana', badge: 'Novos', link: '/categorias' },
]

export default function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const promoRef = useRef(null)

  useEffect(() => {
    getHome().then(setData).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" /></div>
  if (!data) return <p className="text-center py-10 text-gray-400">Erro ao carregar</p>

  const promos = data.promocoes?.length > 0 ? data.promocoes : defaultPromos

  const scrollPromo = (dir) => {
    if (!promoRef.current) return
    const w = promoRef.current.offsetWidth
    promoRef.current.scrollBy({ left: dir * w * 0.85, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Hero */}
      <div className="hero-gradient text-white px-4 py-8 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-1 text-white/80 text-sm mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            São José dos Campos, SP
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
            O Supermercado Tauste<br />São José na palma da sua mão
          </h1>
          <p className="text-white/80 mt-2 text-sm">
            Encontre lojas, ofertas e serviços perto de você
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-6 space-y-8 pb-6">
        {/* Categorias com ícones minimalistas */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <div className="flex overflow-x-auto gap-3 no-scrollbar pb-1">
            {data.categorias.map(cat => (
              <Link
                key={cat.id}
                to={`/categorias/${cat.slug}`}
                className="flex flex-col items-center gap-2 min-w-[76px] group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-primary-50 group-hover:text-primary-600 transition border border-gray-100 group-hover:border-primary-200">
                  {getIcon(cat.slug)}
                </div>
                <span className="text-[11px] font-medium text-gray-600 group-hover:text-primary-700 text-center leading-tight">
                  {cat.nome}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Promoções Especiais — 3 cards deslizáveis */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
            Promoções Especiais
          </h2>
          <div className="relative">
            <button onClick={() => scrollPromo(-1)} className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-md rounded-full items-center justify-center text-gray-500 hover:text-primary-600 transition hidden sm:flex">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div ref={promoRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
              {promos.map((promo, i) => (
                <Link
                  key={promo.id}
                  to={promo.link || (promo.estabelecimentos ? `/estabelecimento/${promo.estabelecimentos.slug}` : '/ofertas')}
                  className="min-w-[280px] sm:min-w-[320px] flex-shrink-0 rounded-2xl p-5 text-white relative overflow-hidden snap-start"
                  style={{
                    background: i === 0
                      ? 'linear-gradient(135deg, #0D9488 0%, #2DD4BF 100%)'
                      : i === 1
                        ? 'linear-gradient(135deg, #0891B2 0%, #67E8F9 100%)'
                        : 'linear-gradient(135deg, #7C3AED 0%, #C4B5FD 100%)',
                  }}
                >
                  {promo.badge && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-white/20 backdrop-blur rounded-full text-[11px] font-bold">
                      {promo.badge}
                    </span>
                  )}
                  <h3 className="font-bold text-xl mt-1">{promo.titulo}</h3>
                  <p className="text-white/80 text-sm mt-1">{promo.descricao}</p>
                  <span className="inline-block mt-4 px-4 py-1.5 bg-white/20 backdrop-blur rounded-full text-sm font-semibold">
                    Ver ofertas
                  </span>
                </Link>
              ))}
            </div>
            <button onClick={() => scrollPromo(1)} className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-md rounded-full items-center justify-center text-gray-500 hover:text-primary-600 transition hidden sm:flex">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </section>

        {/* Destaque da Semana */}
        {data.destaqueSemana && data.destaqueSemana.estabelecimentos && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-3.77 1.522m0 0a6.003 6.003 0 01-3.77-1.522" />
              </svg>
              Destaque da Semana
              <span className="ml-1 px-2.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                #{data.destaqueSemana.numero}
              </span>
            </h2>
            <DestaqueSemanaCard est={data.destaqueSemana.estabelecimentos} numero={data.destaqueSemana.numero} semanaInicio={data.destaqueSemana.semana_inicio} semanaFim={data.destaqueSemana.semana_fim} />
          </section>
        )}

        {/* Populares */}
        {data.populares?.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                </svg>
                Populares
              </h2>
              <Link to="/categorias" className="text-sm text-primary-600 font-semibold hover:underline">
                Ver mais
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {data.populares.map(est => (
                <div key={est.id} className="min-w-[300px] max-w-[340px] flex-shrink-0">
                  <EstabelecimentoCard est={est} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Lojas Premium */}
        {data.destaqueLojas?.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              Lojas Premium
            </h2>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {data.destaqueLojas.map(est => (
                <div key={est.id} className="min-w-[300px] max-w-[340px] flex-shrink-0">
                  <EstabelecimentoCard est={est} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA Seja Parceiro */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-2xl p-6 text-center text-white">
          <h2 className="text-xl font-bold">Tem uma loja?</h2>
          <p className="text-white/80 text-sm mt-1">Cadastre seu negócio e alcance mais clientes em SJC</p>
          <Link
            to="/parceiro"
            className="inline-block mt-4 px-6 py-2.5 bg-white text-primary-700 font-bold rounded-full hover:bg-gray-50 transition"
          >
            Seja Parceiro
          </Link>
        </section>
      </div>
    </div>
  )
}

// Card do Destaque da Semana (estilo Villa Branca)
function DestaqueSemanaCard({ est, numero, semanaInicio, semanaFim }) {
  const categoria = est.categorias || {}
  const fotoPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(est.nome)}&size=400&background=F59E0B&color=fff`

  const formatDate = (d) => {
    if (!d) return ''
    const date = new Date(d + 'T00:00:00')
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
  }

  return (
    <Link
      to={`/estabelecimento/${est.slug}`}
      className="block bg-white rounded-2xl shadow-sm border-2 border-amber-200 overflow-hidden card-hover"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative sm:w-52 h-44 sm:h-auto bg-gray-100 shrink-0">
          <img src={est.foto_url || fotoPlaceholder} alt={est.nome} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872" />
            </svg>
          </div>
        </div>
        <div className="p-4 flex-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-full mb-2">
            Vencedor do Sorteio
          </span>
          <h3 className="font-bold text-lg text-gray-900">{est.nome}</h3>
          {categoria.nome && <span className="text-sm text-gray-500">{categoria.nome}</span>}
          {est.descricao && <p className="text-sm text-gray-500 mt-2 line-clamp-3">{est.descricao}</p>}
          {est.endereco && (
            <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
              {est.endereco}
            </p>
          )}
          {est.telefone && (
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
              {est.telefone}
            </p>
          )}
          <div className="flex items-center gap-1 mt-2">
            <span className={`inline-flex items-center gap-1 text-xs font-medium ${est.aberto_agora ? 'text-green-600' : 'text-gray-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${est.aberto_agora ? 'bg-green-500' : 'bg-gray-400'}`} />
              {est.aberto_agora ? 'Aberto agora' : 'Fechado'}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <span className="inline-flex items-center px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-lg">
              Ver Detalhes
            </span>
            {semanaInicio && semanaFim && (
              <span className="text-[11px] text-gray-400">
                Destaque: {formatDate(semanaInicio)} - {formatDate(semanaFim)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
