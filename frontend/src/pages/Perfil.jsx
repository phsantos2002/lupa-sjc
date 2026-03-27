import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getEstabelecimento, updateEstabelecimento, getEstabelecimentos } from '../lib/api'
import EstabelecimentoCard from '../components/EstabelecimentoCard'

export default function Perfil() {
  const [mode, setMode] = useState(null) // null = choice, 'consumer', 'lojista'
  const [consumerName, setConsumerName] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('lupa_mode')
    if (saved === 'consumer') { setMode('consumer'); setConsumerName(localStorage.getItem('lupa_consumer_name') || 'Visitante') }
    else if (saved === 'lojista' && localStorage.getItem('lupa_lojista')) setMode('lojista')
  }, [])

  if (mode === 'consumer') return <ConsumerProfile name={consumerName} onLogout={() => { localStorage.removeItem('lupa_mode'); localStorage.removeItem('lupa_consumer_name'); setMode(null) }} />
  if (mode === 'lojista') return <LojistaProfile onLogout={() => { localStorage.removeItem('lupa_mode'); localStorage.removeItem('lupa_lojista'); setMode(null) }} />

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl text-lupa-black">Entrar no Lupa</h1>
        <p className="text-sm text-gray-400 mt-1">Escolha como deseja acessar</p>
      </div>

      {/* Consumer */}
      <button onClick={() => {
        const name = prompt('Qual seu nome?')
        if (name) {
          localStorage.setItem('lupa_mode', 'consumer')
          localStorage.setItem('lupa_consumer_name', name)
          setConsumerName(name)
          setMode('consumer')
        }
      }} className="w-full bg-white rounded-2xl border border-gray-100 p-5 mb-4 text-left card-hover">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-lupa-gold/10 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-lupa-gold" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
          </div>
          <div>
            <h3 className="font-bold text-lupa-black">Entrar como Cliente</h3>
            <p className="text-xs text-gray-400 mt-0.5">Salve lojas favoritas e acesse cupons</p>
          </div>
        </div>
      </button>

      {/* Lojista */}
      <button onClick={() => {
        const whatsapp = prompt('WhatsApp da sua loja:')
        if (whatsapp) {
          localStorage.setItem('lupa_mode', 'lojista')
          localStorage.setItem('lupa_lojista', JSON.stringify({ whatsapp }))
          setMode('lojista')
        }
      }} className="w-full bg-lupa-black rounded-2xl p-5 text-left card-hover">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-lupa-gold/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-lupa-gold" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35" /></svg>
          </div>
          <div>
            <h3 className="font-bold text-white">Área do Lojista</h3>
            <p className="text-xs text-gray-500 mt-0.5">Gerencie sua loja e promoções</p>
          </div>
        </div>
      </button>
    </div>
  )
}

