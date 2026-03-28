import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../lib/format'
import { gerarCupom } from '../lib/api'
import { saveCoupon } from '../lib/favorites'

/**
 * Global offer popup — used from any page.
 * 1. If user has NOT registered (lupa_lead), shows lead capture first.
 * 2. If user IS registered, shows offer detail with WhatsApp/Coupon CTA.
 */
export default function OfferPopup({ offer, store, onClose }) {
  const [lead, setLead] = useState({ nome: '', telefone: '' })
  const [registered, setRegistered] = useState(false)
  const [coupon, setCoupon] = useState(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lupa_lead')
    if (saved) {
      setLead(JSON.parse(saved))
      setRegistered(true)
    }
  }, [])

  const handleRegister = () => {
    if (!lead.nome || !lead.telefone) return
    localStorage.setItem('lupa_lead', JSON.stringify(lead))
    // Track lead
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/analytics/track`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estabelecimento_id: store?.id, evento: 'lead_captured', metadata: { nome: lead.nome, telefone: lead.telefone, oferta: offer.titulo } }),
    }).catch(() => {})
    setRegistered(true)
  }

  const handleGetCoupon = async () => {
    setGenerating(true)
    try {
      const c = await gerarCupom({ promocao_id: offer.id })
      setCoupon(c)
      saveCoupon(c, offer.titulo, store?.nome)
    } catch (err) {
      alert(err.message)
    }
    setGenerating(false)
  }

  const est = store || offer.estabelecimentos || {}
  const whatsNum = est.whatsapp?.replace(/\D/g, '')
  const whatsMsg = encodeURIComponent(`Olá! 👋\nVi no *Jornal Lupa SJC* a oferta:\n\n🏷️ *${offer.titulo}*\n\nMeu nome: ${lead.nome}\nTelefone: ${lead.telefone}\n\nGostaria de aproveitar!`)
  const whatsLink = whatsNum ? `https://wa.me/55${whatsNum}?text=${whatsMsg}` : null
  const isWhatsApp = offer.tipo_resgate !== 'local_coupon'
  const isCoupon = offer.tipo_resgate !== 'whatsapp'

  // Coupon generated view
  if (coupon) {
    return (
      <Modal onClose={onClose}>
        <div className="p-5 text-center">
          <div className="w-16 h-16 bg-lupa-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-lupa-gold" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" /></svg>
          </div>
          <h2 className="font-display text-xl text-lupa-black mb-1">Cupom Gerado!</h2>
          <p className="text-sm text-gray-500 mb-4">{offer.titulo}</p>

          <div className="bg-lupa-cream rounded-2xl p-5 mb-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Seu código</p>
            <p className="text-3xl font-bold text-lupa-gold tracking-[0.15em] font-mono">{coupon.codigo}</p>
            {coupon.expira_em && (
              <p className="text-xs text-gray-400 mt-2">Válido até {new Date(coupon.expira_em).toLocaleDateString('pt-BR')}</p>
            )}
          </div>

          <p className="text-xs text-gray-400 mb-4">Apresente este código na loja para resgatar sua oferta</p>

          <button onClick={() => { navigator.clipboard?.writeText(coupon.codigo); alert('Código copiado!') }} className="w-full py-3 bg-lupa-black text-white font-bold rounded-xl text-sm mb-2">
            Copiar Código
          </button>
          <button onClick={onClose} className="w-full py-3 bg-lupa-cream text-gray-600 font-bold rounded-xl text-sm">
            Fechar
          </button>
        </div>
      </Modal>
    )
  }

  // Lead capture view (not registered yet)
  if (!registered) {
    return (
      <Modal onClose={onClose}>
        <div className="p-5">
          <h3 className="text-lg font-bold text-lupa-black text-center mb-1">Quase lá!</h3>
          <p className="text-xs text-gray-400 text-center mb-4">Informe seus dados para acessar as ofertas</p>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-wider">Seu nome</label>
              <input value={lead.nome} onChange={e => setLead({ ...lead, nome: e.target.value })} placeholder="Como podemos te chamar?" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm mt-1" />
            </div>
            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-wider">WhatsApp</label>
              <input value={lead.telefone} onChange={e => setLead({ ...lead, telefone: e.target.value })} placeholder="(12) 99999-9999" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm mt-1" />
            </div>
          </div>
          <button onClick={handleRegister} disabled={!lead.nome || !lead.telefone} className="w-full py-3 bg-[#075E54] text-white font-bold rounded-xl text-sm mt-4 disabled:opacity-50 min-h-[44px]">
            Acessar oferta
          </button>
          <p className="text-[9px] text-gray-400 text-center mt-2">Seus dados serão usados apenas para enviar ofertas relevantes</p>
        </div>
      </Modal>
    )
  }

  // Offer detail view (registered)
  return (
    <Modal onClose={onClose}>
      <div className="p-5">
        {offer.imagem_url && <img src={offer.imagem_url} alt="" className="w-full h-44 object-cover rounded-xl mb-4" />}
        <div className="flex items-center gap-2 mb-3">
          {offer.valor_desconto && offer.tipo_promo === 'percentage' && (
            <span className="px-2.5 py-1 bg-red-50 text-red-500 text-sm font-bold rounded-lg">-{offer.valor_desconto}%</span>
          )}
          <h2 className="font-bold text-lg text-lupa-black">{offer.titulo}</h2>
        </div>
        {offer.descricao && <p className="text-sm text-gray-500 mb-3">{offer.descricao}</p>}

        {est.nome && (
          <Link to={`/estabelecimento/${est.slug}`} onClick={onClose} className="flex items-center gap-2 mb-4 p-2 bg-lupa-cream rounded-lg">
            {est.logo_url && <img src={est.logo_url} alt="" className="w-8 h-8 rounded-full object-cover" />}
            <div>
              <span className="text-sm font-bold text-lupa-black">{est.nome}</span>
              {est.andar !== undefined && <span className="text-[10px] text-gray-400 block">{est.andar === 0 ? 'Térreo' : `${est.andar}º Andar`}</span>}
            </div>
          </Link>
        )}

        {(offer.preco_de || offer.preco_por) && (
          <div className="flex items-center gap-2 mb-4">
            {offer.preco_de && <span className="text-sm text-gray-400 line-through">R$ {Number(offer.preco_de).toFixed(2)}</span>}
            {offer.preco_por && <span className="text-xl font-bold text-lupa-gold">R$ {Number(offer.preco_por).toFixed(2)}</span>}
          </div>
        )}

        {!offer.preco_por && offer.valor_desconto && offer.tipo_promo === 'fixed_value' && (
          <div className="mb-4">
            <span className="text-xl font-bold text-lupa-gold">R$ {Number(offer.valor_desconto).toFixed(2)}</span>
          </div>
        )}

        {offer.dias_restantes !== null && offer.dias_restantes !== undefined && (
          <p className="text-xs text-gray-400 mb-4">
            {offer.dias_restantes === 0 ? 'Expira hoje!' : `Expira em ${offer.dias_restantes} dias`}
          </p>
        )}

        {offer.condicoes && <p className="text-xs text-gray-400 mb-4 italic">{offer.condicoes}</p>}

        {/* CTA Buttons */}
        <div className="flex flex-col gap-2">
          {isWhatsApp && whatsLink && (
            <a href={whatsLink} target="_blank" rel="noopener" className="w-full py-3 bg-[#25D366] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.553 4.1 1.519 5.826L.053 23.664l5.96-1.56A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.965 0-3.83-.528-5.47-1.528l-.392-.233-3.538.927.944-3.45-.256-.406A9.794 9.794 0 012.18 12c0-5.422 4.398-9.82 9.82-9.82 5.422 0 9.82 4.398 9.82 9.82 0 5.422-4.398 9.82-9.82 9.82z"/></svg>
              Aproveitar oferta
            </a>
          )}
          {isCoupon && (
            <button onClick={handleGetCoupon} disabled={generating || offer.esgotado} className="w-full py-3 btn-gold font-bold rounded-xl text-sm disabled:opacity-50">
              {generating ? 'Gerando...' : offer.esgotado ? 'Esgotado' : 'Gerar Cupom'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50" />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 z-10">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        {children}
      </div>
    </div>
  )
}
