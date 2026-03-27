import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

export default function Header() {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [showDrop, setShowDrop] = useState(false)
  const navigate = useNavigate()
  const dropRef = useRef(null)
  const timer = useRef(null)

  useEffect(() => {
    if (search.trim().length < 2) { setResults([]); return }
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/busca?q=${encodeURIComponent(search.trim())}`)
        const data = await res.json()
        setResults(Array.isArray(data) ? data.slice(0, 6) : [])
        setShowDrop(true)
      } catch { setResults([]) }
    }, 300)
    return () => clearTimeout(timer.current)
  }, [search])

  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setShowDrop(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const go = (e) => {
    e.preventDefault()
    if (search.trim().length >= 2) { navigate(`/busca?q=${encodeURIComponent(search.trim())}`); setSearch(''); setShowDrop(false) }
  }

  return (
    <header className="bg-tauste-blue sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="https://krruptyxkrvdxneezqnu.supabase.co/storage/v1/object/public/logos/lupa-logo.png" alt="Lupa" className="w-9 h-9 rounded-full border-2 border-lupa-gold object-cover" onError={e => { e.target.style.display = 'none' }} />
          <div className="hidden sm:block">
            <div className="text-sm font-bold text-white leading-tight">Lupa</div>
            <div className="text-[11px] text-lupa-gold uppercase tracking-[0.15em]">Tauste SJC</div>
          </div>
        </Link>

        <div className="flex-1 max-w-md relative" ref={dropRef}>
          <form onSubmit={go}>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tauste-blue/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} onFocus={() => results.length > 0 && setShowDrop(true)} placeholder="Buscar lojas..." className="w-full pl-10 pr-4 py-2 rounded-full bg-white text-sm text-lupa-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tauste-orange" />
            </div>
          </form>
          {showDrop && search.trim().length >= 2 && results.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-4 text-center">
              <p className="text-sm text-gray-400">Nenhuma loja encontrada para "{search}"</p>
            </div>
          )}
          {showDrop && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
              <div className="p-2">
                {results.map(r => (
                  <button key={r.id} onClick={() => { navigate(`/estabelecimento/${r.slug}`); setSearch(''); setShowDrop(false) }} className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-lupa-cream transition text-left">
                    <div className="w-8 h-8 rounded-full bg-lupa-cream overflow-hidden flex items-center justify-center shrink-0">
                      {r.logo_url ? <img src={r.logo_url} alt="" className="w-full h-full object-cover" /> : <span className="text-tauste-blue text-xs font-bold">{r.nome?.charAt(0)}</span>}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-lupa-black truncate">{r.nome}</p>
                      <p className="text-[10px] text-gray-400">{r.subcategoria || ''}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Link to="/parceiro" className="hidden sm:inline-flex px-4 py-2.5 min-h-[44px] items-center bg-tauste-orange text-white text-xs font-bold rounded-full hover:bg-tauste-orange-light transition shrink-0">
          Seja Parceiro
        </Link>
      </div>
    </header>
  )
}
