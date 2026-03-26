import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Header() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim().length >= 2) {
      navigate(`/busca?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-lg">
            L
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold text-primary-700 leading-tight">Lupa</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">São José dos Campos</div>
          </div>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar lojas, categorias..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 bg-gray-50"
            />
          </div>
        </form>

        {/* Seja Parceiro */}
        <Link
          to="/parceiro"
          className="hidden sm:inline-flex px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-full hover:bg-primary-700 transition shrink-0"
        >
          Seja Parceiro
        </Link>
      </div>
    </header>
  )
}
