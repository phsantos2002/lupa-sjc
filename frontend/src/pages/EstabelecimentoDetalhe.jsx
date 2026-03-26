import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getEstabelecimento } from '../lib/api'

export default function EstabelecimentoDetalhe() {
  const { slug } = useParams()
  const [est, setEst] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getEstabelecimento(slug).then(setEst).catch(console.error).finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" /></div>

  if (!est) return <p className="text-center py-10 text-gray-400">Estabelecimento não encontrado</p>

  const categoria = est.categorias || {}
  const fotoPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(est.nome)}&size=800&background=0D9488&color=fff&font-size=0.25`
  const whatsappLink = est.whatsapp
    ? `https://wa.me/55${est.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Vi vocês no Lupa SJC 🔍`)}`
    : null

  return (
    <div className="max-w-3xl mx-auto">
      {/* Cover */}
      <div className="relative h-56 sm:h-72 bg-gray-100">
        <img
          src={est.foto_url || fotoPlaceholder}
          alt={est.nome}
          className="w-full h-full object-cover"
        />
        <Link to={-1} className="absolute top-4 left-4 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        {est.destaque && (
          <span className="absolute top-4 right-4 px-3 py-1 bg-primary-500 text-white text-xs font-bold rounded-full">
            Premium
          </span>
        )}
      </div>

      <div className="px-4 pb-8">
        {/* Header info */}
        <div className="flex items-start gap-3 -mt-8 relative">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-md border-2 border-white flex items-center justify-center text-2xl overflow-hidden">
            {est.logo_url ? (
              <img src={est.logo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span>{categoria.icone || '🏪'}</span>
            )}
          </div>
          <div className="pt-9">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">{est.nome}</h1>
              <span className={`w-2 h-2 rounded-full ${est.aberto_agora ? 'bg-green-500' : 'bg-gray-400'}`} />
            </div>
            {categoria.nome && (
              <Link to={`/categorias/${categoria.slug}`} className="text-sm text-primary-600 font-medium hover:underline">
                {categoria.nome}
              </Link>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="mt-3">
          <span className={`inline-flex items-center gap-1 text-sm font-medium ${est.aberto_agora ? 'text-green-600' : 'text-gray-500'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {est.aberto_agora ? 'Aberto agora' : 'Fechado'}
          </span>
        </div>

        {/* Tags */}
        {est.tags && est.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {est.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Descrição */}
        {est.descricao && (
          <div className="mt-5">
            <h2 className="font-bold text-gray-900 mb-2">Sobre</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{est.descricao}</p>
          </div>
        )}

        {/* Contato e endereço */}
        <div className="mt-5 space-y-3">
          {est.endereco && (
            <div className="flex items-start gap-3 text-sm">
              <svg className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-700">{est.endereco}, {est.bairro}</span>
            </div>
          )}
          {est.telefone && (
            <a href={`tel:${est.telefone}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-primary-600">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {est.telefone}
            </a>
          )}
          {est.instagram && (
            <a href={`https://instagram.com/${est.instagram.replace('@', '')}`} target="_blank" rel="noopener" className="flex items-center gap-3 text-sm text-gray-700 hover:text-primary-600">
              <span className="w-5 h-5 text-gray-400 text-center">📷</span>
              {est.instagram}
            </a>
          )}
        </div>

        {/* Promoções */}
        {est.promocoes && est.promocoes.length > 0 && (
          <div className="mt-6">
            <h2 className="font-bold text-gray-900 mb-3">Ofertas</h2>
            <div className="space-y-3">
              {est.promocoes.map(promo => (
                <div key={promo.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{promo.titulo}</h3>
                      {promo.descricao && <p className="text-sm text-gray-500 mt-1">{promo.descricao}</p>}
                    </div>
                    {promo.badge && (
                      <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-[10px] font-bold rounded-full shrink-0">
                        {promo.badge}
                      </span>
                    )}
                  </div>
                  {(promo.preco_de || promo.preco_por) && (
                    <div className="flex items-center gap-2 mt-2">
                      {promo.preco_de && (
                        <span className="text-sm text-gray-400 line-through">R$ {Number(promo.preco_de).toFixed(2)}</span>
                      )}
                      {promo.preco_por && (
                        <span className="text-lg font-bold text-primary-600">R$ {Number(promo.preco_por).toFixed(2)}</span>
                      )}
                      {promo.desconto_percentual && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                          -{promo.desconto_percentual}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex gap-3 mt-6">
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener"
              className="flex-1 py-3 bg-green-500 text-white font-bold rounded-xl text-center hover:bg-green-600 transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.553 4.1 1.519 5.826L.053 23.664l5.96-1.56A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.965 0-3.83-.528-5.47-1.528l-.392-.233-3.538.927.944-3.45-.256-.406A9.794 9.794 0 012.18 12c0-5.422 4.398-9.82 9.82-9.82 5.422 0 9.82 4.398 9.82 9.82 0 5.422-4.398 9.82-9.82 9.82z"/></svg>
              WhatsApp
            </a>
          )}
          {est.telefone && (
            <a
              href={`tel:${est.telefone}`}
              className="py-3 px-5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Ligar
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
