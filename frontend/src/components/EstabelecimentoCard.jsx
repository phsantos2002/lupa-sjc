import { Link } from 'react-router-dom'

export default function EstabelecimentoCard({ est }) {
  const categoria = est.categorias || {}

  return (
    <Link
      to={`/estabelecimento/${est.slug}`}
      className="block bg-white rounded-xl overflow-hidden card-hover border border-gray-100 gold-glow"
    >
      <div className="p-3.5 flex items-center gap-3">
        {/* Logo circular */}
        <div className="w-14 h-14 rounded-full bg-lupa-cream flex items-center justify-center shrink-0 overflow-hidden border-2 border-lupa-gold/20">
          {est.logo_url ? (
            <img src={est.logo_url} alt={est.nome} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lupa-gold font-display font-bold text-lg">{est.nome?.charAt(0)}</span>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-sm text-lupa-black truncate">{est.nome}</h3>
            {est.destaque && (
              <svg className="w-4 h-4 text-lupa-gold shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          {categoria.nome && (
            <span className="text-[11px] text-lupa-gold font-medium">{categoria.nome}</span>
          )}
          {est.descricao && (
            <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{est.descricao}</p>
          )}
        </div>

        {/* Arrow */}
        <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </Link>
  )
}