// ===== CONSUMER PROFILE =====
function ConsumerProfile({ name, onLogout }) {
  const [tab, setTab] = useState('favoritos')
  const [favorites, setFavorites] = useState([])
  const [stores, setStores] = useState([])
  const [coupons, setCoupons] = useState([])

  useEffect(() => {
    const favIds = JSON.parse(localStorage.getItem('lupa_favorites') || '[]')
    setFavorites(favIds)
    const savedCoupons = JSON.parse(localStorage.getItem('lupa_coupons') || '[]')
    setCoupons(savedCoupons)

    if (favIds.length > 0) {
      getEstabelecimentos().then(all => {
        setStores(all.filter(s => favIds.includes(s.id)))
      }).catch(() => {})
    }
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-lupa-gold rounded-full flex items-center justify-center text-lupa-black font-bold text-lg">
            {name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h1 className="font-bold text-lupa-black">{name}</h1>
            <p className="text-xs text-gray-400">Cliente Lupa</p>
          </div>
        </div>
        <button onClick={onLogout} className="text-xs text-gray-400 hover:text-red-500">Sair</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-100 mb-5">
        {[{ id: 'favoritos', label: 'Favoritos', count: favorites.length }, { id: 'cupons', label: 'Meus Cupons', count: coupons.length }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${tab === t.id ? 'border-lupa-gold text-lupa-black' : 'border-transparent text-gray-400'}`}>
            {t.label} {t.count > 0 && <span className="ml-1 px-1.5 py-0.5 bg-lupa-gold/10 text-lupa-gold text-[10px] font-bold rounded-full">{t.count}</span>}
          </button>
        ))}
      </div>

      {tab === 'favoritos' && (
        stores.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 text-sm">Nenhuma loja favorita ainda</p>
            <Link to="/" className="text-sm text-lupa-gold font-bold mt-2 inline-block">Explorar lojas</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stores.map(est => <EstabelecimentoCard key={est.id} est={est} />)}
          </div>
        )
      )}

      {tab === 'cupons' && (
        coupons.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 text-sm">Nenhum cupom salvo</p>
            <Link to="/ofertas" className="text-sm text-lupa-gold font-bold mt-2 inline-block">Ver ofertas</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {coupons.map((c, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-lupa-black">{c.titulo || 'Cupom'}</h4>
                    <p className="text-xs text-gray-400">{c.loja || ''}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-lupa-gold/10 text-lupa-gold text-xs font-bold rounded font-mono">{c.codigo}</span>
                </div>
                {c.expira_em && <p className="text-[10px] text-gray-400 mt-2">Válido até {new Date(c.expira_em).toLocaleDateString('pt-BR')}</p>}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}

// ===== LOJISTA PROFILE =====
function LojistaProfile({ onLogout }) {
  const [est, setEst] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('lupa_lojista') || '{}')
    if (saved.id) {
      getEstabelecimento(saved.id).then(d => { setEst(d); setForm(d) }).finally(() => setLoading(false))
    } else if (saved.whatsapp) {
      fetch(`${import.meta.env.VITE_API_URL || ''}/api/estabelecimentos?whatsapp=${encodeURIComponent(saved.whatsapp)}`)
        .then(r => r.json())
        .then(data => {
          if (data.length > 0) {
            const loja = data[0]
            localStorage.setItem('lupa_lojista', JSON.stringify({ id: loja.slug, whatsapp: saved.whatsapp }))
            setEst(loja); setForm(loja)
          }
        }).finally(() => setLoading(false))
    } else setLoading(false)
  }, [])

  const handleSave = async () => {
    try {
      await updateEstabelecimento(est.id, { nome: form.nome, descricao: form.descricao, telefone: form.telefone, whatsapp: form.whatsapp, instagram: form.instagram, endereco: form.endereco })
      setEst({ ...est, ...form }); setEditing(false); setSuccess('Salvo!')
      setTimeout(() => setSuccess(''), 3000)
    } catch { alert('Erro ao salvar') }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 rounded-full border-[3px] border-lupa-gold/30 border-t-lupa-gold animate-spin" /></div>
  if (!est) return <div className="text-center py-10"><p className="text-gray-400">Loja não encontrada</p><button onClick={onLogout} className="text-sm text-lupa-gold mt-2">Voltar</button></div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-xl text-lupa-black">Painel da Loja</h1>
        <button onClick={onLogout} className="text-xs text-gray-400 hover:text-red-500">Sair</button>
      </div>

      {success && <div className="mb-4 px-4 py-2 bg-green-50 text-green-700 text-sm rounded-xl">{success}</div>}

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-lupa-cream border-2 border-lupa-gold/20 overflow-hidden flex items-center justify-center">
          {est.logo_url ? <img src={est.logo_url} alt="" className="w-full h-full object-cover" /> : <span className="text-lupa-gold font-display text-xl">{est.nome?.charAt(0)}</span>}
        </div>
        <div>
          <h2 className="font-bold text-lupa-black">{est.nome}</h2>
          <Link to={`/estabelecimento/${est.slug}`} className="text-xs text-lupa-gold">Ver página pública →</Link>
        </div>
      </div>

      {!editing ? (
        <button onClick={() => setEditing(true)} className="w-full py-3 bg-lupa-gold text-lupa-black font-bold rounded-xl text-sm">Editar Perfil</button>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          {['nome', 'descricao', 'telefone', 'whatsapp', 'instagram', 'endereco'].map(field => (
            <div key={field}>
              <label className="text-[10px] text-gray-400 uppercase tracking-wider">{field}</label>
              <input value={form[field] || ''} onChange={e => setForm({ ...form, [field]: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm mt-1" />
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} className="flex-1 py-2.5 bg-lupa-gold text-lupa-black font-bold rounded-xl text-sm">Salvar</button>
            <button onClick={() => { setEditing(false); setForm(est) }} className="px-4 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}
