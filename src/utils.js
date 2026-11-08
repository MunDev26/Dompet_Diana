export function fmt(n) {
  return new Intl.NumberFormat('id-ID').format(Math.abs(n))
}

export function fmtShort(n) {
  const abs = Math.abs(n)
  const sign = n < 0 ? '−' : ''
  if (abs >= 1_000_000) return `${sign}Rp ${(abs / 1_000_000).toFixed(abs % 1_000_000 === 0 ? 0 : 1)}jt`
  if (abs >= 1_000)     return `${sign}Rp ${(abs / 1_000).toFixed(0)}rb`
  return `${sign}Rp ${abs.toLocaleString('id-ID')}`
}

export function fmtDateGroup(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date  = new Date(y, m - 1, d)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const yest  = new Date(today); yest.setDate(today.getDate() - 1)
  const day   = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  if (date.getTime() === today.getTime()) return `Hari ini — ${day}`
  if (date.getTime() === yest.getTime())  return `Kemarin — ${day}`
  return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })
}

export function groupByDate(txs) {
  const map = {}
  ;[...txs]
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
    .forEach(tx => {
      if (!map[tx.date]) map[tx.date] = []
      map[tx.date].push(tx)
    })
  return Object.entries(map)
}

export function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
