import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 bg-tauste-blue/10 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-tauste-blue" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
      </div>
      <h1 className="text-2xl font-bold text-lupa-black">Página não encontrada</h1>
      <p className="text-sm text-gray-400 mt-2 max-w-xs">A página que você procura não existe ou foi movida.</p>
      <Link to="/" className="mt-6 px-6 py-3 bg-tauste-blue text-white font-bold rounded-xl text-sm min-h-[44px] flex items-center">Voltar ao início</Link>
    </div>
  )
}
