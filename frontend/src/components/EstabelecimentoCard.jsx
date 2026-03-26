import { Link } from 'react-router-dom'

export default function EstabelecimentoCard({ est, compact = false }) {
  const categoria = est.categorias || {}
  const fotoPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(est.nome)}&size=400&background=0D9488&color=fff&font-size=0.33`

  return (
    <Link
      to={`/estabelecimento/${est.slug}`}
      className="block bg-white rounded-xl overflow-hidden shadow-sm card-hover border border-gray-100"
    >
      {/* Foto */}
      <div className="relative h-40 bg-gray-100">
        <img
          src={est.foto_url || fotoPlaceholder}
          alt={est.nome}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Badge premium */}
        {est.destaque && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary-500 text-white text-[10px] font-bold rounded-full uppercase">
            Premium
          </span>
        )}

        {/* Status aberto/fechado */}
        <span className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded-full ${
          est.aberto_agora
            ? 'bg-green-500 text-white'
            : 'bg-gray-800/70 text-white'
        }`}>
          {est.aberto_agora ? 'Aberto' : 'Fechado'}
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start gap-2">
          {/* Logo pequeno */}
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg shrink-0 overflow-hidden border border-gray-200">
            {est.logo_url ? (
              <img src={est.logo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span>{categoria.icone || '🏪'}</span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-gray-900 truncate">{est.nome}</h3>
            {categoria.nome && (
              <span className="text-xs text-primary-600 font-medium">{categoria.nome}</span>
            )}
          </div>
        </div>

        {!compact && est.descricao && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{est.descricao}</p>
        )}

        {est.tags && est.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {est.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-primary-50 text-primary-700 text-[10px] font-medium rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {est.endereco && (
          <div className="flex items-start gap-1 mt-2 text-[11px] text-gray-400">
            <svg className="w-3 h-3 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{est.endereco}</span>
          </div>
        )}

        {est.telefone && (
          <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400">
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{est.telefone}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
