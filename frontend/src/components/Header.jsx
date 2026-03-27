import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

export default function Header() {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()
  const dropRef = useRef(null)
  const timerRef = useRef(null)

  // Debounced search
  useEffect(() => {
    if (search.trim().length < 2) { setResults([]); return }
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/busca?q=${encodeURIComponent(search.trim())}`)
        const data = await res.json()
        setResults(Array.isArray(data) ? data.slice(0, 6) : [])
        setShowDropdown(true)
      } catch { setResults([]) }
    }, 300)
    return () => clearTimeout(timerRef.current)
  }, [search])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setShowDropdown(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim().length >= 2) {
      navigate(`/busca?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
      setShowDropdown(false)
    }
  }

  const goTo = (slug) => {
    navigate(`/estabelecimento/${slug}`)
    setSearch('')
    setShowDropdown(false)
  }

  return (
    <header className="bg-lupa-black sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src="https://krruptyxkrvdxneezqnu.supabase.co/storage/v1/object/public/logos/lupa-logo.png"
            alt="Lupa"
            className="w-9 h-9 rounded-full border-2 border-lupa-gold object-cover"
            onError={e => { e.target.style.display = 'none' }}
          />
          <div className="hidden sm:block">
            <div className="font-display text-sm font-bold text-white leading-tight tracking-wide">Lupa</div>
            <div className="text-[9px] text-lupa-gold uppercase tracking-[0.2em]">São José dos Campos</div>
          </div>
        </Link>

        {/* Smart Search */}
        <div className="flex-1 max-w-md relative" ref={dropRef}>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => results.length > 0 && setShowDropdown(true)}
                placeholder="Buscar lojas..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-700 bg-lupa-dark text-white text-sm placeholder-gray-500 focus:outline-none focus:border-lupa-gold focus:ring-1 focus:ring-lupa-gold"
              />
            </div>
          </form>

          {/* Dropdown results */}
          {showDropdown && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
              <div className="p-2">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider px-2 py-1">Lojas</p>
                {results.map(r => (
                  <button key={r.id} onClick={() => goTo(r.slug)} className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-lupa-cream transition text-left">
                    <div className="w-8 h-8 rounded-full bg-lupa-cream overflow-hidden flex items-center justify-center shrink-0">
                      {r.logo_url ? <img src={r.logo_url} alt="" className="w-full h-full object-cover" /> : <span className="text-lupa-gold text-xs font-bold">{r.nome?.charAt(0)}</span>}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-lupa-black truncate">{r.nome}</p>
                      <p className="text-[10px] text-gray-400">{r.subcategoria || r.categorias?.nome || ''}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={handleSearch} className="w-full py-2.5 bg-lupa-cream text-xs text-lupa-gold font-bold text-center hover:bg-gray-200 transition">
                Ver todos os resultados →
              </button>
            </div>
          )}
        </div>

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
