import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPromocoes, gerarCupom } from '../lib/api'
import { saveCoupon } from '../lib/favorites'

const FLOOR_FILTERS = [
  { label: 'Todas', value: '' },
  { label: 'Térreo', value: '0' },
  { label: '1º Andar', value: '1' },
  { label: '2º Andar', value: '2' },
]

export default function Ofertas() {
  const [promos, setPromos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState(null)
  const [coupon, setCoupon] = useState(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    getPromocoes().then(setPromos).catch(console.error).finally(() => setLoading(false))
  }, [])

  const filtered = filter ? promos.filter(p => p.estabelecimentos?.andar === Number(filter)) : promos

  const handleGetCoupon = async (promoId) => {
    setGenerating(true)
    try {
      const c = await gerarCupom({ promocao_id: promoId })
      setCoupon(c)
      saveCoupon(c, selected?.titulo, selected?.estabelecimentos?.nome)
    } catch (err) {
      alert(err.message)
    }
    setGenerating(false)
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 rounded-full border-[3px] border-lupa-gold/30 border-t-lupa-gold animate-spin" />
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="font-display text-2xl text-lupa-black mb-1">Ofertas</h1>
      <p className="text-sm text-gray-400 mb-5">{promos.length} ofertas disponíveis</p>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
        {FLOOR_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition ${
              filter === f.value ? 'bg-lupa-black text-white' : 'bg-lupa-cream text-gray-500 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-10">Nenhuma oferta disponível no momento</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(promo => (
            <PromoCard key={promo.id} promo={promo} onSelect={() => setSelected(promo)} />
          ))}
        </div>
      )}

      {/* Promo Detail Modal */}
      {selected && !coupon && (
        <Modal onClose={() => setSelected(null)}>
          <div className="p-5">
            {selected.imagem_url && <img src={selected.imagem_url} alt="" className="w-full h-40 object-cover rounded-xl mb-4" />}
            <div className="flex items-center gap-2 mb-3">
              {selected.valor_desconto && selected.tipo_promo === 'percentage' && (
                <span className="px-2.5 py-1 bg-red-50 text-red-500 text-sm font-bold rounded-lg">-{selected.valor_desconto}%</span>
              )}
              <h2 className="font-bold text-lg text-lupa-black">{selected.titulo}</h2>
            </div>
            {selected.descricao && <p className="text-sm text-gray-500 mb-3">{selected.descricao}</p>}

            {selected.estabelecimentos && (
              <Link to={`/estabelecimento/${selected.estabelecimentos.slug}`} className="flex items-center gap-2 mb-4 p-2 bg-lupa-cream rounded-lg">
                {selected.estabelecimentos.logo_url && <img src={selected.estabelecimentos.logo_url} alt="" className="w-8 h-8 rounded-full object-cover" />}
                <div>
                  <span className="text-sm font-bold text-lupa-black">{selected.estabelecimentos.nome}</span>
                  <span className="text-[10px] text-gray-400 block">{selected.estabelecimentos.andar === 0 ? 'Térreo' : `${selected.estabelecimentos.andar}º Andar`}</span>
                </div>
              </Link>
            )}

            {(selected.preco_de || selected.preco_por) && (
              <div className="flex items-center gap-2 mb-4">
                {selected.preco_de && <span className="text-sm text-gray-400 line-through">R$ {Number(selected.preco_de).toFixed(2)}</span>}
                {selected.preco_por && <span className="text-xl font-bold text-lupa-gold">R$ {Number(selected.preco_por).toFixed(2)}</span>}
              </div>
            )}

            {selected.dias_restantes !== null && (
              <p className="text-xs text-gray-400 mb-4">
                {selected.dias_restantes === 0 ? 'Expira hoje!' : `Expira em ${selected.dias_restantes} dias`}
              </p>
            )}

            {selected.condicoes && <p className="text-xs text-gray-400 mb-4 italic">{selected.condicoes}</p>}

            <div className="flex gap-2">
              <button
                onClick={() => handleGetCoupon(selected.id)}
                disabled={generating || selected.esgotado}
                className="flex-1 py-3 bg-lupa-gold text-lupa-black font-bold rounded-xl text-sm disabled:opacity-50"
              >
                {generating ? 'Gerando...' : selected.esgotado ? 'Esgotado' : 'Pegar Cupom'}
              </button>
              {selected.estabelecimentos?.whatsapp && (
                <a
                  href={`https://wa.me/55${selected.estabelecimentos.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Vi a promoção *${selected.titulo}* no Jornal Lupa e gostaria de aproveitar!`)}`}
                  target="_blank"
                  rel="noopener"
                  className="py-3 px-4 bg-green-500 text-white font-bold rounded-xl text-sm flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Coupon Generated Modal */}
      {coupon && (
        <Modal onClose={() => { setCoupon(null); setSelected(null) }}>
          <div className="p-5 text-center">
            <div className="w-16 h-16 bg-lupa-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-lupa-gold" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" /></svg>
            </div>
            <h2 className="font-display text-xl text-lupa-black mb-1">Cupom Gerado!</h2>
            {selected && <p className="text-sm text-gray-500 mb-4">{selected.titulo}</p>}

            <div className="bg-lupa-cream rounded-2xl p-5 mb-4">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Seu código</p>
              <p className="text-3xl font-bold text-lupa-gold tracking-[0.15em] font-mono">{coupon.codigo}</p>
              {coupon.expira_em && (
                <p className="text-xs text-gray-400 mt-2">Válido até {new Date(coupon.expira_em).toLocaleDateString('pt-BR')}</p>
              )}
            </div>

            <p className="text-xs text-gray-400 mb-4">Apresente este código na loja para resgatar sua oferta</p>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(coupon.codigo)
                alert('Código copiado!')
              }}
              className="w-full py-3 bg-lupa-black text-white font-bold rounded-xl text-sm mb-2"
            >
              Copiar Código
            </button>
            <button
              onClick={() => { setCoupon(null); setSelected(null) }}
              className="w-full py-3 bg-lupa-cream text-gray-600 font-bold rounded-xl text-sm"
            >
              Fechar
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// Promo Card
function PromoCard({ promo, onSelect }) {
  const est = promo.estabelecimentos || {}
  return (
    <button onClick={onSelect} className="bg-white rounded-xl border border-gray-100 overflow-hidden card-hover text-left w-full">
      {promo.imagem_url && <img src={promo.imagem_url} alt="" className="w-full h-32 object-cover" />}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-lupa-black line-clamp-2">{promo.titulo}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              {est.logo_url && <img src={est.logo_url} alt="" className="w-5 h-5 rounded-full object-cover" />}
              <span className="text-xs text-gray-400">{est.nome}</span>
            </div>
          </div>
          {promo.valor_desconto && promo.tipo_promo === 'percentage' && (
            <span className="px-2 py-1 bg-red-50 text-red-500 text-xs font-bold rounded-lg shrink-0">-{promo.valor_desconto}%</span>
          )}
        </div>
        {(promo.preco_de || promo.preco_por) && (
          <div className="flex items-center gap-2 mt-2">
            {promo.preco_de && <span className="text-xs text-gray-400 line-through">R$ {Number(promo.preco_de).toFixed(2)}</span>}
            {promo.preco_por && <span className="text-sm font-bold text-lupa-gold">R$ {Number(promo.preco_por).toFixed(2)}</span>}
          </div>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-[10px] text-gray-400">
            {promo.dias_restantes === 0 ? 'Expira hoje!' : promo.dias_restantes ? `${promo.dias_restantes}d restantes` : ''}
          </span>
          <span className="text-[10px] text-lupa-gold font-bold uppercase">Ver oferta →</span>
        </div>
      </div>
    </button>
  )
}

// Simple Modal
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50" />
      <div
        className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 z-10">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        {children}
      </div>
    </div>
  )
}
