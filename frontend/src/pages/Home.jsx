import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPromocoes } from '../lib/api'

export default function Home() {
  const [ofertas, setOfertas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPromocoes().then(setOfertas).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 rounded-full border-[3px] border-tauste-orange/30 border-t-tauste-orange animate-spin" /></div>

  return (
    <div className="max-w-5xl mx-auto px-4 pb-8">
      {/* Header */}
      <div className="pt-4 pb-3">
        <h1 className="text-xl font-bold text-lupa-black">Ofertas</h1>
        <p className="text-xs text-gray-400 mt-0.5">{ofertas.length} ofertas disponíveis no Tauste SJC</p>
      </div>

      {/* Offer cards grid */}
      {ofertas.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-tauste-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-tauste-orange" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /></svg>
          </div>
          <p className="text-gray-400 text-sm">Nenhuma oferta disponível no momento</p>
          <p className="text-gray-300 text-xs mt-1">Volte em breve!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ofertas.map(o => <OfferCard key={o.id} offer={o} />)}
        </div>
      )}

      {/* CTA */}
      <section className="bg-tauste-blue rounded-2xl p-6 text-center mt-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(245,132,31,0.5) 0%, transparent 70%)' }} />
        <div className="relative">
          <h2 className="text-lg font-bold text-white">Quer aparecer por aqui?</h2>
          <p className="text-white/50 text-xs mt-1.5">Entre em contato conosco agora mesmo</p>
          <Link to="/parceiro" className="inline-block mt-4 px-5 py-2 bg-tauste-orange text-white font-bold rounded-full hover:bg-tauste-orange-light transition text-sm">Seja Parceiro</Link>
        </div>
      </section>
    </div>
  )
}

function OfferCard({ offer }) {
  const est = offer.estabelecimentos || {}
  const whatsMsg = encodeURIComponent(`Olá! 👋\nVi no *Jornal Lupa SJC* a oferta:\n\n🏷️ *${offer.titulo}*\n\nGostaria de aproveitar!`)
  const whatsLink = est.whatsapp ? `https://wa.me/55${est.whatsapp?.replace(/\D/g, '')}?text=${whatsMsg}` : null

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm card-hover">
      {/* Photo */}
      {offer.imagem_url ? (
        <img src={offer.imagem_url} alt="" className="w-full h-28 object-cover" loading="lazy" />
      ) : (
        <div className="w-full h-24 bg-gradient-to-br from-tauste-blue to-tauste-blue-light flex items-center justify-center">
          {est.logo_url ? <img src={est.logo_url} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white/20" /> : <span className="text-white/40 text-2xl font-bold">{est.nome?.charAt(0)}</span>}
        </div>
      )}

      <div className="p-2.5">
        {/* Store */}
        <div className="flex items-center gap-1.5 mb-1">
          {est.logo_url && <img src={est.logo_url} alt="" className="w-4 h-4 rounded-full object-cover" />}
          <span className="text-[9px] text-gray-400 truncate">{est.nome}</span>
        </div>

        {/* Title */}
        <h3 className="text-xs font-bold text-lupa-black line-clamp-2 leading-tight">{offer.titulo}</h3>

        {/* Price */}
        <div className="flex items-center gap-1.5 mt-1">
          {offer.valor_desconto && offer.tipo_promo === 'percentage' && (
            <span className="px-1.5 py-0.5 bg-tauste-orange text-white text-[9px] font-bold rounded">-{offer.valor_desconto}%</span>
          )}
          {offer.preco_de && <span className="text-[9px] text-gray-400 line-through">R${Number(offer.preco_de).toFixed(0)}</span>}
          {offer.preco_por && <span className="text-xs font-bold text-tauste-orange">R$ {Number(offer.preco_por).toFixed(2)}</span>}
        </div>

        {/* Days + CTA */}
        <div className="mt-2">
          {offer.dias_restantes !== null && offer.dias_restantes !== undefined && (
            <p className="text-[9px] text-gray-400 mb-1.5">{offer.dias_restantes === 0 ? 'Expira hoje!' : `${offer.dias_restantes}d restantes`}</p>
          )}
          {whatsLink ? (
            <a href={whatsLink} target="_blank" rel="noopener" className="block w-full py-1.5 bg-green-500 text-white text-[10px] font-bold rounded-md text-center">
              Quero essa oferta
            </a>
          ) : (
            <Link to="/ofertas" className="block w-full py-1.5 bg-tauste-blue text-white text-[10px] font-bold rounded-md text-center">
              Ver oferta
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
