import { useState, useEffect } from 'react'
import { getHome } from '../lib/api'
import EstabelecimentoCard from '../components/EstabelecimentoCard'

const FLOORS = [
  { label: 'Todos', value: 'all' },
  { label: 'Piso Térreo', value: 'Térreo' },
  { label: '1º Andar', value: '1º Andar' },
  { label: '2º Andar', value: '2º Andar' },
]

export default function Lojas() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [floor, setFloor] = useState('all')
  const [cat, setCat] = useState('all')

  useEffect(() => {
    getHome().then(d => setStores(d.todasLojas || [])).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 rounded-full border-[3px] border-tauste-blue/30 border-t-tauste-blue animate-spin" /></div>

  // Categories from actual stores (only those with active stores)
  const categories = [...new Set(stores.map(s => s.categorias?.nome).filter(Boolean))].sort()

  let filtered = stores
  if (floor !== 'all') filtered = filtered.filter(s => s.tags?.includes(floor))
  if (cat !== 'all') filtered = filtered.filter(s => s.categorias?.nome === cat)

  return (
    <div className="max-w-5xl mx-auto px-4 pb-8">
      <div className="pt-4 pb-2">
        <h1 className="text-xl font-bold text-lupa-black">Lojas</h1>
        <p className="text-xs text-gray-400 mt-0.5">{stores.length} lojas no Tauste SJC</p>
      </div>

      {/* Floor filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
        {FLOORS.map(f => (
          <button key={f.value} onClick={() => setFloor(f.value)} className={`px-3 py-1.5 text-[11px] font-bold rounded-full whitespace-nowrap transition ${floor === f.value ? 'bg-tauste-blue text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Category filter — only categories with active stores */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
        <button onClick={() => setCat('all')} className={`px-3 py-1.5 text-[11px] font-bold rounded-full whitespace-nowrap transition ${cat === 'all' ? 'bg-lupa-gold text-lupa-black' : 'bg-white text-gray-500 border border-gray-200'}`}>Todas</button>
        {categories.map(c => (
          <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 text-[11px] font-bold rounded-full whitespace-nowrap transition ${cat === c ? 'bg-lupa-gold text-lupa-black' : 'bg-white text-gray-500 border border-gray-200'}`}>{c}</button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-[10px] text-gray-400 mt-1 mb-3">{filtered.length} loja{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}</p>

      {/* Store grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-10 text-sm">Nenhuma loja encontrada com esses filtros</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(est => <EstabelecimentoCard key={est.id} est={est} />)}
        </div>
      )}
    </div>
  )
}
