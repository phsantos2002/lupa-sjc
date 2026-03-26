import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getHome } from '../lib/api'
import EstabelecimentoCard from '../components/EstabelecimentoCard'

export default function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHome().then(setData).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" /></div>

  if (!data) return <p className="text-center py-10 text-gray-400">Erro ao carregar</p>

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
            Tudo do bairro,<br />na palma da sua mão
          </h1>
          <p className="text-white/80 mt-2 text-sm">
            Encontre lojas, ofertas e serviços perto de você
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-6 space-y-8 pb-6">
        {/* Categorias */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <div className="flex overflow-x-auto gap-4 no-scrollbar pb-1">
            {data.categorias.map(cat => (
              <Link
                key={cat.id}
                to={`/categorias/${cat.slug}`}
                className="flex flex-col items-center gap-1.5 min-w-[72px] group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl group-hover:bg-primary-50 transition border border-gray-100 group-hover:border-primary-200">
                  {cat.icone}
                </div>
                <span className="text-[11px] font-medium text-gray-600 group-hover:text-primary-700 text-center leading-tight">
                  {cat.nome}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Promoções Especiais */}
        {data.promocoes.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span>✨</span> Promoções Especiais
            </h2>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {data.promocoes.map(promo => (
                <div key={promo.id} className="min-w-[280px] rounded-2xl p-5 text-white relative overflow-hidden hero-gradient">
                  {promo.badge && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-white/20 backdrop-blur rounded-full text-[10px] font-bold">
                      {promo.badge}
                    </span>
                  )}
                  <h3 className="font-bold text-lg">{promo.titulo}</h3>
                  <p className="text-white/80 text-sm mt-1">{promo.descricao}</p>
                  {promo.estabelecimentos && (
                    <Link
                      to={`/estabelecimento/${promo.estabelecimentos.slug}`}
                      className="inline-block mt-3 px-4 py-1.5 bg-white/20 backdrop-blur rounded-full text-sm font-semibold hover:bg-white/30 transition"
                    >
                      Ver ofertas
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Destaque da Semana */}
        {data.destaqueSemana && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span>🏆</span> Destaque da Semana
              <span className="ml-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                #{data.destaqueSemana.numero}
              </span>
            </h2>
            {data.destaqueSemana.estabelecimentos && (
              <Link
                to={`/estabelecimento/${data.destaqueSemana.estabelecimentos.slug}`}
                className="block bg-white rounded-2xl shadow-sm border-2 border-amber-200 overflow-hidden card-hover"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-48 h-40 sm:h-auto bg-gray-100">
                    <img
                      src={data.destaqueSemana.estabelecimentos.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.destaqueSemana.estabelecimentos.nome)}&size=400&background=F59E0B&color=fff`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full mb-2">
                      🏆 Destaque da Semana
                    </span>
                    <h3 className="font-bold text-lg text-gray-900">{data.destaqueSemana.estabelecimentos.nome}</h3>
                    {data.destaqueSemana.estabelecimentos.categorias && (
                      <span className="text-sm text-primary-600">{data.destaqueSemana.estabelecimentos.categorias.nome}</span>
                    )}
                    {data.destaqueSemana.estabelecimentos.descricao && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{data.destaqueSemana.estabelecimentos.descricao}</p>
                    )}
                    {data.destaqueSemana.estabelecimentos.endereco && (
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                        {data.destaqueSemana.estabelecimentos.endereco}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )}
          </section>
        )}

        {/* Populares */}
        {data.populares.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>🏠</span> Populares
              </h2>
              <Link to="/categorias" className="text-sm text-primary-600 font-semibold hover:underline">
                Ver mais
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {data.populares.map(est => (
                <div key={est.id} className="min-w-[240px] max-w-[280px]">
                  <EstabelecimentoCard est={est} compact />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Lojas em Destaque */}
        {data.destaqueLojas.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span>🏅</span> Lojas em Destaque
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.destaqueLojas.map(est => (
                <EstabelecimentoCard key={est.id} est={est} />
              ))}
            </div>
          </section>
        )}

        {/* Patrocinadores */}
        {data.patrocinadores.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Apoiadores do App</span>
              <span className="text-xs text-primary-600 font-medium">#Patrocinado</span>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {data.patrocinadores.map(p => (
                <div key={p.id} className="min-w-[260px] bg-primary-600 text-white rounded-xl p-4 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">
                    {p.logo_url ? <img src={p.logo_url} alt="" className="w-full h-full rounded-full object-cover" /> : 'LOGO'}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm truncate">{p.nome}</h4>
                    {p.slogan && <p className="text-white/70 text-xs truncate">{p.slogan}</p>}
                    {p.telefone && <p className="text-white/60 text-[11px] mt-0.5">📞 {p.telefone}</p>}
                    {p.instagram && <p className="text-white/60 text-[11px]">📷 {p.instagram}</p>}
                  </div>
                </div>
              ))}
              {/* Slot vazio - anuncie aqui */}
              <Link to="/parceiro" className="min-w-[260px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center text-gray-400 hover:border-primary-300 hover:text-primary-600 transition">
                <div className="text-center">
                  <p className="font-bold text-sm">Seja um patrocinador!</p>
                  <p className="text-xs mt-1">Anuncie aqui</p>
                </div>
              </Link>
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
