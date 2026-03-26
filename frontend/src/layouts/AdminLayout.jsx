import { NavLink, Outlet, Link } from 'react-router-dom'

const navItems = [
  { to: '/admin/estabelecimentos', label: '🏪 Estabelecimentos' },
  { to: '/admin/promocoes', label: '🏷️ Promoções' },
  { to: '/admin/categorias', label: '📂 Categorias' },
]

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm">L</div>
            <div>
              <h1 className="font-bold text-lg">Lupa SJC <span className="text-primary-400 text-sm font-normal">Admin</span></h1>
            </div>
          </div>
          <Link to="/" className="text-sm text-gray-400 hover:text-white transition">← Ver site</Link>
        </div>
        <nav className="max-w-6xl mx-auto px-4 flex gap-1 pb-2">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
