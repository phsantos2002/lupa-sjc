import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCategorias } from '../lib/api'

export default function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategorias().then(setCategorias).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" /></div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Categorias</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {categorias.map(cat => (
          <Link
            key={cat.id}
            to={`/categorias/${cat.slug}`}
            className="bg-white rounded-xl p-5 flex flex-col items-center gap-3 shadow-sm border border-gray-100 card-hover text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl border border-gray-100">
              {cat.icone}
            </div>
            <span className="font-semibold text-sm text-gray-800">{cat.nome}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
