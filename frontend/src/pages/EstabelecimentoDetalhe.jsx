import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getEstabelecimento } from '../lib/api'
import { isFavorite, toggleFavorite } from '../lib/favorites'
import { trackEvent } from '../lib/analytics'
import { formatPrice } from '../lib/format'
import OfferCard from '../components/OfferCard'
import OfferPopup from '../components/OfferPopup'

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

function isOpenNow(horarios) {
  if (!horarios?.length) return null
  const now = new Date()
  const brTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
  const day = brTime.getDay()
  const h = horarios.find(h => h.dia_semana === day)
  if (!h || h.fechado) return { open: false, next: null }
  const cur = brTime.getHours() * 60 + brTime.getMinutes()
  const [oh, om] = (h.hora_abre || '09:00').split(':').map(Number)
  const [ch, cm] = (h.hora_fecha || '21:00').split(':').map(Number)
  const open = cur >= oh * 60 + om && cur < ch * 60 + cm
  return { open, closes: h.hora_fecha, opens: h.hora_abre }
}

export default function EstabelecimentoDetalhe() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [est, setEst] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('sobre')
  const [photoIdx, setPhotoIdx] = useState(0)
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [showLeadGate, setShowLeadGate] = useState(false)
  const [pendingWhatsLink, setPendingWhatsLink] = useState(null)

  useEffect(() => {
    setLoading(true)
    getEstabelecimento(slug).then(data => { setEst(data); if (data?.id) trackEvent(data.id, 'profile_view') }).catch(console.error).finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 rounded-full border-[3px] border-lupa-gold/30 border-t-lupa-gold animate-spin" />
    </div>
  )

  if (!est) return <p className="text-center py-10 text-gray-400">Loja não encontrada</p>

  const cat = est.categorias || {}
  const photos = est.fotos || []
  const horarios = est.horarios || []
  const status = isOpenNow(horarios)
  const whatsLink = est.whatsapp ? `https://wa.me/55${est.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Vi vocês no Lupa SJC 🔍`)}` : null
  const bannerImg = photos.length > 0 ? photos[photoIdx]?.url : (est.banner_url || est.foto_url)
  const placeholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(est.nome)}&size=800&background=1B2A6B&color=fff&font-size=0.25`

  // Determine which content tabs to show
  const tabs = [{ id: 'sobre', label: 'Sobre' }]
  if (est.tipo_negocio === 'food' && est.cardapio?.length > 0) tabs.push({ id: 'cardapio', label: 'Cardápio' })
  if (est.tipo_negocio === 'service' && est.servicos?.length > 0) tabs.push({ id: 'servicos', label: 'Serviços' })
  if (est.tipo_negocio === 'product' && est.produtos?.length > 0) tabs.push({ id: 'produtos', label: 'Produtos' })
  if (est.tipo_negocio === 'pharmacy' && est.produtos?.length > 0) tabs.push({ id: 'produtos', label: 'Produtos' })
  if (photos.length > 1) tabs.push({ id: 'fotos', label: 'Fotos' })

  const floorLabel = est.andar === 0 ? 'Térreo' : est.andar === 1 ? '1º Andar' : est.andar === 2 ? '2º Andar' : ''

  return (
    <div className="max-w-3xl mx-auto bg-white min-h-screen">
      {/* Banner / Gallery */}
      <div className="relative h-56 sm:h-72 bg-lupa-black">
        <img src={bannerImg || placeholder} alt={est.nome} className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Nav */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <button onClick={() => navigate(-1)} className="w-9 h-9 bg-black/40 backdrop-blur rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex gap-2">
            <FavButton storeId={est.id} />
            <button onClick={() => { if (navigator.share) navigator.share({ title: est.nome, url: window.location.href }) }} className="w-9 h-9 bg-black/40 backdrop-blur rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>
            </button>
          </div>
        </div>

        {/* Photo indicators */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {photos.map((_, i) => (
              <button key={i} onClick={() => setPhotoIdx(i)} className={`w-2 h-2 rounded-full transition ${i === photoIdx ? 'bg-lupa-gold w-5' : 'bg-white/50'}`} />
            ))}
          </div>
        )}
      </div>

      {/* Store header — name BELOW cover */}
      <div className="px-4 pt-4 relative">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-xl bg-white shadow-md border-2 border-white flex items-center justify-center overflow-hidden shrink-0 -mt-12">
            {est.logo_url ? (
              <img src={est.logo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-tauste-blue font-bold text-xl">{est.nome?.charAt(0)}</span>
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-lupa-black truncate">{est.nome}</h1>
            <p className="text-xs text-gray-500">{cat.nome}{est.subcategoria ? ` • ${est.subcategoria}` : ''}</p>
          </div>
        </div>

        {/* Status + Location */}
        <div className="flex flex-wrap items-center gap-3 mt-2">
          {status && (
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${status.open ? 'text-green-600' : 'text-red-500'}`}>
              <span className={`w-2 h-2 rounded-full ${status.open ? 'bg-[#075E54]' : 'bg-red-500'}`} />
              {status.open ? `Aberto agora` : 'Fechado'}
              {status.open && status.closes && <span className="text-gray-400 font-normal">• fecha às {status.closes?.slice(0, 5)}</span>}
            </span>
          )}
          {floorLabel && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
              {floorLabel}{est.andar_detalhe ? ` — ${est.andar_detalhe}` : ''}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          {/* WhatsApp — requires lead registration */}
          {whatsLink ? (
            <button onClick={() => {
              const saved = localStorage.getItem('lupa_lead')
              if (saved) {
                const lead = JSON.parse(saved)
                const msg = encodeURIComponent(`Olá! Vi vocês no Lupa SJC 🔍\n\nMeu nome: ${lead.nome}\nTelefone: ${lead.telefone}`)
                window.open(`https://wa.me/55${est.whatsapp.replace(/\D/g, '')}?text=${msg}`, '_blank')
              } else {
                setPendingWhatsLink(whatsLink)
                setShowLeadGate(true)
              }
            }} className="flex-1 py-2.5 bg-[#25D366] text-white text-sm font-bold rounded-xl text-center flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.553 4.1 1.519 5.826L.053 23.664l5.96-1.56A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.965 0-3.83-.528-5.47-1.528l-.392-.233-3.538.927.944-3.45-.256-.406A9.794 9.794 0 012.18 12c0-5.422 4.398-9.82 9.82-9.82 5.422 0 9.82 4.398 9.82 9.82 0 5.422-4.398 9.82-9.82 9.82z"/></svg>
              WhatsApp
            </button>
          ) : (
            <div className="flex-1 py-2.5 bg-gray-300 text-white text-sm font-bold rounded-xl text-center flex items-center justify-center gap-2 cursor-not-allowed opacity-60">
              <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              WhatsApp
            </div>
          )}
          {est.telefone && (
            <a href={`tel:${est.telefone}`} className="py-2.5 px-4 bg-lupa-cream text-lupa-black text-sm font-bold rounded-xl flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
              Ligar
            </a>
          )}
          {est.instagram && (
            <button onClick={() => {
              const saved = localStorage.getItem('lupa_lead')
              if (saved) {
                window.open(`https://instagram.com/${est.instagram.replace('@', '')}`, '_blank')
              } else {
                setPendingWhatsLink(`https://instagram.com/${est.instagram.replace('@', '')}`)
                setShowLeadGate(true)
              }
            }} className="py-2.5 px-4 bg-lupa-cream text-lupa-black text-sm font-bold rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
            </button>
          )}
        </div>
      </div>

      {/* Inline offers (before tabs) */}
      {est.promocoes?.filter(p => p.ativo !== false).length > 0 && (
        <div className="px-4 mt-4">
          <h3 className="text-sm font-bold text-lupa-black mb-3">Ofertas desta loja</h3>
          <div className="grid grid-cols-2 gap-3">
            {est.promocoes.filter(p => p.ativo !== false).sort((a, b) => (b.principal ? 1 : 0) - (a.principal ? 1 : 0)).slice(0, 20).map(p => (
              <OfferCard key={p.id} offer={p} store={est} onSelect={(o) => setSelectedOffer(o)} />
            ))}
          </div>
        </div>
      )}

      {/* Offer Popup */}
      {selectedOffer && (
        <OfferPopup offer={selectedOffer} store={est} onClose={() => setSelectedOffer(null)} />
      )}

      {/* Tabs */}
      <div className="mt-4 border-b border-gray-100 px-4">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                tab === t.id
                  ? 'border-tauste-orange text-lupa-black'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-4 py-5 pb-24">
        {tab === 'sobre' && <TabSobre est={est} horarios={horarios} floorLabel={floorLabel} />}
        {tab === 'produtos' && <TabProdutos items={est.produtos || []} whatsLink={whatsLink} />}
        {tab === 'servicos' && <TabServicos items={est.servicos || []} whatsLink={whatsLink} />}
        {tab === 'cardapio' && <TabCardapio items={est.cardapio || []} />}
        {tab === 'fotos' && <TabFotos photos={photos} />}
      </div>

      {/* Lead Gate Popup for WhatsApp/Instagram */}
      {showLeadGate && <LeadGatePopup store={est} destination={pendingWhatsLink?.includes('instagram.com') ? 'instagram' : 'whatsapp'} onClose={() => setShowLeadGate(false)} onSuccess={(lead) => {
        setShowLeadGate(false)
        if (pendingWhatsLink?.includes('instagram.com')) {
          window.open(pendingWhatsLink, '_blank')
        } else if (est.whatsapp) {
          const msg = encodeURIComponent(`Olá! Vi vocês no Lupa SJC 🔍\n\nMeu nome: ${lead.nome}\nTelefone: ${lead.telefone}`)
          window.open(`https://wa.me/55${est.whatsapp.replace(/\D/g, '')}?text=${msg}`, '_blank')
        }
        setPendingWhatsLink(null)
      }} />}

    </div>
  )
}

