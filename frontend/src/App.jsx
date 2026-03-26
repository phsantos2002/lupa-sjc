import { Outlet } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Header from './components/Header'

export default function App() {
  return (
    <div className="min-h-screen bg-lupa-bg">
      <Header />
      <main className="pb-safe">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
