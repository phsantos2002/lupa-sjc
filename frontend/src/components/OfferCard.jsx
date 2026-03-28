import { Link } from 'react-router-dom'
import { formatPrice } from '../lib/format'

/**
 * Standardized offer card — used on Home, Ofertas page, and Store Profile
 * Fixed dimensions, consistent layout across all pages
 */
export default function OfferCard({ offer, store, onSelect }) {
  const est = store || offer.estabelecimentos || {}
  const hasDiscount = offer.valor_desconto && offer.tipo_promo === 'percentage'
  const hasPrice = offer.preco_por
  const placeholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(est.nome || 'L')}&size=200&background=1B2A6B&color=fff&font-size=0.3`

  const validity = offer.dias_restantes !== null && offer.dias_restantes !== undefined
    ? (offer.dias_restantes === 0 ? 'Expira hoje!' : `${offer.dias_restantes}d restantes`)
    : (offer.data_fim ? `Até ${new Date(offer.data_fim + 'T00:00:00').toLocaleDateString('pt-BR')}` : 'Válido por tempo limitado')

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm card-hover flex flex-col" style={{ minHeight: '280px' }}>
      {/* Cover — fixed height */}
      <div className="relative h-28 bg-tauste-blue shrink-0">
        {offer.imagem_url ? (
          <img src={offer.imagem_url} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-tauste-blue to-tauste-blue-light flex items-center justify-center">
            {est.logo_url ? <img src={est.logo_url} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white/20" /> : <span className="text-white/30 text-2xl font-bold">{est.nome?.charAt(0)}</span>}
          </div>
        )}
        {/* Principal crown */}
        {offer.principal && (
          <span className="absolute top-2 left-2 text-lg">👑</span>
        )}
        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute top-2 right-2 px-2 py-0.5 bg-tauste-orange text-white text-[10px] font-bold rounded">-{offer.valor_desconto}%</span>
        )}
      </div>

      {/* Content — flex grow to fill */}
      <div className="p-3 flex flex-col flex-1">
        {/* Store logo + name */}
        <div className="flex items-center gap-2 mb-1.5">
          <img src={est.logo_url || placeholder} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 border border-gray-100" />
          <span className="text-xs font-medium text-gray-500 truncate">{est.nome}</span>
        </div>

        {/* Title — max 2 lines */}
        <h3 className="text-xs font-bold text-lupa-black line-clamp-2 leading-tight min-h-[32px]">{offer.titulo}</h3>

        {/* Description — max 1 line */}
        {offer.descricao && <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{offer.descricao}</p>}

        {/* Price — consistent position */}
        <div className="mt-auto pt-1.5">
          {hasPrice && (
            <div className="flex items-baseline gap-1.5">
              {offer.preco_de && <span className="text-[10px] text-gray-400 line-through">{formatPrice(offer.preco_de)}</span>}
              <span className="text-sm font-bold text-tauste-orange">{formatPrice(offer.preco_por)}</span>
            </div>
          )}
          {hasDiscount && !hasPrice && (
            <span className="text-lg font-bold text-tauste-orange">-{offer.valor_desconto}%</span>
          )}
          {!hasDiscount && !hasPrice && offer.valor_desconto && offer.tipo_promo === 'fixed_value' && (
            <span className="text-sm font-bold text-tauste-orange">{formatPrice(offer.valor_desconto)}</span>
          )}

          {/* Validity */}
          <p className="text-[10px] text-gray-400 mt-0.5">{validity}</p>

          {/* CTA Button */}
          {onSelect ? (
            <button onClick={() => onSelect(offer)} className="block w-full py-2 mt-2 bg-tauste-blue text-white text-[11px] font-bold rounded-lg text-center min-h-[36px]">
              Ver oferta
            </button>
          ) : (
            <Link to={`/estabelecimento/${est.slug}`} className="block w-full py-2 mt-2 bg-tauste-blue text-white text-[11px] font-bold rounded-lg text-center min-h-[36px]">
              Ver oferta
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
