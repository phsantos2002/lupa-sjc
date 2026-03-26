import { useState, useEffect } from 'react'
import { getEstabelecimentos, createEstabelecimento, updateEstabelecimento, deleteEstabelecimento } from '../../lib/api'
import { getCategorias } from '../../lib/api'

export default function AdminEstabelecimentos() {
  const [lista, setLista] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({
    nome: '', bairro: '', categoria_id: '', telefone: '', whatsapp: '', instagram: '',
    endereco: '', descricao: '', plano: 'basico', destaque: false, fundador: false, aberto_agora: false,
    tags: '',
  })

  const carregar = async () => {
    setLoading(true)
    const [est, cats] = await Promise.all([
      getEstabelecimentos({ ativo: 'true' }).catch(() => []),
      getCategorias().catch(() => []),
    ])
    setLista(est)
    setCategorias(cats)
    setLoading(false)
  }

  useEffect(() => { carregar() }, [])

  const resetForm = () => {
    setForm({ nome: '', bairro: '', categoria_id: '', telefone: '', whatsapp: '', instagram: '', endereco: '', descricao: '', plano: 'basico', destaque: false, fundador: false, aberto_agora: false, tags: '' })
    setEditando(null)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const body = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] }
    try {
      if (editando) {
        await updateEstabelecimento(editando, body)
      } else {
        await createEstabelecimento(body)
      }
      resetForm()
      carregar()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleEdit = (est) => {
    setForm({
      nome: est.nome, bairro: est.bairro, categoria_id: est.categoria_id || '',
      telefone: est.telefone || '', whatsapp: est.whatsapp || '', instagram: est.instagram || '',
      endereco: est.endereco || '', descricao: est.descricao || '', plano: est.plano || 'basico',
      destaque: est.destaque || false, fundador: est.fundador || false, aberto_agora: est.aberto_agora || false,
      tags: (est.tags || []).join(', '),
    })
    setEditando(est.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza?')) return
    await deleteEstabelecimento(id)
    carregar()
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Estabelecimentos ({lista.length})</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700">
          + Novo
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-5 mb-6 space-y-3">
          <h2 className="font-bold">{editando ? 'Editar' : 'Novo'} Estabelecimento</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required placeholder="Nome *" value={form.nome} onChange={e => setForm(f => ({...f, nome: e.target.value}))} className="px-3 py-2 border rounded-lg text-sm" />
            <input required placeholder="Bairro *" value={form.bairro} onChange={e => setForm(f => ({...f, bairro: e.target.value}))} className="px-3 py-2 border rounded-lg text-sm" />
            <select required value={form.categoria_id} onChange={e => setForm(f => ({...f, categoria_id: e.target.value}))} className="px-3 py-2 border rounded-lg text-sm">
              <option value="">Categoria *</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.icone} {c.nome}</option>)}
            </select>
            <input placeholder="Telefone" value={form.telefone} onChange={e => setForm(f => ({...f, telefone: e.target.value}))} className="px-3 py-2 border rounded-lg text-sm" />
            <input placeholder="WhatsApp (ex: 12991234567)" value={form.whatsapp} onChange={e => setForm(f => ({...f, whatsapp: e.target.value}))} className="px-3 py-2 border rounded-lg text-sm" />
            <input placeholder="Instagram (ex: @loja)" value={form.instagram} onChange={e => setForm(f => ({...f, instagram: e.target.value}))} className="px-3 py-2 border rounded-lg text-sm" />
            <input placeholder="Endereço completo" value={form.endereco} onChange={e => setForm(f => ({...f, endereco: e.target.value}))} className="px-3 py-2 border rounded-lg text-sm col-span-full" />
            <textarea placeholder="Descrição" value={form.descricao} onChange={e => setForm(f => ({...f, descricao: e.target.value}))} className="px-3 py-2 border rounded-lg text-sm col-span-full" rows={2} />
            <input placeholder="Tags (separadas por vírgula)" value={form.tags} onChange={e => setForm(f => ({...f, tags: e.target.value}))} className="px-3 py-2 border rounded-lg text-sm col-span-full" />
            <select value={form.plano} onChange={e => setForm(f => ({...f, plano: e.target.value}))} className="px-3 py-2 border rounded-lg text-sm">
              <option value="basico">Básico</option>
              <option value="premium">Premium</option>
              <option value="destaque">Destaque</option>
            </select>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={form.destaque} onChange={e => setForm(f => ({...f, destaque: e.target.checked}))} /> Destaque</label>
              <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={form.fundador} onChange={e => setForm(f => ({...f, fundador: e.target.checked}))} /> Fundador</label>
              <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={form.aberto_agora} onChange={e => setForm(f => ({...f, aberto_agora: e.target.checked}))} /> Aberto</label>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700">
              {editando ? 'Salvar' : 'Criar'}
            </button>
            <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200">Cancelar</button>
          </div>
        </form>
      )}

      {/* Lista */}
      <div className="space-y-2">
        {lista.map(est => (
          <div key={est.id} className="bg-white rounded-lg border p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl">{est.categorias?.icone || '🏪'}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm truncate">{est.nome}</h3>
                  {est.destaque && <span className="px-1.5 py-0.5 bg-primary-100 text-primary-700 text-[10px] font-bold rounded">Premium</span>}
                  {est.fundador && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded">Fundador</span>}
                </div>
                <p className="text-xs text-gray-400">{est.categorias?.nome} · {est.bairro}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleEdit(est)} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200">Editar</button>
              <button onClick={() => handleDelete(est.id)} className="px-3 py-1 bg-red-50 text-red-600 text-xs rounded-lg hover:bg-red-100">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
