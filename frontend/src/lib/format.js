export function formatPrice(value) {
  if (!value && value !== 0) return ''
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatPhone(value) {
  if (!value) return ''
  const clean = value.replace(/\D/g, '')
  if (clean.length <= 2) return `(${clean}`
  if (clean.length <= 7) return `(${clean.slice(0, 2)}) ${clean.slice(2)}`
  return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7, 11)}`
}
