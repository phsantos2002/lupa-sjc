import { Link } from 'react-router-dom'

export default function EstabelecimentoCard({ est }) {
  const categoria = est.categorias || {}
  const whatsLink = est.whatsapp ? `https://wa.me/55${est.whatsapp.replace(/\D/g, '')}` : null

  return (
    <div className="bg-white rounded-xl overflow-hidden card-hover border border-gray-100 gold-glow flex items-center gap-0">
      {/* Main link area */}
      <Link to={`/estabelecimento/${est.slug}`} className="flex items-center gap-3 p-3 flex-1 min-w-0">
        {/* Logo */}
        <div className="w-12 h-12 rounded-full bg-lupa-cream flex items-center justify-center shrink-0 overflow-hidden border-2 border-lupa-gold/15">
          {est.logo_url ? (
            <img src={est.logo_url} alt={est.nome} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lupa-gold font-display text-base">{est.nome?.charAt(0)}</span>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <h3 className="font-bold text-sm text-lupa-black truncate">{est.nome}</h3>
            {(est.verificado || est.destaque) && (
              <svg className="w-3.5 h-3.5 text-lupa-gold shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-lupa-gold font-medium">{est.subcategoria || categoria.nome}</span>
            {est.aberto_agora && (
              <span className="flex items-center gap-0.5 text-[10px] text-green-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Aberto
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </Link>

      {/* WhatsApp quick button */}
      {whatsLink && (
        <a
          href={whatsLink}
          target="_blank"
          rel="noopener"
          onClick={e => e.stopPropagation()}
          className="w-10 h-full flex items-center justify-center border-l border-gray-100 text-green-500 hover:bg-green-50 transition shrink-0"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
        </a>
      )}
    </div>
  )
}
