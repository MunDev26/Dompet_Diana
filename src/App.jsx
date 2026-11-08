import { useState, useEffect } from 'react'
import Dashboard from './Dashboard'
import AddTransaction from './AddTransaction'
import { uid, todayStr } from './utils'
import { fetchTransactions, insertTransaction, updateTransaction, deleteTransaction } from './db'

const P = '#d6336c'

export default function App() {
  const [txs,     setTxs]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [view,    setView]    = useState('dashboard')
  const [editId,  setEditId]  = useState(null)
  const [delId,   setDelId]   = useState(null)
  const [month,   setMonth]   = useState(() => {
    const d = new Date()
    return { y: d.getFullYear(), m: d.getMonth() }
  })

  useEffect(() => {
    fetchTransactions()
      .then(setTxs)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function add(data) {
    const tx = { ...data, id: uid(), createdAt: new Date().toISOString() }
    try {
      const saved = await insertTransaction(tx)
      setTxs(p => [saved, ...p])
    } catch (err) {
      alert('Gagal menyimpan: ' + err.message)
      return
    }
    setView('dashboard')
  }

  async function update(id, data) {
    try {
      const saved = await updateTransaction(id, data)
      setTxs(p => p.map(t => t.id === id ? saved : t))
    } catch (err) {
      alert('Gagal memperbarui: ' + err.message)
      return
    }
    setEditId(null)
    setView('dashboard')
  }

  async function del(id) {
    try {
      await deleteTransaction(id)
      setTxs(p => p.filter(t => t.id !== id))
    } catch (err) {
      alert('Gagal menghapus: ' + err.message)
      return
    }
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

  if (loading) {
    return (
      <div className="app-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ textAlign: 'center', color: '#8a5568' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>💸</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Memuat data...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: 24 }}>
        <div style={{ textAlign: 'center', color: '#e64c4c' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Gagal terhubung ke database</div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 20 }}>{error}</div>
          <button
            onClick={() => { setError(null); setLoading(true); fetchTransactions().then(setTxs).catch(e => setError(e.message)).finally(() => setLoading(false)) }}
            style={{ background: `linear-gradient(135deg, ${P}, #e8699a)`, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

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
