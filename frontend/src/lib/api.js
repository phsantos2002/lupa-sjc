const API_URL = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (res.status === 204) return null
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erro na requisição')
  return data
}

// Home
export const getHome = () => request('/api/home')

// Categorias
export const getCategorias = () => request('/api/categorias')
export const getCategoria = (slug) => request(`/api/categorias/${slug}`)

// Estabelecimentos
export const getEstabelecimentos = (params) => {
  const q = new URLSearchParams(params).toString()
  return request(`/api/estabelecimentos${q ? '?' + q : ''}`)
}
export const getEstabelecimento = (idOrSlug) => request(`/api/estabelecimentos/${idOrSlug}`)
export const createEstabelecimento = (body) => request('/api/estabelecimentos', { method: 'POST', body: JSON.stringify(body) })
export const updateEstabelecimento = (id, body) => request(`/api/estabelecimentos/${id}`, { method: 'PUT', body: JSON.stringify(body) })
export const deleteEstabelecimento = (id) => request(`/api/estabelecimentos/${id}`, { method: 'DELETE' })

// Promoções
export const getPromocoes = (params) => {
  const q = new URLSearchParams(params).toString()
  return request(`/api/promocoes${q ? '?' + q : ''}`)
}
export const createPromocao = (body) => request('/api/promocoes', { method: 'POST', body: JSON.stringify(body) })
export const updatePromocao = (id, body) => request(`/api/promocoes/${id}`, { method: 'PUT', body: JSON.stringify(body) })
export const deletePromocao = (id) => request(`/api/promocoes/${id}`, { method: 'DELETE' })
export const getPromocao = (id) => request(`/api/promocoes/${id}`)
export const gerarCupom = (body) => request('/api/promocoes/cupons', { method: 'POST', body: JSON.stringify(body) })
export const getCupom = (code) => request(`/api/promocoes/cupons/${code}`)
export const resgatarCupom = (code) => request(`/api/promocoes/cupons/${code}/redeem`, { method: 'PATCH' })

// Busca
export const buscar = (q, categoria) => {
  const params = new URLSearchParams({ q })
  if (categoria) params.set('categoria', categoria)
  return request(`/api/busca?${params}`)
}

// Patrocinadores
export const getPatrocinadores = () => request('/api/patrocinadores')
export const createPatrocinador = (body) => request('/api/patrocinadores', { method: 'POST', body: JSON.stringify(body) })

// Destaques
export const getDestaqueSemana = () => request('/api/destaques/semana')

// Edições (jornal)
export const getEdicoes = () => request('/api/edicoes')
export const gerarEdicao = () => request('/api/gerar-edicao', { method: 'POST' })
