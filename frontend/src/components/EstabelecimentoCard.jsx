import { Link } from 'react-router-dom'

export default function EstabelecimentoCard({ est }) {
  const categoria = est.categorias || {}
  const fotoPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(est.nome)}&size=400&background=0D9488&color=fff&font-size=0.33`

  return (
    <Link
      to={`/estabelecimento/${est.slug}`}
      className="block bg-white rounded-2xl overflow-hidden shadow-sm card-hover border border-gray-100"
    >
      {/* Foto */}
      <div className="relative h-44 bg-gray-100">
        <img
          src={est.foto_url || fotoPlaceholder}
          alt={est.nome}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Favorito */}
        <button className="absolute top-3 left-3 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {/* Status aberto/fechado */}
        <span className={`absolute top-3 right-3 px-2.5 py-1 text-[11px] font-bold rounded-full ${
          est.aberto_agora
            ? 'bg-green-500 text-white'
            : 'bg-gray-800/70 text-white'
        }`}>
          {est.aberto_agora ? 'Aberto' : 'Fechado'}
        </span>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <div className="flex items-start gap-2.5">
          {/* Logo */}
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg shrink-0 overflow-hidden border border-gray-200">
            {est.logo_url ? (
              <img src={est.logo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-sm font-bold">{est.nome?.charAt(0)}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-gray-900 truncate">{est.nome}</h3>
              {est.destaque && (
                <svg className="w-4 h-4 text-primary-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            {categoria.nome && (
              <span className="text-xs text-primary-600 font-medium">{categoria.nome}</span>
            )}
          </div>
        </div>

        {est.descricao && (
          <p className="text-xs text-gray-500 mt-2.5 line-clamp-2">{est.descricao}</p>
        )}

        {est.tags && est.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {est.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-primary-50 text-primary-700 text-[10px] font-semibold rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {est.endereco && (
          <div className="flex items-start gap-1.5 mt-2.5 text-[11px] text-gray-400">
            <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span className="truncate">{est.endereco}</span>
          </div>
        )}

        {est.telefone && (
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <span>{est.telefone}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
