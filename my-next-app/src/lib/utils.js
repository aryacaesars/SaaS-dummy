export const formatRupiah = (amount) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount)
}

export const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

export const getFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error(`Error parsing data for key "${key}":`, error)
    return null
  }
}

// Add the cn function
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

