import { useState, useEffect } from 'react'
import { getPromocoes, getEstabelecimentos, createPromocao, updatePromocao, deletePromocao } from '../../lib/api'

export default function AdminPromocoes() {
  const [lista, setLista] = useState([])
  const [estabelecimentos, setEstabelecimentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({
    estabelecimento_id: '', titulo: '', descricao: '', preco_de: '', preco_por: '',
    desconto_percentual: '', badge: '', tipo: 'oferta',
  })

  const carregar = async () => {
    setLoading(true)
    const [p, e] = await Promise.all([
      getPromocoes({ ativo: 'true' }).catch(() => []),
      getEstabelecimentos().catch(() => []),
    ])
    setLista(p)
    setEstabelecimentos(e)
    setLoading(false)
  }

  useEffect(() => { carregar() }, [])

  const resetForm = () => {
    setForm({ estabelecimento_id: '', titulo: '', descricao: '', preco_de: '', preco_por: '', desconto_percentual: '', badge: '', tipo: 'oferta' })
    setEditando(null)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const body = {
      ...form,
      preco_de: form.preco_de ? Number(form.preco_de) : null,
      preco_por: form.preco_por ? Number(form.preco_por) : null,
      desconto_percentual: form.desconto_percentual ? Number(form.desconto_percentual) : null,
    }
    try {
      if (editando) await updatePromocao(editando, body)
      else await createPromocao(body)
      resetForm()
      carregar()
    } catch (err) { alert(err.message) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza?')) return
    await deletePromocao(id)
    carregar()
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Promoções ({lista.length})</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700">
          + Nova
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-5 mb-6 space-y-3">
          <h2 className="font-bold">{editando ? 'Editar' : 'Nova'} Promoção</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select required value={form.estabelecimento_id} onChange={e => setForm(f => ({...f, estabelecimento_id: e.target.value}))} className="px-3 py-2 border rounded-lg text-sm">
              <option value="">Estabelecimento *</option>
              {estabelecimentos.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
            </select>
            <input required placeholder="Título *" value={form.titulo} onChange={e => setForm(f => ({...f, titulo: e.target.value}))} className="px-3 py-2 border rounded-lg text-sm" />
            <textarea placeholder="Descrição" value={form.descricao} onChange={e => setForm(f => ({...f, descricao: e.target.value}))} className="px-3 py-2 border rounded-lg text-sm col-span-full" rows={2} />
            <input type="number" step="0.01" placeholder="Preço De (R$)" value={form.preco_de} onChange={e => setForm(f => ({...f, preco_de: e.target.value}))} className="px-3 py-2 border rounded-lg text-sm" />
            <input type="number" step="0.01" placeholder="Preço Por (R$)" value={form.preco_por} onChange={e => setForm(f => ({...f, preco_por: e.target.value}))} className="px-3 py-2 border rounded-lg text-sm" />
            <input type="number" placeholder="Desconto %" value={form.desconto_percentual} onChange={e => setForm(f => ({...f, desconto_percentual: e.target.value}))} className="px-3 py-2 border rounded-lg text-sm" />
            <input placeholder="Badge (ex: Novo, Destaque)" value={form.badge} onChange={e => setForm(f => ({...f, badge: e.target.value}))} className="px-3 py-2 border rounded-lg text-sm" />
            <select value={form.tipo} onChange={e => setForm(f => ({...f, tipo: e.target.value}))} className="px-3 py-2 border rounded-lg text-sm">
              <option value="oferta">Oferta</option>
              <option value="cupom">Cupom</option>
              <option value="super_oferta">Super Oferta</option>
              <option value="destaque_semana">Destaque da Semana</option>
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700">
              {editando ? 'Salvar' : 'Criar'}
            </button>
            <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200">Cancelar</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {lista.map(p => (
          <div key={p.id} className="bg-white rounded-lg border p-4 flex items-center justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm truncate">{p.titulo}</h3>
                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded">{p.tipo}</span>
                {p.badge && <span className="px-1.5 py-0.5 bg-primary-100 text-primary-700 text-[10px] font-bold rounded">{p.badge}</span>}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {p.estabelecimentos?.nome}
                {p.preco_por && ` · R$ ${Number(p.preco_por).toFixed(2)}`}
                {p.preco_de && ` (de R$ ${Number(p.preco_de).toFixed(2)})`}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => { setForm({ ...p, preco_de: p.preco_de || '', preco_por: p.preco_por || '', desconto_percentual: p.desconto_percentual || '', badge: p.badge || '' }); setEditando(p.id); setShowForm(true) }}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200">Editar</button>
              <button onClick={() => handleDelete(p.id)} className="px-3 py-1 bg-red-50 text-red-600 text-xs rounded-lg hover:bg-red-100">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