// ===== TAB SOBRE =====
function TabSobre({ est, horarios, floorLabel }) {
  const today = new Date().getDay()
  return (
    <div className="space-y-6">
      {(est.descricao_completa || est.descricao) && (
        <div>
          <h3 className="font-bold text-sm text-lupa-black mb-2">Sobre</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{est.descricao_completa || est.descricao}</p>
        </div>
      )}

      {horarios.length > 0 && (
        <div>
          <h3 className="font-bold text-sm text-lupa-black mb-2">Horário de Funcionamento</h3>
          <div className="space-y-1">
            {horarios.map(h => (
              <div key={h.dia_semana} className={`flex justify-between text-sm py-1.5 px-3 rounded-lg ${h.dia_semana === today ? 'bg-lupa-cream font-medium' : ''}`}>
                <span className={h.dia_semana === today ? 'text-lupa-black' : 'text-gray-500'}>{DIAS[h.dia_semana]}</span>
                <span className={h.fechado ? 'text-red-400' : h.dia_semana === today ? 'text-lupa-gold font-bold' : 'text-gray-600'}>
                  {h.fechado ? 'Fechado' : `${h.hora_abre?.slice(0, 5)} - ${h.hora_fecha?.slice(0, 5)}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {est.endereco && (
        <div>
          <h3 className="font-bold text-sm text-lupa-black mb-2">Localização</h3>
          <div className="flex items-start gap-3 bg-lupa-cream rounded-xl p-3">
            <div className="w-10 h-10 rounded-lg bg-lupa-gold/10 flex items-center justify-center text-lupa-gold font-bold shrink-0">
              {est.andar === 0 ? 'T' : est.andar}
            </div>
            <div>
              <p className="text-sm font-medium text-lupa-black">{floorLabel}</p>
              <p className="text-xs text-gray-500">{est.endereco}</p>
              {est.andar_detalhe && <p className="text-xs text-gray-400 mt-0.5">{est.andar_detalhe}</p>}
            </div>
          </div>
        </div>
      )}

      {est.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {est.tags.filter(t => !['Térreo', '1º Andar', '2º Andar'].includes(t)).map(tag => (
            <span key={tag} className="px-3 py-1 bg-lupa-cream text-lupa-black text-xs font-medium rounded-full">{tag}</span>
          ))}
        </div>
      )}
    </div>
  )
}

// ===== TAB PRODUTOS =====
function TabProdutos({ items, whatsLink }) {
  const cats = [...new Set(items.map(i => i.categoria).filter(Boolean))]
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? items : items.filter(i => i.categoria === filter)

  return (
    <div>
      {cats.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
          <button onClick={() => setFilter('all')} className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap ${filter === 'all' ? 'bg-lupa-black text-white' : 'bg-gray-100 text-gray-500'}`}>Todos</button>
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap ${filter === c ? 'bg-lupa-black text-white' : 'bg-gray-100 text-gray-500'}`}>{c}</button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map(p => (
          <div key={p.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden card-hover">
            {p.imagem_url && <img src={p.imagem_url} alt={p.nome} className="w-full h-28 object-cover" />}
            <div className="p-2.5">
              <div className="flex gap-1 mb-1">
                {p.novo && <span className="px-1.5 py-0.5 bg-lupa-gold/10 text-lupa-gold text-[9px] font-bold rounded">NOVO</span>}
                {p.preco_promocional && <span className="px-1.5 py-0.5 bg-red-50 text-red-500 text-[9px] font-bold rounded">PROMO</span>}
              </div>
              <h4 className="text-xs font-bold text-lupa-black line-clamp-2">{p.nome}</h4>
              {p.descricao && <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{p.descricao}</p>}
              <div className="flex items-center gap-1.5 mt-1.5">
                {p.preco_promocional ? (
                  <>
                    <span className="text-[10px] text-gray-400 line-through">R$ {Number(p.preco).toFixed(2)}</span>
                    <span className="text-sm font-bold text-lupa-gold">R$ {Number(p.preco_promocional).toFixed(2)}</span>
                  </>
                ) : p.preco ? (
                  <span className="text-sm font-bold text-lupa-black">R$ {Number(p.preco).toFixed(2)}</span>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ===== TAB SERVIÇOS =====
function TabServicos({ items, whatsLink }) {
  return (
    <div className="space-y-3">
      {items.map(s => (
        <div key={s.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-lupa-black">{s.nome}</h4>
            {s.descricao && <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{s.descricao}</p>}
            <div className="flex items-center gap-2 mt-2">
              {s.preco ? (
                <span className="text-sm font-bold text-lupa-gold">R$ {Number(s.preco).toFixed(2)}</span>
              ) : s.preco_label ? (
                <span className="text-xs text-gray-500">{s.preco_label}</span>
              ) : (
                <span className="text-xs text-gray-400">Consulte</span>
              )}
              {s.duracao_minutos && (
                <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {s.duracao_minutos}min
                </span>
              )}
            </div>
          </div>
          {whatsLink && (
            <a href={`${whatsLink.split('?')[0]}?text=${encodeURIComponent(`Olá! Gostaria de agendar: ${s.nome}`)}`} target="_blank" rel="noopener" className="px-3 py-2 bg-[#075E54] text-white text-[10px] font-bold rounded-lg whitespace-nowrap">
              Agendar
            </a>
          )}
        </div>
      ))}
    </div>
  )
}

// ===== TAB CARDÁPIO =====
function TabCardapio({ items }) {
  const sections = [...new Set(items.map(i => i.secao))]
  return (
    <div className="space-y-6">
      {sections.map(sec => (
        <div key={sec}>
          <h3 className="font-bold text-sm text-lupa-black mb-3 uppercase tracking-wider">{sec}</h3>
          <div className="space-y-2">
            {items.filter(i => i.secao === sec).map(item => (
              <div key={item.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3">
                {item.imagem_url && <img src={item.imagem_url} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-lupa-black truncate">{item.nome}</h4>
                    {item.popular && <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-bold rounded">TOP</span>}
                    {item.novo && <span className="px-1.5 py-0.5 bg-lupa-gold/10 text-lupa-gold text-[9px] font-bold rounded">NOVO</span>}
                  </div>
                  {item.descricao && <p className="text-[10px] text-gray-400 line-clamp-1">{item.descricao}</p>}
                </div>
                <span className="text-sm font-bold text-lupa-gold whitespace-nowrap">R$ {Number(item.preco).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ===== TAB PROMOÇÕES =====
function TabPromos({ items, whatsLink, storeName }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 text-sm">Nenhuma oferta no momento</p>
        <p className="text-gray-300 text-xs mt-1">Volte em breve para conferir as promoções!</p>
      </div>
    )
  }
  return (
    <div className="space-y-3">
      {items.map(p => {
        const offerWhats = whatsLink ? `${whatsLink.split('?')[0]}?text=${encodeURIComponent(`Olá! 👋\nVi no *Jornal Lupa SJC* a oferta:\n\n🏷️ *${p.titulo}*\n\nGostaria de aproveitar!`)}` : null
        return (
          <div key={p.id} className="bg-white border border-gray-100 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-lupa-black">{p.titulo}</h4>
                {p.descricao && <p className="text-xs text-gray-400 mt-1">{p.descricao}</p>}
              </div>
              {p.valor_desconto && p.tipo_promo === 'percentage' && (
                <span className="px-2 py-0.5 bg-tauste-orange/10 text-tauste-orange text-[10px] font-bold rounded-full">-{p.valor_desconto}%</span>
              )}
            </div>
            {(p.preco_de || p.preco_por) && (
              <div className="flex items-center gap-2 mt-2">
                {p.preco_de && <span className="text-xs text-gray-400 line-through">R$ {Number(p.preco_de).toFixed(2)}</span>}
                {p.preco_por && <span className="text-lg font-bold text-tauste-orange">R$ {Number(p.preco_por).toFixed(2)}</span>}
              </div>
            )}
            {offerWhats && (
              <a href={offerWhats} target="_blank" rel="noopener" className="flex items-center justify-center gap-1.5 mt-3 py-2 bg-[#075E54] text-white text-xs font-bold rounded-lg w-full hover:bg-green-600 transition">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                Quero essa oferta
              </a>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ===== FAV BUTTON =====
function FavButton({ storeId }) {
  const [fav, setFav] = useState(isFavorite(storeId))
  return (
    <button onClick={() => { toggleFavorite(storeId); setFav(!fav) }} className="w-9 h-9 bg-black/40 backdrop-blur rounded-full flex items-center justify-center transition">
      <svg className={`w-4 h-4 transition ${fav ? 'text-red-500 fill-red-500' : 'text-white'}`} fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    </button>
  )
}


// ===== TAB FOTOS =====
function TabFotos({ photos }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {photos.map(p => (
        <div key={p.id} className="rounded-xl overflow-hidden">
          <img src={p.url} alt={p.legenda || ''} className="w-full h-36 object-cover" />
          {p.legenda && <p className="text-[10px] text-gray-400 mt-1 px-1">{p.legenda}</p>}
        </div>
      ))}
    </div>
  )
}

// ===== LEAD GATE POPUP =====
function LeadGatePopup({ store, destination = 'whatsapp', onClose, onSuccess }) {
  const [lead, setLead] = useState({ nome: '', telefone: '' })

  const handleSubmit = () => {
    if (!lead.nome || !lead.telefone) return
    localStorage.setItem('lupa_lead', JSON.stringify(lead))
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/analytics/track`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estabelecimento_id: store?.id, evento: 'lead_captured', metadata: { nome: lead.nome, telefone: lead.telefone } }),
    }).catch(() => {})
    onSuccess(lead)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50" />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 z-10">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="p-5">
          <h3 className="text-lg font-bold text-lupa-black text-center mb-1">Quase lá!</h3>
          <p className="text-xs text-gray-400 text-center mb-4">Informe seus dados para continuar</p>
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
          <button onClick={handleSubmit} disabled={!lead.nome || !lead.telefone} className={`w-full py-3 text-white font-bold rounded-xl text-sm mt-4 disabled:opacity-50 min-h-[44px] flex items-center justify-center gap-2 ${destination === 'instagram' ? 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]' : 'bg-[#25D366]'}`}>
            {destination === 'instagram' ? (
              <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            ) : (
              <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.553 4.1 1.519 5.826L.053 23.664l5.96-1.56A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.965 0-3.83-.528-5.47-1.528l-.392-.233-3.538.927.944-3.45-.256-.406A9.794 9.794 0 012.18 12c0-5.422 4.398-9.82 9.82-9.82 5.422 0 9.82 4.398 9.82 9.82 0 5.422-4.398 9.82-9.82 9.82z"/></svg>
            )}
            {destination === 'instagram' ? 'Continuar para o Instagram' : 'Continuar para o WhatsApp'}
          </button>
          <p className="text-[9px] text-gray-400 text-center mt-2">Seus dados serão usados apenas para enviar ofertas relevantes</p>
        </div>
      </div>
    </div>
  )
}
