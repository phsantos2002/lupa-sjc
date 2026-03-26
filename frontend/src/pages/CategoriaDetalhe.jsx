import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCategoria } from '../lib/api'
import EstabelecimentoCard from '../components/EstabelecimentoCard'

export default function CategoriaDetalhe() {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getCategoria(slug).then(setData).catch(console.error).finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" /></div>

  if (!data) return <p className="text-center py-10 text-gray-400">Categoria não encontrada</p>

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-primary-600">Início</Link>
        <span>/</span>
        <Link to="/categorias" className="hover:text-primary-600">Categorias</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{data.categoria.nome}</span>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">{data.categoria.icone}</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{data.categoria.nome}</h1>
          <p className="text-sm text-gray-500">{data.estabelecimentos.length} estabelecimento{data.estabelecimentos.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {data.estabelecimentos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-500">Nenhum estabelecimento nesta categoria ainda</p>
          <Link to="/parceiro" className="inline-block mt-3 text-sm text-primary-600 font-semibold hover:underline">
            Cadastre o seu!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.estabelecimentos.map(est => (
            <EstabelecimentoCard key={est.id} est={est} />
          ))}
        </div>
      )}
    </div>
  )
}
