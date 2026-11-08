import { useState, useEffect } from 'react'
import Dashboard from './Dashboard'
import AddTransaction from './AddTransaction'
import { uid, todayStr } from './utils'

const KEY = 'dompet_diana_v1'

function sampleData() {
  const t  = todayStr()
  const y  = new Date(Date.now() - 86_400_000).toISOString().split('T')[0]
  const d2 = new Date(Date.now() - 2 * 86_400_000).toISOString().split('T')[0]
  const now = new Date().toISOString()
  return [
    { id: uid(), type: 'income',  amount: 500_000, categoryId: 'lainnya',        note: 'Transfer masuk klien',   date: t,  createdAt: now },
    { id: uid(), type: 'expense', amount: 18_000,  categoryId: 'makanan',        note: 'Makan siang warteg',     date: t,  createdAt: now },
    { id: uid(), type: 'expense', amount: 23_000,  categoryId: 'transportasi',   note: 'Ojek online ke kos',     date: y,  createdAt: now },
    { id: uid(), type: 'expense', amount: 47_500,  categoryId: 'belanja',        note: 'Minimarket',             date: y,  createdAt: now },
    { id: uid(), type: 'expense', amount: 80_000,  categoryId: 'tagihan',        note: 'Pulsa & data internet',  date: d2, createdAt: now },
    { id: uid(), type: 'expense', amount: 15_000,  categoryId: 'biaya-admin',    note: 'Biaya transfer bank',    date: d2, createdAt: now },
  ]
}

export default function App() {
  const [txs, setTxs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY))
      return saved?.length ? saved : sampleData()
    } catch {
      return sampleData()
    }
  })

  const [view,   setView]   = useState('dashboard')
  const [editId, setEditId] = useState(null)
  const [delId,  setDelId]  = useState(null)
  const [month,  setMonth]  = useState(() => {
    const d = new Date()
    return { y: d.getFullYear(), m: d.getMonth() }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(txs))
  }, [txs])

  function add(data) {
    setTxs(p => [{ ...data, id: uid(), createdAt: new Date().toISOString() }, ...p])
    setView('dashboard')
  }

  function update(id, data) {
    setTxs(p => p.map(t => t.id === id ? { ...t, ...data } : t))
    setEditId(null)
    setView('dashboard')
  }

  function del(id) {
    setTxs(p => p.filter(t => t.id !== id))
    setDelId(null)
  }

  const monthTxs = txs.filter(t => {
    const d = new Date(t.date + 'T00:00:00')
    return d.getFullYear() === month.y && d.getMonth() === month.m
  })

  const summary = monthTxs.reduce(
    (a, t) => {
      if (t.type === 'income') a.income += t.amount
      else a.expense += t.amount
      a.balance = a.income - a.expense
      return a
    },
    { income: 0, expense: 0, balance: 0 },
  )

  if (view === 'add') {
    return <AddTransaction onBack={() => setView('dashboard')} onSave={add} />
  }

  if (view === 'edit' && editId) {
    const tx = txs.find(t => t.id === editId)
    return (
      <AddTransaction
        initialData={tx}
        onBack={() => { setView('dashboard'); setEditId(null) }}
        onSave={(d) => update(editId, d)}
      />
    )
  }

  return (
    <Dashboard
      txs={monthTxs}
      summary={summary}
      month={month}
      onMonthChange={setMonth}
      onAdd={() => setView('add')}
      onEdit={(id) => { setEditId(id); setView('edit') }}
      delId={delId}
      onDelReq={setDelId}
      onDelConfirm={del}
      onDelCancel={() => setDelId(null)}
    />
  )
}
