import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPromocoes } from '../lib/api'

export default function Ofertas() {
  const [promocoes, setPromocoes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPromocoes().then(setPromocoes).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" /></div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span>🏷️</span> Ofertas
      </h1>

      {promocoes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-4xl mb-3">🏷️</p>
          <p className="text-gray-500">Nenhuma oferta disponível no momento</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {promocoes.map(promo => (
            <div key={promo.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden card-hover">
              {promo.imagem_url && (
                <div className="h-36 bg-gray-100">
                  <img src={promo.imagem_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-gray-900">{promo.titulo}</h3>
                  {promo.badge && (
                    <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-[10px] font-bold rounded-full shrink-0">
                      {promo.badge}
                    </span>
                  )}
                </div>
                {promo.descricao && <p className="text-sm text-gray-500 mt-1">{promo.descricao}</p>}

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

                {promo.estabelecimentos && (
                  <Link
                    to={`/estabelecimento/${promo.estabelecimentos.slug}`}
                    className="inline-flex items-center gap-1 mt-3 text-sm text-primary-600 font-medium hover:underline"
                  >
                    {promo.estabelecimentos.nome}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
