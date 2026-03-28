import { Link } from 'react-router-dom'
import { useState } from 'react'
import { isFavorite, toggleFavorite } from '../lib/favorites'

export default function EstabelecimentoCard({ est }) {
  const categoria = est.categorias || {}
  const [fav, setFav] = useState(isFavorite(est.id))
  const whatsMsg = encodeURIComponent(`Olá! 👋 Vi a loja *${est.nome}* no *Jornal Lupa SJC* e gostaria de mais informações!`)
  const whatsLink = est.whatsapp ? `https://wa.me/55${est.whatsapp.replace(/\D/g, '')}?text=${whatsMsg}` : null
  const placeholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(est.nome)}&size=400&background=1B2A6B&color=fff&font-size=0.3`

  // Ofertas ativas da loja
  const ofertas = (est.promocoes || []).filter(p => p.ativo !== false)

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover shadow-sm">
      {/* Cover photo */}
      <Link to={`/estabelecimento/${est.slug}`} className="block relative h-32 bg-tauste-blue overflow-hidden">
        <img src={est.banner_url || est.foto_url || placeholder} alt={est.nome} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Status */}
        <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold rounded-full ${est.aberto_agora ? 'bg-[#075E54] text-white' : 'bg-gray-800/80 text-gray-300'}`}>
          {est.aberto_agora ? 'Aberto' : 'Fechado'}
        </span>

        {/* Fav */}
        <button onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavorite(est.id); setFav(!fav) }} className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
          <svg className={`w-3.5 h-3.5 ${fav ? 'text-red-500 fill-red-500' : 'text-white'}`} fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
        </button>

        {/* Store name + bigger logo */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end gap-2.5">
          <div className="w-14 h-14 rounded-xl bg-white shadow-lg border-2 border-white flex items-center justify-center overflow-hidden shrink-0 -mb-4">
            {est.logo_url ? <img src={est.logo_url} alt="" className="w-full h-full object-cover" /> : <span className="text-tauste-blue font-bold text-lg">{est.nome?.charAt(0)}</span>}
          </div>
          <div className="min-w-0 mb-1">
            <h3 className="font-bold text-base text-white truncate drop-shadow leading-tight">{est.nome}</h3>
            <p className="text-[11px] text-white/80 drop-shadow">{est.subcategoria || categoria.nome}</p>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 pt-5">
        {est.descricao && <p className="text-[11px] text-gray-400 line-clamp-2 mb-2">{est.descricao}</p>}

        {/* Offer inside card (first active offer) */}
        {ofertas.length > 0 && (
          <div className="bg-tauste-orange/5 border border-tauste-orange/20 rounded-xl p-2.5 mb-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] text-tauste-orange font-bold uppercase tracking-wider">Oferta</p>
                <p className="text-xs font-bold text-lupa-black mt-0.5 line-clamp-1">{ofertas[0].titulo}</p>
                {ofertas[0].descricao && <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{ofertas[0].descricao}</p>}
              </div>
              {ofertas[0].valor_desconto && ofertas[0].tipo_promo === 'percentage' && (
                <span className="px-2 py-0.5 bg-tauste-orange text-white text-[10px] font-bold rounded shrink-0">-{ofertas[0].valor_desconto}%</span>
              )}
              {ofertas[0].preco_por && (
                <span className="text-sm font-bold text-tauste-orange shrink-0">R$ {Number(ofertas[0].preco_por).toFixed(2)}</span>
              )}
            </div>
            {ofertas.length > 1 && (
              <p className="text-[9px] text-tauste-orange/60 mt-1">+ {ofertas.length - 1} oferta{ofertas.length > 2 ? 's' : ''}</p>
            )}
          </div>
        )}

        {/* Action button — gold "Ver perfil" only */}
        <div>
          <Link to={`/estabelecimento/${est.slug}`} className="block w-full py-2 btn-blue-shine text-[11px] font-bold rounded-lg text-center min-h-[36px]">
            Ver perfil
          </Link>
        </div>
      </div>
    </div>
  )
}
