// Simple localStorage-based favorites system

export function getFavorites() {
  return JSON.parse(localStorage.getItem('lupa_favorites') || '[]')
}

export function isFavorite(storeId) {
  return getFavorites().includes(storeId)
}

export function toggleFavorite(storeId) {
  const favs = getFavorites()
  const idx = favs.indexOf(storeId)
  if (idx >= 0) {
    favs.splice(idx, 1)
  } else {
    favs.push(storeId)
  }
  localStorage.setItem('lupa_favorites', JSON.stringify(favs))
  return idx < 0 // returns true if added
}

// Save coupon to localStorage
export function saveCoupon(coupon, promoTitle, storeName) {
  const coupons = JSON.parse(localStorage.getItem('lupa_coupons') || '[]')
  coupons.unshift({
    codigo: coupon.codigo,
    titulo: promoTitle,
    loja: storeName,
    expira_em: coupon.expira_em,
    criado_em: coupon.criado_em,
  })
  localStorage.setItem('lupa_coupons', JSON.stringify(coupons))
}
