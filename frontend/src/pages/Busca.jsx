import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { buscar } from '../lib/api'
import EstabelecimentoCard from '../components/EstabelecimentoCard'

export default function Busca() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [resultados, setResultados] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (q.length >= 2) {
      setLoading(true)
      buscar(q).then(setResultados).catch(console.error).finally(() => setLoading(false))
    }
  }, [q])

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Resultados para "{q}"</h1>
      <p className="text-sm text-gray-500 mb-6">{resultados.length} resultado{resultados.length !== 1 ? 's' : ''}</p>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" /></div>
      ) : resultados.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-500">Nenhum resultado encontrado para "{q}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resultados.map(est => (
            <EstabelecimentoCard key={est.id} est={est} />
          ))}
        </div>
      )}
    </div>
  )
}
