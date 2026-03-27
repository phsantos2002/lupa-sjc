import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import Categorias from './pages/Categorias'
import CategoriaDetalhe from './pages/CategoriaDetalhe'
import Ofertas from './pages/Ofertas'
import Lojas from './pages/Lojas'
import Busca from './pages/Busca'
import EstabelecimentoDetalhe from './pages/EstabelecimentoDetalhe'
import SejaParceiro from './pages/SejaParceiro'
import Perfil from './pages/Perfil'
import NotFound from './pages/NotFound'
import AdminEstabelecimentos from './pages/admin/AdminEstabelecimentos'
import AdminPromocoes from './pages/admin/AdminPromocoes'
import AdminCategorias from './pages/admin/AdminCategorias'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* App consumer */}
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="lojas" element={<Lojas />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="categorias/:slug" element={<CategoriaDetalhe />} />
          <Route path="ofertas" element={<Ofertas />} />
          <Route path="busca" element={<Busca />} />
          <Route path="estabelecimento/:slug" element={<EstabelecimentoDetalhe />} />
          <Route path="parceiro" element={<SejaParceiro />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/estabelecimentos" replace />} />
          <Route path="estabelecimentos" element={<AdminEstabelecimentos />} />
          <Route path="promocoes" element={<AdminPromocoes />} />
          <Route path="categorias" element={<AdminCategorias />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
