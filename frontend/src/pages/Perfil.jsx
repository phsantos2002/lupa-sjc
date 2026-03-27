import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getEstabelecimento, updateEstabelecimento, createPromocao, deletePromocao } from '../lib/api'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function Perfil() {
  const [est, setEst] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loginForm, setLoginForm] = useState({ slug: '', senha: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [tab, setTab] = useState('perfil')

  useEffect(() => {
    const saved = localStorage.getItem('lupa_store_auth')
    if (saved) {
      const { slug } = JSON.parse(saved)
      loadStore(slug)
    }
  }, [])

  const loadStore = async (slug) => {
    setLoading(true)
    try {
      const data = await getEstabelecimento(slug)
      setEst(data)
    } catch { setError('Erro ao carregar dados') }
    setLoading(false)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/estabelecimentos/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      localStorage.setItem('lupa_store_auth', JSON.stringify(data))
      await loadStore(data.slug)
    } catch (err) {
      setError(err.message || 'Erro ao fazer login')
    }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('lupa_store_auth')
    setEst(null)
  }

  // Login screen
  if (!est) {
    return (
      <div className="max-w-md mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-tauste-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-tauste-blue" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-lupa-black">Área da Loja</h1>
          <p className="text-sm text-gray-400 mt-1">Entre com seu login para gerenciar sua loja</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Identificador da loja</label>
            <input type="text" value={loginForm.slug} onChange={e => setLoginForm({ ...loginForm, slug: e.target.value })} placeholder="ex: suki-sucos" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input type="password" value={loginForm.senha} onChange={e => setLoginForm({ ...loginForm, senha: e.target.value })} placeholder="Sua senha" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" required />
          </div>
          {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 bg-tauste-blue text-white font-bold rounded-xl text-sm disabled:opacity-50">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/parceiro" className="text-sm text-tauste-orange font-semibold">Quero cadastrar minha loja →</Link>
        </div>
      </div>
    )
  }

  // Dashboard
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-lupa-cream border overflow-hidden flex items-center justify-center">
            {est.logo_url ? <img src={est.logo_url} alt="" className="w-full h-full object-cover" /> : <span className="text-tauste-blue font-bold">{est.nome?.charAt(0)}</span>}
          </div>
          <div>
            <h1 className="font-bold text-lupa-black">{est.nome}</h1>
            <Link to={`/estabelecimento/${est.slug}`} className="text-[10px] text-tauste-orange">Ver página pública →</Link>
          </div>
        </div>
        <button onClick={handleLogout} className="text-xs text-gray-400">Sair</button>
      </div>

      {success && <div className="mb-3 px-3 py-2 bg-green-50 text-green-700 text-sm rounded-xl">{success}</div>}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-100 mb-4">
        {[{ id: 'perfil', label: 'Perfil' }, { id: 'ofertas', label: 'Ofertas' }, { id: 'horarios', label: 'Horários' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 text-sm font-medium border-b-2 transition ${tab === t.id ? 'border-tauste-orange text-lupa-black' : 'border-transparent text-gray-400'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'perfil' && <EditProfile est={est} onSave={(updated) => { setEst({ ...est, ...updated }); setSuccess('Perfil salvo!'); setTimeout(() => setSuccess(''), 3000) }} />}
      {tab === 'ofertas' && <ManageOffers est={est} onUpdate={() => loadStore(est.slug)} />}
      {tab === 'horarios' && <EditHours est={est} />}
    </div>
  )
}

// ===== EDIT PROFILE =====
function EditProfile({ est, onSave }) {
  const [form, setForm] = useState({
    nome: est.nome || '', descricao: est.descricao || '', descricao_completa: est.descricao_completa || '',
    telefone: est.telefone || '', whatsapp: est.whatsapp || '', instagram: est.instagram || '',
    website: est.website || '', endereco: est.endereco || '', foto_url: est.foto_url || '',
    logo_url: est.logo_url || '', banner_url: est.banner_url || '',
  })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try { await updateEstabelecimento(est.id, form); onSave(form) } catch { alert('Erro ao salvar') }
    setSaving(false)
  }

  const fields = [
    { key: 'nome', label: 'Nome da loja' },
    { key: 'descricao', label: 'Descrição curta' },
    { key: 'descricao_completa', label: 'Sobre (texto completo)', textarea: true },
    { key: 'telefone', label: 'Telefone' },
    { key: 'whatsapp', label: 'WhatsApp (com DDD)' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'website', label: 'Site' },
    { key: 'endereco', label: 'Endereço' },
    { key: 'logo_url', label: 'URL do Logo' },
    { key: 'banner_url', label: 'URL da Foto de Capa (principal)' },
    { key: 'foto_url', label: 'URL da Foto de Capa (alternativa)' },
  ]

  return (
    <div className="space-y-3">
      {fields.map(f => (
        <div key={f.key}>
          <label className="text-[10px] text-gray-400 uppercase tracking-wider">{f.label}</label>
          {f.textarea ? (
            <textarea value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm mt-1 resize-none" />
          ) : (
            <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm mt-1" />
          )}
        </div>
      ))}
      <button onClick={save} disabled={saving} className="w-full py-3 bg-tauste-blue text-white font-bold rounded-xl text-sm disabled:opacity-50">
        {saving ? 'Salvando...' : 'Salvar Perfil'}
      </button>
    </div>
  )
}

// ===== MANAGE OFFERS =====
function ManageOffers({ est, onUpdate }) {
  const ofertas = (est.promocoes || []).filter(p => p.ativo !== false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ titulo: '', descricao: '', tipo_promo: 'percentage', valor_desconto: '', preco_de: '', preco_por: '', data_fim: '', tipo_resgate: 'whatsapp' })
  const [saving, setSaving] = useState(false)

  const create = async () => {
    setSaving(true)
    try {
      await createPromocao({
        estabelecimento_id: est.id,
        titulo: form.titulo,
        descricao: form.descricao,
        tipo: 'oferta',
        tipo_promo: form.tipo_promo,
        valor_desconto: form.valor_desconto ? Number(form.valor_desconto) : null,
        preco_de: form.preco_de ? Number(form.preco_de) : null,
        preco_por: form.preco_por ? Number(form.preco_por) : null,
        data_fim: form.data_fim || null,
        tipo_resgate: form.tipo_resgate,
        ativo: true,
        destaque_home: true,
      })
      setShowForm(false)
      setForm({ titulo: '', descricao: '', tipo_promo: 'percentage', valor_desconto: '', preco_de: '', preco_por: '', data_fim: '', tipo_resgate: 'whatsapp' })
      onUpdate()
    } catch (e) { alert(e.message) }
    setSaving(false)
  }

  const remove = async (id) => {
    if (!confirm('Remover esta oferta?')) return
    await deletePromocao(id)
    onUpdate()
  }

  return (
    <div>
      {/* Existing offers */}
      {ofertas.length === 0 ? (
        <p className="text-center text-gray-400 py-6 text-sm">Nenhuma oferta criada</p>
      ) : (
        <div className="space-y-2 mb-4">
          {ofertas.map(o => (
            <div key={o.id} className="bg-tauste-orange/5 border border-tauste-orange/15 rounded-xl p-3 flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold text-lupa-black">{o.titulo}</h4>
                {o.descricao && <p className="text-[10px] text-gray-400">{o.descricao}</p>}
                <div className="flex gap-2 mt-1">
                  {o.valor_desconto && o.tipo_promo === 'percentage' && <span className="text-xs font-bold text-tauste-orange">-{o.valor_desconto}%</span>}
                  {o.preco_por && <span className="text-xs font-bold text-tauste-orange">R$ {Number(o.preco_por).toFixed(2)}</span>}
                </div>
              </div>
              <button onClick={() => remove(o.id)} className="text-xs text-red-400 hover:text-red-600">Remover</button>
            </div>
          ))}
        </div>
      )}

      {/* Create form */}
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="w-full py-3 bg-tauste-orange text-white font-bold rounded-xl text-sm">+ Nova Oferta</button>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <h3 className="font-bold text-sm text-lupa-black">Nova Oferta</h3>
          <input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Título da oferta" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          <textarea value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} placeholder="Descrição" rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none" />

          <div>
            <label className="text-[10px] text-gray-400">Tipo</label>
            <select value={form.tipo_promo} onChange={e => setForm({ ...form, tipo_promo: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm mt-1">
              <option value="percentage">Desconto %</option>
              <option value="special_price">Preço especial (de/por)</option>
              <option value="fixed_value">Valor fixo</option>
            </select>
          </div>

          {form.tipo_promo === 'percentage' && (
            <input value={form.valor_desconto} onChange={e => setForm({ ...form, valor_desconto: e.target.value })} placeholder="% de desconto (ex: 20)" type="number" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          )}
          {form.tipo_promo === 'special_price' && (
            <div className="grid grid-cols-2 gap-2">
              <input value={form.preco_de} onChange={e => setForm({ ...form, preco_de: e.target.value })} placeholder="De (R$)" type="number" step="0.01" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
              <input value={form.preco_por} onChange={e => setForm({ ...form, preco_por: e.target.value })} placeholder="Por (R$)" type="number" step="0.01" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
            </div>
          )}
          {form.tipo_promo === 'fixed_value' && (
            <input value={form.valor_desconto} onChange={e => setForm({ ...form, valor_desconto: e.target.value })} placeholder="Valor (R$)" type="number" step="0.01" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          )}

          <input value={form.data_fim} onChange={e => setForm({ ...form, data_fim: e.target.value })} type="date" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />

          <div>
            <label className="text-[10px] text-gray-400">Resgate</label>
            <select value={form.tipo_resgate} onChange={e => setForm({ ...form, tipo_resgate: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm mt-1">
              <option value="whatsapp">WhatsApp</option>
              <option value="local_coupon">Cupom no local</option>
              <option value="both">Ambos</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button onClick={create} disabled={saving || !form.titulo} className="flex-1 py-2.5 bg-tauste-blue text-white font-bold rounded-lg text-sm disabled:opacity-50">{saving ? 'Criando...' : 'Criar Oferta'}</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-lg text-sm">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ===== EDIT HOURS =====
function EditHours({ est }) {
  const horarios = est.horarios || []
  const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 mb-2">Horários atuais (edição em breve)</p>
      {horarios.map(h => (
        <div key={h.dia_semana} className="flex justify-between items-center py-2 px-3 bg-lupa-cream rounded-lg">
          <span className="text-sm text-lupa-black">{DIAS[h.dia_semana]}</span>
          <span className={`text-sm ${h.fechado ? 'text-red-400' : 'text-gray-600'}`}>
            {h.fechado ? 'Fechado' : `${h.hora_abre?.slice(0, 5)} - ${h.hora_fecha?.slice(0, 5)}`}
          </span>
        </div>
      ))}
    </div>
  )
}
