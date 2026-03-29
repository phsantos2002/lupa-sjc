import { useState, useEffect } from 'react'
import { getPromocoes } from '../lib/api'
import OfferPopup from '../components/OfferPopup'

const FLOOR_FILTERS = [
  { label: 'Todas', value: '' },
  { label: 'Térreo', value: '0' },
  { label: '1º Andar', value: '1' },
  { label: '2º Andar', value: '2' },
]

export default function Ofertas() {
  const [promos, setPromos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getPromocoes().then(data => {
      // 1 per store, prefer principal
      const sorted = data.sort((a, b) => (b.principal ? 1 : 0) - (a.principal ? 1 : 0))
      const seen = new Set()
      const unique = sorted.filter(o => {
        const sid = o.estabelecimento_id
        if (seen.has(sid)) return false
        seen.add(sid)
        return true
      })
      setPromos(unique)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const filtered = filter ? promos.filter(p => p.estabelecimentos?.andar === Number(filter)) : promos

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 rounded-full border-[3px] border-lupa-gold/30 border-t-lupa-gold animate-spin" />
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-lupa-black mb-1">Ofertas</h1>
      <p className="text-sm text-gray-400 mb-5">{promos.length} ofertas disponíveis</p>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
        {FLOOR_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition ${
              filter === f.value ? 'bg-lupa-black text-white' : 'bg-lupa-cream text-gray-500 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-10">Nenhuma oferta disponível no momento</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(promo => (
            <PromoCard key={promo.id} promo={promo} onSelect={() => setSelected(promo)} />
          ))}
        </div>
      )}

      {/* Offer Popup (lead capture + detail + CTA) */}
      {selected && (
        <OfferPopup offer={selected} store={selected.estabelecimentos} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

// Promo Card
function PromoCard({ promo, onSelect }) {
  const est = promo.estabelecimentos || {}
  const placeholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(est.nome || 'L')}&size=200&background=1B2A6B&color=fff`
  return (
    <button onClick={onSelect} className="bg-white rounded-xl border border-gray-100 overflow-hidden card-hover text-left w-full flex">
      {/* Photo left — square */}
      <div className="w-32 h-32 shrink-0 bg-tauste-blue">
        {promo.imagem_url ? (
          <img src={promo.imagem_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-tauste-blue to-tauste-blue-light flex items-center justify-center">
            {est.logo_url ? <img src={est.logo_url} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white/20" /> : <span className="text-white/30 text-xl font-bold">{est.nome?.charAt(0)}</span>}
          </div>
        )}
      </div>
      {/* Info right */}
      <div className="p-3 flex-1 flex flex-col min-w-0">
        <h3 className="font-bold text-sm text-lupa-black line-clamp-2 leading-tight">{promo.titulo}</h3>
        <div className="flex items-center gap-2 mt-1.5">
          <img src={est.logo_url || placeholder} alt="" className="w-7 h-7 rounded-full object-cover border border-gray-100" />
          <span className="text-xs font-medium text-gray-500 truncate">{est.nome}</span>
        </div>
        <div className="mt-auto pt-2">
          <div className="flex items-center gap-2">
            {promo.valor_desconto && promo.tipo_promo === 'percentage' && (
              <span className="px-2 py-0.5 bg-tauste-orange text-white text-sm font-bold rounded">-{promo.valor_desconto}%</span>
            )}
            {promo.preco_de && <span className="text-xs text-gray-400 line-through">R$ {Number(promo.preco_de).toFixed(2)}</span>}
            {promo.preco_por && <span className="text-base font-bold text-tauste-orange">R$ {Number(promo.preco_por).toFixed(2)}</span>}
            {!promo.preco_por && promo.valor_desconto && promo.tipo_promo === 'fixed_value' && (
              <span className="text-base font-bold text-tauste-orange">R$ {Number(promo.valor_desconto).toFixed(2)}</span>
            )}
          </div>
          <span className="inline-flex items-center justify-center w-full py-2 mt-2 btn-gold text-xs font-bold rounded-lg">Ver oferta</span>
        </div>
      </div>
    </button>
  )
}
