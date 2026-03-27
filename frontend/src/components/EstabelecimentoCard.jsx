import { Link } from 'react-router-dom'
import { useState } from 'react'
import { isFavorite, toggleFavorite } from '../lib/favorites'

export default function EstabelecimentoCard({ est }) {
  const categoria = est.categorias || {}
  const [fav, setFav] = useState(isFavorite(est.id))
  const whatsMsg = encodeURIComponent(`Olá! 👋 Vi a loja *${est.nome}* no *Jornal Lupa SJC* e gostaria de mais informações!`)
  const whatsLink = est.whatsapp ? `https://wa.me/55${est.whatsapp.replace(/\D/g, '')}?text=${whatsMsg}` : null
  const placeholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(est.nome)}&size=400&background=1B2A6B&color=fff&font-size=0.3`

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover shadow-sm">
      {/* Cover */}
      <Link to={`/estabelecimento/${est.slug}`} className="block relative h-28 bg-tauste-blue overflow-hidden">
        <img src={est.banner_url || est.foto_url || placeholder} alt={est.nome} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold rounded-full ${est.aberto_agora ? 'bg-green-500 text-white' : 'bg-gray-800/80 text-gray-300'}`}>
          {est.aberto_agora ? 'Aberto' : 'Fechado'}
        </span>

        <button onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavorite(est.id); setFav(!fav) }} className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
          <svg className={`w-3.5 h-3.5 ${fav ? 'text-red-500 fill-red-500' : 'text-white'}`} fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
        </button>
      </Link>

      {/* Info */}
      <div className="p-3">
        <Link to={`/estabelecimento/${est.slug}`} className="flex items-start gap-2">
          <div className="w-10 h-10 -mt-7 rounded-lg bg-white shadow-md border-2 border-white flex items-center justify-center overflow-hidden shrink-0 relative z-10">
            {est.logo_url ? <img src={est.logo_url} alt="" className="w-full h-full object-cover" /> : <span className="text-tauste-blue font-bold text-sm">{est.nome?.charAt(0)}</span>}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <h3 className="font-bold text-sm text-lupa-black truncate">{est.nome}</h3>
            <p className="text-[10px] text-tauste-orange font-medium">{est.subcategoria || categoria.nome}</p>
          </div>
        </Link>

        {est.descricao && <p className="text-[11px] text-gray-400 mt-2 line-clamp-2">{est.descricao}</p>}

        {/* Action buttons — WhatsApp as primary CTA */}
        <div className="flex gap-2 mt-3">
          {whatsLink ? (
            <>
              <a href={whatsLink} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} className="flex-1 py-2 bg-green-500 text-white text-[11px] font-bold rounded-lg text-center flex items-center justify-center gap-1 hover:bg-green-600 transition">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                Falar no WhatsApp
              </a>
              <Link to={`/estabelecimento/${est.slug}`} className="py-2 px-3 border border-gray-200 text-gray-500 text-[11px] font-bold rounded-lg text-center hover:bg-gray-50 transition">
                Ver perfil
              </Link>
            </>
          ) : (
            <Link to={`/estabelecimento/${est.slug}`} className="flex-1 py-2 bg-tauste-blue text-white text-[11px] font-bold rounded-lg text-center hover:bg-tauste-blue-light transition">
              Ver perfil
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
