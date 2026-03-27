import { Link } from 'react-router-dom'
import { useState } from 'react'
import { isFavorite, toggleFavorite } from '../lib/favorites'

export default function EstabelecimentoCard({ est }) {
  const categoria = est.categorias || {}
  const [fav, setFav] = useState(isFavorite(est.id))
  const whatsMsg = encodeURIComponent(`Olá! Vi vocês no Jornal Lupa SJC e gostaria de saber mais! 🔍`)
  const whatsLink = est.whatsapp ? `https://wa.me/55${est.whatsapp.replace(/\D/g, '')}?text=${whatsMsg}` : null
  const placeholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(est.nome)}&size=400&background=1A1A1A&color=C9A84C&font-size=0.3`

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover gold-glow">
      {/* Banner / Cover */}
      <Link to={`/estabelecimento/${est.slug}`} className="block relative h-32 bg-lupa-black overflow-hidden">
        <img
          src={est.banner_url || est.foto_url || placeholder}
          alt={est.nome}
          className="w-full h-full object-cover opacity-80"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status badge */}
        <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold rounded-full ${est.aberto_agora ? 'bg-green-500 text-white' : 'bg-gray-800/80 text-gray-300'}`}>
          {est.aberto_agora ? 'Aberto' : 'Fechado'}
        </span>

        {/* Fav button */}
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavorite(est.id); setFav(!fav) }}
          className="absolute top-2.5 right-2.5 w-7 h-7 bg-black/30 backdrop-blur rounded-full flex items-center justify-center"
        >
          <svg className={`w-3.5 h-3.5 ${fav ? 'text-red-500 fill-red-500' : 'text-white'}`} fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {/* Verified badge */}
        {(est.verificado || est.destaque) && (
          <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-lupa-gold/90 text-lupa-black text-[9px] font-bold rounded-full flex items-center gap-0.5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307z" clipRule="evenodd" /></svg>
            Premium
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-3.5">
        <Link to={`/estabelecimento/${est.slug}`} className="flex items-start gap-2.5">
          {/* Logo */}
          <div className="w-11 h-11 -mt-8 rounded-xl bg-white shadow-md border-2 border-white flex items-center justify-center overflow-hidden shrink-0 relative z-10">
            {est.logo_url ? (
              <img src={est.logo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lupa-gold font-display text-base">{est.nome?.charAt(0)}</span>
            )}
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <h3 className="font-bold text-sm text-lupa-black truncate">{est.nome}</h3>
            <p className="text-[10px] text-lupa-gold font-medium">{est.subcategoria || categoria.nome}</p>
          </div>
        </Link>

        {est.descricao && (
          <p className="text-[11px] text-gray-400 mt-2 line-clamp-2">{est.descricao}</p>
        )}

        {/* Tags */}
        {est.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {est.tags.filter(t => !['Térreo', '1º Andar', '2º Andar'].includes(t)).slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-lupa-cream text-gray-500 text-[9px] font-medium rounded-full">{tag}</span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <Link to={`/estabelecimento/${est.slug}`} className="flex-1 py-2 bg-lupa-black text-white text-[11px] font-bold rounded-lg text-center">
            Ver perfil
          </Link>
          {whatsLink && (
            <a href={whatsLink} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} className="py-2 px-3 bg-green-500 text-white text-[11px] font-bold rounded-lg flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
              Contato
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
