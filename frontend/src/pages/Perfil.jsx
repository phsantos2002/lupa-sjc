import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getEstabelecimento, updateEstabelecimento } from '../lib/api'

export default function Perfil() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loginData, setLoginData] = useState({ whatsapp: '', senha: '' })
  const [est, setEst] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Checar login salvo
  useEffect(() => {
    const saved = localStorage.getItem('lupa_lojista')
    if (saved) {
      const data = JSON.parse(saved)
      setLoggedIn(true)
      loadEstabelecimento(data.id)
    }
  }, [])

  const loadEstabelecimento = async (id) => {
    setLoading(true)
    try {
      const data = await getEstabelecimento(id)
      setEst(data)
      setForm(data)
    } catch {
      setError('Erro ao carregar dados')
    }
    setLoading(false)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Busca por WhatsApp no backend
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/estabelecimentos?whatsapp=${encodeURIComponent(loginData.whatsapp)}`)
      const data = await res.json()

      if (Array.isArray(data) && data.length > 0) {
        const loja = data[0]
        localStorage.setItem('lupa_lojista', JSON.stringify({ id: loja.id || loja.slug, whatsapp: loginData.whatsapp }))
        setLoggedIn(true)
        setEst(loja)
        setForm(loja)
      } else {
        setError('Nenhum estabelecimento encontrado com esse WhatsApp')
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.')
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await updateEstabelecimento(est.id, {
        nome: form.nome,
        descricao: form.descricao,
        telefone: form.telefone,
        whatsapp: form.whatsapp,
        instagram: form.instagram,
        endereco: form.endereco,
        bairro: form.bairro,
        foto_url: form.foto_url,
        logo_url: form.logo_url,
        tags: form.tags,
      })
      setEst({ ...est, ...form })
      setEditing(false)
      setSuccess('Perfil atualizado com sucesso!')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Erro ao salvar. Tente novamente.')
    }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('lupa_lojista')
    setLoggedIn(false)
    setEst(null)
    setForm({})
  }

  // Tela de Login
  if (!loggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Área do Lojista</h1>
          <p className="text-sm text-gray-500 mt-2">Acesse com o WhatsApp cadastrado da sua loja</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp da loja</label>
            <input
              type="text"
              value={loginData.whatsapp}
              onChange={e => setLoginData({ ...loginData, whatsapp: e.target.value })}
              placeholder="(12) 99999-9999"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">Ainda não tem cadastro?</p>
          <Link to="/parceiro" className="text-sm text-primary-600 font-semibold hover:underline mt-1 inline-block">
            Seja Parceiro
          </Link>
        </div>
      </div>
    )
  }

  // Loading
  if (loading && !est) {
    return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" /></div>
  }

  if (!est) return <p className="text-center py-10 text-gray-400">Erro ao carregar perfil</p>

  const categoria = est.categorias || {}

  // Painel do Lojista
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header do perfil */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Meu Perfil</h1>
        <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-500 transition">
          Sair
        </button>
      </div>

      {success && (
        <div className="mb-4 px-4 py-2.5 bg-green-50 text-green-700 text-sm rounded-xl font-medium">{success}</div>
      )}
      {error && (
        <div className="mb-4 px-4 py-2.5 bg-red-50 text-red-500 text-sm rounded-xl font-medium">{error}</div>
      )}

      {/* Card preview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="relative h-40 bg-gray-100">
          <img src={est.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(est.nome)}&size=800&background=0D9488&color=fff`} alt="" className="w-full h-full object-cover" />
          <span className={`absolute top-3 right-3 px-2.5 py-1 text-[11px] font-bold rounded-full ${est.aberto_agora ? 'bg-green-500 text-white' : 'bg-gray-800/70 text-white'}`}>
            {est.aberto_agora ? 'Aberto' : 'Fechado'}
          </span>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
              {est.logo_url ? <img src={est.logo_url} alt="" className="w-full h-full object-cover" /> : <span className="text-gray-400 font-bold">{est.nome?.charAt(0)}</span>}
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{est.nome}</h2>
              {categoria.nome && <span className="text-sm text-primary-600">{categoria.nome}</span>}
            </div>
          </div>
          <Link to={`/estabelecimento/${est.slug}`} className="inline-flex items-center gap-1 mt-3 text-sm text-primary-600 font-medium hover:underline">
            Ver página pública
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
          </Link>
        </div>
      </div>

      {/* Formulário de edição */}
      {!editing ? (
        <button
          onClick={() => setEditing(true)}
          className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
          Editar Perfil
        </button>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-900">Editar Informações</h3>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Nome</label>
            <input value={form.nome || ''} onChange={e => setForm({ ...form, nome: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-400" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Descrição</label>
            <textarea value={form.descricao || ''} onChange={e => setForm({ ...form, descricao: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-400 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Telefone</label>
              <input value={form.telefone || ''} onChange={e => setForm({ ...form, telefone: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">WhatsApp</label>
              <input value={form.whatsapp || ''} onChange={e => setForm({ ...form, whatsapp: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Instagram</label>
            <input value={form.instagram || ''} onChange={e => setForm({ ...form, instagram: e.target.value })} placeholder="@sualoja" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-400" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Endereço</label>
            <input value={form.endereco || ''} onChange={e => setForm({ ...form, endereco: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-400" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">URL da Foto</label>
            <input value={form.foto_url || ''} onChange={e => setForm({ ...form, foto_url: e.target.value })} placeholder="https://..." className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-400" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">URL do Logo</label>
            <input value={form.logo_url || ''} onChange={e => setForm({ ...form, logo_url: e.target.value })} placeholder="https://..." className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-400" />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              onClick={() => { setEditing(false); setForm(est); setError('') }}
              className="px-5 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Links rápidos */}
      <div className="mt-6 space-y-3">
        <Link to={`/estabelecimento/${est.slug}`} className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4 hover:bg-gray-50 transition">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="text-sm font-medium text-gray-700">Ver minha página</span>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </Link>
        <Link to="/parceiro" className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4 hover:bg-gray-50 transition">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
            <span className="text-sm font-medium text-gray-700">Upgrade de plano</span>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </Link>
      </div>
    </div>
  )
}
