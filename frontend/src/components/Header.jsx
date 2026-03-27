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
    <header className="bg-lupa-black sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src="https://krruptyxkrvdxneezqnu.supabase.co/storage/v1/object/public/logos/lupa-logo.png"
            alt="Lupa"
            className="w-9 h-9 rounded-full border-2 border-lupa-gold object-cover"
          />
          <div className="hidden sm:block">
            <div className="font-display text-sm font-bold text-white leading-tight tracking-wide">Lupa</div>
            <div className="text-[9px] text-lupa-gold uppercase tracking-[0.2em]">São José dos Campos</div>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar lojas..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-700 bg-lupa-dark text-white text-sm placeholder-gray-500 focus:outline-none focus:border-lupa-gold focus:ring-1 focus:ring-lupa-gold"
            />
          </div>
        </form>

        <Link
          to="/parceiro"
          className="hidden sm:inline-flex px-4 py-2 bg-lupa-gold text-lupa-black text-xs font-bold rounded-full hover:bg-lupa-gold-light transition shrink-0 uppercase tracking-wider"
        >
          Seja Parceiro
        </Link>
      </div>
    </header>
  )
}
