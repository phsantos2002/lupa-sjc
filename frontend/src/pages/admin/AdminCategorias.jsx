import { useState, useEffect } from 'react'
import { getCategorias } from '../../lib/api'

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategorias().then(setCategorias).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" /></div>

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Categorias ({categorias.length})</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categorias.map(cat => (
          <div key={cat.id} className="bg-white rounded-lg border p-4 flex items-center gap-3">
            <span className="text-2xl">{cat.icone}</span>
            <div>
              <h3 className="font-semibold text-sm">{cat.nome}</h3>
              <p className="text-xs text-gray-400">/{cat.slug}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-400 mt-4">As categorias padrão foram criadas na migration. Para adicionar novas, use o SQL Editor do Supabase.</p>
    </div>
  )
}
